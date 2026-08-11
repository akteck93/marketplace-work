"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { CreditCard, DollarSign, Clock, CheckCircle2, Download, Plus } from "lucide-react";

export default function ClientPaymentsPage() {
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock Transactions Data
  const [transactions, setTransactions] = useState([
    { id: "TXN-001", date: "2026-08-01", amount: 1200, status: "COMPLETED", desc: "Fund Escrow: Build Empire Project" },
    { id: "TXN-002", date: "2026-07-28", amount: 450, status: "COMPLETED", desc: "Milestone 1 Payment Release" },
    { id: "TXN-003", date: "2026-07-15", amount: 50, status: "FAILED", desc: "Wallet Recharge" },
  ]);

  const handlePayment = async () => {
    if (!isRazorpayLoaded) {
      alert("Razorpay SDK is not loaded yet!");
      return;
    }

    setIsProcessing(true);

    const options = {
      key: "rzp_test_YourTestKey", // Replace with real key in production
      amount: "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "Workiffy 3D",
      description: "Escrow Deposit / Wallet Recharge",
      image: "https://marketplace-work-rose.vercel.app/favicon.ico",
      handler: function (response) {
        alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
        
        // Add mock transaction
        setTransactions([
          {
            id: `TXN-${Math.floor(Math.random() * 10000)}`,
            date: new Date().toISOString().split('T')[0],
            amount: 500, // equivalent $500 roughly
            status: "COMPLETED",
            desc: "Wallet Recharge (via Razorpay)"
          },
          ...transactions
        ]);
        setIsProcessing(false);
      },
      prefill: {
        name: "Alok Singh",
        email: "alok@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Workiffy Corporate Office",
      },
      theme: {
        color: "#2d5bff",
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
          alert("Payment Cancelled");
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js" 
        onLoad={() => setIsRazorpayLoaded(true)} 
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            Payments & Escrow 💳
          </h2>
          <p className="text-sm text-slate-500 mt-1">Manage your funds, invoices, and billing history.</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Spent</p>
            <p className="text-3xl font-black text-slate-800">$1,650.00</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">In Escrow</p>
            <p className="text-3xl font-black text-amber-500">$2,329.00</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#2d5bff] to-[#1a47e6] rounded-2xl p-6 shadow-md flex flex-col justify-between text-white">
          <div>
            <p className="text-xs font-bold text-white/80 uppercase tracking-wider mb-1">Wallet Balance</p>
            <p className="text-3xl font-black">$0.00</p>
          </div>
          <button 
            onClick={handlePayment}
            disabled={isProcessing}
            className="mt-4 w-full py-2.5 bg-white text-[#2d5bff] hover:bg-slate-50 font-bold text-sm rounded-lg shadow-sm flex items-center justify-center gap-2 transition disabled:opacity-70"
          >
            {isProcessing ? "Processing..." : (
              <>
                <Plus className="w-4 h-4" /> Add Funds with Razorpay
              </>
            )}
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          Transaction History
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400">
                <th className="pb-3 font-medium">Transaction ID</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100">
              {transactions.map((txn, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition">
                  <td className="py-4 pr-4 font-mono text-slate-500">{txn.id}</td>
                  <td className="py-4 pr-4 text-slate-600">{txn.date}</td>
                  <td className="py-4 pr-4 font-medium text-slate-800">{txn.desc}</td>
                  <td className="py-4 pr-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase flex items-center w-fit gap-1 ${
                      txn.status === 'COMPLETED' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {txn.status === 'COMPLETED' ? <CheckCircle2 className="w-3 h-3" /> : null}
                      {txn.status}
                    </span>
                  </td>
                  <td className="py-4 pr-4 font-black text-slate-900">${txn.amount.toFixed(2)}</td>
                  <td className="py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-[#2d5bff] hover:bg-blue-50 rounded-lg transition inline-flex">
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
