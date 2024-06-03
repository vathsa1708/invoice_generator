import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/authSlice';
import { AppDispatch } from '../store';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    dispatch(loginUser({ email, password }));

    try {
      const response = await axios.post('https://backend-7-di1k.onrender.com/api/login', { email, password });
      const { token } = response.data;

      // Save the token and userId in localStorage or state
      localStorage.setItem('token', token);

      // Redirect to Add Product page upon successful login
      navigate('/add-product', { state: { userId: response.data.userId } });
    } catch (err) {
      console.error('Error logging in:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl mb-4">Login</h1>
        <div>
          <label htmlFor="email" className="block mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border p-2 w-full"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="password" className="block mb-2">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border p-2 w-full"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white mt-4 p-2 w-full">Login</button>
      </form>
    </div>
  );
};

export default Login;
