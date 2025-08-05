"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { setCredentials } from "@/lib/redux/features/authSlice";
import { useAppDispatch } from "../redux/hooks/reduxHooks";
import { useLoginMutation } from "../redux/features/auth/authApi";

import { socketManager } from "@/lib/websocket/websocketManager";
import { isErrorResponse, FieldErrorMap } from "@/types/apiResponse";
import { LoginResponse } from "@/types/auth";

export default function useLogin() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrorMap>({});

  const { email, password } = formData;

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear field error when user types
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFieldErrors({}); // Clear previous errors

    try {
      const result = await login({ email, password }).unwrap();
      
      // Successful login
      const { access, refresh } = (result as LoginResponse).token;
      dispatch(setCredentials({ refreshToken: refresh, accessToken: access }));
      socketManager.connect();
      toast.success("Login successful!");
      router.push("/profile");
    } catch (error) {
      if (isErrorResponse(error)) {
        // Handle field errors
        const newFieldErrors: FieldErrorMap = {};
        
        Object.entries(error.errors).forEach(([field, errors]) => {
          if (field !== 'non_field_errors' && field !== 'detail') {
            // Convert error to array format if it isn't already
            newFieldErrors[field] = Array.isArray(errors) 
              ? errors.map(String) 
              : [String(errors)];
          }
        });

        if (Object.keys(newFieldErrors).length > 0) {
          setFieldErrors(newFieldErrors);
        }

        // Show non-field errors
        const message = 
          error.errors.non_field_errors?.[0] ||
          error.errors.detail?.[0] ||
          "Invalid credentials";
        
        if (message) {
          toast.error(String(message));
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return {
    email,
    password,
    isLoading,
    fieldErrors,
    onChange,
    onSubmit,
  };
}