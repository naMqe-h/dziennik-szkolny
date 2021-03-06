import { AiFillDelete, AiFillMessage } from "react-icons/ai";
import { FaUserEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  messagesStateModalItf,
  SingleStudentDataFromFirebase,
  userType,
} from "../../utils/interfaces";
interface SingleClassTableRowProps {
  student: SingleStudentDataFromFirebase;
  number: number;
  isMobile: boolean;
  isExtraSmallDevice: boolean;
  showDelete: boolean;
  userType: userType;
  setMessagesModal: React.Dispatch<React.SetStateAction<messagesStateModalItf>>
}

export const SingleClassTableRow: React.FC<SingleClassTableRowProps> = ({
  student,
  number,
  isMobile,
  isExtraSmallDevice,
  showDelete,
  userType,
  setMessagesModal
}) => {
  return !isMobile ? (
    <tr>
      <th className="w-1">{number}</th>
      <td>{student.lastName}</td>
      <td>{student.firstName}</td>
      <td>{student.email}</td>
      <td>{student.birth}</td>
      <td>{student.pesel}</td>
      <td className="w-1">
      <button
          className="btn btn-square btn-info btn-sm "
          onClick={() => setMessagesModal({
            isOpen: true,
            reciever: student
          })}
        >
          <AiFillMessage size={20} />
      </button>
      {userType === "principals" && (
        <>
          <Link to={`/students/${student.email.split("@")[0]}`}>
            <button className="btn btn-square btn-warning btn-sm ml-2">
              <FaUserEdit size={20} />
            </button>
          </Link>
          <button className="btn btn-square btn-error btn-sm ml-2">
            <AiFillDelete size={20} />
          </button>
        </>
      )}
      </td>
    </tr>
  ) : (
    <tr>
      {!isExtraSmallDevice && <th className="w-1">{number}</th>}
      <td>{student.lastName}</td>
      <td>{student.firstName}</td>
      {!isExtraSmallDevice && <td>{student.email}</td>}
      <td className="w-1">
        <button
          className="btn btn-square btn-info btn-sm"
          onClick={() => setMessagesModal({
            isOpen: true,
            reciever: student
          })}
        >
          <AiFillMessage size={20} />
        </button>
      {userType === "principals" && (
          <>
            <Link to={`/students/${student.email.split("@")[0]}`}>
              <button className="btn btn-square btn-warning btn-sm ml-2">
                <FaUserEdit size={20} />
              </button>
            </Link>
            {!showDelete && (
              <button className="btn btn-square btn-error btn-sm ml-2">
                <AiFillDelete size={20} />
              </button>
            )}
          </>
      )}
      </td>
    </tr>
  );
};
