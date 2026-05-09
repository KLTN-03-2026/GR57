import { useState, useRef, useEffect } from 'react';
import { StudentSidebar } from '@/components/layouts/StudentSidebar';
import { StudentHeader } from '@/components/layouts/StudentHeader';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Xin chào! Tôi là trợ lý AI của LearningHub. Tôi có thể giúp bạn giải đáp các câu hỏi về học tập, lịch học, điểm số và nhiều hơn nữa. Bạn cần hỗ trợ gì?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    'Lịch học của tôi tuần này?',
    'Điểm số môn Lập trình web',
    'Hạn nộp bài tập sắp tới',
    'Cách đăng ký tín chỉ',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('lịch') || lowerMessage.includes('học')) {
      return 'Lịch học tuần này của bạn:\n\n📅 Thứ 2: Lập trình Web (7:00 - 9:30, P.301)\n📅 Thứ 3: Cơ sở dữ liệu (13:00 - 15:30, P.205)\n📅 Thứ 4: Mạng máy tính (9:00 - 11:30, P.402)\n📅 Thứ 5: Quản trị dự án (15:00 - 17:30, P.108)\n📅 Thứ 6: Thực hành Lab (13:00 - 16:30, P.Lab2)\n\nBạn có thể xem chi tiết tại mục "Lịch học" nhé!';
    }

    if (lowerMessage.includes('điểm') || lowerMessage.includes('score')) {
      return 'Điểm số gần đây của bạn:\n\n📊 Lập trình Web: 8.5/10\n📊 Cơ sở dữ liệu: 9.0/10\n📊 Mạng máy tính: 7.5/10\n📊 Quản trị dự án: 8.8/10\n\n🎯 GPA hiện tại: 3.42/4.0\n\nBạn đang học tập rất tốt! Xem chi tiết tại "Tiến độ học tập".';
    }

    if (lowerMessage.includes('bài tập') || lowerMessage.includes('assignment')) {
      return 'Bài tập sắp đến hạn:\n\n⏰ Bài tập Lập trình Web #5\n   Hạn: 28/03/2026 23:59\n   Trạng thái: Chưa nộp\n\n⏰ Báo cáo Cơ sở dữ liệu\n   Hạn: 30/03/2026 17:00\n   Trạng thái: Đang làm\n\n⏰ Thực hành Mạng máy tính\n   Hạn: 02/04/2026 23:59\n   Trạng thái: Chưa nộp\n\nHãy hoàn thành đúng hạn nhé!';
    }

    if (lowerMessage.includes('đăng ký') || lowerMessage.includes('tín chỉ')) {
      return 'Hướng dẫn đăng ký tín chỉ:\n\n1️⃣ Vào mục "Đăng ký tín chỉ"\n2️⃣ Chọn các môn học bạn muốn đăng ký\n3️⃣ Kiểm tra lịch học (tránh trùng lịch)\n4️⃣ Đảm bảo tổng tín chỉ ≤ 24\n5️⃣ Nhấn "Xác nhận đăng ký"\n\n📌 Lưu ý: Thời gian đăng ký: 25/03 - 10/04/2026\n\nBạn cần hỗ trợ thêm không?';
    }

    if (lowerMessage.includes('học phí') || lowerMessage.includes('tuition')) {
      return 'Thông tin học phí:\n\n💰 Tổng học phí học kỳ: 12.000.000 VNĐ\n✅ Đã thanh toán: 12.000.000 VNĐ\n📊 Còn lại: 0 VNĐ\n\n📅 Hạn thanh toán kỳ tới: 15/04/2026\n\nBạn có thể xem chi tiết tại mục "Học phí".';
    }

    if (lowerMessage.includes('giảng viên') || lowerMessage.includes('teacher')) {
      return 'Danh sách giảng viên:\n\n👨‍🏫 TS. Nguyễn Văn A - Lập trình Web\n   Email: nva@university.edu.vn\n\n👩‍🏫 PGS.TS. Trần Thị B - Cơ sở dữ liệu\n   Email: ttb@university.edu.vn\n\n👨‍🏫 ThS. Lê Văn C - Mạng máy tính\n   Email: lvc@university.edu.vn\n\nBạn có thể liên hệ qua email hoặc Office Hours.';
    }

    if (lowerMessage.includes('gpa') || lowerMessage.includes('điểm trung bình')) {
      return 'Thông tin GPA của bạn:\n\n🎓 GPA Học kỳ hiện tại: 3.42/4.0\n📚 GPA Tích lũy: 3.38/4.0\n⭐ Xếp loại: Giỏi\n📊 Tổng tín chỉ: 98/140\n\n🏆 Bạn đang có thành tích học tập xuất sắc!\n\nTiếp tục phát huy nhé!';
    }

    // Default response
    return 'Cảm ơn bạn đã hỏi! Tôi có thể giúp bạn về:\n\n✅ Lịch học và thời khóa biểu\n✅ Điểm số và GPA\n✅ Bài tập và deadline\n✅ Đăng ký tín chỉ\n✅ Học phí\n✅ Thông tin giảng viên\n\nHãy thử hỏi tôi về các chủ đề này nhé! 😊';
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputText),
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <StudentSidebar />
      
      <div className="flex-1 ml-64 flex flex-col">
        <StudentHeader title="Chatbot AI" />
        
        <div className="flex-1 flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
          {/* Chat Container */}
          <div className="flex-1 flex flex-col max-w-5xl w-full mx-auto bg-white shadow-xl rounded-t-2xl mt-6">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Bot className="w-7 h-7 text-blue-600" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">LearningHub AI Assistant</h2>
                  <p className="text-blue-100 text-sm flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Đang hoạt động
                  </p>
                </div>
                <div className="ml-auto">
                  <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={chatAreaRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50"
              style={{ maxHeight: 'calc(100vh - 300px)' }}
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 ${
                    message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'bot' 
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-500' 
                      : 'bg-gradient-to-br from-gray-600 to-gray-800'
                  }`}>
                    {message.sender === 'bot' ? (
                      <Bot className="w-5 h-5 text-white" />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'} max-w-2xl`}>
                    <div
                      className={`px-4 py-3 rounded-2xl shadow-sm ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-sm'
                          : 'bg-white text-gray-800 rounded-bl-sm border border-gray-200'
                      }`}
                    >
                      <p className="whitespace-pre-line leading-relaxed">{message.text}</p>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 px-1">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-end gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm border border-gray-200 shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && (
              <div className="px-6 py-3 bg-white border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">💡 Gợi ý câu hỏi:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors border border-blue-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    inputText.trim()
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  <Send className={`w-5 h-5 ${inputText.trim() ? 'text-white' : 'text-gray-500'}`} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Nhấn Enter để gửi • Shift + Enter để xuống dòng
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
