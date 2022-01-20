import { SignupPrincipalView } from "../components/principal/SignupPrincipalView";
import { useAuthStatus } from "../hooks/useAuthStatus";
import { Navigate } from "react-router-dom";

export const Signup = () => {
  const { isLogged, loading } = useAuthStatus();

  if (!loading) {
    return isLogged ? (
      <Navigate to="/" />
    ) : (
      <div>{<SignupPrincipalView />}</div>
    );
  }
  return null;
};
