import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link, useNavigate, useParams } from "react-router-dom"
import { RootState } from "../../redux/store"
import { SingleClassData } from "../../utils/interfaces"
import { FcConferenceCall } from 'react-icons/fc'
import { SingleClassTable } from "./SingleClassTable"
import { toast } from "react-toastify"
import { Grades } from "./grades/Grades"
import { Subjects } from "./subjects/Subjects"
import { BsFillArrowLeftCircleFill } from "react-icons/bs"
import useMediaQuery from "../../hooks/useMediaQuery";

export const SingleClassView = () => {
  const { id, subpage } = useParams();
  const navigate = useNavigate();
  const [singleClass, setSingleClass] = useState<SingleClassData>();
  const [classTeacherName, setClassTeacherName] = useState<string>();
  const [studentsInfo, setStudentsInfo] = useState({});
  const [checked, setChecked] = useState<boolean>(false);
  const classes = useSelector(
    (state: RootState) => state.user.schoolData?.classes
  );
  const teachers = useSelector(
    (state: RootState) => state.user.schoolData?.teachers
  );
  const allStudents = useSelector(
    (state: RootState) => state.user.schoolData?.students
  );
  const isMobile = useMediaQuery("(max-width:700px)");
  const buttonsMQ = useMediaQuery("(max-width:1200px)");
  useEffect(() => {
    if (classes && id) {
      for (const [key, value] of Object.entries(classes)) {
        if (key === id) {
          setSingleClass(value);
        }
      }
      setChecked(true);
    }
  }, [classes, id]);

  useEffect(() => {
    if (checked && !singleClass) {
      toast.error(`Klasa "${id}" nie istnieje`, { autoClose: 2000 });
      navigate("/");
    }
    // eslint-disable-next-line
  }, [checked]);

  useEffect(() => {
    if (teachers) {
      for (const [key, value] of Object.entries(teachers)) {
        if (key === singleClass?.classTeacher) {
          setClassTeacherName(`${value.firstName}  ${value.lastName}`);
        }
      }
    }

    if (singleClass && allStudents) {
      const { students } = singleClass;
      for (const [key, value] of Object.entries(allStudents)) {
        if (students.includes(key)) {
          setStudentsInfo((prev) => ({
            ...prev,
            [key]: value,
          }));
        }
      }
    }
    // eslint-disable-next-line
  }, [singleClass]);

  return (
    <div className="p-8 overflow-x-auto">
      <Link to='/classes' className="flex items-center mb-2 gap-2">
          <BsFillArrowLeftCircleFill />
          Powrót do listy klas
      </Link>
      <div className="flex flex-row h-20 card bg-base-300 rounded-box items-center px-10">
        <div className="flex items-center flex-1 font-bold text-lg">
          <FcConferenceCall className="mr-2" size={32} />
          {isMobile ? singleClass?.name : singleClass?.fullName}
          {!isMobile && (
            <div className="badge badge-secondary badge-outline badge-lg ml-6">
              Uczniów: {singleClass?.students.length}
            </div>
          )}
        </div>
        <div className="mx-5">Wychowawca: {classTeacherName}</div>
      </div>

      <div className="grid grid-rows-1 xl:flex xl:flex-row  card items-center my-4 flex-col gap-4 max-w-full px-2">
        <div className=" grid grid-cols-2 sm:grid-cols-3  gap-2 place-items-stretch  xl:flex items-center flex-1 font-bold text-lg flex-wrap">
          <Link
            to={`/class/${id}/info`}
            className="btn btn-secondary btn-outline "
          >
            Dane uczniów
          </Link>
          <Link
            to={`/class/${id}/subjects`}
            className="btn btn-secondary btn-outline "
          >
            Lista przedmiotów
          </Link>
          <Link
            to={`/class/${id}/lesson-plan`}
            className="btn btn-secondary btn-outline "
          >
            Plan Lekcji
          </Link>
          <Link
            to={`/class/${id}/frequency`}
            className="btn btn-secondary btn-outline "
          >
            Frekwencja
          </Link>
          <Link
            to={`/class/${id}/grades`}
            className="btn btn-secondary btn-outline "
          >
            Oceny
          </Link>
          <select className="select select-bordered select-secondary  max-w-full">
            <option>Semestr 1</option>
            <option>Semestr 2</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2 xl:flex">
           {subpage === 'info' && (
                <>
                    <button className="btn btn-primary btn-outline ml-2">Dodaj ucznia</button>
                    <button className="btn btn-primary btn-outline ml-2">Wygeneruj uczniów</button>
                </>
            )}
            {subpage === 'subjects' && (
                <>
                    <button className="btn btn-primary btn-outline ml-2">Dodaj przedmiot</button>
                </>
            )}
            {subpage === 'grades' && (
                <>
                    <button className="btn btn-primary btn-outline ml-2">Dodaj ocenę</button>
                </>
            )}
        </div>
      </div>

      {subpage === "info" && <SingleClassTable studentsInfo={studentsInfo} />}
      {subpage === 'subjects' && <Subjects subjects={singleClass?.subjects} /> }
      {subpage === "lesson-plan" && <p>Plan lekcji</p>}
      {subpage === "frequency" && <p>frekwencja</p>}
      {subpage === "grades" && (
        <Grades studentsInfo={studentsInfo} />
      )}
    </div>
  );
};
