import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from "@google/genai";
import type { Word, StudyProgress, User } from '../types';
import SpeakerButton from './SpeakerButton';

// Helper functions for shuffling array
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

// Helper functions for audio encoding/decoding as per guidelines
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


interface ConversationViewProps {
  allWords: Word[];
  studyProgress: StudyProgress;
  currentUser: User | null;
  onGoalUpdate: () => void;
}

interface TranscriptItem {
    author: 'user' | 'ai';
    content: string;
}

const ConversationView: React.FC<ConversationViewProps> = ({ allWords, studyProgress, currentUser, onGoalUpdate }) => {
  const [stage, setStage] = useState<'setup' | 'chatting' | 'finished'>('setup');
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [targetWords, setTargetWords] = useState<Word[]>([]);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [enableVietnamese, setEnableVietnamese] = useState(true);
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');

  // Refs for managing Web Audio API and Gemini Live session
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextAudioStartTimeRef = useRef<number>(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  
  // Refs for building transcriptions
  const currentInputTranscriptionRef = useRef('');
  const currentOutputTranscriptionRef = useRef('');

  const stopConversation = () => {
    // Disconnect microphone processing
    if (scriptProcessorRef.current && mediaStreamSourceRef.current) {
        mediaStreamSourceRef.current.disconnect();
        scriptProcessorRef.current.disconnect();
        scriptProcessorRef.current = null;
    }

    // Stop microphone stream
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    mediaStreamRef.current = null;
    
    // Close session
    sessionPromiseRef.current?.then(session => session.close());
    sessionPromiseRef.current = null;

    // Close AudioContexts
    inputAudioContextRef.current?.close().catch(console.error);
    outputAudioContextRef.current?.close().catch(console.error);
    inputAudioContextRef.current = null;
    outputAudioContextRef.current = null;
    
    // Reset state
    setConnectionStatus('disconnected');
    setStage('setup');
    setTranscript([]);
    setTargetWords([]);
    setUsedWords(new Set());
    currentInputTranscriptionRef.current = '';
    currentOutputTranscriptionRef.current = '';
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopConversation();
    };
  }, []);

  const handleStartConversation = async () => {
    setConnectionStatus('connecting');
    setError(null);
    onGoalUpdate();

    const wordsToReview = allWords.filter(w => studyProgress[w.english]?.srsLevel > 0);
    const wordsUnknown = allWords.filter(w => !studyProgress[w.english]);
    let potentialWords = [...wordsToReview, ...shuffleArray(wordsUnknown)];
    if (potentialWords.length < 3) {
      potentialWords = [...potentialWords, ...shuffleArray(allWords)];
    }
    const selectedWords = shuffleArray(Array.from(new Set(potentialWords))).slice(0, 3);

    if (selectedWords.length < 1) {
        setError("Không có đủ từ để bắt đầu. Hãy học thêm một vài từ nhé!");
        setConnectionStatus('error');
        return;
    }
    setTargetWords(selectedWords);
    setUsedWords(new Set());
    setTranscript([]);

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const wordList = selectedWords.map(w => w.english).join(', ');
        
        const difficultyMap = {
            beginner: 'A2',
            intermediate: 'B1',
            advanced: 'C1'
        };
        const selectedLevel = difficultyMap[difficulty];
        
        const translationInstruction = enableVietnamese 
            ? `You MUST ALWAYS respond in this exact format: First, speak the English sentence. Then, immediately say "In Vietnamese," followed by the Vietnamese translation. For example: "That's a great idea! In Vietnamese, đó là một ý tưởng tuyệt vời!".`
            : `You MUST respond ONLY in English. DO NOT provide any Vietnamese translation.`;

        const systemInstruction = `You are Gem, a highly intelligent and adaptive English tutor. Your primary goal is to have a dynamic voice conversation with a Vietnamese learner.

**Initial Level:** The user's starting CEFR level is ${selectedLevel}. Begin the conversation at this level.

**ADAPTIVE BEHAVIOR (CRITICAL):**
1.  **Analyze Continuously:** As the user speaks, constantly analyze their vocabulary range, grammatical accuracy, and the complexity of their sentence structures.
2.  **Level Up:** If the user demonstrates a strong command of English (using advanced words, complex sentences, few errors), you MUST gradually increase the difficulty of your own language. Introduce more sophisticated vocabulary, academic phrasing, and more complex grammatical structures to challenge them and help them grow.
3.  **Level Down:** If the user struggles (simple words, frequent errors, hesitation), you MUST simplify your language to match their current level, ensuring the conversation remains encouraging and comprehensible.

**Core Task:** The student's mission is to use these words: ${wordList}. Guide the conversation naturally to give them a chance to use these words.

**Language & Format:**
${translationInstruction}

Start the conversation by saying "Hello! How are you today?".`;

        inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        
        sessionPromiseRef.current = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            config: {
                systemInstruction,
                responseModalities: [Modality.AUDIO],
                inputAudioTranscription: {},
                outputAudioTranscription: {},
            },
            callbacks: {
                onopen: () => {
                    const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
                    mediaStreamSourceRef.current = source;
                    const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                    scriptProcessorRef.current = scriptProcessor;

                    scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                        const pcmBlob: Blob = {
                            data: encode(new Uint8Array(new Int16Array(inputData.map(x => x * 32768)).buffer)),
                            mimeType: 'audio/pcm;rate=16000',
                        };
                        sessionPromiseRef.current?.then((session) => {
                            session.sendRealtimeInput({ media: pcmBlob });
                        });
                    };
                    source.connect(scriptProcessor);
                    scriptProcessor.connect(inputAudioContextRef.current!.destination);
                    setConnectionStatus('connected');
                    setStage('chatting');
                },
                onmessage: async (message: LiveServerMessage) => {
                    if (message.serverContent?.inputTranscription) {
                        const text = message.serverContent.inputTranscription.text;
                        currentInputTranscriptionRef.current += text;
                        setTranscript(prev => {
                            const last = prev[prev.length - 1];
                            if (last?.author === 'user') {
                                return [...prev.slice(0, -1), { ...last, content: currentInputTranscriptionRef.current }];
                            }
                            return [...prev, { author: 'user', content: currentInputTranscriptionRef.current }];
                        });
                    }
                    if (message.serverContent?.outputTranscription) {
                        const text = message.serverContent.outputTranscription.text;
                        currentOutputTranscriptionRef.current += text;
                         setTranscript(prev => {
                            const last = prev[prev.length - 1];
                            if (last?.author === 'ai') {
                                return [...prev.slice(0, -1), { ...last, content: currentOutputTranscriptionRef.current }];
                            }
                            return [...prev, { author: 'ai', content: currentOutputTranscriptionRef.current }];
                        });
                    }
                    if (message.serverContent?.turnComplete) {
                        const newlyUsed = new Set(usedWords);
                        targetWords.forEach(word => {
                            if (!newlyUsed.has(word.english) && currentInputTranscriptionRef.current.toLowerCase().includes(word.english.toLowerCase())) {
                                newlyUsed.add(word.english);
                            }
                        });
                        setUsedWords(newlyUsed);

                        if (newlyUsed.size === selectedWords.length && stage !== 'finished') {
                           setTimeout(() => setStage('finished'), 2000);
                        }

                        currentInputTranscriptionRef.current = '';
                        currentOutputTranscriptionRef.current = '';
                    }

                    const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                    if (base64Audio && outputAudioContextRef.current) {
                        const outputCtx = outputAudioContextRef.current;
                        nextAudioStartTimeRef.current = Math.max(nextAudioStartTimeRef.current, outputCtx.currentTime);
                        const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
                        const source = outputCtx.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(outputCtx.destination);
                        source.addEventListener('ended', () => audioSourcesRef.current.delete(source));
                        source.start(nextAudioStartTimeRef.current);
                        nextAudioStartTimeRef.current += audioBuffer.duration;
                        audioSourcesRef.current.add(source);
                    }
                    
                    if (message.serverContent?.interrupted) {
                        audioSourcesRef.current.forEach(source => source.stop());
                        audioSourcesRef.current.clear();
                        nextAudioStartTimeRef.current = 0;
                    }
                },
                onerror: (e) => {
                    console.error('Session Error:', e);
                    setError('Kết nối bị lỗi. Vui lòng thử lại.');
                    stopConversation();
                },
                onclose: () => {
                },
            },
        });

    } catch (err) {
        console.error("Setup Error:", err);
        setError("Không thể truy cập micro. Vui lòng kiểm tra quyền và thử lại.");
        setConnectionStatus('error');
    }
  };
  
  const highlightUsedWords = (text: string) => {
    const wordRegex = new RegExp(`\\b(${targetWords.map(w => w.english).join('|')})\\b`, 'gi');
    return text.replace(wordRegex, '<strong class="bg-yellow-200/80 text-yellow-900 px-1 py-0.5 rounded">$1</strong>');
  };

  const renderMicButton = () => {
     let icon;
     let text;
     let colorClass;

     switch (connectionStatus) {
        case 'connecting':
            icon = <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
            text = "Đang kết nối...";
            colorClass = "bg-slate-400 cursor-not-allowed";
            break;
        case 'connected':
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8h-1a6 6 0 11-12 0H3a7.001 7.001 0 006 6.93V17H7a1 1 0 100 2h6a1 1 0 100-2h-2v-2.07z" clipRule="evenodd" /></svg>;
            text = "AI đang lắng nghe...";
            colorClass = "bg-blue-600 animate-pulse";
            break;
        default: // disconnected or error
             icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;
             text = "Đã ngắt kết nối";
             colorClass = "bg-red-500";
     }

     return (
        <div className="flex flex-col items-center gap-4">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg ${colorClass}`}>
              {icon}
          </div>
          <p className="font-semibold text-slate-600">{text}</p>
        </div>
     );
  };
  
  if (stage === 'setup') {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full">
                <h2 className="text-3xl font-bold text-slate-800">AI Luyện Nói</h2>
                <p className="text-slate-600 mt-4 mb-6">Thực hành từ vựng bằng cách nói chuyện trực tiếp với AI. AI sẽ đưa ra một vài từ, và nhiệm vụ của bạn là sử dụng chúng trong cuộc hội thoại!</p>
                
                <div className="mb-6">
                    <label htmlFor="difficulty-select" className="block text-sm font-medium text-slate-700 mb-1 text-left">Chọn độ khó</label>
                    <select
                        id="difficulty-select"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as any)}
                        className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="beginner">Mới bắt đầu</option>
                        <option value="intermediate">Trung bình</option>
                        <option value="advanced">Nâng cao</option>
                    </select>
                </div>

                <div className="flex items-center justify-center mb-8">
                    <label className="flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={enableVietnamese}
                            onChange={(e) => setEnableVietnamese(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        <span className="ms-3 text-sm font-medium text-slate-700">Bật bản dịch tiếng Việt</span>
                    </label>
                </div>

                {error && <p className="text-red-500 bg-red-50 p-3 rounded-md mb-4">{error}</p>}
                
                <button
                    onClick={handleStartConversation}
                    disabled={connectionStatus === 'connecting'}
                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-wait"
                >
                    {connectionStatus === 'connecting' ? 'Đang chuẩn bị...' : 'Bắt đầu Luyện tập'}
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto p-4 h-[calc(100vh-180px)]">
        <div className="bg-white p-4 rounded-xl shadow-md border mb-4">
            <h3 className="text-md font-bold text-slate-700 text-center">Nhiệm vụ của bạn: Dùng các từ sau</h3>
            <div className="flex justify-center flex-wrap gap-3 mt-3">
                {targetWords.map(word => (
                    <span key={word.english} className={`px-3 py-1 text-sm rounded-full font-medium transition-all ${usedWords.has(word.english) ? 'bg-green-200 text-green-800 line-through' : 'bg-slate-200 text-slate-700'}`}>
                        {word.english}
                    </span>
                ))}
            </div>
        </div>
        <div className="flex-1 bg-white rounded-xl shadow-inner border p-4 overflow-y-auto space-y-4">
            {transcript.map((item, index) => (
                <div key={index} className={`flex items-start gap-3 ${item.author === 'user' ? 'justify-end' : 'justify-start'}`}>
                   {item.author === 'ai' && (
                       <>
                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold mt-1 shadow">AI</div>
                        <div className="max-w-md p-3 rounded-2xl shadow-sm bg-slate-100 text-slate-800 rounded-bl-none">
                            {(() => {
                                const fullText = item.content;
                                if (!enableVietnamese) {
                                    return <p className="leading-relaxed">{fullText}</p>;
                                }
                                
                                const separatorRegex = /in vietnamese,/i;
                                const matchIndex = fullText.search(separatorRegex);

                                let englishPart = fullText;
                                let vietnamesePart = '';

                                if (matchIndex !== -1) {
                                    englishPart = fullText.substring(0, matchIndex).trim();
                                    vietnamesePart = fullText.substring(matchIndex + "In Vietnamese,".length).trim().replace(/^:?\s*/, '');
                                }
                                
                                return (
                                    <>
                                        <p className="leading-relaxed">{englishPart}</p>
                                        {vietnamesePart && (
                                            <p className="text-sm text-slate-500 mt-2 pt-2 border-t border-slate-200/60 italic">{vietnamesePart}</p>
                                        )}
                                    </>
                                );
                            })()}
                            {item.content && <div className="mt-2 -mb-1 -mr-1 text-right"><SpeakerButton textToSpeak={item.content} ariaLabel="Nghe lại" /></div>}
                        </div>
                       </>
                   )}
                   {item.author === 'user' && (
                       <>
                        <div className="max-w-md p-3 rounded-2xl shadow-sm bg-blue-100 text-slate-800 rounded-br-none">
                            <p className="leading-relaxed" dangerouslySetInnerHTML={{ __html: highlightUsedWords(item.content) }}></p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold mt-1 shadow">BẠN</div>
                       </>
                   )}
                </div>
            ))}
            {stage === 'finished' && (
                <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
                    <h4 className="font-bold text-green-800 text-lg">Hoàn thành! 🎉</h4>
                    <p className="text-green-700">Bạn đã sử dụng tất cả các từ. Làm tốt lắm!</p>
                </div>
            )}
        </div>
        <div className="mt-4 flex flex-col items-center justify-center gap-4">
            {stage !== 'finished' ? (
                renderMicButton()
            ) : (
                <button onClick={stopConversation} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
                    Chơi lại
                </button>
            )}
             <button onClick={stopConversation} className="text-sm text-slate-500 hover:text-slate-700">
                Kết thúc phiên
            </button>
        </div>
    </div>
  );
};

export default ConversationView;