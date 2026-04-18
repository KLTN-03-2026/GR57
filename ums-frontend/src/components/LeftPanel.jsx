import "./LeftPanel.css";

function LeftPanel() {
  return (
    <div className="left-panel">
      <div className="content">
        <h1>Learning Hub</h1>

        <h3>Nền tảng quản lý đào tạo thông minh tích hợp AI</h3>

        <p>
          LearningHub là hệ thống quản lý đào tạo hiện đại, tích hợp AI để hỗ trợ học viên theo dõi tiến độ học tập.
        </p>

        <div className="tags">
          <span>📘 Quản lý học tập</span>
          <span>🤖 Chatbot AI 24/7</span>
          <span>📊 Realtime</span>
        </div>

        <img src="https://images.unsplash.com/photo-1588072432836-e10032774350" />

        <div className="stats">
          <div><h2>1000+</h2><p>Học viên</p></div>
          <div><h2>50+</h2><p>Khóa học</p></div>
          <div><h2>98%</h2><p>Hài lòng</p></div>
        </div>
      </div>
    </div>
  );
}

export default LeftPanel;