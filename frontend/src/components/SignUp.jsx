import React, { useState } from 'react';
import axios from 'axios';

function Signup({ onSignupSuccess, goToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/signup', {
        email,
        password
      });
      onSignupSuccess();
    } catch (err) {
      setError('Signup failed. Email may already be registered.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <form onSubmit={handleSignup} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
            Sign Up
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <button onClick={goToLogin} className="text-blue-500 hover:underline">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
