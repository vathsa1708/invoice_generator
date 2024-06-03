import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import './index.css';
import AddProduct from './pages/AddProduct.tsx';
import DownloadInvoice from './DownloadInvoice.tsx';
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<Register />} />
        <Route path="/add-product" element={<AddProduct/>} />
        <Route path="/download" element={<DownloadInvoice />} />
      </Routes>
    </Router>
  );
};

export default App;
