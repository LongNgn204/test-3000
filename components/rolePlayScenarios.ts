// FIX: Import React to support JSX syntax for icons.
import React from 'react';

export interface Scenario {
  id: string;
  title: string;
  description: string;
  goal: string;
  category: 'Du lịch' | 'Công việc' | 'Đời sống hàng ngày';
  icon: React.ReactNode;
  systemInstruction: string;
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'order-coffee',
    title: 'Gọi Cà Phê',
    description: 'Luyện tập gọi đồ uống tại một quán cà phê.',
    goal: 'Gọi thành công một ly latte đá cỡ vừa, ít đường.',
    category: 'Đời sống hàng ngày',
    // FIX: Replaced JSX with React.createElement to be compatible with .ts files.
    icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 21c-5.523 0-10-4.477-10-10S6.477 1 12 1s10 4.477 10 10-4.477 10-10 10zm0-18c-4.411 0-8 3.589-8 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8zm0 14c-3.309 0-6-2.691-6-6s2.691-6 6-6 6 2.691 6 6-2.691 6-6 6zm0-10c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4z" })),
    systemInstruction: `You are a friendly barista at a coffee shop. Your goal is to take the user's order. The user's task is to successfully order an iced, medium-sized latte with less sugar. Respond naturally to their requests. Start the conversation with "Hi, what can I get for you today?". You must always respond ONLY in English. DO NOT provide any Vietnamese translation.`
  },
  {
    id: 'hotel-check-in',
    title: 'Check-in Khách sạn',
    description: 'Thực hành các thủ tục nhận phòng tại khách sạn.',
    goal: 'Hoàn thành check-in cho phòng đôi trong 2 đêm.',
    category: 'Du lịch',
    // FIX: Replaced JSX with React.createElement to be compatible with .ts files.
    icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" })),
    systemInstruction: `You are a hotel receptionist. The user wants to check in. Their task is to check in for a double room for 2 nights. You may need to ask for their name, reservation details, or a passport. Be helpful and polite. Start the conversation with "Good afternoon, welcome to our hotel. How can I help you?". You must always respond ONLY in English. DO NOT provide any Vietnamese translation.`
  },
  {
    id: 'job-interview',
    title: 'Phỏng vấn Xin việc',
    description: 'Trải nghiệm một buổi phỏng vấn cho vị trí nhân viên.',
    goal: 'Trả lời 3 câu hỏi phỏng vấn về kinh nghiệm và điểm mạnh.',
    category: 'Công việc',
    // FIX: Replaced JSX with React.createElement to be compatible with .ts files.
    icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6a4 4 0 11-8 0 4 4 0 018 0z" })),
    systemInstruction: `You are a hiring manager interviewing the user for a junior position. Their task is to answer 3 questions about their experience and strengths. You must ask at least three questions, such as "Tell me about your previous experience," "What are your greatest strengths?", and "Why do you want to work here?". Evaluate their answers naturally. Start with "Thanks for coming in today. Let's start with a few questions. Could you tell me about yourself?". You must always respond ONLY in English. DO NOT provide any Vietnamese translation.`
  }
];