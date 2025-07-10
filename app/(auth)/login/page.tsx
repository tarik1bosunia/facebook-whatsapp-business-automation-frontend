'use client';

import useLogin from "@/lib/hooks/use-login";
import { useAppSelector } from "@/lib/redux/hooks/reduxHooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const {
    email,
    password,
    isLoading,
    fieldErrors,
    onChange,
    onSubmit
  } = useLogin();

  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/profile');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg font-medium">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login to your account
        </h2>

        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 ${fieldErrors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-indigo-500"
                }`}
              placeholder="you@example.com"
            />
            {fieldErrors.email && (
              <div className="mt-1 space-y-1">
                {fieldErrors.email.map((error, index) => (
                  <p key={index} className="text-sm text-red-600 flex items-start">
                    <span className="mr-1">•</span>
                    <span>{error}</span>
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 ${fieldErrors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-indigo-500"
                }`}
              placeholder="••••••••"
            />
            {fieldErrors.password && (
              <div className="mt-1 space-y-1">
                {fieldErrors.password.map((error, index) => (
                  <p key={index} className="text-sm text-red-600 flex items-start">
                    <span className="mr-1">•</span>
                    <span>{error}</span>
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </>
              ) : 'Login'}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-indigo-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}