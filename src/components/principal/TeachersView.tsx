import { useEffect, useState } from "react";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../redux/store";
import { SingleTeacherData, SortingOptions } from "../../utils/interfaces";
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
export interface SortingOfTeachers {
  lp: SortingOptions;
  firstName: SortingOptions;
  lastName: SortingOptions;
  classTeacher: SortingOptions;
  email: SortingOptions;
  gender: SortingOptions;
  subject: SortingOptions;
}
export const defaultSortingStateOfTeachers: SortingOfTeachers = {
  lp: "Default",
  firstName: "Default",
  lastName: "Default",
  classTeacher: "Default",
  email: "Default",
  gender: "Default",
  subject: "Default",
};
export const TeachersView: React.FC = () => {
  const [teachersData, setTeachersData] = useState<TeachersDataWithoutPassword>(
    []
  );
  const [ModalOption, setModalOptions] = useState<ModalOptionsTeachers>({
    isOpen: false,
    removedTeacher: null,
  });
  const [sorting, setSorting] = useState<SortingOfTeachers>(
    defaultSortingStateOfTeachers
  );
  const isMobile = useMediaQuery("(max-width:768px)");
  const [searchQuery, setsearchQuery] = useState<string>("");
  const schoolData = useSelector(
    (state: RootState) => state.schoolData.schoolData
  );

  useEffect(() => {
    if (schoolData?.teachers) {
      const TeachersDataWithoutPassword = Object.values(
        schoolData.teachers
      ).map((x) => {
        let newX;
        if (x.classTeacher === "") {
          newX = { ...x, classTeacher: "Brak klasy" };
        }
        return omit(newX ? newX : x, ["password"]);
      }).filter(x=>x.isActive!==false);
      const saerchedTeachers = TeachersDataWithoutPassword.filter((x) => {
        const keyed = Object.values(x).filter((x) => typeof x === "string");
        return keyed.some((v) =>
          v.toString().toLowerCase().includes(searchQuery.toLowerCase())
        );
      }).sort((a, b) => a.lastName.localeCompare(b.lastName));
      //! Implementacja sortowania taka sama jak w classesView
      const key = Object.keys(sorting).find((x) => {
        return sorting[x as keyof SortingOfTeachers] !== "Default";
      });
      if (!key) setTeachersData(saerchedTeachers);
      const type = sorting[key as keyof SortingOfTeachers];
      if (key == "lp") {
        if (type === "Descending") {
          return setTeachersData(saerchedTeachers.reverse());
        }
      } else {
        if (type === "Ascending") {
          return setTeachersData(
            saerchedTeachers.sort((b, a) =>
              String(
                a[key as keyof Omit<SingleTeacherData, "password">]
              ).localeCompare(
                String(b[key as keyof Omit<SingleTeacherData, "password">])
              )
            )
          );
        } else {
          return setTeachersData(
            saerchedTeachers.sort((b, a) =>
              String(
                b[key as keyof Omit<SingleTeacherData, "password">]
              ).localeCompare(
                String(a[key as keyof Omit<SingleTeacherData, "password">])
              )
            )
          );
        }
      }
    }
  }, [schoolData?.teachers, searchQuery, sorting]);
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
          setSorting={setSorting}
          sorting={sorting}
        />
      </section>
    </>
  );
};
