import { AiFillDelete } from "react-icons/ai";
import { FaUserEdit } from "react-icons/fa";
import { SingleStudentDataFromFirebase } from "../../utils/interfaces";
interface SingleClassTableRowProps {
  student: SingleStudentDataFromFirebase;
  number: number;
  isMobile: boolean;
  isExtraSmallDevice: boolean;
  showDelete: boolean;
}

export const SingleClassTableRow: React.FC<SingleClassTableRowProps> = ({
  student,
  number,
  isMobile,
  isExtraSmallDevice,
  showDelete,
}) => {
  return !isMobile ? (
    <tr>
      <th className="w-1">{number}</th>
      <td>{student.lastName}</td>
      <td>{student.firstName}</td>
      <td>{student.email}</td>
      <td>{student.birth}</td>
      <td>{student.pesel}</td>
      <td>4 dni temu</td>
      <td className="w-1">
        <button className="btn btn-square btn-warning btn-sm">
          <FaUserEdit size={20} />
        </button>
        <button className="btn btn-square btn-error btn-sm ml-2">
          <AiFillDelete size={20} />
        </button>
      </td>
    </tr>
  ) : (
    <tr>
      {!isExtraSmallDevice && <th className="w-1">{number}</th>}
      <td>{student.lastName}</td>
      <td>{student.firstName}</td>
      {!isExtraSmallDevice && <td>{student.email}</td>}
      <td className="w-1">
        <button className="btn btn-square btn-warning btn-sm">
          <FaUserEdit size={20} />
        </button>
        {!showDelete && (
          <button className="btn btn-square btn-error btn-sm ml-2">
            <AiFillDelete size={20} />
          </button>
        )}
      </td>
    </tr>
  );
};
