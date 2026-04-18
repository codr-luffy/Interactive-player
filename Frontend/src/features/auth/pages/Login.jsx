import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import FormGroup from "../components/FormGroup.jsx";
import "../style/login.scss";

const Login = () => {
  const { loading, handleLogin } = useAuth();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    await handleLogin({ email, password });
    navigate("/");
  }

  return (
    <main className="login-page">
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <FormGroup
            lable="Email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormGroup
            lable="Password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="button" type="submit">
            Login
          </button>
        </form>
        <p>
          Don't have an Account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
