import { deleteField, doc, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../../firebase/firebase.config";
import useMediaQuery from "../../hooks/useMediaQuery";
import { useSetDocument } from "../../hooks/useSetDocument";
import { useUpdateInfoCounter } from "../../hooks/useUpdateInfoCounter";
import { RootState } from "../../redux/store";
import {
  SingleClassData,
  TeachersDataFromFirebase,
} from "../../utils/interfaces";
import { SearchButton } from "../searchButton/SearchButton";
import { ClassTable } from "./classes/ClassTable";
interface ModalOptions {
  isOpen: boolean;
  removedClass: SingleClassData | null;
}
export const ClassesView: React.FC = () => {
  const { setDocument } = useSetDocument();
  const { updateCounter } = useUpdateInfoCounter();
  const schoolData = useSelector((state: RootState) => state.schoolData.schoolData)
  const classesDataWithoutConverting = useRef<null | SingleClassData[]>(null);
  const [classesData, setClassesData] = useState<SingleClassData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [ModalOptions, setModalOptions] = useState<ModalOptions>({
    isOpen: false,
    removedClass: null,
  });
  const isMobile = useMediaQuery("(max-width:768px)");
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
  async function removeClass(
    removedClassData: SingleClassData,
    wasAccepted?: boolean
  ) {
    if (schoolData?.classes) {
      if (!wasAccepted) {
        return setModalOptions((prev) => {
          return { ...prev, isOpen: true, removedClass: removedClassData };
        });
      } else {
        const { domain } = schoolData.information;
        const RemovedTeacherObject = Object.values(
          schoolData.teachers
        ).find((x) => {
          const Name = `${x.firstName} ${x.lastName}`;
          return Name === removedClassData.classTeacher;
        });
        const teacherEmail = RemovedTeacherObject?.email;
        await updateDoc(doc(db, domain, "classes"), {
          [removedClassData.name]: deleteField(),
        });
        try {
          if (teacherEmail) {
            setDocument(domain, "teachers", {
              [teacherEmail as string]: {
                classTeacher: "",
              },
            });
          }
          updateCounter(domain, "classesCount", "decrement");
        } catch (error) {
          console.log(error);
        }
        toast.success("Udało ci się usunąc Klasę");
      }
    }
  }
  useEffect(() => {
    if (schoolData?.classes) {
      //First we change classTeacher email to his firstName and lastName by mapping the array of allClasses
      classesDataWithoutConverting.current = Object.values(
        schoolData.classes
      );
      const allClasses = Object.values(schoolData.classes).map((x) => {
        const newName = findClassTeacherName(x.classTeacher);
        return { ...x, classTeacher: newName ? newName : "Brak wychowawcy" };
      });
      //Then we implement Search by matching every string field on classes to our searchQuery
      const searchedClasses = allClasses.filter((x) => {
        const keyed = Object.values(x).filter((x) => typeof x === "string");
        return keyed.some((v) =>
          v.toString().toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
      setClassesData(searchedClasses);
    }
    // eslint-disable-next-line
  }, [schoolData?.classes, searchQuery]);
  return (
    <>
      <div className={`modal ${ModalOptions.isOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h2 className="text-2xl text-center">
            {`Czy napewno chcesz usunąć tą klasę ${ModalOptions.removedClass?.name} ?`}
          </h2>
          <span className=" text-error select-none text text-center justify-center flex mt-4">
            Usuniętej klasy nie da się przywrócić
          </span>
          <div className="modal-action">
            <button
              className={`btn btn-primary`}
              onClick={() => {
                let classThatIsBeingRemoved = ModalOptions.removedClass;
                setModalOptions((prev) => {
                  return { ...prev, isOpen: false };
                });
                removeClass(classThatIsBeingRemoved as SingleClassData, true);
              }}
            >
              Usuń
            </button>
            <button
              className="btn"
              onClick={() => {
                setModalOptions(() => {
                  return {
                    removedClass: null,
                    isOpen: false,
                  };
                });
              }}
            >
              Zamknij
            </button>
          </div>
        </div>
      </div>
      <div className="bg-base-200 rounded-xl shadow-lg p-8 overflow-x-auto  border-base-300 flex flex-col items-center relative">
        <h2 className="text-primary text-2xl text-center mb-4">Lista Klas</h2>
        <Link
          to="/"
          className="flex w-max items-center mb-2 gap-2 absolute left-6"
        >
          <BsFillArrowLeftCircleFill
            className={`transition-all hover:-translate-x-1.5 duration-300 text-2xl`}
          />
          {!isMobile && "Powrót do Panelu Dyrektora"}
        </Link>
        <SearchButton
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <ClassTable classesData={classesData} removeClass={removeClass} />
      </div>
    </>
  );
};
