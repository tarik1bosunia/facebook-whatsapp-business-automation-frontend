'use client'

import useVerify from "@/lib/hooks/useVerify";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// import { ModalsSetup } from "@/components/utils";


export default function Setup(){
   const verify =  useVerify()

    return (
        <>
        <ToastContainer />

        {/* <ModalsSetup /> */}
        </>
    )
}