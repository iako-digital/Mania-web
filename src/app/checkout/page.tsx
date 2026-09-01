'use client';

import { useState } from "react";

export default function CheckoutPage() {
  const [referenceCode] = useState(() => `MANIA-${Math.floor(1000 + Math.random() * 9000)}`);
  const [formData, setFormData] = useState({ name: "", transactionCode: "" });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Submit the form data to the backend
    await fetch("/api/payments/manual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, referenceCode }),
    });
    alert("Payment confirmation submitted!");
  };

  return (
    <div className="checkout-page">
      <h1>Bank Transfer Payment</h1>
      <p>For support, contact us at <strong>info@mania.com.ge</strong>.</p>
      <p>Recipient: <strong>მანია ვაშაკიძე</strong></p>
      <p>
        BOG IBAN: <strong>GE98BG0000000612692174</strong>{" "}
        <button onClick={() => handleCopy("GE98BG0000000612692174")}>Copy</button>
      </p>
      <p>
        TBC IBAN: <strong>GE06TB7003045064300073</strong>{" "}
        <button onClick={() => handleCopy("GE06TB7003045064300073")}>Copy</button>
      </p>
      <p>Payment Reference Code: <strong>{referenceCode}</strong></p>
      <form onSubmit={handleSubmit}>
        <label>
          Your Name:
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </label>
        <label>
          Transaction Code:
          <input
            type="text"
            value={formData.transactionCode}
            onChange={(e) => setFormData({ ...formData, transactionCode: e.target.value })}
            required
          />
        </label>
        <button type="submit">Submit Confirmation</button>
      </form>
    </div>
  );
}
