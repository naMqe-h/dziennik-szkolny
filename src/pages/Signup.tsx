import { SignupPrincipalView } from "../components/principal/SignupPrincipalView";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
interface SingUpProps {
  loading: boolean;
}
export const Signup: React.FC<SingUpProps> = ({ loading }) => {
  const state = useSelector((state: RootState) => state.user);
  console.log(loading, state.user);
  if (!loading) {
    return state.user && state.data && state.schoolData && state.userType ? (
      <Navigate to="/" />
    ) : (
      <div>{<SignupPrincipalView />}</div>
    );
  }
  return null;
};