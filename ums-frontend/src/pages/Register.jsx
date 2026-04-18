import AuthLayout from "../layouts/AuthLayout";
import { Link } from "react-router-dom";
import "./AuthForm.css";

function Register() {
  return (
    <AuthLayout>
      <div className="card">
        <h2>Đăng ký</h2>

        <input placeholder="Email" />
        <input placeholder="Username" />
        <input type="password" placeholder="Mật khẩu" />

        <button>Đăng ký</button>

        <p className="bottom">
          Đã có tài khoản? <Link to="/">Đăng nhập</Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default Register;