import React from 'react';
import { useLocation } from 'react-router-dom';

const DownloadInvoice: React.FC = () => {
  const location = useLocation();
  const { userId, products } = location.state;

  const handleGeneratePDF = async () => {
    try {
      const response = await fetch('https://backend-17.onrender.com/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId, products })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'invoice.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        console.error('Error generating PDF invoice:', await response.text());
      }
    } catch (error) {
      console.error('Error generating PDF invoice:', error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 p-4 flex items-center justify-center">
      <button onClick={handleGeneratePDF} className="bg-green-500 text-white p-4 rounded">
        Download Invoice
      </button>
    </div>
  );
};

export default DownloadInvoice;
