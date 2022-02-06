import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { Loader } from "../../loader/Loader";
import { toast } from "react-toastify";

interface ProtectedRouteProps {
  children: JSX.Element;
  loading: boolean;
}

export const TeacherRoute: React.FC<ProtectedRouteProps> = ({ children, loading }) => {
  const principal = useSelector((state: RootState) => state.principal);
  const teacher = useSelector((state: RootState) => state.teacher)
  const student = useSelector((state: RootState) => state.student)
  const schoolData = useSelector((state: RootState) => state.schoolData.schoolData)
  const userType = useSelector((state: RootState) => state.userType.userType)

  if (loading) {
    return <Loader />;
  } else {
    if ((principal.user && principal.data && schoolData && userType) || (teacher.user && teacher.data && userType && schoolData)) {
      return children;
    } else {
      if (student.user && student.data && userType) {
        toast.error('Brak uprawnień do przejścia na podaną stronę', { autoClose: 3000 })
        return <Navigate to='/' />
      }
      return <Navigate to="/login" />;
    }
  }
};
