import express from 'express';
import puppeteer from 'puppeteer';
import User, { IUser } from '../models/User';
import { IProduct } from '../models/Product';

const router = express.Router();

// Route to generate PDF invoice
router.post('/generate-pdf', async (req, res) => {
  try {
    const { userId, products } = req.body;

    const user = await User.findById(userId) as IUser;
    if (!user) {
      return res.status(404).send('User not found');
    }

    const totalAmount = products.reduce((total: number, product: IProduct) => total + product.quantity * product.rate, 0);
    const grandTotal = totalAmount * 1.18;

    const invoiceHtml = `
      <html>
        <head>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body class="p-8 bg-gray-100">
          <div class="max-w-3xl mx-auto bg-white p-6 rounded shadow-md">
            <h1 class="text-3xl font-bold mb-4 text-center">Invoice</h1>
            <div class="mb-6">
              <p class="text-xl font-semibold">Customer: ${user.name}</p>
              <p class="text-lg">Email: ${user.email}</p>
            </div>
            <table class="table-auto w-full mb-6">
              <thead>
                <tr>
                  <th class="px-4 py-2 border">Product</th>
                  <th class="px-4 py-2 border">Quantity</th>
                  <th class="px-4 py-2 border">Rate</th>
                  <th class="px-4 py-2 border">Total</th>
                </tr>
              </thead>
              <tbody>
                ${products.map((product: IProduct) => `
                  <tr>
                    <td class="border px-4 py-2 text-center">${product.name}</td>
                    <td class="border px-4 py-2 text-center">${product.quantity}</td>
                    <td class="border px-4 py-2 text-center">${product.rate}</td>
                    <td class="border px-4 py-2 text-center">${(product.quantity * product.rate).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="text-center">
              <p class="text-lg font-semibold">Total: $${totalAmount.toFixed(2)}</p>
              <p class="text-lg font-semibold">Grand Total (with 18% GST): $${grandTotal.toFixed(2)}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    await page.setContent(invoiceHtml, { waitUntil: 'networkidle0', timeout: 60000 }); // 60 seconds
    const pdfBuffer = await page.pdf({ format: 'A4', timeout: 60000 }); // 60 seconds

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=invoice.pdf'
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
});

export default router;
