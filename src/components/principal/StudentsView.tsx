import { omit } from "lodash";
import { useEffect, useState } from "react";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useMediaQuery from "../../hooks/useMediaQuery";
import { RootState } from "../../redux/store";
import {
  messagesStateModalItf,
  SingleStudentDataFromFirebase,
  SortingOptions,
} from "../../utils/interfaces";
import { Modal as MessagesModal } from "../messages/Modal";
import { SearchButton } from "../searchButton/SearchButton";
import { RemoveStudentModal } from "./students/RemoveStudentModal";
import { StudentsTable } from "./students/StudentsTable";


export type StudentsDataWithoutPassword = Omit<
  SingleStudentDataFromFirebase,
  "password"
>[];
export interface ModalOptionsStudent {
  isOpen: boolean;
  removedStudent: Omit<SingleStudentDataFromFirebase, "password"> | null;
}

export interface SortingOfStudents {
  lp: SortingOptions;
  firstName: SortingOptions;
  lastName: SortingOptions;
  class: SortingOptions;
  gender: SortingOptions;
  email: SortingOptions;
}
export const defaultSortingStateOfStudents: SortingOfStudents = {
  lp: "Default",
  firstName: "Default",
  lastName: "Default",
  class: "Default",
  email: "Default",
  gender: "Default",
};
export const StudentsView = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [studentsData, setStudentsData] = useState<StudentsDataWithoutPassword>(
    []
  );

  const [messageModal, setMessageModal] = useState<messagesStateModalItf>({
    isOpen: false,
    reciever: null
  })

  const [ModalOption, setModalOptions] = useState<ModalOptionsStudent>({
    isOpen: false,
    removedStudent: null,
  });
  const [sorting, setSorting] = useState<SortingOfStudents>(
    defaultSortingStateOfStudents
  );
  const isMobile = useMediaQuery("(max-width:768px)");

  const schoolData = useSelector(
    (state: RootState) => state.schoolData.schoolData
  );

  useEffect(() => {
    if (schoolData?.students) {
      const StudentsDataWithoutPassword = Object.values(schoolData.students)
        .map((x) => {
          let newX;
          if (x.class === "") {
            newX = { ...x, class: "Brak klasy" };
          }
          return omit(newX ? newX : x, ["password"]);
        })
        .filter((x) => x.isActive !== false);
      const searchedStudents = StudentsDataWithoutPassword.filter((x) => {
        const keyed = Object.values(x).filter((x) => typeof x === "string");
        return keyed.some((v) =>
          v.toString().toLowerCase().includes(searchQuery.toLowerCase())
        );
      }).sort((a, b) => a.lastName.localeCompare(b.lastName));
      //! Implementacja sortowania taka sama jak w classesView
      const key = Object.keys(sorting).find((x) => {
        return sorting[x as keyof SortingOfStudents] !== "Default";
      });
      if (!key) return setStudentsData(searchedStudents);
      const type = sorting[key as keyof SortingOfStudents];
      if (key === "lp") {
        if (type === "Descending") {
          return setStudentsData(searchedStudents.reverse());
        }
      } else {
        if (type === "Ascending") {
          return setStudentsData(
            searchedStudents.sort((b, a) =>
              String(
                a[key as keyof Omit<SingleStudentDataFromFirebase, "password">]
              ).localeCompare(
                String(
                  b[
                    key as keyof Omit<SingleStudentDataFromFirebase, "password">
                  ]
                )
              )
            )
          );
        } else {
          return setStudentsData(
            searchedStudents.sort((b, a) =>
              String(
                b[key as keyof Omit<SingleStudentDataFromFirebase, "password">]
              ).localeCompare(
                String(
                  a[
                    key as keyof Omit<SingleStudentDataFromFirebase, "password">
                  ]
                )
              )
            )
          );
        }
      }
    }
  }, [schoolData?.students, searchQuery, sorting]);
  return (
    <>
      <RemoveStudentModal
        ModalOptions={ModalOption}
        setModalOptions={setModalOptions}
      />
      <MessagesModal 
        modalOptions={messageModal}
        setModalOptions={setMessageModal}
      />
      <section className="card bg-base-200 px-8 py-4 relative overflow-x-auto">
        <Link to="/" className="flex w-max items-center mb-2 gap-2">
          <BsFillArrowLeftCircleFill
            className={`transition-all hover:-translate-x-1.5 duration-300 text-2xl`}
          />
          {!isMobile && "Powrót do Panelu Dyrektora"}
        </Link>
        <header className="flex justify-center flex-col items-center gap-4">
          <h2 className="text-primary text-2xl text-center">Lista Uczniów</h2>
          <SearchButton
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </header>
        <StudentsTable
          studentsData={studentsData}
          setModalOptions={setModalOptions}
          setMessagesModal={setMessageModal}
          sorting={sorting}
          setSorting={setSorting}
        />
      </section>
    </>
  );
};
