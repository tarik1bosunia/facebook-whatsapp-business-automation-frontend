"use client"
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";

import { setCredentials } from "@/lib/redux/slices/authSlice";
import { useAppDispatch } from "@/lib/redux/hooks/reduxHooks";
// import useModal from "./use-modal";
import { useLoginMutation } from "../redux/features/auth/authApi";


export default function useLogin(){
    // const {close: closeLoginModal} = useModal('loginModal')
    const router = useRouter()
    const dispatch = useAppDispatch()

    const [login, {isLoading}] = useLoginMutation()

    const [formData, setformData] = useState({
        email: '' ,
        password: '',
    })

    const {email, password} = formData

    const onChange = (event:ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target; 
        setformData({...formData, [name]: value})
    }
    

    const onSubmit = (event:FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        login({email, password})
        .unwrap()
        .then((data) => {
        //    closeLoginModal();

           const {refresh, access}  = data.token
    
           dispatch(setCredentials({refreshToken: refresh, accessToken: access}))
           toast.success("Login Successfull!")
           router.push('/profile')
        })
        .catch(() => {
            toast.error("Login Failed!")
        })

    }

    return {
        email,
        password,
        isLoading,
        onChange,
        onSubmit,
    }
}