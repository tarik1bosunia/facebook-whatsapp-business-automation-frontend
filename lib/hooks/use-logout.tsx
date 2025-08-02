import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../redux/hooks/reduxHooks";
import { logoutAndReset } from "../redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "../redux/features/auth/authApi";

export default function useLogout() {
    const dispatch = useAppDispatch();
    const [logoutBackend, { isLoading }] = useLogoutMutation()
    const router = useRouter()

    const refreshToken = useAppSelector(state => state.auth.refreshToken)



    const handleLogout = async () => {

        if (!refreshToken) {
            toast.error("No refresh token found");
            return;
        }
        try {
            // Optional: refresh token blaklisted.. can not be used in future
            await logoutBackend({ refresh: refreshToken }).unwrap();
        } catch (error) {
            console.log("error", error)
        }
        dispatch(logoutAndReset());
        
        toast.success("Logout successful!");
        router.push("/login");


    }
    return { handleLogout, isLoading }
}