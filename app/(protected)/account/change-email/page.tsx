'use client'
import React, { useState } from 'react';
import { ArrowLeft, Mail, Send, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Link from 'next/link';

const ChangeEmail = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Enter new email, 2: Verify email
  
  const form = useForm({
    defaultValues: {
      currentEmail: 'john.doe@example.com',
      newEmail: '',
      password: '',
      verificationCode: '',
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    
    if (step === 1) {
      // Simulate sending verification email
      setTimeout(() => {
        setLoading(false);
        setStep(2);
        toast.success('Verification code sent to your new email address');
      }, 1500);
    } else {
      // Simulate email verification
      setTimeout(() => {
        setLoading(false);
        toast.success('Email address updated successfully');
        setStep(1);
        form.reset();
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/account">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Change Email</h1>
            <p className="text-muted-foreground">Update your email address</p>
          </div>
        </div>

        {/* Current Email Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Current Email Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium">{form.watch('currentEmail')}</p>
              <p className="text-sm text-muted-foreground">This is your current verified email address</p>
            </div>
          </CardContent>
        </Card>

        {/* Change Email Form */}
        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 ? 'Enter New Email Address' : 'Verify New Email Address'}
            </CardTitle>
            <CardDescription>
              {step === 1 
                ? 'Enter your new email address and confirm your password'
                : 'Enter the verification code sent to your new email address'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {step === 1 ? (
                  <>
                    <FormField
                      control={form.control}
                      name="newEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Email Address</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Enter your new email address" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Enter your current password" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                ) : (
                  <>
                    <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-orange-800">
                          Verification Required
                        </p>
                        <p className="text-sm text-orange-700">
                          We've sent a verification code to <strong>{form.watch('newEmail')}</strong>. 
                          Please check your inbox and enter the code below.
                        </p>
                      </div>
                    </div>
                    <FormField
                      control={form.control}
                      name="verificationCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Verification Code</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter 6-digit verification code" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={loading} className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    {loading 
                      ? (step === 1 ? 'Sending...' : 'Verifying...') 
                      : (step === 1 ? 'Send Verification Code' : 'Verify & Update Email')
                    }
                  </Button>
                  {step === 2 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                  )}
                  <Link href="/account">
                    <Button variant="outline">Cancel</Button>
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChangeEmail;