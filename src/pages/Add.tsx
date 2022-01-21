import { useParams } from "react-router-dom";
import { Class } from "../components/add/Class";
import { Teacher } from "../components/add/Teacher";
import { Student } from "../components/add/Student";
import { Subject } from "../components/add/Subject";

export const Add = () => {
  const { type } = useParams();

  return (
    <div className="w-full flex items-center justify-center">
      {type === "class" && <Class />}
      {type === "teacher" && <Teacher />}
      {type === "student" && <Student />}
      {type === "subject" && <Subject />}
    </div>
  );
};
