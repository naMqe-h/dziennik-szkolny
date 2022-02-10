import { useEffect, useState } from "react";
import useMediaQuery from "../../../hooks/useMediaQuery";
import { SchoolGrade } from "../../../utils/interfaces";
import { SingleGrade } from "./SingleGrade";

interface SingleGradeRowProps {
  subject: string;
  grades: SchoolGrade[];
}

export const SingleGradeRow: React.FC<SingleGradeRowProps> = ({
  subject,
  grades,
}) => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [avg, setAvg] = useState<string>("0");
  let allGrades: number[] = [];

  useEffect(() => {
    grades.forEach((grade) => {
      allGrades.push(grade.grade);
    });
    if (grades.length > 0) {
      const tempAvg = (
        allGrades.reduce((prev, curr) => prev + curr) / allGrades.length
      ).toFixed(2);
      setAvg(tempAvg);
    } else {
      setAvg("-");
    }
    // eslint-disable-next-line
  }, [grades]);
  return (
    <tr>
      <th>{subject}</th>
      <td className={`${grades.length < 0 && "flex flex-wrap"}`}>
        {grades.map((grade, index) => (
          <SingleGrade key={index} grade={grade} />
        ))}
      </td>
      {!isMobile && (
        <>
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
        </>
      )}
    </tr>
  );
};
