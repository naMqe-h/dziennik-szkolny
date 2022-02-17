import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../redux/store";
import {
  SingleClassData,
  SingleStudentDataFromFirebase,
  termType,
} from "../../utils/interfaces";
import { FcConferenceCall } from "react-icons/fc";
import { SingleClassTable } from "./SingleClassTable";
import { toast } from "react-toastify";
import { Grades } from "./grades/Grades";
import { Subjects } from "./subjects/Subjects";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import useMediaQuery from "../../hooks/useMediaQuery";
import { AiOutlineClose } from "react-icons/ai";
import useFetch from "../../hooks/useFetch";
import { useSetDocument } from "../../hooks/useSetDocument";
import { useUpdateInfoCounter } from "../../hooks/useUpdateInfoCounter";
import { LessonPlan } from "./lessonPlan/LessonPlan";
import { Frequency } from "./frequency/Frequency";
import { Schedule } from "./Schedule/Schedule";
import { MobileLessonPlan } from "./lessonPlan/mobileLessonPlan/MobileLessonPlan";

export const SingleClassView = () => {
  const { data: users, loading, getData, setData } = useFetch();
  const { setDocument } = useSetDocument();
  const { updateCounter } = useUpdateInfoCounter();

  const { id, subpage } = useParams();
  const navigate = useNavigate();

  //modal generowanie
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const [countGenerate, setCountGenerate] = useState<number>(1);
  const [yearGnerate, setYearGenerate] = useState<number>(2000);
  const [singleClass, setSingleClass] = useState<SingleClassData>();
  const [classTeacherName, setClassTeacherName] = useState<string>();
  const [studentsInfo, setStudentsInfo] = useState({});
  const [isSubjectOpen, setIsSubjectOpen] = useState<boolean>(false);
  const [isGradeOpen, setIsGradeOpen] = useState(false);
  const [checked, setChecked] = useState<boolean>(false);
  const [term, setTerm] = useState<termType>(1);
  const schoolData = useSelector(
    (state: RootState) => state.schoolData.schoolData
  );
  const principal = useSelector((state: RootState) => state.principal);
  const teacher = useSelector((state: RootState) => state.teacher);

  const classes = schoolData?.classes;
  const teachers = schoolData?.teachers;
  const allStudents = schoolData?.students;
  const domain = schoolData?.information.domain;

  const isMobile = useMediaQuery("(max-width:480px)");
  const isTablet = useMediaQuery("(max-width:700px)");
  const showMobileLessonPlan = useMediaQuery("(max-width:1024px)");

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
  const handleGenerate = async () => {
    if (countGenerate <= 30) {
      const baseUrl = process.env.REACT_APP_HEROKU_URL;
      const url = `${baseUrl}/users/single-year?count=${countGenerate}&year=${yearGnerate}&domain=${domain}`;
      await getData(url);
    } else {
      toast.error("Maksymalna ilość do wygenerowania to 30 uczniów", {
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    const saveGeneratedUsers = async () => {
      let tempEmails: string[] = [];

      for (const item of Object.values(users)) {
        const tempUser: SingleStudentDataFromFirebase = {
          firstName: item.firstName,
          lastName: item.lastName,
          gender: item.gender,
          password: item.password,
          pesel: item.pesel,
          birth: item.dateFirebase,
          email: item.email,
          class: singleClass?.name as string,
          grades: {},
          profilePicture: "",
          isActive: true,
        };

        const objWrapper = {
          [tempUser.email]: {
            ...tempUser,
          },
        };

        tempEmails.push(tempUser.email);
        await setDocument(domain as string, "students", objWrapper);
        await updateCounter(domain as string, "studentsCount", "increment");
      }

      const previousStudents =
        schoolData?.classes[singleClass?.name as string].students;
      await setDocument(domain as string, "classes", {
        [singleClass?.name as string]: {
          students: [...(previousStudents as string[]), ...tempEmails],
        },
      });
      setData([]);
    };

    if (users.length > 0) {
      saveGeneratedUsers();
    }
    // eslint-disable-next-line
  }, [users]);
  return (
    <>
      <div className={`modal ${isOpen ? "modal-open" : ""} `}>
        <div className="modal-box flex flex-col items bg-base-300">
          <AiOutlineClose
            onClick={() => setIsOpen((prev) => !prev)}
            size={30}
            className="absolute top-2 right-2 cursor-pointer"
          />
          <h2 className="mb-3 text-center">
            Wygeneruj uczniów dla klasy
            <span className="font-bold">{singleClass?.fullName}</span>
          </h2>
          <label className="label">
            <span className="label-text mb-0">Ilość (max 30)</span>
          </label>
          <input
            type="number"
            min={1}
            max={30}
            onChange={(e) => setCountGenerate(+e.currentTarget.value)}
            value={countGenerate}
            placeholder="Ilość"
            className="input input-bordered mt-0"
          />

          <label className="label">
            <span className="label-text mb-0">Podaj rocznik</span>
          </label>
          <input
            type="number"
            min={1990}
            max={2021}
            onChange={(e) => setYearGenerate(+e.currentTarget.value)}
            value={yearGnerate}
            placeholder="Ilość"
            className="input input-bordered mt-0"
          />

          <button
            onClick={handleGenerate}
            className={`btn btn-primary w-44 mt-4 mx-auto ${
              loading ? "loading" : ""
            }`}
          >
            Wygeneruj
          </button>
        </div>
      </div>
      <div className="p-8 overflow-x-auto">
        <Link to="/classes" className="flex items-center mb-2 gap-2">
          <BsFillArrowLeftCircleFill
            className={`transition-all hover:-translate-x-1.5 duration-300 text-2xl`}
          />
          {!isMobile && "Powrót do listy klas"}
        </Link>
        <div className="flex flex-row h-20 card bg-base-300 rounded-box items-center px-10">
          <div className="flex items-center flex-1 font-bold text-lg">
            <FcConferenceCall className="mr-2" size={32} />
            {isTablet ? singleClass?.name : singleClass?.fullName}
            {!isTablet && (
              <div className="badge badge-secondary badge-outline badge-lg ml-6">
                Uczniów: {singleClass?.students.length}
              </div>
            )}
          </div>
          <div className="mx-5">
            {!isMobile && "Wychowawca:"} {classTeacherName}
          </div>
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
            <Link
              to={`/class/${id}/schedule`}
              className="btn btn-secondary btn-outline "
            >
              Wydarzenia
            </Link>
            <select
              className="select select-bordered select-secondary  max-w-full"
              onChange={(e) => setTerm(Number(e.target.value) as termType)}
            >
              <option value={1}>Semestr 1</option>
              <option value={2}>Semestr 2</option>
            </select>
          </div>
          {subpage === "info" && principal.user && (
            <div className="grid grid-cols-2 gap-2 xl:flex">
              <Link
                to="/add/student"
                className="btn btn-primary btn-outline lg:ml-2"
              >
                Dodaj ucznia
              </Link>
              <button
                onClick={() => setIsOpen((prev) => !prev)}
                className={`btn btn-primary btn-outline lg:ml-2`}
              >
                Wygeneruj uczniów
              </button>
            </div>
          )}

          {subpage === "subjects" && principal.user && (
            <div className="grid grid-cols-1 gap-2 xl:flex">
              <button
                onClick={() => setIsSubjectOpen((prev) => !prev)}
                className="btn btn-primary btn-outline ml-2"
              >
                Dodaj przedmiot
              </button>
            </div>
          )}
          {subpage === "grades" && teacher.user && (
            <div className="grid grid-cols-1 gap-2 xl:flex">
              <button
                onClick={() => setIsGradeOpen((prev) => !prev)}
                className="btn btn-primary btn-outline ml-2"
              >
                Dodaj ocenę
              </button>
            </div>
          )}
          {subpage === "schedule" && teacher.user && (
            <div className="grid grid-cols-1 gap-2 xl:flex">
              <button
                onClick={() => setIsScheduleOpen((prev) => !prev)}
                className="btn btn-primary btn-outline ml-2"
              >
                Dodaj wydarzenie
              </button>
            </div>
          )}
        </div>

        {subpage === "info" && (
          <SingleClassTable studentsInfo={studentsInfo} showDelete={isMobile} />
        )}
        {subpage === "subjects" && (
          <Subjects
            setIsOpen={setIsSubjectOpen}
            isOpen={isSubjectOpen}
            subjects={singleClass?.subjects}
            singleClass={singleClass}
          />
        )}
        {subpage === "lesson-plan" ? (
          showMobileLessonPlan ? (
            <MobileLessonPlan singleClass={singleClass} />
          ) : (
            <LessonPlan singleClass={singleClass} />
          )
        ) : null}
        {subpage === "frequency" && <Frequency />}
        {subpage === "grades" && (
          <Grades
            setIsOpen={setIsGradeOpen}
            isOpen={isGradeOpen}
            studentsInfo={studentsInfo}
            term={term}
          />
        )}
        {subpage === "schedule" && (
          <Schedule
            singleClass={singleClass}
            isOpen={isScheduleOpen}
            setIsOpen={setIsScheduleOpen}
            userData={teacher.user ? teacher.data : principal.data}
            domain={domain}
          />
        )}
      </div>
    </>
  );
};
