import { useParams } from "react-router-dom";
import { Class } from "../components/add/Class";
import { Teacher } from "../components/add/Teacher";

export const Add = () => {
  const { type } = useParams();

  return (
    <div className="w-full flex items-center justify-center">
      {type === "class" && <Class />}
      {type === "teacher" && <Teacher />}
      {type === "student" && <h1>Student</h1>}
      {type === "subject" && <h1>Przedmiot</h1>}
    </div>
  );
};
