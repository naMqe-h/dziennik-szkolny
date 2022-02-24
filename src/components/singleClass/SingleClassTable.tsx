import { useState } from "react";
import { useSelector } from "react-redux";
import useMediaQuery from "../../hooks/useMediaQuery";
import { RootState } from "../../redux/store";
import {
  messagesStateModalItf,
  SingleStudentDataFromFirebase,
  StudentsDataFromFirebase,
  userType,
} from "../../utils/interfaces";
import { SingleClassTableRow } from "./SingleClassTableRow";
import { Modal as MessagesModal } from "../messages/Modal";


interface SingleClassTableProps {
  studentsInfo: StudentsDataFromFirebase;
  showDelete: boolean;
}

export const SingleClassTable: React.FC<SingleClassTableProps> = ({
  studentsInfo,
  showDelete,
}) => {
  const userType = useSelector((state: RootState) => state.userType.userType);
  const tempStudents: SingleStudentDataFromFirebase[] =
    Object.values(studentsInfo);
  const students = tempStudents.sort(
    (a: SingleStudentDataFromFirebase, b: SingleStudentDataFromFirebase) =>
      a.lastName.localeCompare(b.lastName, "pl")
  );

  const [messageModal, setMessageModal] = useState<messagesStateModalItf>({
    isOpen: false,
    reciever: null
  })

  const isMobile = useMediaQuery("(max-width:1000px)");
  const isExtraSmallDevice = useMediaQuery("(max-width:560px)");
  
  
  return (
    <div className="overflow-x-auto">
      <MessagesModal 
        modalOptions={messageModal}
        setModalOptions={setMessageModal}
      />
      <table className="table w-full table-zebra text-center">
        {!isMobile ? (
          <>
            <thead>
              <tr>
                <th>Nr</th>
                <th>Nazwisko</th>
                <th>Imię</th>
                <th>Email</th>
                <th>Urodziny</th>
                <th>Pesel</th>
                <th>Ostatnie logowanie</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <SingleClassTableRow
                  key={student.email}
                  student={student}
                  number={index + 1}
                  isMobile={isMobile}
                  isExtraSmallDevice={isExtraSmallDevice}
                  showDelete={showDelete}
                  userType={userType as userType}
                  setMessagesModal={setMessageModal}
                />
              ))}
            </tbody>
          </>
        ) : (
          <>
            <thead>
              <tr>
                {!isExtraSmallDevice && <th>Nr</th>}
                <th>Nazwisko</th>
                <th>Imię</th>
                {!isExtraSmallDevice && <th>Email</th>}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <SingleClassTableRow
                  key={student.email}
                  student={student}
                  number={index + 1}
                  isMobile={isMobile}
                  isExtraSmallDevice={isExtraSmallDevice}
                  showDelete={showDelete}
                  userType={userType as userType}
                  setMessagesModal={setMessageModal}
                />
              ))}
            </tbody>
          </>
        )}
      </table>
    </div>
  );
};
