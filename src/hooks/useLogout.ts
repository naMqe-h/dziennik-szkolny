import { AuthError, signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { auth } from "../firebase/firebase.config";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/userSlice";

export const useLogout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logoutUser = () => {
    signOut(auth)
      .then(() => {
        dispatch(logout());
        toast.success("Udało ci się wylogować");
        navigate("/login");
      })
      .catch((error: AuthError) => {
        toast.error(`${error.message}`);
      });
  };

  return { logoutUser };
};
