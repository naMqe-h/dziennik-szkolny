import { useSelector } from "react-redux";
import { DashboardView as PrincipalView } from "../components/principal/DashboardView";
import { DashboardView as StudentView } from "../components/student/DashboardView";
import { DashboardView as TeacherView } from "../components/teacher/DashboardView";
import { RootState } from "../redux/store";

export const Dashboard = () => {
  const userType = useSelector((state: RootState) => state.userType.userType)

  return (
    <div className="h-full m-4">
      {userType === 'principals' && <PrincipalView />}
      {userType === 'students' && <StudentView /> }
      {userType === 'teachers' && <TeacherView /> }
    </div>
  );
};
