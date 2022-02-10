import useMediaQuery from "../../../hooks/useMediaQuery";
import { SingleStudentDataFromFirebase } from "../../../utils/interfaces";
import { SingleGradeRow } from "./SingleGradeRow";

interface SingleStudentGradeRowProps {
  student: SingleStudentDataFromFirebase;
  number: number;
}

export const SingleStudentGradeRow: React.FC<SingleStudentGradeRowProps> = ({
  student,
  number,
}) => {
  const tempGrades = Object.entries(student.grades);
  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <div className="collapse w-full border rounded-box border-base-300 collapse-arrow">
      <input type="checkbox" />
      <div className="collapse-title text-xl font-medium">
        {number} {student.lastName} {student.firstName}
      </div>
      <div className="collapse-content">
        <table className="table w-full">
          <thead>
            <tr className="">
              <th className=" w-1">Nazwa przedmiotu</th>
              <th>Oceny</th>
              {!isMobile && <th className="w-1">Średnia ocen</th>}
              {!isMobile && <th className="w-1">Ocena semestralna</th>}
            </tr>
          </thead>
          <tbody>
            {tempGrades.map((item) => (
              <SingleGradeRow
                key={item[0]}
                subject={item[0]}
                grades={item[1]}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
