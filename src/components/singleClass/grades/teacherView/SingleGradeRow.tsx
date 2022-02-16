import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAverage } from "../../../../hooks/useAverage";
import { RootState } from "../../../../redux/store";
import {
  SchoolGrade,
  SingleStudentDataFromFirebase,
  termType,
} from "../../../../utils/interfaces";
import { SingleGrade } from "../SingleGrade";

interface SingleGradeRowProps {
  student: SingleStudentDataFromFirebase;
  number: number;
  term: termType;
}

export const SingleGradeRow: React.FC<SingleGradeRowProps> = ({
  student,
  number,
  term,
}) => {
  const { calculateAvg } = useAverage();

  const subject = useSelector(
    (state: RootState) => state.teacher.data?.subject
  );
  const [grades, setGrades] = useState<SchoolGrade[]>([]);
  const [avg, setAvg] = useState<string>();
  useEffect(() => {
    setGrades(
      student.grades[subject as string].filter((x) => x.term === term) ?? []
    );
    // eslint-disable-next-line
  }, [student, term]);

  useEffect(() => {
    if (grades?.length > 0) {
      const tempAvg = calculateAvg(grades);
      setAvg(tempAvg);
    } else {
      setAvg("0.00");
    }
    // eslint-disable-next-line
  }, [grades]);

  return (
    <tr className="border-b-[1px] border-base-100">
      <td>{number}</td>
      <td>
        {student.lastName} {student.firstName}
      </td>
      <td>
        <div className="flex flex-wrap gap-y-2">
          {grades.length > 0
            ? grades?.map((grade, index) => (
                <SingleGrade key={index} grade={grade} />
              ))
            : "Brak ocen"}
        </div>
      </td>
      <td
        className={`text-${
          avg && +avg > 0 && +avg < 2 ? "error" : "success"
        } font-bold text-center`}
      >
        {avg}
      </td>
      <td className="text-center">
        <div className="badge font-bold">-</div>
      </td>
    </tr>
  );
};
