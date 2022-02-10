import React, { useEffect, useState } from "react";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { FcSettings } from "react-icons/fc";
import { RiFileSettingsLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useMediaQuery from "../../../hooks/useMediaQuery";
import { RootState } from "../../../redux/store";
import {
  SingleStudentDataFromFirebase,
  termType,
} from "../../../utils/interfaces";
import { SingleGradeRow } from "../../singleClass/grades/SingleGradeRow";

export const StudentGradesView = () => {
  const userType = useSelector((state: RootState) => state.userType.userType);
  const student = useSelector((state: RootState) => state.student.data);
  const [currentTerm, setCurrentTerm] = useState<termType>(1);
  const isMobile = useMediaQuery("(max-width:768px)");
  const [studentData, setStudentData] =
    useState<SingleStudentDataFromFirebase | null>(null);
  const navigate = useNavigate();
  const changeTerm = () => {
    currentTerm === 1 ? setCurrentTerm(2) : setCurrentTerm(1);
  };
  useEffect(() => {
    if (userType === "principals" || userType === "teachers") {
      navigate("/classes");
    } else {
      if (student) {
        setStudentData(student);
      }
    }
  }, [userType]);
  return (
    <section className="card bg-base-200 w-full border rounded-box border-base-300 py-4 px-8">
      <Link to="/" className="flex w-max items-center mb-2 gap-2">
        <BsFillArrowLeftCircleFill
          className={`transition-all hover:-translate-x-1.5 duration-300 text-2xl`}
        />
        {!isMobile && "Powrót na stronę główną"}
      </Link>
      <h1 className="text-3xl text-primary text-center gap-2 flex flex-col items-center">
        <span>Semestr {`${currentTerm}`}</span>
        <div className="dropdown dropdown-hover text-primary">
          <FcSettings className="" />
          <ul
            tabIndex={0}
            className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52"
          >
            <div className="form-control items-start">
              <label className="cursor-pointer label ">
                <span className="label-text mr-4">Zmień semestr</span>
                <input
                  type="checkbox"
                  checked={currentTerm === 2}
                  onChange={changeTerm}
                  className="toggle"
                />
              </label>
            </div>
          </ul>
        </div>
      </h1>

      <table className="table w-full overflow-x-auto">
        <thead>
          <tr className="">
            <th className="w-1">Nazwa przedmiotu</th>
            <th>Oceny</th>
            {!isMobile && (
              <>
                <th className="w-1">Średnia ocen</th>
                <th className="w-1">Ocena semestralna</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {studentData &&
            Object.entries(studentData?.grades).map((item) => (
              <SingleGradeRow
                key={item[0]}
                subject={item[0]}
                grades={item[1].filter((x) => x.term === currentTerm) ?? []}
              />
            ))}
        </tbody>
      </table>
    </section>
  );
};
