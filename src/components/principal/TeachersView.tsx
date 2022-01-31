import { useEffect, useState } from "react";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../redux/store";
import { SingleTeacherData } from "../../utils/interfaces";
import { omit } from "lodash";
import { TeachersTable } from "./teachers/TeachersTable";
import { SearchButton } from "../searchButton/SearchButton";
import { RemoveTeacherModal } from "./teachers/RemoveTeacherModal";
import useMediaQuery from "../../hooks/useMediaQuery";
export type TeachersDataWithoutPassword = Omit<SingleTeacherData, "password">[];
export interface ModalOptionsTeachers {
  isOpen: boolean;
  removedTeacher: Omit<SingleTeacherData, "password"> | null;
}
export const TeachersView: React.FC = () => {
  const [teachersData, setTeachersData] = useState<TeachersDataWithoutPassword>(
    []
  );
  const [ModalOption, setModalOptions] = useState<ModalOptionsTeachers>({
    isOpen: false,
    removedTeacher: null,
  });
  const isMobile = useMediaQuery("(max-width:768px)");
  const [searchQuery, setsearchQuery] = useState<string>("");
  const state = useSelector((state: RootState) => state.principal);
  useEffect(() => {
    if (state.schoolData?.teachers) {
      const TeachersDataWithoutPassword = Object.values(
        state.schoolData.teachers
      ).map((x) => {
        let newX;
        if (x.classTeacher === "") {
          newX = { ...x, classTeacher: "Brak klasy" };
        }
        return omit(newX ? newX : x, ["password"]);
      });
      const searchedClasses = TeachersDataWithoutPassword.filter((x) => {
        const keyed = Object.values(x).filter((x) => typeof x === "string");
        return keyed.some((v) =>
          v.toString().toLowerCase().includes(searchQuery.toLowerCase())
        );
      }).sort((a, b) => (b.lastName < a.lastName ? 1 : -1));
      setTeachersData(searchedClasses);
    }
  }, [state.schoolData?.teachers, searchQuery]);
  return (
    <>
      <RemoveTeacherModal
        ModalOptions={ModalOption}
        setModalOptions={setModalOptions}
      />
      <section className="card bg-base-200 px-8 py-4 relative">
        <Link to="/" className="flex w-max items-center mb-2 gap-2">
          <BsFillArrowLeftCircleFill
            className={`transition-all hover:-translate-x-1.5 duration-300 text-2xl`}
          />
          {!isMobile && "Powrót do Panelu Dyrektora"}
        </Link>
        <header className="flex justify-center flex-col items-center gap-4">
          <h2 className="text-primary text-2xl text-center">
            Lista Nauczycieli
          </h2>
          <SearchButton
            searchQuery={searchQuery}
            setSearchQuery={setsearchQuery}
          />
        </header>
        <TeachersTable
          teachersData={teachersData}
          setModalOptions={setModalOptions}
        />
      </section>
    </>
  );
};
