import { useEffect, useState } from "react";
import "../styles/SignIn.css";
import { logInUser, getErrorMessage, getUserInfo } from "../reducers/userSlice";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [formaData, setFormData] = useState([]);
  const dispatch = useDispatch();
  const userInfo = useSelector(getUserInfo);
  const errorMessage = useSelector(getErrorMessage);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(logInUser(formaData));
  };

  const handleChange = (e) => {
    setFormData({ ...formaData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (userInfo) {
      navigate("/chart");
    }
  }, [navigate, userInfo]);

  return (
    <div className="signin-container">
      <h2>Login In</h2>
      <div className="signin-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            placeholder="Name"
            name="userName"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            name="userEmail"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            placeholder="password"
            name="password"
            onChange={handleChange}
            required
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button onClick={handleSubmit} className="signin-button">
          Sign In
        </button>
        <p>
          Don&apos;t have an account? <Link to="/"> Sign In </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
