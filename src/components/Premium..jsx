// PremiumPage.jsx
import React from 'react';

export default function PremiumPage() {
  return (
    <div className="bg-[#f6f8fc] min-h-screen py-12 px-6 md:px-24 flex flex-col md:flex-row justify-between items-center gap-10">
      {/* Left Content */}
      <div className="max-w-xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">MoodMigo Premium</h1>
        <p className="text-gray-600 text-lg mb-6">
          Unlock the full potential of your mental health journey with MoodMigo Premium.
          Get unlimited access to our Journal, Manas Chatbot, and Community features.
        </p>
        <ul className="text-gray-800 space-y-4 mb-6">
          {[
            'Unlimited access to Journal feature',
            '3 hours of daily Manas chatbot interaction',
            'Full community access and participation',
            'Priority access to counseling sessions',
          ].map((item, i) => (
            <li key={i} className="flex items-center">
              <span className="bg-green-100 text-green-600 p-1 rounded-full mr-3">✔️</span>
              {item}
            </li>
          ))}
        </ul>
        <button className="bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-purple-700">
          Upgrade to Premium
        </button>
      </div>

      {/* Right Card */}
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-bl-full" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">MoodMigo Premium</h2>
        <p className="text-3xl font-bold text-gray-900 mb-1">$9.99 <span className="text-base text-gray-500 font-medium">/month</span></p>
        <ul className="text-gray-800 space-y-3 mt-4 mb-6">
          {[
            'All Premium Features',
            'Cancel Anytime',
            '7-Day Free Trial',
          ].map((item, i) => (
            <li key={i} className="flex items-center">
              <span className="text-purple-500 mr-3">✔️</span>
              {item}
            </li>
          ))}
        </ul>
        <button className="bg-purple-500 text-white font-semibold w-full py-3 rounded-lg hover:bg-purple-600">
          Start Free Trial
        </button>
      </div>
    </div>
  );
}
