import { AiFillDelete } from "react-icons/ai";
import { FaUserEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "../../../hooks/useMediaQuery";
import {
  defaultSortingStateOfStudents,
  messagesStateModalItf,
  ModalOptionsStudent,
  SortingOfStudents,
  StudentsDataWithoutPassword,
} from "../StudentsView";
import {AiFillMessage} from 'react-icons/ai'

type SortTableParameters =
  | "lp"
  | "firstName"
  | "lastName"
  | "class"
  | "gender"
  | "email";
interface StudentsTableProps {
  studentsData: StudentsDataWithoutPassword;
  setModalOptions: React.Dispatch<React.SetStateAction<ModalOptionsStudent>>;
  setMessagesModal: React.Dispatch<React.SetStateAction<messagesStateModalItf>>
  setSorting: React.Dispatch<React.SetStateAction<SortingOfStudents>>;
  sorting: SortingOfStudents;
}
export const StudentsTable: React.FC<StudentsTableProps> = ({
  studentsData,
  setModalOptions,
  setMessagesModal,
  setSorting,
  sorting,
}) => {
  const navigate = useNavigate();
  const hideEmail = useMediaQuery("(max-width:1000px)");
  const hideGenderLP = useMediaQuery("(max-width:660px)");
  const hideClass = useMediaQuery("(max-width:480px)");
  const hideDelete = useMediaQuery("(max-width:400px)");
  function sortTable(type: SortTableParameters) {
    if (type === "lp") {
      if (sorting[type] === "Default") {
        setSorting(() => {
          return { ...defaultSortingStateOfStudents, [type]: "Descending" };
        });
      } else {
        setSorting(defaultSortingStateOfStudents);
      }
    } else {
      if (sorting[type] === "Descending") {
        setSorting(() => {
          return { ...defaultSortingStateOfStudents, [type]: "Ascending" };
        });
      } else if (sorting[type] === "Ascending") {
        setSorting(defaultSortingStateOfStudents);
      } else {
        setSorting(() => {
          return { ...defaultSortingStateOfStudents, [type]: "Descending" };
        });
      }
    }
  }
  return (
    <table className="table table-zebra mt-4  w-full text-center ">
      <thead>
        <tr className="first:cursor-pointer">
          {!hideGenderLP && (
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
          {!hideClass && (
            <th
              className={`hover:brightness-125 rounded-xl ${
                sorting.class !== "Default" && "brightness-150"
              }`}
              onClick={() => sortTable("class")}
            >
              Klasa
            </th>
          )}
          {!hideGenderLP && (
            <th
              className={`hover:brightness-125 rounded-xl ${
                sorting.gender !== "Default" && "brightness-150"
              }`}
              onClick={() => sortTable("gender")}
            >
              Płeć
            </th>
          )}
          {!hideEmail && (
            <th
              className={`hover:brightness-125 rounded-xl ${
                sorting.email !== "Default" && "brightness-150"
              }`}
              onClick={() => sortTable("email")}
            >
              Email
            </th>
          )}
          <th className="cursor-default"></th>
        </tr>
      </thead>
      <tbody>
        {studentsData.map((x, index) => {
          return (
            <tr className="hover:brightness-125 cursor-pointer" key={x.email}>
              {!hideGenderLP && (
                <td>
                  {" "}
                  {sorting.lp === "Default"
                    ? index + 1
                    : sorting.lp === "Descending"
                    ? studentsData.length - index
                    : index + 1}
                </td>
              )}
              <td>{x.lastName}</td>
              <td>{x.firstName}</td>
              {!hideClass && <td>{x.class}</td>}
              {!hideGenderLP && <td>{x.gender}</td>}
              {!hideEmail && <td>{x.email}</td>}
              <td>
                <button
                  className="btn btn-square btn-info btn-sm "
                  onClick={() => setMessagesModal({
                    isOpen: true,
                    reciever: x
                  })}
                >
                  <AiFillMessage size={20} />
                </button>
                <button
                  className="btn btn-square btn-warning btn-sm ml-2"
                  onClick={() => navigate(`/students/${x.email.split("@")[0]}`)}
                >
                  <FaUserEdit size={20} />
                </button>
                {!hideDelete && (
                  <button
                    className="btn btn-square btn-error btn-sm ml-2"
                    onClick={() => {
                      setModalOptions({ isOpen: true, removedStudent: x });
                    }}
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
