import { Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Login } from "../../pages/Login";
interface ProtectedRouteProps {
  element: JSX.Element;
  path: string;
}
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  path,
}) => {
  const userData = useSelector((state: RootState) => state.user);

  return (
    <Route
      path={path}
      element={userData.user && userData.data ? element : <Login />}
    />
  );
};
