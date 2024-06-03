import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../index.css';

interface Product {
  name: string;
  quantity: string;
  rate: string;
}

const AddProduct: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId; // Get userId from state
  const [products, setProducts] = useState<Product[]>([{ name: '', quantity: '', rate: '' }]);

  const handleAddProduct = () => {
    setProducts([...products, { name: '', quantity: '', rate: '' }]);
  };

  const handleChange = (index: number, field: keyof Product, value: string) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };

  const calculateTotal = () => {
    return products.reduce((total, product) => {
      const productQty = parseFloat(product.quantity) || 0;
      const productRate = parseFloat(product.rate) || 0;
      return total + productQty * productRate;
    }, 0);
  };

  const calculateGrandTotal = () => {
    const total = calculateTotal();
    return total + total * 0.18; // Adding 18% GST
  };

  const handleSaveProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId, products })
      });

      if (response.ok) {
        console.log('Products saved successfully');
        navigate('/download', { state: { userId, products } });
      } else {
        console.error('Error saving products:', await response.text());
      }
    } catch (error) {
      console.error('Error saving products:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSaveProducts();
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-screen-lg mx-auto">
        <h1 className="text-3xl mb-4 text-center">INVOICE GENERATOR</h1>
        <table className="w-full mb-4 table-fixed">
          <thead>
            <tr>
              <th className="border-b-2 p-2 text-center">Product</th>
              <th className="border-b-2 p-2 text-center">Qty</th>
              <th className="border-b-2 p-2 text-center">Rate</th>
              <th className="border-b-2 p-2 text-center">Total</th>
              <th className="border-b-2 p-2 text-center">+</th>
            </tr>
          </thead>
          <tbody className='border-b-2 mb-4'>
            {products.map((product, index) => (
              <tr key={index}>
                <td className="p-2 text-center">
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                    required
                    className="w-full text-center"
                  />
                </td>
                <td className="p-2 text-center">
                  <input
                    type="text"
                    value={product.quantity}
                    onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                    required
                    className="w-full text-center"
                  />
                </td>
                <td className="p-2 text-center">
                  <input
                    type="text"
                    value={product.rate}
                    onChange={(e) => handleChange(index, 'rate', e.target.value)}
                    required
                    className="w-full text-center"
                  />
                </td>
                <td className="p-2 text-center">
                  {(parseFloat(product.quantity) || 0) * (parseFloat(product.rate) || 0)}
                </td>
                <td className="p-2 text-center ">
                  {index === products.length - 1 && (
                    <button type="button" onClick={handleAddProduct} className="text-xl font-bold">+</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-10 ">
          <p className="font-semibold text-center">Total: ${calculateTotal().toFixed(2)}</p>
          <p className="font-semibold text-center">Grand Total (with 18% GST): ${calculateGrandTotal().toFixed(2)}</p>
        </div>
        <button type="submit" className="bg-green-500 text-white mt-4 p-2 w-full">Next</button>
      </form>
    </div>
  );
};

export default AddProduct;
