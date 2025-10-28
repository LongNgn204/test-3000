const LEARNING_IDIOMS = [
    { idiom: 'Break the ice', meaning: 'Phá bỏ sự ngại ngùng', example: 'To start a conversation in a social setting (Bắt đầu một cuộc trò chuyện trong một bối cảnh xã hội)' },
    { idiom: 'Piece of cake', meaning: 'Dễ như ăn bánh', example: 'Something very easy to do (Một việc rất dễ làm)' },
    // Add 98 more idioms
];

const rawCategories = [
    { category: 'A1', words: [
        { english: 'red', type: 'noun', pronunciation: '/rɛd/', vietnamese: 'đỏ', example: 'The color of blood (Màu của máu)' },
        // Add 3000+ new words for A1
    ] },
    { category: 'A2', words: [
        // Add new words for A2
    ] },
    { category: 'B1', words: [
        // Add new words for B1
    ] },
    // Continue for B2, C1, C2
];

const TYPE_COLORS = {
    // Keep existing structure intact
};

// Ensure to follow TypeScript typing for Category and Word interfaces.