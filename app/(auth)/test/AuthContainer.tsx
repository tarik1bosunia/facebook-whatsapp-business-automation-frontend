import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthContainer = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-slate-400">
          {isLogin 
            ? "Sign in to access your account" 
            : "Join us and start your journey"
          }
        </p>
      </div>

      {/* Toggle Buttons */}
      <div className="flex bg-slate-800/50 backdrop-blur-sm rounded-xl p-1 mb-8 border border-slate-700/50">
        <button
          onClick={() => setIsLogin(true)}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
            isLogin
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
            !isLogin
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Form Container */}
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
        <div className="transition-all duration-500 ease-in-out">
          {isLogin ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-6">
        <p className="text-slate-400 text-sm">
          Protected by industry-standard encryption
        </p>
      </div>
    </div>
  );
};

export default AuthContainer