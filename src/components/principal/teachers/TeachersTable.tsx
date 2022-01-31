import { AiFillDelete } from "react-icons/ai";
import { FaUserEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "../../../hooks/useMediaQuery";
import {
  ModalOptionsTeachers,
  TeachersDataWithoutPassword,
} from "../TeachersView";
interface TeachersTableProps {
  teachersData: TeachersDataWithoutPassword;
  setModalOptions: React.Dispatch<React.SetStateAction<ModalOptionsTeachers>>;
}
export const TeachersTable: React.FC<TeachersTableProps> = ({
  teachersData,
  setModalOptions,
}) => {
  const hideEmailGender = useMediaQuery("(max-width:1000px)");
  const hideClassSubject = useMediaQuery("(max-width:768px)");
  const hideLPDelete = useMediaQuery("(max-width:430px)");
  const navigate = useNavigate();
  return (
    <table className="table table-zebra mt-4  w-full text-center">
      <thead>
        <tr>
          {!hideLPDelete && <th>LP.</th>}
          <th>Nazwisko</th>
          <th>Imię</th>
          {!hideEmailGender && <th>Email</th>}
          {!hideClassSubject && <th>Klasa</th>}
          {!hideClassSubject && <th>Przedmiot</th>}
          {!hideEmailGender && <th>Płeć</th>}
          <th></th>
        </tr>
      </thead>
      <tbody>
        {teachersData.map((x, index) => {
          return (
            <tr className="hover:brightness-125 cursor-pointer" key={x.email}>
              {!hideLPDelete && <td>{index + 1}</td>}
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
