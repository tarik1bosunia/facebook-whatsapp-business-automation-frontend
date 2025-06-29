'use client'

import AuthContainer from "./AuthContainer";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      {/* Hero Section */}
      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:flex-1 flex-col justify-center px-12 xl:px-16">
          <div className="max-w-lg">
            <h1 className="text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
              Welcome to
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Hero Access
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Your gateway to unlimited possibilities. Join thousands of users who trust our platform for secure and seamless access.
            </p>
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-slate-300">Secure & Encrypted</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-100"></div>
                <span className="text-slate-300">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="flex-1 lg:flex-none lg:w-[500px] xl:w-[600px] flex items-center justify-center px-6 sm:px-12 lg:px-16">
          <AuthContainer />
        </div>
      </div>
    </div>
  );
};
