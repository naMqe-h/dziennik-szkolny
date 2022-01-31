import { AiFillDelete } from "react-icons/ai";
import { FaUserEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "../../../hooks/useMediaQuery";
import { SingleClassData } from "../../../utils/interfaces";
interface ClassTableProps {
  classesData: SingleClassData[];
  removeClass: (
    removedClassData: SingleClassData,
    wasAccepted?: boolean
  ) => void;
}
export const ClassTable: React.FC<ClassTableProps> = ({
  classesData,
  removeClass,
}) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:750px)");
  return (
    <table className="table table-zebra w-full text-center ">
      <thead>
        <tr>
          {isMobile ? (
            <>
              <th>LP</th>
              <th>Nazwa</th>
              <th>Wychowawca</th>
            </>
          ) : (
            <>
              <th>LP</th>
              <th>Nazwa</th>
              <th>Wychowawca</th>
              <th>Profil</th>
              <th>Ilośc uczniów</th>
              <th>Edytuj</th>
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
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.classTeacher}</td>
                </tr>
              );
            })
          : classesData.map((item, index) => {
              return (
                <tr
                  className="hover:brightness-125 cursor-pointer"
                  key={item.classTeacher}
                >
                  <td>{index + 1}</td>
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
                    <button
                      className="btn btn-square btn-error btn-sm ml-2"
                      onClick={() => {
                        removeClass(item, false);
                      }}
                    >
                      <AiFillDelete size={20} />
                    </button>
                  </td>
                </tr>
              );
            })}
      </tbody>
    </table>
  );
};
