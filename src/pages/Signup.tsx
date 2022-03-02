import { SignupPrincipalView } from "../components/principal/SignupPrincipalView";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import React from "react";
interface SingUpProps {
  loading: boolean;
}
export const Signup: React.FC<SingUpProps> = ({ loading }) => {
  const principal = useSelector((state: RootState) => state.principal);
  const { userType } = useSelector((state: RootState) => state.userType)
  const schoolData = useSelector((state: RootState) => state.schoolData.schoolData)


  if (!loading) {
    return principal.user && principal.data && schoolData && userType ? (
      <Navigate to="/" />
    ) : (
      <div>{<SignupPrincipalView />}</div>
    );
  }
  return null;
};