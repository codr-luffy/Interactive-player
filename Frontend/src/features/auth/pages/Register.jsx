import { useState } from "react";
import "../style/register.scss";
import FormGroup from "../components/FormGroup";
import { useAuth } from "../hooks/useAuth.js";
import { Link, useNavigate } from "react-router";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { loading, handleRegister } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    await handleRegister({ username, email, password });
    navigate("/");
  }
  return (
    <main className="register-page">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h1>Register</h1>
          <FormGroup
            lable="Username"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
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
            Register
          </button>
        </form>
        <p>
          Already have an account?
          <Link to="/login">Login here</Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
