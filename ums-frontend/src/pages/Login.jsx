import AuthLayout from "../layouts/AuthLayout";
import { Link } from "react-router-dom";
import "./AuthForm.css";

function Login() {
  return (
    <AuthLayout>
      <div className="card">

        <h2 className="title">Đăng nhập</h2>
        <p className="subtitle">
          Chào mừng bạn trở lại với Learning Hub
        </p>

        {/* EMAIL */}
        <label>Tên đăng nhập / Email</label>
        <div className="input-group">
          <span className="icon">✉</span>
          <input placeholder="Nhập email hoặc tên đăng nhập" />
        </div>

        {/* PASSWORD */}
        <label>Mật khẩu</label>
        <div className="input-group">
          <span className="icon">🔒</span>
          <input type="password" placeholder="Nhập mật khẩu" />
          <span className="icon-right">👁</span>
        </div>

        {/* OPTIONS */}
        <div className="options">
          <label className="remember">
            <input type="checkbox" /> Ghi nhớ đăng nhập
          </label>
          <Link to="/forgot-password">Quên mật khẩu?</Link>
        </div>

        {/* BUTTON */}
        <button className="btn-primary">Đăng nhập</button>

        {/* REGISTER */}
        <p className="bottom">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>

        <p className="footer">
          © 2026 Learning Hub. All rights reserved.
        </p>

      </div>
    </AuthLayout>
  );
}

export default Login;