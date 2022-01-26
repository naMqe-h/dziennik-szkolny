import { deleteField, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FcSearch } from "react-icons/fc";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { db } from "../../firebase/firebase.config";
import { useAddDocument } from "../../hooks/useAddDocument";
import { RootState } from "../../redux/store";
import {
  SingleClassData,
  TeachersDataFromFirebase,
} from "../../utils/interfaces";
import { SearchButton } from "../SearchButton/SearchButton";
import { ClassTable } from "./viewClasses/ClassTable";
interface ModalOptions {
  isOpen: boolean;
  removedClass: SingleClassData | null;
}
export const ViewClases: React.FC = () => {
  const { addDocument } = useAddDocument();
  const state = useSelector((state: RootState) => state.user);
  const [classesData, setClassesData] = useState<SingleClassData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [ModalOptions, setModalOptions] = useState<ModalOptions>({
    isOpen: false,
    removedClass: null,
  });
  function findClassTeacherName(email: string): string {
    const allTeachers = state.schoolData?.teachers as TeachersDataFromFirebase;
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
    if (state.schoolData?.classes) {
      if (!wasAccepted) {
        return setModalOptions((prev) => {
          return { ...prev, isOpen: true, removedClass: removedClassData };
        });
      } else {
        const { domain } = state.schoolData.information;
        const teacherEmail = removedClassData.classTeacher;
        await updateDoc(doc(db, domain, "classes"), {
          [removedClassData.name]: deleteField(),
        });
        try {
          addDocument(domain, "teachers", {
            [teacherEmail]: {
              classTeacher: "",
            },
          });
        } catch (error) {
          console.log(error);
        }
        toast.success("Udało ci się usunąc Klasę");
      }
    }
  }
  useEffect(() => {
    if (state.schoolData?.classes) {
      //First we change classTeacher email to his firstName and lastName by mapping the array of allClasses
      const allClasses = Object.values(state.schoolData.classes).map((x) => {
        const newName = findClassTeacherName(x.classTeacher);
        return { ...x, classTeacher: newName };
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
  }, [state.schoolData?.classes, searchQuery]);
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
      <div className="bg-base-200 rounded-xl shadow-lg p-8 overflow-x-auto  border-base-300 flex flex-col items-center">
        <SearchButton
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <ClassTable
          classesData={classesData}
          findClassTeacherName={findClassTeacherName}
          removeClass={removeClass}
        />
      </div>
    </>
  );
};
