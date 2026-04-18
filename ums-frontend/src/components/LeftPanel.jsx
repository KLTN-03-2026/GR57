function LeftPanel() {
  return (
    <div style={styles.left}>
      <div style={{ maxWidth: "500px" }}>
        <h1>Learning Hub</h1>
        <h3>Nền tảng quản lý đào tạo thông minh tích hợp AI</h3>
        <p>
          LearningHub là hệ thống quản lý đào tạo hiện đại, tích hợp AI để hỗ trợ học viên.
        </p>
      </div>
    </div>
  );
}

export default LeftPanel;

const styles = {
  left: {
    flex: 1,
    background: "linear-gradient(135deg,#1447E6,#3B82F6)",
    color: "white",
    padding: "40px",
    display: "flex",
    alignItems: "center"
  }
};