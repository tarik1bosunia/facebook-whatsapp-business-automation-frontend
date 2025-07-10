'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import Link from "next/link";
import useLogin from "@/lib/hooks/use-login";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks/reduxHooks";

const Login = () => {
    const {
        email,
        password,
        isLoading,
        fieldErrors,
        onChange,
        onSubmit
    } = useLogin();

    const [showPassword, setShowPassword] = useState(false);

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-300/10 to-blue-400/10 rounded-full blur-3xl"></div>
            </div>

            <Card className="w-full max-w-md shadow-2xl backdrop-blur-sm bg-white/95 border-0 relative z-10 animate-fade-in">
                <CardHeader className="space-y-1 text-center pb-6">
                    <CardTitle className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                        Welcome back
                    </CardTitle>
                    <CardDescription className="text-base text-muted-foreground mt-2">
                        Sign in to your account to continue
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 pt-2">
                    <GoogleLoginButton />

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <Separator className="w-full" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-4 text-muted-foreground font-medium">Or continue with email</span>
                        </div>
                    </div>

                    {fieldErrors.non_field_errors && (
                        <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                            <AlertCircle className="h-4 w-4" />
                            <span>{fieldErrors.non_field_errors[0]}</span>
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                                Email address
                            </Label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={onChange}
                                    className={`pl-10 h-12 border-2 transition-all duration-200 bg-white/80 ${fieldErrors.email
                                            ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                                            : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                        }`}
                                    disabled={isLoading}
                                />
                            </div>
                            {fieldErrors.email && (
                                <div className="space-y-1 mt-1">
                                    {fieldErrors.email.map((error, index) => (
                                        <p key={index} className="text-sm text-destructive flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {error}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                                    Password
                                </Label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
                                <Input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={onChange}
                                    className={`pl-10 pr-12 h-12 border-2 transition-all duration-200 bg-white/80 ${fieldErrors.password
                                            ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                                            : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                        }`}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground hover:text-slate-700 transition-colors disabled:opacity-50"
                                    disabled={isLoading}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {fieldErrors.password && (
                                <div className="space-y-1 mt-1">
                                    {fieldErrors.password.map((error, index) => (
                                        <p key={index} className="text-sm text-destructive flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {error}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Signing you in...
                                </>
                            ) : (
                                "Sign in to your account"
                            )}
                        </Button>
                    </form>

                    <div className="text-center pt-6 border-t border-slate-100">
                        <p className="text-sm text-slate-600">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/register"
                                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                            >
                                Create one now
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;

