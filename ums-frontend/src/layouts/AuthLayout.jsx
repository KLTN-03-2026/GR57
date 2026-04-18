import LeftPanel from "../components/LeftPanel";
import "./AuthLayout.css";

function AuthLayout({ children }) {
  return (
    <div className="auth-container">
      <LeftPanel />
      <div className="auth-right">
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;