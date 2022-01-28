import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { Loader } from "../../loader/Loader";

interface ProtectedRouteProps {
  children: JSX.Element;
  loading: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  loading,
}) => {
  const state = useSelector((state: RootState) => state.principal);
  if (loading) {
    return <Loader />;
  } else {
    if (state.data && state.schoolData && state.user && state.userType) {
      return children;
    }
    return <Navigate to="/login" />;
  }
};
