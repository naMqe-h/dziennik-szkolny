import { Bar, Pie } from "react-chartjs-2";
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
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { CombinedSchoolDataFromFirebase } from "../../../utils/interfaces";
import { useEffect, useState } from "react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export const Graphs: React.FC = () => {

    type gradesType = {[key: number]: number} 

    const schoolData = useSelector((state: RootState) => state.schoolData.schoolData as CombinedSchoolDataFromFirebase)

    const {
        classesCount = 0,
        studentsCount = 0,
        teachersCount = 0,
      } = schoolData.information;


    const initialGrades:gradesType = {
            '1': 0,
            '2': 0,
            '3': 0,
            '4': 0,
            '5': 0,
            '6': 0,
    }

    const [grades, setGrades] = useState<gradesType>(initialGrades);
    const GradesLabels = Object.keys(grades);
    const [gradesGraphData, setGradesGraphData] = useState({
        labels: GradesLabels,
        datasets: [
          {
            label: 'Oceny',
            data: Object.values(grades),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ],
      })
    const [frequency, setFrequency] = useState([0,0])
    const [frequencyGraphData, setFrequencyGraphData] = useState({
        labels: ['Obecności', 'Nieobecności'],
        datasets: [
          {
            label: '% Frekwencji',
            data: frequency,
            backgroundColor: ['rgba(27, 162, 49, 0.5)', 'rgba(220, 40, 40, 0.5)'],
            borderColor: ['transparent']
          },
        ],
      })

    useEffect(() => {
        let tempGrades = initialGrades;

        Object.values(schoolData.students).map((student) => Object.values(student.grades).map((item) => item.map((grade) => grade.grade)).flat().map((studentGrade) => {
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
    }, [schoolData.students])

    useEffect(() => {
      setGradesGraphData({
        labels: GradesLabels,
        datasets: [
          {
            label: 'Oceny',
            data: Object.values(grades),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ],
      })
    }, [grades])

    useEffect(() => {
        if(schoolData.classes){
            let allPresence = 0;
            let allPosiblePresences = 0;
            Object.values(schoolData.classes).map((singleClass) => singleClass.completedLessons && singleClass.completedLessons.map((lesson) => {
                allPresence += lesson.presenceCount
                allPosiblePresences += lesson.studentsCount
            }));
            setFrequency([allPresence, allPosiblePresences-allPresence])
        }
        
    }, [schoolData.classes])

    useEffect(() => {
        setFrequencyGraphData({
            labels: ['Obecności', 'Nieobecności'],
            datasets: [
              {
                label: '% Frekwencji',
                data: frequency,
                backgroundColor: ['rgba(27, 162, 49, 0.5)', 'rgba(220, 40, 40, 0.5)'],
                borderColor: ['transparent']
              },
            ],
          })
      }, [frequency])
    

    const schoolOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: 'Dane szkoły',
          },
        },
    };
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
    const FrequencyOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: 'Frekwencja',
          },
        },
    };

    const schoolInfoData = {
        labels: ['liczba klas', 'liczba uczniów', 'liczba nauczycieli'],
        datasets: [
          {
            label: 'Dane szkoły',
            data: [classesCount, studentsCount, teachersCount],
            backgroundColor: 'rgba(41, 186, 255, 0.5)',
          },
        ],
      };

    return(
        <div className="grid grid-cols-1 md:grid-cols-2 p-10">
            <div>
                <Bar data={schoolInfoData} options={schoolOptions} />
            </div>
            <div>
                <Bar data={gradesGraphData} options={GradesOptions} />
            </div>
            <div className="flex flex-col items-center md:col-span-2">
                <div className="max-w-[70%]">
                    <Pie data={frequencyGraphData} options={FrequencyOptions} />
                </div>
            </div>
            
        </div>
    )
}