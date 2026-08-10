import { useState } from "react";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";

const Auth = () => {
  const [register, setRegister] = useState(true);

  return (
    <div>
      <h1>Welcome to UCMS registration!</h1>
      <button onClick={() => setRegister(!register)}>
        {register ? "Go to Login" : "Go to Register"}
      </button>
      {register && <Register />}
      {!register && <Login />}
    </div>
  );
};

export default Auth;
