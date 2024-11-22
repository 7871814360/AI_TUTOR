import React, { useState, useRef } from 'react';
import '../CSS/login.css';
import App from './home.js';

function Login() {
  const [otpSent, setOtpSent] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);
  const emailRef = useRef();
  const otpRef = useRef();
  const [email, setEmail] = useState(null);
  const handleClick = () => {
    //set timeout for 5 sec
    setTimeout(() => {
    setEmail("amarakannanr@gmail.com");
    setIsLoggedIn(true);
    }, 1000);
  }
  const handleClick1 = () => {
    //set timeout for 5 sec
    setTimeout(() => {
    setEmail("kpnnaveen0205@gmail.com");
    setIsLoggedIn(true);
    }, 1000);
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError(null);
     const email = emailRef.current.value;
     setEmail(email);

    try {
      const response = await fetch('http://localhost:4000/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailInput: email }),
      });
      const data = await response.json();
      if (data.success) {
        setOtpSent(true);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const otp = otpRef.current.value;

    try {
      const response = await fetch('http://localhost:4000/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otpInput: otp }),
      });
      const data = await response.json();
      if (data.result === 0) {
        setIsLoggedIn(true);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  if (isLoggedIn) {
    //return (<div>Welcome! You are logged in.</div>);
    return <App email= {email}/>;
  }

  return (
    <>
      <header className="header">
        <nav className="nav">
          <a href="#" className="nav_logo">AI TUTOR FOR CHILD</a>
          <ul className="nav_items">
            <li className="nav_item">
              <a href="#" className="nav_link">Home</a>
              <a href="#" className="nav_link" onClick={handleClick}>Class</a>
              <a href="#" className="nav_link" onClick={handleClick1}>Services</a>
              <a href="#" className="nav_link">Contact</a>
            </li>
          </ul>
          <button className="button-log" id="form-open">Login</button>
        </nav>
      </header>

      <section className="home">
        <div className="form_container">
          <i className="uil uil-times form_close">x</i>

          <div className="form login_form">
            <h2>Login</h2>
            {!otpSent ? (
              <form onSubmit={handleEmailSubmit}>
                <div className="input_box">
                  <input type="email" ref={emailRef} placeholder="Enter your email" required />
                  <i className="uil uil-envelope-alt email"></i>
                </div>
                <button type="submit" className="button" id="runButton">Generate OTP</button>
                {error && <div className="error">{error}</div>}
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit}>
                <div className="input_box">
                  <input type="text" ref={otpRef} placeholder="Enter OTP..." required />
                  <i className="uil uil-lock password"></i>
                </div>
                <button type="submit" className="button" id="verifyButton">Log In</button>
                {error && <div className="error">{error}</div>}
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;