import { deleteField, doc, updateDoc } from "firebase/firestore";
import { cloneDeep } from "lodash";
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
  ClassesDataFromFirebase,
  SingleClassData,
  SortingOptions,
  StudentsDataFromFirebase,
  TeachersDataFromFirebase,
} from "../../utils/interfaces";
import { Teacher } from "../add/Teacher";
import { SearchButton } from "../searchButton/SearchButton";
import { ClassTable } from "./classes/ClassTable";
interface ModalOptions {
  isOpen: boolean;
  removedClass: SingleClassData | null;
}
export interface SortingOfClasses {
  lp: SortingOptions;
  name: SortingOptions;
  classTeacher: SortingOptions;
  profile: SortingOptions;
  studentCount: SortingOptions;
}
export const defaultSortingState: SortingOfClasses = {
  lp: "Default",
  name: "Default",
  classTeacher: "Default",
  profile: "Default",
  studentCount: "Default",
};
export const ClassesView: React.FC = () => {
  const { setDocument } = useSetDocument();
  const { updateCounter } = useUpdateInfoCounter();
  const schoolData = useSelector(
    (state: RootState) => state.schoolData.schoolData
  );
  const userType = useSelector((state: RootState) => state.userType.userType);
  const dataAboutTeacher = useSelector(
    (state: RootState) => state.teacher.data ?? null
  );
  const classesDataWithoutConverting = useRef<null | SingleClassData[]>(null);
  const [classesData, setClassesData] = useState<SingleClassData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sorting, setSorting] = useState<SortingOfClasses>(defaultSortingState);
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
        // const RemovedTeacherObject = Object.values(schoolData.teachers).find(
        //   (x) => {
        //     const Name = `${x.firstName} ${x.lastName}`;
        //     return Name === removedClassData.classTeacher;
        //   }
        // );
        //? Przy przywracaniu klasy należy przywrócić uczniów do klasy chyba że zostali przypisani do innej
        const oldStudents = cloneDeep(schoolData.students);
        const newStudents: StudentsDataFromFirebase = {};
        Object.entries(oldStudents).forEach((values, _N) => {
          const studentEmail = values[0];
          const studentData = values[1];
          if (studentData.class === removedClassData.name) {
            newStudents[studentEmail] = { ...studentData, class: "" };
          } else {
            newStudents[studentEmail] = studentData;
          }
        });
        const removedClassObject: SingleClassData =
          schoolData.classes[removedClassData.name];
        //?Przy przywracaniu klasy będzie trzeba dodać godziny pracowania dla nauczycieli zgodnie z planem lekcji
        const oldTeachers = schoolData.teachers;
        const newTeachers: TeachersDataFromFirebase = {};
        Object.entries(oldTeachers).forEach((values, _N) => {
          const teacherEmail = values[0];
          const teacherData = values[1];
          const newClassTeacher =
            teacherData.classTeacher === removedClassData.name
              ? ""
              : teacherData.classTeacher;
          const newTeachedClasses = teacherData.teachedClasses.filter(
            (x) => x !== removedClassData.name
          );
          const newWorkingHours = teacherData.workingHours.filter(
            (x) => x.className !== removedClassData.name
          );
          newTeachers[teacherEmail] = {
            ...teacherData,
            workingHours: newWorkingHours,
            teachedClasses: newTeachedClasses,
            classTeacher: newClassTeacher,
          };
        });
        console.log(newTeachers);
        try {
          //? Przy przywracaniu klasy należy przywrócić wychowawce
          setDocument(domain, "classes", {
            [removedClassData.name]: { ...removedClassObject, isActive: false },
          });
          setDocument(domain, "teachers", newTeachers);
          setDocument(domain, "students", newStudents);
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
      //Na początku zmieniamy email wychowawcy na imię i nazwisko
      let values: ClassesDataFromFirebase = {};
      if (userType === "teachers") {
        Object.keys(schoolData.classes).filter((x) => {
          if (dataAboutTeacher?.teachedClasses.some((y) => x === y)) {
            values[x] = schoolData.classes[x];
          }
        });
      } else {
        values = schoolData.classes;
      }
      // console.log(schoolData.classes);
      classesDataWithoutConverting.current = Object.values(values);
      const allClasses = Object.values(values)
        .map((x) => {
          const newName = findClassTeacherName(x.classTeacher);
          return { ...x, classTeacher: newName ? newName : "Brak wychowawcy" };
        })
        .filter((x) => x.isActive !== false);
      //Potem implementujemy searcha poprzez filtrowanie obiektu wszystkich klas i zostawianie tylko pól typu string
      const searchedClasses = allClasses
        .filter((x) => {
          const keyed = Object.values(x).filter((x) => typeof x === "string");
          return keyed.some((v) =>
            v.toString().toLowerCase().includes(searchQuery.toLowerCase())
          );
        })
        .sort((a, b) => a.name.localeCompare(b.name));
      //!Implementacja algorytmu sortującego
      //Tutaj szukamy która kolumna jest sortowana
      const key = Object.keys(sorting).find((x) => {
        return sorting[x as keyof SortingOfClasses] !== "Default";
      });
      //Jeśli żadna nie jest to zwracamy wyniki wyszukiwania
      if (!key) return setClassesData(searchedClasses);
      //Zmienna od typu sortowania np. Ascending | Descending
      const type = sorting[key as keyof SortingOfClasses];
      //lp to specialny przypadek ponieważ nie ma go normalnie w searchedClasses jeśli sortujemy bo od descending to poprostu odwracamy tablice, w innym przypadku zwracamy wyniki wyszukiwania
      if (key === "lp") {
        if (type === "Descending") {
          return setClassesData(searchedClasses.reverse());
        }
        //Tutaj mamy 2 specialny przypadek studentCount ponieważ jest on numerem więc sortujemy po ilości uczniów
      } else if (key === "studentCount") {
        if (type === "Descending") {
          return setClassesData(
            searchedClasses.sort((a, b) =>
              b.students.length > a.students.length ? 1 : -1
            )
          );
        }
        if (type === "Ascending") {
          return setClassesData(
            searchedClasses.sort((a, b) =>
              b.students.length > a.students.length ? -1 : 1
            )
          );
        }
        //Tutaj wykonujemy resztę logiki do pól typu string porównujemy i sortujemy je alfabetycznie.
      } else {
        if (type === "Ascending") {
          return setClassesData(
            searchedClasses.sort((b, a) =>
              String(a[key as keyof SingleClassData]).localeCompare(
                String(b[key as keyof SingleClassData])
              )
            )
          );
        } else {
          return setClassesData(
            searchedClasses.sort((b, a) =>
              String(b[key as keyof SingleClassData]).localeCompare(
                String(a[key as keyof SingleClassData])
              )
            )
          );
        }
      }
    }
    // eslint-disable-next-line
  }, [schoolData?.classes, searchQuery, sorting]);
  return (
    <>
      <div className={`modal ${ModalOptions.isOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h2 className="text-2xl text-center">
            {`Czy napewno chcesz usunąć tą klasę ${ModalOptions.removedClass?.name} ?`}
          </h2>
          <span className=" text-success select-none text text-center justify-center flex mt-4">
            Usuniętą klasę można w każdej chwili przywrócić!
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
          {!isMobile &&
            `Powrót do Panelu ${
              userType === "principals" ? "Dyrektora" : "Nauczyciela"
            }`}
        </Link>
        <SearchButton
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <ClassTable
          classesData={classesData}
          removeClass={removeClass}
          setSorting={setSorting}
          sorting={sorting}
        />
      </div>
    </>
  );
};
