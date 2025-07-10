'use client'
import { useEffect } from "react";

import { useAppDispatch } from "../redux/hooks/reduxHooks";
import { finishedInitialLoad } from "../redux/slices/authSlice";
import { useVerifyTokenMutation } from "../redux/features/auth/authApi";



export default function useVerify(){
    const dispatch = useAppDispatch()
    const [verify] = useVerifyTokenMutation()

    useEffect(() => {
        verify(undefined)
        .then(() => {
            // console.log(response.data)
            // if (response?.data?.access && response?.data?.refresh) {
            //     // Dispatch setAuth with access and refresh tokens
            //     dispatch(setAuth({
            //         access: response.data.access,
            //         refresh: response.data.refresh,
            //     }));
            // }
            
        })
        .catch(() => {

        }).finally(() => {
            dispatch(finishedInitialLoad())
        })
    },[dispatch, verify])

}

