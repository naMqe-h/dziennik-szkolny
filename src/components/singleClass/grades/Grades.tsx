import { Dispatch, SetStateAction } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  SingleStudentDataFromFirebase as SSDFF,
  StudentsDataFromFirebase,
  termType,
} from "../../../utils/interfaces";
import { Modal } from "./add/Modal";
import { SingleStudentGradeRow } from "./SingleStudentGradeRow";
import { GradesTable } from "./teacherView/GradesTable";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { useEffect, useState } from "react"

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

interface GradesProps {
  studentsInfo: StudentsDataFromFirebase;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  term: termType;
  currentClass: string | undefined
}

export const Grades: React.FC<GradesProps> = ({ studentsInfo, isOpen, setIsOpen, term, currentClass}) => {

  type gradesType = {[key: number]: number} 
  const initialGrades:gradesType = {
    '1': 0,
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0,
    '6': 0,
  }

  const tempStudents = Object.values(studentsInfo);
  const students = tempStudents.sort((a: SSDFF, b: SSDFF) =>
    a.lastName.localeCompare(b.lastName, "pl")
  );
  const userType = useSelector((state: RootState) => state.userType.userType);
  const classTeacher = useSelector((state: RootState) => state.teacher.data?.classTeacher)

  const [grades, setGrades] = useState<gradesType>(initialGrades);
  
  const GradesLabels = Object.keys(grades);

  const [gradesGraphData, setGradesGraphData] = useState({
    labels: GradesLabels,
    datasets: [
      {
        label: 'Oceny',
        data: Object.values(grades),
        backgroundColor: 'rgba(41, 186, 255, 0.5)',
      },
    ],
  })

  const GradesOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Oceny',
      },
    },
  };

  useEffect(() => {
    let tempGrades = initialGrades;
    
    Object.values(studentsInfo).map((student) => Object.values(student.grades).map((item) => item.map((grade) => grade.grade)).flat().map((studentGrade) => {
      switch(studentGrade){
          case 1: tempGrades[1]++; break;
          case 2: tempGrades[2]++; break;
          case 3: tempGrades[3]++; break;
          case 4: tempGrades[4]++; break;
          case 5: tempGrades[5]++; break;
          case 6: tempGrades[6]++; break;
      }
    }))
    setGrades(tempGrades)
  }, [studentsInfo])

  useEffect(() => {
    setGradesGraphData({
      labels: GradesLabels,
      datasets: [
        {
          label: 'Oceny',
          data: Object.values(grades),
          backgroundColor: 'rgba(41, 186, 255, 0.5)',
        },
      ],
    })
  }, [grades])
  

  return (
    <>
      <Modal
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        students={students}
        studentsInfo={studentsInfo}
      />
      <div className="w-full flex flex-col items-center justify-center mb-4">
                <div>
                    <Bar data={gradesGraphData} options={GradesOptions} />
                </div>
            </div>
      <div className="overflow-x-auto">
        {userType === "teachers" && classTeacher !== currentClass as string ? (
          <GradesTable students={students} term={term} />
        ) : (
          students.map((student, index) => (
            <SingleStudentGradeRow
              key={student.email}
              student={student}
              number={index + 1}
              term={term}
            />
          ))
        )}
          
      </div>
    </>
  );
};
