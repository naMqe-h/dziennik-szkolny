import { omit } from "lodash";
import { useEffect, useState } from "react";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useMediaQuery from "../../hooks/useMediaQuery";
import { RootState } from "../../redux/store";
import { SingleStudentDataFromFirebase } from "../../utils/interfaces";
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
export const StudentsView = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [studentsData, setStudentsData] = useState<StudentsDataWithoutPassword>(
    []
  );
  const [ModalOption, setModalOptions] = useState<ModalOptionsStudent>({
    isOpen: false,
    removedStudent: null,
  });
  const isMobile = useMediaQuery("(max-width:768px)");

  const state = useSelector((state: RootState) => state.principal);
  useEffect(() => {
    if (state.schoolData?.students) {
      const StudentsDataWithoutPassword = Object.values(
        state.schoolData.students
      ).map((x) => {
        let newX;
        if (x.class === "") {
          newX = { ...x, class: "Brak klasy" };
        }
        return omit(newX ? newX : x, ["password"]);
      });
      const searchedClasses = StudentsDataWithoutPassword.filter((x) => {
        const keyed = Object.values(x).filter((x) => typeof x === "string");
        return keyed.some((v) =>
          v.toString().toLowerCase().includes(searchQuery.toLowerCase())
        );
      }).sort((a, b) => (b.lastName < a.lastName ? 1 : -1));
      setStudentsData(searchedClasses);
    }
  }, [state.schoolData?.students, searchQuery]);
  return (
    <>
      <RemoveStudentModal
        ModalOptions={ModalOption}
        setModalOptions={setModalOptions}
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
        />
      </section>
    </>
  );
};
