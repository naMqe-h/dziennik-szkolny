import { AiFillDelete } from "react-icons/ai";
import { FaUserEdit } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "../../../hooks/useMediaQuery";
import { RootState } from "../../../redux/store";
import { SingleClassData } from "../../../utils/interfaces";
import { defaultSortingState, SortingOfClasses } from "../ClassesView";
type SortTableParameters =
  | "lp"
  | "name"
  | "classTeacher"
  | "profile"
  | "studentCount";
interface ClassTableProps {
  classesData: SingleClassData[];
  setSorting: React.Dispatch<React.SetStateAction<SortingOfClasses>>;
  sorting: SortingOfClasses;
  removeClass: (
    removedClassData: SingleClassData,
    wasAccepted?: boolean
  ) => void;
}
export const ClassTable: React.FC<ClassTableProps> = ({
  classesData,
  removeClass,
  setSorting,
  sorting,
}) => {
  const userType = useSelector((state: RootState) => state.userType.userType);
  function sortTable(type: SortTableParameters) {
    if (type === "lp") {
      if (sorting[type] === "Default") {
        setSorting(() => {
          return { ...defaultSortingState, [type]: "Descending" };
        });
      } else {
        setSorting(defaultSortingState);
      }
    } else {
      if (sorting[type] === "Descending") {
        setSorting(() => {
          return { ...defaultSortingState, [type]: "Ascending" };
        });
      } else if (sorting[type] === "Ascending") {
        setSorting(defaultSortingState);
      } else {
        setSorting(() => {
          return { ...defaultSortingState, [type]: "Descending" };
        });
      }
    }
  }
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:750px)");
  return (
    <table className="table table-zebra w-full text-center mt-4">
      <thead>
        <tr className="first:cursor-pointer">
          {isMobile ? (
            <>
              {/* <th
                className={`hover:brightness-125 rounded-xl ${
                  sorting.lp !== "Default" && "brightness-150"
                }`}
                onClick={() => sortTable("lp")}
              >
                LP
              </th> */}
              <th
                className={`hover:brightness-125 rounded-xl ${
                  sorting.name !== "Default" && "brightness-150"
                }`}
                onClick={() => sortTable("name")}
              >
                Nazwa
              </th>
              <th
                className={`hover:brightness-125 rounded-xl ${
                  sorting.classTeacher !== "Default" && "brightness-150"
                }`}
                onClick={() => sortTable("classTeacher")}
              >
                Wychowawca
              </th>
              <th className={`hover:brightness-125 rounded-xl cursor-default`}>
                Edytuj
              </th>
            </>
          ) : (
            <>
              <th
                className={`hover:brightness-125 rounded-xl ${
                  sorting.lp !== "Default" && "brightness-150"
                }`}
                onClick={() => sortTable("lp")}
              >
                LP
              </th>
              <th
                className={`hover:brightness-125 rounded-xl ${
                  sorting.name !== "Default" && "brightness-150"
                }`}
                onClick={() => sortTable("name")}
              >
                Nazwa
              </th>
              <th
                className={`hover:brightness-125 rounded-xl ${
                  sorting.classTeacher !== "Default" && "brightness-150"
                }`}
                onClick={() => sortTable("classTeacher")}
              >
                Wychowawca
              </th>
              <th
                className={`hover:brightness-125 rounded-xl ${
                  sorting.profile !== "Default" && "brightness-150"
                }`}
                onClick={() => sortTable("profile")}
              >
                Profil
              </th>
              <th
                className={`hover:brightness-125 rounded-xl ${
                  sorting.studentCount !== "Default" && "brightness-150"
                }`}
                onClick={() => sortTable("studentCount")}
              >
                Ilośc uczniów
              </th>
              <th className="cursor-default">Edytuj</th>
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {isMobile
          ? classesData.map((item, index) => {
              return (
                <tr
                  className="hover:brightness-125 cursor-pointer"
                  key={item.classTeacher}
                  onClick={() => navigate(`/class/${item.name}/info`)}
                >
                  <td>{item.name}</td>
                  <td>{item.classTeacher}</td>
                  <td>
                    {
                      <button
                        className="btn btn-square btn-warning btn-sm "
                        onClick={() => navigate(`/class/${item.name}/info`)}
                      >
                        <FaUserEdit size={20} />
                      </button>
                    }
                  </td>
                </tr>
              );
            })
          : classesData.map((item, index) => {
              return (
                <tr
                  className="hover:brightness-125 cursor-pointer"
                  key={item.classTeacher}
                >
                  <td>
                    {sorting.lp === "Default"
                      ? index + 1
                      : sorting.lp === "Descending"
                      ? classesData.length - index
                      : index + 1}
                  </td>
                  <td>{item.name}</td>
                  <td>{item.classTeacher}</td>
                  <td>{item.profile}</td>
                  <td>{item.students.length}</td>
                  <td>
                    <button
                      className="btn btn-square btn-warning btn-sm "
                      onClick={() => navigate(`/class/${item.name}/info`)}
                    >
                      <FaUserEdit size={20} />
                    </button>
                    {userType === "principals" && (
                      <button
                        className="btn btn-square btn-error btn-sm ml-2"
                        onClick={() => {
                          removeClass(item, false);
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
