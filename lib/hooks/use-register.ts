"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "react-toastify";
import { useAppDispatch } from "../redux/hooks/reduxHooks";
import { useRegisterUserMutation } from "../redux/features/auth/authApi";
import { setCredentials } from "../redux/slices/authSlice";
import { ErrorResponse } from "@/types/auth";

export default function useRegister() {
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterUserMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const { email, password, first_name, last_name } = formData;

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: [] })); // clear error
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    register({ email, password, first_name, last_name })
      .unwrap()
      .then((data) => {
        const { refresh, access } = data.token;
        dispatch(setCredentials({ refreshToken: refresh, accessToken: access }));
        toast.success("Please check your email to verify your account!");
      })
      .catch((error: any) => {
        if (error?.errors) {
          setErrors(error.errors);
        }
        toast.error(error?.message || "Registration failed!");
      });
  };

  const handleGoogleSignup = () => {
    console.log("Google signup clicked");
  };

  return {
    email,
    password,
    first_name,
    last_name,
    isLoading,
    errors,
    onChange,
    onSubmit,
    handleGoogleSignup,
  };
}
