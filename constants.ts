import type { Category, Word, CEFRLevel } from './types';

export const TYPE_COLORS: { [key: string]: string } = {
    'n': '#3b82f6',       // blue-500
    'v': '#16a34a',       // green-600
    'adj': '#8b5cf6',     // violet-500
    'adv': '#f97316',     // orange-500
    'prep': '#dc2626',    // red-600
    'conj': '#ca8a04',    // yellow-600
    'n/v': '#475569',     // slate-600
    'pron': '#ec4899',    // pink-500
    'det': '#14b8a6',     // teal-500
    'phr v': '#0891b2',   // cyan-600
    'idiom': '#d946ef',   // fuchsia-500
};

export const LEARNING_IDIOMS = [
  {
    idiom: "Practice makes perfect.",
    meaning: "Luyện tập tạo nên sự hoàn hảo.",
    example: "Don't give up on learning the piano. Practice makes perfect! (Đừng từ bỏ việc học piano. Có công mài sắt, có ngày nên kim!)"
  },
  {
    idiom: "Burn the midnight oil.",
    meaning: "Thức khuya để học hoặc làm việc.",
    example: "She was burning the midnight oil to prepare for her final exams. (Cô ấy đã thức khuya học bài để chuẩn bị cho kỳ thi cuối kỳ.)"
  },
  {
    idiom: "Hit the books.",
    meaning: "Bắt đầu học một cách nghiêm túc.",
    example: "I have a big test tomorrow, so I need to hit the books tonight. (Tôi có một bài kiểm tra lớn vào ngày mai, vì vậy tối nay tôi cần phải học hành chăm chỉ.)"
  },
  {
    idiom: "Pass with flying colors.",
    meaning: "Vượt qua kỳ thi với điểm số rất cao.",
    example: "He studied hard and passed the exam with flying colors. (Anh ấy đã học rất chăm chỉ và vượt qua kỳ thi với điểm số xuất sắc.)"
  },
];


// Dữ liệu thô sẽ được xử lý để thêm màu và ví dụ
const rawCategories: (Omit<Category, 'words'> & { words: Omit<Word, 'color'>[] })[] = [
  // A1 Level
  {
    id: 'a1-greetings', name: 'Chào hỏi & Giới thiệu', level: 'A1', words: [
      { english: 'hello', type: 'n', pronunciation: '/həˈloʊ/', vietnamese: 'xin chào', example: 'Hello, my name is John. (Xin chào, tên tôi là John.)' },
      { english: 'goodbye', type: 'n', pronunciation: '/ˌɡʊdˈbaɪ/', vietnamese: 'tạm biệt', example: 'Goodbye! See you tomorrow. (Tạm biệt! Hẹn gặp bạn ngày mai.)' },
      { english: 'name', type: 'n', pronunciation: '/neɪm/', vietnamese: 'tên', example: 'What is your name? (Tên bạn là gì?)' },
      { english: 'thank you', type: 'n', pronunciation: '/θæŋk juː/', vietnamese: 'cảm ơn', example: 'Thank you for your help. (Cảm ơn sự giúp đỡ của bạn.)' },
      { english: 'please', type: 'adv', pronunciation: '/pliːz/', vietnamese: 'làm ơn', example: 'Could you help me, please? (Làm ơn, bạn có thể giúp tôi được không?)' },
      { english: 'sorry', type: 'adj', pronunciation: '/ˈsɑːri/', vietnamese: 'xin lỗi', example: 'I am sorry for being late. (Tôi xin lỗi vì đã đến muộn.)' },
      { english: 'morning', type: 'n', pronunciation: '/ˈmɔːrnɪŋ/', vietnamese: 'buổi sáng', example: 'Good morning! (Chào buổi sáng!)' },
      { english: 'afternoon', type: 'n', pronunciation: '/ˌæftərˈnuːn/', vietnamese: 'buổi chiều', example: 'Good afternoon, sir. (Chào buổi chiều, thưa ông.)' },
      { english: 'evening', type: 'n', pronunciation: '/ˈiːvnɪŋ/', vietnamese: 'buổi tối', example: 'Good evening, everyone. (Chào buổi tối mọi người.)' },
    ],
  },
  {
    id: 'a1-family', name: 'Gia đình', level: 'A1', words: [
      { english: 'family', type: 'n', pronunciation: '/ˈfæməli/', vietnamese: 'gia đình', example: 'I have a small family. (Tôi có một gia đình nhỏ.)' },
      { english: 'mother', type: 'n', pronunciation: '/ˈmʌðər/', vietnamese: 'mẹ', example: 'My mother is a teacher. (Mẹ tôi là giáo viên.)' },
      { english: 'father', type: 'n', pronunciation: '/ˈfɑːðər/', vietnamese: 'bố', example: 'My father works in an office. (Bố tôi làm việc ở văn phòng.)' },
      { english: 'brother', type: 'n', pronunciation: '/ˈbrʌðər/', vietnamese: 'anh/em trai', example: 'He is my older brother. (Anh ấy là anh trai tôi.)' },
      { english: 'sister', type: 'n', pronunciation: '/ˈsɪstər/', vietnamese: 'chị/em gái', example: 'I have one sister. (Tôi có một người chị/em gái.)' },
      { english: 'son', type: 'n', pronunciation: '/sʌn/', vietnamese: 'con trai', example: 'They have one son and two daughters. (Họ có một con trai và hai con gái.)' },
      { english: 'daughter', type: 'n', pronunciation: '/ˈdɔːtər/', vietnamese: 'con gái', example: 'His daughter is five years old. (Con gái anh ấy năm tuổi.)' },
      { english: 'parent', type: 'n', pronunciation: '/ˈperənt/', vietnamese: 'bố mẹ', example: 'My parents live in the countryside. (Bố mẹ tôi sống ở nông thôn.)' },
    ],
  },
  {
    id: 'a1-common-objects', name: 'Đồ vật thông dụng', level: 'A1', words: [
        { english: 'book', type: 'n', pronunciation: '/bʊk/', vietnamese: 'quyển sách', example: 'I am reading a book. (Tôi đang đọc một quyển sách.)' },
        { english: 'pen', type: 'n', pronunciation: '/pen/', vietnamese: 'cái bút', example: 'Can I borrow your pen? (Tôi có thể mượn bút của bạn không?)' },
        { english: 'table', type: 'n', pronunciation: '/ˈteɪbl/', vietnamese: 'cái bàn', example: 'The keys are on the table. (Chìa khóa ở trên bàn.)' },
        { english: 'chair', type: 'n', pronunciation: '/tʃer/', vietnamese: 'cái ghế', example: 'Please have a chair. (Xin mời ngồi.)' },
        { english: 'house', type: 'n', pronunciation: '/haʊs/', vietnamese: 'ngôi nhà', example: 'This is my house. (Đây là nhà của tôi.)' },
        { english: 'car', type: 'n', pronunciation: '/kɑːr/', vietnamese: 'xe ô tô', example: 'She has a new car. (Cô ấy có một chiếc ô tô mới.)' },
        { english: 'phone', type: 'n', pronunciation: '/foʊn/', vietnamese: 'điện thoại', example: 'My phone is ringing. (Điện thoại của tôi đang reo.)' },
        { english: 'water', type: 'n', pronunciation: '/ˈwɔːtər/', vietnamese: 'nước', example: 'I need to drink some water. (Tôi cần uống một ít nước.)' },
    ]
  },
    {
    id: 'a1-weather', name: 'Thời tiết', level: 'A1', words: [
        { english: 'weather', type: 'n', pronunciation: '/ˈweðər/', vietnamese: 'thời tiết', example: 'What\'s the weather like today? (Thời tiết hôm nay thế nào?)' },
        { english: 'sunny', type: 'adj', pronunciation: '/ˈsʌni/', vietnamese: 'có nắng', example: 'It is a sunny day. (Hôm nay là một ngày nắng đẹp.)' },
        { english: 'rainy', type: 'adj', pronunciation: '/ˈreɪni/', vietnamese: 'có mưa', example: 'I don\'t like rainy days. (Tôi không thích những ngày mưa.)' },
        { english: 'cloudy', type: 'adj', pronunciation: '/ˈklaʊdi/', vietnamese: 'nhiều mây', example: 'The sky is cloudy. (Bầu trời nhiều mây.)' },
        { english: 'hot', type: 'adj', pronunciation: '/hɑːt/', vietnamese: 'nóng', example: 'It is very hot in the summer. (Mùa hè trời rất nóng.)' },
        { english: 'cold', type: 'adj', pronunciation: '/koʊld/', vietnamese: 'lạnh', example: 'Wear a coat, it\'s cold outside. (Mặc áo khoác vào, bên ngoài trời lạnh đấy.)' },
        { english: 'windy', type: 'adj', pronunciation: '/ˈwɪndi/', vietnamese: 'có gió', example: 'It is too windy to play outside. (Trời quá gió để chơi bên ngoài.)' },
    ]
  },
  // A2 Level
  {
    id: 'a2-daily-routines', name: 'Sinh hoạt hàng ngày', level: 'A2', words: [
      { english: 'get up', type: 'phr v', pronunciation: '/ɡet ʌp/', vietnamese: 'thức dậy', example: 'I get up at 7 AM every morning. (Tôi thức dậy lúc 7 giờ mỗi sáng.)' },
      { english: 'have breakfast', type: 'phr v', pronunciation: '/hæv ˈbrekfəst/', vietnamese: 'ăn sáng', example: 'We have breakfast together. (Chúng tôi ăn sáng cùng nhau.)' },
      { english: 'go to work', type: 'phr v', pronunciation: '/ɡoʊ tə wɜːrk/', vietnamese: 'đi làm', example: 'He goes to work by bus. (Anh ấy đi làm bằng xe buýt.)' },
      { english: 'watch TV', type: 'phr v', pronunciation: '/wɑːtʃ ˌtiːˈviː/', vietnamese: 'xem TV', example: 'They watch TV in the evening. (Họ xem TV vào buổi tối.)' },
      { english: 'usually', type: 'adv', pronunciation: '/ˈjuːʒuəli/', vietnamese: 'thường xuyên', example: 'I usually walk to school. (Tôi thường đi bộ đến trường.)' },
      { english: 'sometimes', type: 'adv', pronunciation: '/ˈsʌmtaɪmz/', vietnamese: 'thỉnh thoảng', example: 'Sometimes I play football with my friends. (Thỉnh thoảng tôi chơi bóng đá với bạn bè.)' },
      { english: 'always', type: 'adv', pronunciation: '/ˈɔːlweɪz/', vietnamese: 'luôn luôn', example: 'She always helps her mother. (Cô ấy luôn luôn giúp đỡ mẹ.)' },
      { english: 'never', type: 'adv', pronunciation: '/ˈnevər/', vietnamese: 'không bao giờ', example: 'He never eats fast food. (Anh ấy không bao giờ ăn đồ ăn nhanh.)' },
    ]
  },
  {
    id: 'a2-food-drink', name: 'Đồ ăn & Thức uống', level: 'A2', words: [
      { english: 'restaurant', type: 'n', pronunciation: '/ˈrestərɑːnt/', vietnamese: 'nhà hàng', example: 'Let\'s eat at that new restaurant. (Hãy ăn ở nhà hàng mới đó đi.)' },
      { english: 'delicious', type: 'adj', pronunciation: '/dɪˈlɪʃəs/', vietnamese: 'ngon', example: 'The food was delicious. (Đồ ăn rất ngon.)' },
      { english: 'hungry', type: 'adj', pronunciation: '/ˈhʌŋɡri/', vietnamese: 'đói', example: 'I am hungry, let\'s get some food. (Tôi đói, đi kiếm gì ăn thôi.)' },
      { english: 'thirsty', type: 'adj', pronunciation: '/ˈθɜːrsti/', vietnamese: 'khát', example: 'Can I have some water? I am thirsty. (Cho tôi ít nước được không? Tôi khát.)' },
      { english: 'menu', type: 'n', pronunciation: '/ˈmenjuː/', vietnamese: 'thực đơn', example: 'Could we see the menu, please? (Làm ơn cho chúng tôi xem thực đơn được không?)' },
      { english: 'order', type: 'v', pronunciation: '/ˈɔːrdər/', vietnamese: 'gọi món', example: 'Are you ready to order? (Bạn đã sẵn sàng gọi món chưa?)' },
      { english: 'waiter', type: 'n', pronunciation: '/ˈweɪtər/', vietnamese: 'bồi bàn nam', example: 'The waiter brought us the bill. (Người bồi bàn đã mang cho chúng tôi hóa đơn.)' },
      { english: 'bill', type: 'n', pronunciation: '/bɪl/', vietnamese: 'hóa đơn', example: 'Can we have the bill, please? (Làm ơn cho chúng tôi xin hóa đơn?)' },
    ]
  },
  {
    id: 'a2-shopping', name: 'Mua sắm', level: 'A2', words: [
        { english: 'price', type: 'n', pronunciation: '/praɪs/', vietnamese: 'giá cả', example: 'What is the price of this shirt? (Giá của chiếc áo này là bao nhiêu?)' },
        { english: 'expensive', type: 'adj', pronunciation: '/ɪkˈspensɪv/', vietnamese: 'đắt', example: 'This watch is too expensive for me. (Cái đồng hồ này quá đắt đối với tôi.)' },
        { english: 'cheap', type: 'adj', pronunciation: '/tʃiːp/', vietnamese: 'rẻ', example: 'I bought a cheap but good phone. (Tôi đã mua một chiếc điện thoại rẻ nhưng tốt.)' },
        { english: 'money', type: 'n', pronunciation: '/ˈmʌni/', vietnamese: 'tiền', example: 'I need to save more money. (Tôi cần tiết kiệm thêm tiền.)' },
        { english: 'buy', type: 'v', pronunciation: '/baɪ/', vietnamese: 'mua', example: 'I want to buy a new dress. (Tôi muốn mua một chiếc váy mới.)' },
        { english: 'sell', type: 'v', pronunciation: '/sel/', vietnamese: 'bán', example: 'They sell fresh fruit at the market. (Họ bán trái cây tươi ở chợ.)' },
    ]
  },
  {
    id: 'a2-travel', name: 'Du lịch', level: 'A2', words: [
        { english: 'airport', type: 'n', pronunciation: '/ˈerpɔːrt/', vietnamese: 'sân bay', example: 'We need to be at the airport two hours before the flight. (Chúng ta cần có mặt tại sân bay hai giờ trước chuyến bay.)' },
        { english: 'ticket', type: 'n', pronunciation: '/ˈtɪkɪt/', vietnamese: 'vé', example: 'Have you bought your plane ticket yet? (Bạn đã mua vé máy bay chưa?)' },
        { english: 'hotel', type: 'n', pronunciation: '/hoʊˈtel/', vietnamese: 'khách sạn', example: 'We are staying at a five-star hotel. (Chúng tôi đang ở một khách sạn năm sao.)' },
        { english: 'passport', type: 'n', pronunciation: '/ˈpæspɔːrt/', vietnamese: 'hộ chiếu', example: 'Don\'t forget your passport. (Đừng quên hộ chiếu của bạn.)' },
        { english: 'journey', type: 'n', pronunciation: '/ˈdʒɜːrni/', vietnamese: 'chuyến đi', example: 'It was a long journey by train. (Đó là một chuyến đi dài bằng tàu hỏa.)' },
        { english: 'visit', type: 'v', pronunciation: '/ˈvɪzɪt/', vietnamese: 'thăm', example: 'We are going to visit our grandparents next week. (Chúng tôi sẽ đi thăm ông bà vào tuần tới.)' },
        { english: 'tourist', type: 'n', pronunciation: '/ˈtʊrɪst/', vietnamese: 'khách du lịch', example: 'Many tourists visit this city in the summer. (Nhiều khách du lịch đến thăm thành phố này vào mùa hè.)' },
    ]
  },
   {
    id: 'a2-health', name: 'Sức khỏe', level: 'A2', words: [
      { english: 'doctor', type: 'n', pronunciation: '/ˈdɑːktər/', vietnamese: 'bác sĩ', example: 'I need to see a doctor. (Tôi cần đi gặp bác sĩ.)' },
      { english: 'hospital', type: 'n', pronunciation: '/ˈhɑːspɪtl/', vietnamese: 'bệnh viện', example: 'She was taken to the hospital. (Cô ấy đã được đưa đến bệnh viện.)' },
      { english: 'headache', type: 'n', pronunciation: '/ˈhedeɪk/', vietnamese: 'đau đầu', example: 'I have a terrible headache. (Tôi bị đau đầu kinh khủng.)' },
      { english: 'healthy', type: 'adj', pronunciation: '/ˈhelθi/', vietnamese: 'khỏe mạnh', example: 'Eating vegetables is healthy. (Ăn rau rất tốt cho sức khỏe.)' },
      { english: 'exercise', type: 'v', pronunciation: '/ˈeksərsaɪz/', vietnamese: 'tập thể dục', example: 'You should exercise regularly. (Bạn nên tập thể dục thường xuyên.)' },
    ],
  },
  // B1 Level
  {
    id: 'b1-work', name: 'Công việc', level: 'B1', words: [
      { english: 'appointment', type: 'n', pronunciation: '/əˈpɔɪntmənt/', vietnamese: 'cuộc hẹn', example: 'I have a doctor\'s appointment at 3 PM. (Tôi có cuộc hẹn với bác sĩ lúc 3 giờ chiều.)' },
      { english: 'employee', type: 'n', pronunciation: '/ɪmˈplɔɪiː/', vietnamese: 'nhân viên', example: 'The company has over 100 employees. (Công ty có hơn 100 nhân viên.)' },
      { english: 'meeting', type: 'n', pronunciation: '/ˈmiːtɪŋ/', vietnamese: 'cuộc họp', example: 'The meeting was postponed until next week. (Cuộc họp đã bị hoãn lại đến tuần sau.)' },
      { english: 'project', type: 'n', pronunciation: '/ˈprɒdʒekt/', vietnamese: 'dự án', example: 'We are working on a new project. (Chúng tôi đang thực hiện một dự án mới.)' },
      { english: 'salary', type: 'n', pronunciation: '/ˈsæləri/', vietnamese: 'lương', example: 'He receives a good salary. (Anh ấy nhận được một mức lương tốt.)' },
      { english: 'manager', type: 'n', pronunciation: '/ˈmænɪdʒər/', vietnamese: 'quản lý', example: 'She is the manager of the sales department. (Cô ấy là quản lý của phòng kinh doanh.)' },
      { english: 'deadline', type: 'n', pronunciation: '/ˈdedlaɪn/', vietnamese: 'hạn chót', example: 'The deadline for this project is Friday. (Hạn chót cho dự án này là thứ Sáu.)' },
      { english: 'experience', type: 'n', pronunciation: '/ɪkˈspɪriəns/', vietnamese: 'kinh nghiệm', example: 'Do you have any experience in this field? (Bạn có kinh nghiệm trong lĩnh vực này không?)' },
      { english: 'colleague', type: 'n', pronunciation: '/ˈkɑːliːɡ/', vietnamese: 'đồng nghiệp', example: 'I went to lunch with my colleagues. (Tôi đã đi ăn trưa với các đồng nghiệp của mình.)' },
    ]
  },
  {
    id: 'b1-education', name: 'Giáo dục', level: 'B1', words: [
        { english: 'university', type: 'n', pronunciation: '/ˌjuːnɪˈvɜːrsəti/', vietnamese: 'trường đại học', example: 'She is studying economics at a famous university. (Cô ấy đang học kinh tế tại một trường đại học nổi tiếng.)' },
        { english: 'exam', type: 'n', pronunciation: '/ɪɡˈzæm/', vietnamese: 'kỳ thi', example: 'I have to study for my final exams. (Tôi phải học cho kỳ thi cuối kỳ.)' },
        { english: 'degree', type: 'n', pronunciation: '/dɪˈɡriː/', vietnamese: 'bằng cấp', example: 'He has a degree in computer science. (Anh ấy có bằng cử nhân ngành khoa học máy tính.)' },
        { english: 'subject', type: 'n', pronunciation: '/ˈsʌbdʒɪkt/', vietnamese: 'môn học', example: 'My favorite subject in school was history. (Môn học yêu thích của tôi ở trường là lịch sử.)' },
        { english: 'knowledge', type: 'n', pronunciation: '/ˈnɑːlɪdʒ/', vietnamese: 'kiến thức', example: 'Reading books is a good way to gain knowledge. (Đọc sách là một cách tốt để thu nhận kiến thức.)' },
    ]
  },
  {
    id: 'b1-opinions', name: 'Quan điểm & Cảm xúc', level: 'B1', words: [
      { english: 'believe', type: 'v', pronunciation: '/bɪˈliːv/', vietnamese: 'tin tưởng', example: 'I believe we can solve this problem. (Tôi tin rằng chúng ta có thể giải quyết vấn đề này.)' },
      { english: 'disagree', type: 'v', pronunciation: '/ˌdɪsəˈɡriː/', vietnamese: 'không đồng ý', example: 'I disagree with your opinion on this matter. (Tôi không đồng ý với ý kiến của bạn về vấn đề này.)' },
      { english: 'excited', type: 'adj', pronunciation: '/ɪkˈsaɪtɪd/', vietnamese: 'hào hứng', example: 'She was excited about her trip to Paris. (Cô ấy rất hào hứng về chuyến đi đến Paris.)' },
      { english: 'worried', type: 'adj', pronunciation: '/ˈwɜːrid/', vietnamese: 'lo lắng', example: 'I am worried about the exam results. (Tôi lo lắng về kết quả kỳ thi.)' },
      { english: 'opinion', type: 'n', pronunciation: '/əˈpɪnjən/', vietnamese: 'ý kiến', example: 'In my opinion, this is the best solution. (Theo ý kiến của tôi, đây là giải pháp tốt nhất.)' },
      { english: 'suggest', type: 'v', pronunciation: '/səɡˈdʒest/', vietnamese: 'gợi ý', example: 'I suggest that we take a break. (Tôi gợi ý chúng ta nên nghỉ giải lao.)' },
      { english: 'probably', type: 'adv', pronunciation: '/ˈprɑːbəbli/', vietnamese: 'có lẽ', example: 'It will probably rain tomorrow. (Ngày mai có lẽ trời sẽ mưa.)' },
      { english: 'disappointed', type: 'adj', pronunciation: '/ˌdɪsəˈpɔɪntɪd/', vietnamese: 'thất vọng', example: 'He was disappointed with his test score. (Anh ấy thất vọng với điểm kiểm tra của mình.)' },
      { english: 'prefer', type: 'v', pronunciation: '/prɪˈfɜːr/', vietnamese: 'thích hơn', example: 'I prefer tea to coffee. (Tôi thích trà hơn cà phê.)' },
    ]
  },
  {
    id: 'b1-environment', name: 'Môi trường', level: 'B1', words: [
      { english: 'pollution', type: 'n', pronunciation: '/pəˈluːʃn/', vietnamese: 'sự ô nhiễm', example: 'Air pollution is a serious problem in big cities. (Ô nhiễm không khí là một vấn đề nghiêm trọng ở các thành phố lớn.)' },
      { english: 'recycle', type: 'v', pronunciation: '/ˌriːˈsaɪkl/', vietnamese: 'tái chế', example: 'We should recycle paper and plastic. (Chúng ta nên tái chế giấy và nhựa.)' },
      { english: 'protect', type: 'v', pronunciation: '/prəˈtekt/', vietnamese: 'bảo vệ', example: 'We need to protect endangered animals. (Chúng ta cần bảo vệ các loài động vật có nguy cơ tuyệt chủng.)' },
      { english: 'climate change', type: 'n', pronunciation: '/ˈklaɪmət tʃeɪndʒ/', vietnamese: 'biến đổi khí hậu', example: 'Climate change is causing global temperatures to rise. (Biến đổi khí hậu đang làm cho nhiệt độ toàn cầu tăng lên.)' },
      { english: 'environment', type: 'n', pronunciation: '/ɪnˈvaɪrənmənt/', vietnamese: 'môi trường', example: 'It is important to keep our environment clean. (Việc giữ cho môi trường của chúng ta sạch sẽ là rất quan trọng.)' },
    ]
  },
   {
    id: 'b1-hobbies', name: 'Sở thích', level: 'B1', words: [
      { english: 'hobby', type: 'n', pronunciation: '/ˈhɑːbi/', vietnamese: 'sở thích', example: 'My hobby is playing the guitar. (Sở thích của tôi là chơi guitar.)' },
      { english: 'photography', type: 'n', pronunciation: '/fəˈtɑːɡrəfi/', vietnamese: 'nhiếp ảnh', example: 'She is interested in photography. (Cô ấy quan tâm đến nhiếp ảnh.)' },
      { english: 'gardening', type: 'n', pronunciation: '/ˈɡɑːrdnɪŋ/', vietnamese: 'làm vườn', example: 'Gardening is a relaxing activity. (Làm vườn là một hoạt động thư giãn.)' },
      { english: 'collect', type: 'v', pronunciation: '/kəˈlekt/', vietnamese: 'sưu tầm', example: 'He likes to collect old stamps. (Anh ấy thích sưu tầm tem cũ.)' },
      { english: 'instrument', type: 'n', pronunciation: '/ˈɪnstrəmənt/', vietnamese: 'nhạc cụ', example: 'Can you play any musical instrument? (Bạn có thể chơi bất kỳ nhạc cụ nào không?)' },
    ],
  },
  // B2 Level
  {
    id: 'b2-technology', name: 'Công nghệ', level: 'B2', words: [
      { english: 'advantage', type: 'n', pronunciation: '/ədˈvæntɪdʒ/', vietnamese: 'lợi thế', example: 'The advantage of this software is its simplicity. (Lợi thế của phần mềm này là sự đơn giản của nó.)' },
      { english: 'disadvantage', type: 'n', pronunciation: '/ˌdɪsədˈvæntɪdʒ/', vietnamese: 'bất lợi', example: 'A major disadvantage is the high cost. (Một bất lợi lớn là chi phí cao.)' },
      { english: 'efficient', type: 'adj', pronunciation: '/ɪˈfɪʃnt/', vietnamese: 'hiệu quả', example: 'This new machine is more efficient than the old one. (Cái máy mới này hiệu quả hơn cái cũ.)' },
      { english: 'reliable', type: 'adj', pronunciation: '/rɪˈlaɪəbl/', vietnamese: 'đáng tin cậy', example: 'We need a reliable internet connection for our work. (Chúng tôi cần một kết nối internet đáng tin cậy cho công việc.)' },
      { english: 'develop', type: 'v', pronunciation: '/dɪˈveləp/', vietnamese: 'phát triển', example: 'They are developing a new type of battery. (Họ đang phát triển một loại pin mới.)' },
      { english: 'innovation', type: 'n', pronunciation: '/ˌɪnəˈveɪʃn/', vietnamese: 'sự đổi mới', example: 'The company is known for its technological innovation. (Công ty được biết đến với sự đổi mới công nghệ.)' },
      { english: 'device', type: 'n', pronunciation: '/dɪˈvaɪs/', vietnamese: 'thiết bị', example: 'A smartphone is a very useful device. (Điện thoại thông minh là một thiết bị rất hữu ích.)' },
      { english: 'artificial intelligence', type: 'n', pronunciation: '/ˌɑːrtɪfɪʃl ɪnˈtelɪdʒəns/', vietnamese: 'trí tuệ nhân tạo', example: 'Artificial intelligence is changing many industries. (Trí tuệ nhân tạo đang thay đổi nhiều ngành công nghiệp.)' },
    ]
  },
   {
    id: 'b2-society', name: 'Xã hội', level: 'B2', words: [
      { english: 'government', type: 'n', pronunciation: '/ˈɡʌvərnmənt/', vietnamese: 'chính phủ', example: 'The government has announced new policies. (Chính phủ đã công bố các chính sách mới.)' },
      { english: 'economy', type: 'n', pronunciation: '/ɪˈkɑːnəmi/', vietnamese: 'nền kinh tế', example: 'The country\'s economy is growing fast. (Nền kinh tế của đất nước đang phát triển nhanh.)' },
      { english: 'community', type: 'n', pronunciation: '/kəˈmjuːnəti/', vietnamese: 'cộng đồng', example: 'He is an active member of the local community. (Anh ấy là một thành viên tích cực của cộng đồng địa phương.)' },
      { english: 'culture', type: 'n', pronunciation: '/ˈkʌltʃər/', vietnamese: 'văn hóa', example: 'I am interested in learning about different cultures. (Tôi thích tìm hiểu về các nền văn hóa khác nhau.)' },
      { english: 'citizen', type: 'n', pronunciation: '/ˈsɪtɪzn/', vietnamese: 'công dân', example: 'He is a citizen of the United States. (Anh ấy là công dân của Hoa Kỳ.)' },
      { english: 'election', type: 'n', pronunciation: '/ɪˈlekʃn/', vietnamese: 'cuộc bầu cử', example: 'The presidential election will be held next year. (Cuộc bầu cử tổng thống sẽ được tổ chức vào năm tới.)' },
    ]
  },
  {
    id: 'b2-media', name: 'Truyền thông', level: 'B2', words: [
        { english: 'influence', type: 'n/v', pronunciation: '/ˈɪnfluəns/', vietnamese: 'ảnh hưởng', example: 'The media has a powerful influence on public opinion. (Truyền thông có ảnh hưởng mạnh mẽ đến dư luận.)' },
        { english: 'broadcast', type: 'v', pronunciation: '/ˈbrɔːdkæst/', vietnamese: 'phát sóng', example: 'The concert will be broadcast live. (Buổi hòa nhạc sẽ được phát sóng trực tiếp.)' },
        { english: 'journalist', type: 'n', pronunciation: '/ˈdʒɜːrnəlɪst/', vietnamese: 'nhà báo', example: 'She works as a journalist for a major newspaper. (Cô ấy làm nhà báo cho một tờ báo lớn.)' },
        { english: 'advertisement', type: 'n', pronunciation: '/ˌædvərˈtaɪzmənt/', vietnamese: 'quảng cáo', example: 'I saw an advertisement for a new car on TV. (Tôi đã xem một quảng cáo xe hơi mới trên TV.)' },
        { english: 'source', type: 'n', pronunciation: '/sɔːrs/', vietnamese: 'nguồn (tin)', example: 'It is important to verify the source of the information. (Việc xác minh nguồn thông tin là rất quan trọng.)' },
    ]
  },
  {
    id: 'b2-finance', name: 'Tài chính', level: 'B2', words: [
      { english: 'investment', type: 'n', pronunciation: '/ɪnˈvestmənt/', vietnamese: 'sự đầu tư', example: 'Real estate can be a good investment. (Bất động sản có thể là một khoản đầu tư tốt.)' },
      { english: 'profit', type: 'n', pronunciation: '/ˈprɑːfɪt/', vietnamese: 'lợi nhuận', example: 'The company made a huge profit last year. (Công ty đã tạo ra lợi nhuận khổng lồ vào năm ngoái.)' },
      { english: 'budget', type: 'n', pronunciation: '/ˈbʌdʒɪt/', vietnamese: 'ngân sách', example: 'We need to create a budget for this project. (Chúng ta cần tạo ngân sách cho dự án này.)' },
      { english: 'loan', type: 'n', pronunciation: '/loʊn/', vietnamese: 'khoản vay', example: 'He took out a loan to buy a car. (Anh ấy đã vay một khoản để mua ô tô.)' },
      { english: 'debt', type: 'n', pronunciation: '/det/', vietnamese: 'nợ', example: 'It is important to pay off your debts. (Việc trả hết nợ của bạn là rất quan trọng.)' },
    ],
  },
  // C1 Level
  {
    id: 'c1-academic', name: 'Học thuật', level: 'C1', words: [
      { english: 'analyze', type: 'v', pronunciation: '/ˈænəlaɪz/', vietnamese: 'phân tích', example: 'The scientist will analyze the data from the experiment. (Nhà khoa học sẽ phân tích dữ liệu từ thí nghiệm.)' },
      { english: 'hypothesis', type: 'n', pronunciation: '/haɪˈpɒθəsɪs/', vietnamese: 'giả thuyết', example: 'The results of the study supported their initial hypothesis. (Kết quả của nghiên cứu đã ủng hộ giả thuyết ban đầu của họ.)' },
      { english: 'ambiguous', type: 'adj', pronunciation: '/æmˈbɪɡjuəs/', vietnamese: 'mơ hồ, không rõ ràng', example: 'The instructions were ambiguous, which led to confusion. (Hướng dẫn không rõ ràng, dẫn đến sự nhầm lẫn.)' },
      { english: 'comprehensive', type: 'adj', pronunciation: '/ˌkɒmprɪˈhensɪv/', vietnamese: 'toàn diện', example: 'The report provides a comprehensive overview of the issue. (Báo cáo cung cấp một cái nhìn tổng quan toàn diện về vấn đề.)' },
      { english: 'criterion', type: 'n', pronunciation: '/kraɪˈtɪriən/', vietnamese: 'tiêu chí', example: 'What is the main criterion for selecting the candidates? (Tiêu chí chính để lựa chọn ứng viên là gì?)' },
      { english: 'implication', type: 'n', pronunciation: '/ˌɪmplɪˈkeɪʃn/', vietnamese: 'hàm ý, ẩn ý', example: 'The new law has serious implications for the economy. (Luật mới có những hàm ý nghiêm trọng đối với nền kinh tế.)' },
      { english: 'theory', type: 'n', pronunciation: '/ˈθiːəri/', vietnamese: 'lý thuyết', example: 'Einstein\'s theory of relativity changed physics. (Thuyết tương đối của Einstein đã thay đổi ngành vật lý.)' },
    ]
  },
  {
    id: 'c1-business', name: 'Kinh doanh', level: 'C1', words: [
      { english: 'negotiate', type: 'v', pronunciation: '/nəˈɡoʊʃieɪt/', vietnamese: 'đàm phán', example: 'They are negotiating a new contract. (Họ đang đàm phán một hợp đồng mới.)' },
      { english: 'strategy', type: 'n', pronunciation: '/ˈstrætədʒi/', vietnamese: 'chiến lược', example: 'The company needs a new marketing strategy. (Công ty cần một chiến lược tiếp thị mới.)' },
      { english: 'revenue', type: 'n', pronunciation: '/ˈrevənuː/', vietnamese: 'doanh thu', example: 'The company\'s revenue increased by 10% last year. (Doanh thu của công ty đã tăng 10% vào năm ngoái.)' },
      { english: 'competitor', type: 'n', pronunciation: '/kəmˈpetɪtər/', vietnamese: 'đối thủ cạnh tranh', example: 'We need to be better than our competitors. (Chúng ta cần phải tốt hơn các đối thủ cạnh tranh của mình.)' },
      { english: 'entrepreneur', type: 'n', pronunciation: '/ˌɑːntrəprəˈnɜːr/', vietnamese: 'doanh nhân', example: 'He is a successful entrepreneur who started his own company. (Anh ấy là một doanh nhân thành đạt đã thành lập công ty của riêng mình.)' },
      { english: 'leverage', type: 'v', pronunciation: '/ˈlevərɪdʒ/', vietnamese: 'tận dụng', example: 'We should leverage our brand reputation to attract more customers. (Chúng ta nên tận dụng danh tiếng thương hiệu của mình để thu hút thêm khách hàng.)' },
      { english: 'asset', type: 'n', pronunciation: '/ˈæset/', vietnamese: 'tài sản', example: 'Our employees are our most valuable asset. (Nhân viên là tài sản quý giá nhất của chúng tôi.)' },
    ]
  },
  {
    id: 'c1-politics', name: 'Chính trị & Luật pháp', level: 'C1', words: [
      { english: 'legislation', type: 'n', pronunciation: '/ˌledʒɪsˈleɪʃn/', vietnamese: 'pháp luật, luật pháp', example: 'The government has passed new legislation to protect the environment. (Chính phủ đã thông qua luật mới để bảo vệ môi trường.)' },
      { english: 'advocate', type: 'v', pronunciation: '/ˈædvəkeɪt/', vietnamese: 'biện hộ, ủng hộ', example: 'She is a strong advocate for human rights. (Cô ấy là một người ủng hộ mạnh mẽ cho nhân quyền.)' },
      { english: 'sovereignty', type: 'n', pronunciation: '/ˈsɒvrənti/', vietnamese: 'chủ quyền', example: 'The country fought to defend its sovereignty. (Đất nước đã chiến đấu để bảo vệ chủ quyền của mình.)' },
      { english: 'treaty', type: 'n', pronunciation: '/ˈtriːti/', vietnamese: 'hiệp ước', example: 'The two nations signed a peace treaty. (Hai quốc gia đã ký một hiệp ước hòa bình.)' },
      { english: 'judiciary', type: 'n', pronunciation: '/dʒuˈdɪʃieri/', vietnamese: 'cơ quan tư pháp', example: 'An independent judiciary is essential for a democracy. (Một cơ quan tư pháp độc lập là điều cần thiết cho một nền dân chủ.)' },
    ]
  },
   {
    id: 'c1-psychology', name: 'Tâm lý học', level: 'C1', words: [
      { english: 'cognitive', type: 'adj', pronunciation: '/ˈkɑːɡnətɪv/', vietnamese: 'thuộc về nhận thức', example: 'Cognitive skills include memory and problem-solving. (Kỹ năng nhận thức bao gồm trí nhớ và giải quyết vấn đề.)' },
      { english: 'bias', type: 'n', pronunciation: '/ˈbaɪəs/', vietnamese: 'thành kiến, thiên vị', example: 'We must be aware of our own cognitive biases. (Chúng ta phải nhận thức được những thành kiến nhận thức của chính mình.)' },
      { english: 'perception', type: 'n', pronunciation: '/pərˈsepʃn/', vietnamese: 'sự nhận thức', example: 'Our perception of reality is influenced by our experiences. (Nhận thức của chúng ta về thực tế bị ảnh hưởng bởi kinh nghiệm của chúng ta.)' },
      { english: 'motivation', type: 'n', pronunciation: '/ˌmoʊtɪˈveɪʃn/', vietnamese: 'động lực', example: 'Understanding student motivation is key to effective teaching. (Hiểu được động lực của học sinh là chìa khóa để giảng dạy hiệu quả.)' },
      { english: 'anxiety', type: 'n', pronunciation: '/æŋˈzaɪəti/', vietnamese: 'sự lo âu', example: 'He suffers from social anxiety. (Anh ấy bị chứng lo âu xã hội.)' },
    ],
  },
  // C2 Level
  {
    id: 'c2-advanced-concepts', name: 'Khái niệm nâng cao', level: 'C2', words: [
      { english: 'ubiquitous', type: 'adj', pronunciation: '/juːˈbɪkwɪtəs/', vietnamese: 'phổ biến, ở đâu cũng có', example: 'Smartphones have become ubiquitous in modern society. (Điện thoại thông minh đã trở nên phổ biến trong xã hội hiện đại.)' },
      { english: 'ephemeral', type: 'adj', pronunciation: '/ɪˈfemərəl/', vietnamese: 'phù du, chóng tàn', example: 'Fashion trends are often ephemeral. (Các xu hướng thời trang thường chỉ là phù du.)' },
      { english: 'juxtaposition', type: 'n', pronunciation: '/ˌdʒʌkstəpəˈzɪʃn/', vietnamese: 'sự đặt cạnh nhau', example: 'The juxtaposition of wealth and poverty in the city is striking. (Sự đặt cạnh nhau của giàu và nghèo trong thành phố thật đáng kinh ngạc.)' },
      { english: 'eloquent', type: 'adj', pronunciation: '/ˈeləkwənt/', vietnamese: 'hùng hồn, có tài hùng biện', example: 'She delivered an eloquent speech that moved the audience. (Cô ấy đã có một bài phát biểu hùng hồn làm lay động khán giả.)' },
      { english: 'pernicious', type: 'adj', pronunciation: '/pərˈnɪʃəs/', vietnamese: 'độc hại, nguy hiểm', example: 'The pernicious effects of social media on mental health are well-documented. (Những ảnh hưởng độc hại của mạng xã hội đối với sức khỏe tâm thần đã được ghi nhận rõ ràng.)' },
      { english: 'inexorable', type: 'adj', pronunciation: '/ɪnˈeksərəbl/', vietnamese: 'không thể lay chuyển', example: 'The inexorable march of time affects us all. (Bước đi không thể lay chuyển của thời gian ảnh hưởng đến tất cả chúng ta.)' },
      { english: 'cacophony', type: 'n', pronunciation: '/kəˈkɑːfəni/', vietnamese: 'âm thanh hỗn tạp, chói tai', example: 'The city street was filled with a cacophony of car horns and construction noise. (Đường phố đầy những âm thanh hỗn tạp của còi xe và tiếng ồn xây dựng.)' },
      { english: 'veracity', type: 'n', pronunciation: '/vəˈræsəti/', vietnamese: 'tính chân thực', example: 'The police questioned the veracity of his statement. (Cảnh sát đã nghi ngờ tính chân thực của lời khai của anh ta.)' },
    ]
  },
  {
    id: 'c2-abstract-ideas', name: 'Ý tưởng trừu tượng', level: 'C2', words: [
        { english: 'paradigm', type: 'n', pronunciation: '/ˈpærədaɪm/', vietnamese: 'hệ hình, mô hình', example: 'The discovery of DNA created a new paradigm in biology. (Việc phát hiện ra DNA đã tạo ra một hệ hình mới trong sinh học.)' },
        { english: 'dichotomy', type: 'n', pronunciation: '/daɪˈkɒtəmi/', vietnamese: 'sự phân đôi', example: 'There is often a dichotomy between what people say and what they do. (Thường có một sự phân đôi giữa những gì người ta nói và những gì họ làm.)' },
        { english: 'zeitgeist', type: 'n', pronunciation: '/ˈzaɪtɡaɪst/', vietnamese: 'tinh thần thời đại', example: 'His music perfectly captured the zeitgeist of the 1960s. (Âm nhạc của ông đã nắm bắt hoàn hảo tinh thần thời đại của những năm 1960.)' },
        { english: 'esoteric', type: 'adj', pronunciation: '/ˌesəˈterɪk/', vietnamese: 'bí truyền, khó hiểu', example: 'He was having an esoteric conversation about philosophy. (Anh ấy đang có một cuộc trò chuyện khó hiểu về triết học.)' },
        { english: 'synergy', type: 'n', pronunciation: '/ˈsɪnərdʒi/', vietnamese: 'sự hợp lực', example: 'The synergy between the two companies resulted in a very successful product. (Sự hợp lực giữa hai công ty đã tạo ra một sản phẩm rất thành công.)' },
    ]
  },
  {
    id: 'c2-philosophy', name: 'Triết học', level: 'C2', words: [
      { english: 'ontology', type: 'n', pronunciation: '/ɒnˈtɒlədʒi/', vietnamese: 'bản thể luận', example: 'Ontology is the branch of metaphysics dealing with the nature of being. (Bản thể luận là nhánh của siêu hình học nghiên cứu về bản chất của sự tồn tại.)' },
      { english: 'epistemology', type: 'n', pronunciation: '/ɪˌpɪstəˈmɒlədʒi/', vietnamese: 'nhận thức luận', example: 'Epistemology questions what knowledge is and how it can be acquired. (Nhận thức luận đặt câu hỏi kiến thức là gì và làm thế nào để có được nó.)' },
      { english: 'hedonism', type: 'n', pronunciation: '/ˈhiːdənɪzəm/', vietnamese: 'chủ nghĩa khoái lạc', example: 'Hedonism is the ethical theory that pleasure is the highest good. (Chủ nghĩa khoái lạc là học thuyết đạo đức cho rằng khoái lạc là điều tốt đẹp nhất.)' },
      { english: 'stoicism', type: 'n', pronunciation: '/ˈstoʊɪsɪzəm/', vietnamese: 'chủ nghĩa khắc kỷ', example: 'Stoicism teaches the development of self-control and fortitude as a means of overcoming destructive emotions. (Chủ nghĩa khắc kỷ dạy về sự phát triển của tự chủ và dũng khí như một phương tiện để vượt qua những cảm xúc tiêu cực.)' },
      { english: 'existentialism', type: 'n', pronunciation: '/ˌeɡzɪˈstenʃəlɪzəm/', vietnamese: 'chủ nghĩa hiện sinh', example: 'Existentialism emphasizes individual freedom, responsibility, and the meaning of life. (Chủ nghĩa hiện sinh nhấn mạnh sự tự do, trách nhiệm cá nhân và ý nghĩa của cuộc sống.)' },
    ],
  }
];

// Xử lý dữ liệu thô để thêm thuộc tính màu vào mỗi từ
export const WORD_CATEGORIES: Category[] = rawCategories.map(category => ({
  ...category,
  words: category.words.map(word => ({
    ...word,
    example: word.example || 'Example not available. (Chưa có ví dụ.)',
    color: TYPE_COLORS[word.type] || TYPE_COLORS['n/v'],
  })),
}));

export const ALL_WORDS: Word[] = WORD_CATEGORIES.flatMap(category => category.words);