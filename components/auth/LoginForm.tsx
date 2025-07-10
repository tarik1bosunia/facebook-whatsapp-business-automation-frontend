import React, { useState } from 'react';
import { loginStart, loginSuccess, loginFailure } from '@/lib/redux/slices/authSlice';
import { useAppDispatch } from '@/lib/redux/hooks/reduxHooks';
import { useLoginMutation } from '@/lib/redux/features/auth/authApi';

type ApiError = {
  message?: string;
  data?: {
    errors?: Record<string, string[] | string>;
  };
}


const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const response = await login({ email, password }).unwrap();
      dispatch(loginSuccess({
        access: response.token.access,
        refresh: response.token.refresh,
      }));
      // Redirect to dashboard or home page
    } catch (error: unknown) {
      const apiError = error as ApiError;
            // Convert error format to match what authSlice expects
      const formattedErrors: Record<string, string[]> = {};
      if (apiError.data?.errors) {
        for (const [key, value] of Object.entries(apiError.data.errors)) {
          formattedErrors[key] = Array.isArray(value) ? value : [value];
        }
      }
      dispatch(loginFailure({
        error: apiError.message || 'Login failed',
        fieldErrors: formattedErrors,
      }));
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
            Forgot your password?
          </a>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign in
        </button>
      </div>
    </form>
  );
};

export default LoginForm;