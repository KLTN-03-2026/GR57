import AuthLayout from "../layouts/AuthLayout";
import { Link } from "react-router-dom";
import "./AuthForm.css";

function ForgotPassword() {
  return (
    <AuthLayout>
      <div className="card">

        <div className="forgot-icon">
          ✉
        </div>

        <h2 className="title">Quên mật khẩu</h2>
        <p className="subtitle">
          Nhập email để nhận liên kết đặt lại mật khẩu
        </p>

        <label>Địa chỉ Email</label>
        <div className="input-group">
          <span className="icon">✉</span>
          <input placeholder="example@learninghub.com" />
        </div>

        <button className="btn-primary">
          Gửi yêu cầu
        </button>

        <p className="back-link">
          <Link to="/">← Quay lại đăng nhập</Link>
        </p>

        <div className="divider"></div>

        <p className="note">
          Bạn sẽ nhận được email hướng dẫn đặt lại mật khẩu trong vòng 5 phút.
          Nếu không nhận được, vui lòng liên hệ hỗ trợ.
        </p>

      </div>
    </AuthLayout>
  );
}

export default ForgotPassword;