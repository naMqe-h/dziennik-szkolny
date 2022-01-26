import { useNavigate } from "react-router-dom";
import useMediaQuery from "../../../hooks/useMediaQuery";
import { SingleClassData } from "../../../utils/interfaces";
interface ClassTableProps {
  classesData: SingleClassData[];
  findClassTeacherName: (email: string) => string;
  removeClass: (
    removedClassData: SingleClassData,
    wasAccepted?: boolean
  ) => void;
}
export const ClassTable: React.FC<ClassTableProps> = ({
  classesData,
  findClassTeacherName,
  removeClass,
}) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");
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
                  onClick={() => navigate(`classes/${item.name}`)}
                >
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{findClassTeacherName(item.classTeacher)}</td>
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
                      className="btn btn-primary"
                      onClick={() => navigate(`/class/${item.name}/info`)}
                    >
                      Wyświetl
                    </button>
                    <button
                      className="btn btn-error ml-4"
                      onClick={() => {
                        removeClass(item, false);
                      }}
                    >
                      Usuń
                    </button>
                  </td>
                </tr>
              );
            })}
      </tbody>
    </table>
  );
};
