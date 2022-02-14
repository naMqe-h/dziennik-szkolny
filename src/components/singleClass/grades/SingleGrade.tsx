import Tippy from "@tippyjs/react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../../redux/store";
import {
  SchoolGrade,
  TeachersDataFromFirebase,
} from "../../../utils/interfaces";

interface SingleGradeProps {
  grade: SchoolGrade;
}

export const SingleGrade: React.FC<SingleGradeProps> = ({ grade }) => {
  const schoolData = useSelector(
    (state: RootState) => state.schoolData.schoolData
  );
  const [color, setColor] = useState<string>("");
  //Konwertuję emaile teacherów na imię i nazwisko
  function findClassTeacherName(email: string): string {
    const allTeachers = schoolData?.teachers as TeachersDataFromFirebase;
    const match = Object.keys(allTeachers).find((x) => x === email);
    if (match) {
      const foundedTeacher = allTeachers[match];
      const Name = `${foundedTeacher.firstName} ${foundedTeacher.lastName}`;
      return Name;
    }
    return "";
  }
  useEffect(() => {
    if ([1, 2].includes(grade.grade)) setColor("badge-error");
    if ([3, 4].includes(grade.grade)) setColor("badge-warning");
    if (grade.grade === 5) setColor("badge-info");
    if (grade.grade === 6) setColor("badge-success");
  }, [grade.grade]);
  return (
    <Tippy
      allowHTML={true}
      placement={"top-start"}
      maxWidth={"300px"}
      content={
        <div className="p-4 bg-base-300 break-words text-base-content rounded-xl shadow-xl flex flex-col">
          <div>
            <b>Ocena:</b>{" "}
            <span className={`text-${color.split("-")[1]}`}>{grade.grade}</span>
          </div>
          <div>
            <b>Waga:</b> <span>{grade.weight}</span>
          </div>
          <div>
            <b>Temat:</b> <span>{grade.topic}</span>
          </div>
          <div>
            <b>Nauczyciel:</b>{" "}
            <span>{findClassTeacherName(grade.addedBy)}</span>
          </div>
          <div>
            <b>Wystawiono:</b>{" "}
            <span>
              {moment(Number(grade.date.replaceAll(/\s/g, ""))).format(
                "DD.MM.yyyy"
              )}
            </span>
          </div>
        </div>
      }
    >
      <Link to={`grade/singleGrade`}>
        <span
          className={`tooltip badge md:mx-1 m-1 p-4 font-bold flex z-10 cursor-pointer ${color}`}
        >
          {grade.grade}
        </span>
      </Link>
    </Tippy>
  );
};
