import { cloneDeep } from "lodash";
import { Dispatch, SetStateAction, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useSetDocument } from "../../../../hooks/useSetDocument";
import { RootState } from "../../../../redux/store";
import {
  SchoolGrade,
  SingleStudentDataFromFirebase,
  StudentsDataFromFirebase,
} from "../../../../utils/interfaces";
import { NewGrade } from "./NewGrade";

interface ModalProps {
  students: SingleStudentDataFromFirebase[];
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  studentsInfo: StudentsDataFromFirebase;
}

export const Modal: React.FC<ModalProps> = ({
  students,
  isOpen,
  setIsOpen,
  studentsInfo,
}) => {
  const { setDocument } = useSetDocument();

  const domain = useSelector(
    (state: RootState) => state.schoolData.schoolData?.information.domain
  );
  const teacher =
    useSelector((state: RootState) => state.teacher.data) || undefined;

  const [newGrades, setNewGrades] = useState<{ [key: string]: number }>({});
  const [topic, setTopic] = useState<string>("");
  const [weight, setWeight] = useState<number>(0);

  const handleAdd = async () => {
    const newStudentsInfo = cloneDeep(studentsInfo);
    // tutaj tworzymy nowy obiekt uczniów z dopisanymi nowymi ocenami
    if (topic !== "" && weight) {
      for (const [key, value] of Object.entries(newGrades)) {
        const prevGrades = cloneDeep(newStudentsInfo[key].grades);
        const newGrade: SchoolGrade = {
          grade: value,
          weight: 0,
          addedBy: teacher?.email as string,
          date: Date.now().toLocaleString(),
          topic: "Test",
          term: 1,
        };
        const newSubject = {
          [teacher?.subject as string]: [newGrade],
        };
        if (newStudentsInfo[key]?.grades[teacher?.subject as string]) {
          newStudentsInfo[key]?.grades[teacher?.subject as string].push(
            newGrade
          );
        } else {
          newStudentsInfo[key].grades = {
            ...prevGrades,
            ...newSubject,
          };
        }
      }
      await setDocument(domain as string, "students", newStudentsInfo);
      toast.success("Dodane nowe oceny", { autoClose: 3000 });
    } else {
      //! Walidacja inputów
      toast.error("Uzupełnij temat i wagę oceny", { autoClose: 3000 });
    }
  };

  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box flex flex-col items-center gap-2 bg-base-300 max-w-[800px] ">
        <AiOutlineClose
          onClick={() => setIsOpen((prev) => !prev)}
          size={30}
          className="absolute top-2 right-2 cursor-pointer"
        />
        <div className="w-full">
          <div className="flex gap-6">
            <div>
              <p className="label-text">Temat</p>
              <input
                value={topic}
                onChange={(e) => setTopic(e.currentTarget.value)}
                type="text"
                placeholder="Kartkówka"
                className="input input-bordered"
              />
            </div>
            <div>
              <p className="label-text">Waga oceny</p>
              <input
                value={weight}
                onChange={(e) => setWeight(+e.currentTarget.value)}
                type="number"
                min={0}
                max={10}
                placeholder="0-10"
                className="input input-bordered"
              />
            </div>
          </div>
          <div className="overflow-x-auto mt-6">
            <table className="table w-full table-zebra">
              <thead>
                <tr>
                  <th className="w-1">Nr</th>
                  <th>Nazwisko Imię</th>
                  <th className="text-center">Ocena</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student.email}>
                    <th>{index + 1}</th>
                    <td>
                      {student.lastName} {student.firstName}
                    </td>
                    <td className="flex justify-center">
                      <NewGrade
                        email={student.email}
                        setNewGrades={setNewGrades}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <button onClick={handleAdd} className="btn btn-primary w-44 self-end">
          Dodaj
        </button>
      </div>
    </div>
  );
};
