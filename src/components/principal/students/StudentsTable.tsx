import { AiFillDelete } from "react-icons/ai";
import { FaUserEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "../../../hooks/useMediaQuery";
import {
  ModalOptionsStudent,
  StudentsDataWithoutPassword,
} from "../StudentsView";

interface StudentsTableProps {
  studentsData: StudentsDataWithoutPassword;
  setModalOptions: React.Dispatch<React.SetStateAction<ModalOptionsStudent>>;
}
export const StudentsTable: React.FC<StudentsTableProps> = ({
  studentsData,
  setModalOptions,
}) => {
  const navigate = useNavigate();
  const hideEmail = useMediaQuery("(max-width:1000px)");
  const hideGenderLP = useMediaQuery("(max-width:660px)");
  const hideClass = useMediaQuery("(max-width:480px)");
  const hideDelete = useMediaQuery("(max-width:400px)");
  return (
    <table className="table table-zebra mt-4  w-full text-center ">
      <thead>
        <tr>
          {!hideGenderLP && <th>LP.</th>}
          <th>Nazwisko</th>
          <th>Imię</th>
          {!hideClass && <th>Klasa</th>}
          {!hideGenderLP && <th>Płeć</th>}
          {!hideEmail && <th>Email</th>}
          <th></th>
        </tr>
      </thead>
      <tbody>
        {studentsData.map((x, index) => {
          return (
            <tr className="hover:brightness-125 cursor-pointer" key={x.email}>
              {!hideGenderLP && <td>{index + 1}</td>}
              <td>{x.lastName}</td>
              <td>{x.firstName}</td>
              {!hideClass && <td>{x.class}</td>}
              {!hideGenderLP && <td>{x.gender}</td>}
              {!hideEmail && <td>{x.email}</td>}
              <td>
                <button
                  className="btn btn-square btn-warning btn-sm "
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
