import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { Loader } from "../../loader/Loader";

interface ProtectedRouteProps {
  children: JSX.Element;
  loading: boolean;
}

export const StudentRoute: React.FC<ProtectedRouteProps> = ({ children, loading }) => {
  const principal = useSelector((state: RootState) => state.principal);
  const student = useSelector((state: RootState) => state.student)
  const teacher = useSelector((state: RootState) => state.teacher)
  const schoolData = useSelector((state: RootState) => state.schoolData.schoolData)
  const userType = useSelector((state: RootState) => state.userType.userType)

  if (loading) {
    return <Loader />;
  } else {
    if ((principal.user && principal.data && schoolData && userType) || (student.user && student.data && userType) || (teacher.user && teacher.data && userType && schoolData)) {
      return children;
    }
    return <Navigate to="/login" />;
  }
};
