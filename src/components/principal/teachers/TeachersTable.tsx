import { AiFillDelete } from "react-icons/ai";
import { FaUserEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "../../../hooks/useMediaQuery";
import {
  defaultSortingStateOfTeachers,
  ModalOptionsTeachers,
  SortingOfTeachers,
  TeachersDataWithoutPassword,
} from "../TeachersView";
type SortTableParameters =
  | "lp"
  | "firstName"
  | "lastName"
  | "classTeacher"
  | "gender"
  | "email"
  | "subject";
interface TeachersTableProps {
  teachersData: TeachersDataWithoutPassword;
  setModalOptions: React.Dispatch<React.SetStateAction<ModalOptionsTeachers>>;
  sorting: SortingOfTeachers;
  setSorting: React.Dispatch<React.SetStateAction<SortingOfTeachers>>;
}
export const TeachersTable: React.FC<TeachersTableProps> = ({
  teachersData,
  setModalOptions,
  sorting,
  setSorting,
}) => {
  const hideEmailGender = useMediaQuery("(max-width:1000px)");
  const hideClassSubject = useMediaQuery("(max-width:768px)");
  const hideLPDelete = useMediaQuery("(max-width:430px)");
  const navigate = useNavigate();
  function sortTable(type: SortTableParameters) {
    if (type === "lp") {
      if (sorting[type] === "Default") {
        setSorting(() => {
          return { ...defaultSortingStateOfTeachers, [type]: "Descending" };
        });
      } else {
        setSorting(defaultSortingStateOfTeachers);
      }
    } else {
      if (sorting[type] === "Descending") {
        setSorting(() => {
          return { ...defaultSortingStateOfTeachers, [type]: "Ascending" };
        });
      } else if (sorting[type] === "Ascending") {
        setSorting(defaultSortingStateOfTeachers);
      } else {
        setSorting(() => {
          return { ...defaultSortingStateOfTeachers, [type]: "Descending" };
        });
      }
    }
  }
  return (
    <table className="table table-zebra mt-4  w-full text-center">
      <thead>
        <tr className="first:cursor-pointer">
          {!hideLPDelete && (
            <th
              className={`hover:brightness-125 rounded-xl ${
                sorting.lp !== "Default" && "brightness-150"
              }`}
              onClick={() => sortTable("lp")}
            >
              LP.
            </th>
          )}
          <th
            className={`hover:brightness-125 rounded-xl ${
              sorting.lastName !== "Default" && "brightness-150"
            }`}
            onClick={() => sortTable("lastName")}
          >
            Nazwisko
          </th>
          <th
            className={`hover:brightness-125 rounded-xl ${
              sorting.firstName !== "Default" && "brightness-150"
            }`}
            onClick={() => sortTable("firstName")}
          >
            Imię
          </th>
          {!hideEmailGender && (
            <th
              className={`hover:brightness-125 rounded-xl ${
                sorting.email !== "Default" && "brightness-150"
              }`}
              onClick={() => sortTable("email")}
            >
              Email
            </th>
          )}
          {!hideClassSubject && (
            <th
              className={`hover:brightness-125 rounded-xl ${
                sorting.classTeacher !== "Default" && "brightness-150"
              }`}
              onClick={() => sortTable("classTeacher")}
            >
              Klasa
            </th>
          )}
          {!hideClassSubject && (
            <th
              className={`hover:brightness-125 rounded-xl ${
                sorting.subject !== "Default" && "brightness-150"
              }`}
              onClick={() => sortTable("subject")}
            >
              Przedmiot
            </th>
          )}
          {!hideEmailGender && (
            <th
              className={`hover:brightness-125 rounded-xl ${
                sorting.gender !== "Default" && "brightness-150"
              }`}
              onClick={() => sortTable("gender")}
            >
              Płeć
            </th>
          )}
          <th className="cursor-default"></th>
        </tr>
      </thead>
      <tbody>
        {teachersData.map((x, index) => {
          return (
            <tr className="hover:brightness-125 cursor-pointer" key={x.email}>
              {!hideLPDelete && (
                <td>
                  {sorting.lp === "Default"
                    ? index + 1
                    : sorting.lp === "Descending"
                    ? teachersData.length - index
                    : index + 1}
                </td>
              )}
              <td>{x.lastName}</td>
              <td>{x.firstName}</td>
              {!hideEmailGender && <td>{x.email}</td>}
              {!hideClassSubject && (
                <td>{x.classTeacher === "" ? "Brak klasy" : x.classTeacher}</td>
              )}
              {!hideClassSubject && <td>{x.subject}</td>}
              {!hideEmailGender && <td>{x.gender}</td>}
              <td>
                <button
                  className="btn btn-square btn-warning btn-sm "
                  onClick={() => navigate(`/teachers/${x.email.split("@")[0]}`)}
                >
                  <FaUserEdit size={20} />
                </button>
                {!hideLPDelete && (
                  <button
                    className="btn btn-square btn-error btn-sm ml-2"
                    onClick={() =>
                      setModalOptions({ isOpen: true, removedTeacher: x })
                    }
                  >
                    <AiFillDelete size={20} />
                  </button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
