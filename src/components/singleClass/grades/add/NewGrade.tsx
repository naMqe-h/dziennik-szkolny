import { Dispatch, SetStateAction, useEffect, useState } from "react";

const grades = [
  { grade: 0, color: "badge-neutral" },
  { grade: 1, color: "badge-error" },
  { grade: 2, color: "badge-error" },
  { grade: 3, color: "badge-warning" },
  { grade: 4, color: "badge-warning" },
  { grade: 5, color: "badge-info" },
  { grade: 6, color: "badge-success" },
];

interface NewGradeProps {
  email: string;
  setNewGrades: Dispatch<SetStateAction<{}>>;
  newGrades: { [key: string]: number };
}

export const NewGrade: React.FC<NewGradeProps> = ({
  email,
  setNewGrades,
  newGrades,
}) => {
  const [grade, setGrade] = useState<number>();

  const handleGrade = (_grade: number) => {
    setNewGrades((prev) => ({
      ...prev,
      [email]: _grade,
    }));
    setGrade(_grade);
  };
  useEffect(() => {
    const isSelected = Object.keys(newGrades).some((item) => {
      return item === email;
    });
    !isSelected && setGrade(undefined);
  }, [newGrades]);
  return (
    <div className="flex">
      {grades.map((item) => (
        <span
          onClick={() => handleGrade(item.grade)}
          key={item.grade}
          className={`badge mx-1 p-4 font-bold flex z-10 cursor-pointer ${
            item.color
          } ${
            grade === item.grade
              ? "scale-[1.2]"
              : "opacity-30 hover:opacity-100 hover:scale-110"
          }`}
        >
          {item.grade}
        </span>
      ))}
    </div>
  );
};
