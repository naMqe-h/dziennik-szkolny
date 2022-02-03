import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useSetDocument } from "../../../hooks/useSetDocument";
import { RootState } from "../../../redux/store";
import {
  SingleClassData,
  SingleSubjectInClasses,
  SingleTeacherData,
  SubjectData,
} from "../../../utils/interfaces";
import { SubjectRow } from "./SubjectRow";

interface SubjectsProps {
  subjects: SingleSubjectInClasses[] | undefined;
  singleClass: SingleClassData | undefined;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

interface SubjectDataWithTeacher extends SubjectData {
  teacher: string;
}

interface SubjectDataWithKey extends SubjectData {
  key: string;
}

export const Subjects: React.FC<SubjectsProps> = ({
  subjects,
  singleClass,
  isOpen,
  setIsOpen,
}) => {
  const { setDocument } = useSetDocument();
  const schoolData = useSelector((state: RootState) => state.schoolData.schoolData);
  const allSubjects = schoolData?.subjects
  const allTeachers = schoolData?.teachers
  const domain = schoolData?.information.domain

  const [newSubjects, setNewSubjects] = useState<SubjectDataWithKey[]>();
  const [availableTeachers, setAvailableTeachers] =
    useState<SingleTeacherData[]>();
  const [subjectValue, setSubjectValue] = useState<string>("");
  const [teacherValue, setTeacherValue] = useState<string>("");
  const [readySubjects, setReadySubjects] =
    useState<SubjectDataWithTeacher[]>();

  const subjectsNames: string[] = [];
  const allSubjectsNames: string[] = [];
  const newSubjectsNames: string[] = [];
  const newSubjectsTemp: SubjectDataWithTeacher[] = [];

  useEffect(() => {
    if (allSubjects && subjects) {
      for (const [key] of Object.entries(allSubjects)) {
        allSubjectsNames.push(key);
      }
      // eslint-disable-next-line
      for (const [key, value] of Object.entries(subjects)) {
        subjectsNames.push(value.name);
      }
      // eslint-disable-next-line
      allSubjectsNames.map((value) => {
        if (!subjectsNames.includes(value)) {
          newSubjectsNames.push(value);
        }
      });
      const newSubjectsTemp = [];
      for (const [key, value] of Object.entries(allSubjects)) {
        if (newSubjectsNames.includes(key)) {
          newSubjectsTemp.push({ ...value, key });
        }
      }
      setNewSubjects(newSubjectsTemp);
    }
    // eslint-disable-next-line
  }, [allSubjects, subjects]);

  useEffect(() => {
    if (allSubjects && allTeachers) {
      const tempTeachersEmails = [];
      const tempTeachers = [];
      for (const [key, value] of Object.entries(allSubjects)) {
        if (key === subjectValue) {
          tempTeachersEmails.push(...value.teachers);
        }
      }
      for (const [key, value] of Object.entries(allTeachers)) {
        if (tempTeachersEmails.includes(key)) {
          tempTeachers.push(value);
        }
      }
      setAvailableTeachers(tempTeachers);
    }
  }, [allSubjects, allTeachers, subjectValue]);

  useEffect(() => {
    if (allSubjects) {
      // eslint-disable-next-line
      subjects?.map((subject) => {
        for (const [key, value] of Object.entries(allSubjects)) {
          if (key === subject.name) {
            newSubjectsTemp.push({ ...value, teacher: subject.teacher });
          } else if (subject.name === "GodzinaWychowawcza") {
            newSubjectsTemp.push({
              includedAvg: false,
              teachers: [subject.teacher],
              name: "Godzina Wychowawcza",
              teacher: subject.teacher,
            });
            break;
          }
        }
      });
      setReadySubjects(newSubjectsTemp);
    }
    // eslint-disable-next-line
  }, [subjects, allSubjects]);

  const handleAdd = async () => {
    if (teacherValue !== "" && subjectValue !== "") {
      if (singleClass) {
        if (allTeachers) {
          const allTeachedClasses = allTeachers[teacherValue].teachedClasses;
          const data = {
            [singleClass.name]: {
              subjects: [
                ...singleClass.subjects,
                { name: subjectValue, teacher: teacherValue },
              ],
            },
          };
          const data2 = {
            [teacherValue]: {
              teachedClasses: [...allTeachedClasses, singleClass.name],
            },
          };
          await setDocument(domain as string, "classes", data);
          await setDocument(domain as string, "teachers", data2);
          setTeacherValue("");
          setSubjectValue("");
        }
      }
    } else {
      toast.error("Wypełnij wszystkie pola", { autoClose: 2000 });
    }
  };
  return (
    <>
      <div className={`modal ${isOpen ? "modal-open" : ""} `}>
        <div className="modal-box flex flex-col items-center gap-2 bg-base-300">
          <AiOutlineClose
            onClick={() => setIsOpen((prev) => !prev)}
            size={30}
            className="absolute top-2 right-2 cursor-pointer"
          />
          <h2 className="mb-3">
            Dodaj przedmiot dla klasy{" "}
            <span className="font-bold">{singleClass?.fullName}</span>
          </h2>
          Wybierz przedmiot:
          <select
            onChange={(e) => setSubjectValue(e.currentTarget.value)}
            className="select select-bordered w-full max-w-xs"
          >
            <option value=""></option>
            {newSubjects?.map((subject) => (
              <option value={subject.key} key={subject.name}>
                {subject.name}
              </option>
            ))}
          </select>
          Wybierz nauczyciela uczącego:
          <select
            onChange={(e) => setTeacherValue(e.currentTarget.value)}
            className="select select-bordered w-full max-w-xs"
          >
            <option value=""></option>
            {availableTeachers?.map((teacher) => (
              <option value={teacher.email} key={teacher.email}>
                {teacher.lastName} {teacher.firstName}
              </option>
            ))}
          </select>
          <button onClick={handleAdd} className="btn btn-primary w-44">
            Dodaj
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="w-1">Nr</th>
              <th>Nazwa przedmiotu</th>
              <th>Nauczyciel uczący</th>
              <th className="w-1">Liczone do średniej</th>
            </tr>
          </thead>
          <tbody>
            {readySubjects?.map((subject, index) => (
              <SubjectRow
                key={subject.name}
                subject={subject}
                number={index + 1}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
