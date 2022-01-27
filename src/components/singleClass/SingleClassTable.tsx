import useMediaQuery from "../../hooks/useMediaQuery";
import {
  SingleStudentDataFromFirebase,
  StudentsDataFromFirebase,
} from "../../utils/interfaces";
import { SingleClassTableRow } from "./SingleClassTableRow";

interface SingleClassTableProps {
  studentsInfo: StudentsDataFromFirebase;
}

export const SingleClassTable: React.FC<SingleClassTableProps> = ({
  studentsInfo,
}) => {
  const tempStudents: SingleStudentDataFromFirebase[] =
    Object.values(studentsInfo);
  const students = tempStudents.sort(
    (a: SingleStudentDataFromFirebase, b: SingleStudentDataFromFirebase) =>
      a.lastName.localeCompare(b.lastName, "pl")
  );
  const isMobile = useMediaQuery("(max-width:1000px)");
  const isExtraSmallDevice = useMediaQuery("(max-width:560px)");
  return (
    <div className="overflow-x-auto">
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
                />
              ))}
            </tbody>
          </>
        )}
      </table>
    </div>
  );
};
