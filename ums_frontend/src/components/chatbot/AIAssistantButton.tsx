import { MessageCircle } from 'lucide-react';
import { useState } from 'react';
import svgPaths from '../../imports/svg-0z84kior3o';

export function LearningSupportButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating support button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)] hover:scale-110 transition-all duration-300 border-2 border-white opacity-[0.83]"
        style={{ backgroundImage: "linear-gradient(135deg, rgb(43, 127, 255) 0%, rgb(21, 93, 252) 50%, rgb(152, 16, 250) 100%)" }}
        aria-label="Trợ lý học tập"
      >
        {/* Support icon */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <g>
              <path d="M16 10.6667V5.33333H10.6667" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
              <path d={svgPaths.pbea9f00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
              <path d="M2.66667 18.6667H5.33333" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
              <path d="M26.6667 18.6667H29.3333" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
              <path d="M20 17.3333V20" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
              <path d="M12 17.3333V20" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
            </g>
          </svg>
        </div>

        {/* Online Indicator */}
        <div className="absolute -top-1 right-0 bg-[#00c950] border-2 border-white rounded-full w-4 h-4" />

        {/* Pulse effect */}
        {!isOpen && <span className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-20" />}
      </button>

      {/* Support chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-8 z-50 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">Trợ lý học tập</h3>
                <p className="text-xs text-white/80">Hỗ trợ 24/7</p>
              </div>
            </div>
          </div>

          {/* Chat Content */}
          <div className="h-96 bg-gray-50 p-4 overflow-y-auto">
            {/* Welcome Message */}
            <div className="mb-4">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 mb-2">
                      Xin chào! Tôi là trợ lý học tập của LearningHub. Tôi có thể giúp bạn:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Tìm kiếm thông tin khóa học</li>
                      <li>• Kiểm tra lịch học</li>
                      <li>• Hướng dẫn sử dụng hệ thống</li>
                      <li>• Trả lời các câu hỏi thường gặp</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 mb-3">Câu hỏi gợi ý:</p>
              <button className="w-full text-left bg-white hover:bg-blue-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 transition-colors">
                📅 Lịch học của tôi hôm nay là gì?
              </button>
              <button className="w-full text-left bg-white hover:bg-blue-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 transition-colors">
                📊 Tiến độ học tập của tôi như thế nào?
              </button>
              <button className="w-full text-left bg-white hover:bg-blue-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 transition-colors">
                💰 Kiểm tra học phí
              </button>
              <button className="w-full text-left bg-white hover:bg-blue-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 transition-colors">
                📚 Tìm tài liệu học tập
              </button>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập câu hỏi của bạn..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all">
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export const AIAssistantButton = LearningSupportButton;