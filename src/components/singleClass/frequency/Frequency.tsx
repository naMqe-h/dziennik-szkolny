import { cloneDeep } from "lodash"
import { BsFillCheckCircleFill } from "react-icons/bs"
import { useSelector } from "react-redux"
import { useSetDocument } from "../../../hooks/useSetDocument"
import { RootState } from "../../../redux/store"
import { SingleClassData, SingleStudentPresence, StudentsDataFromFirebase } from "../../../utils/interfaces"
import { Pie } from "react-chartjs-2";
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

type FrequencyProps = {
    studentsInfo: StudentsDataFromFirebase;
    singleClass: SingleClassData | undefined;
}


const presenceTypes = {
    OB: 'badge-success',
    NB: 'badge-info',
    SP: 'badge-warning',
    ZW: 'badge-neutral',
    US: 'badge-success',
}


export const Frequency: React.FC<FrequencyProps> = ({ studentsInfo, singleClass }) => {
    const { setDocument } = useSetDocument()
    
    const domain = useSelector((state: RootState) => state.schoolData.schoolData?.information.domain)
    const allTeachears = useSelector((state: RootState) => state.schoolData.schoolData?.teachers)

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
        if(singleClass){
            let allPresence = 0;
            let allPosiblePresences = 0;

            singleClass.completedLessons.map(({presenceCount, studentsCount}) => {
                allPresence += presenceCount
                allPosiblePresences += studentsCount 
            });

            setFrequency([allPresence, allPosiblePresences-allPresence])
        }
        
    }, [singleClass]);

    useEffect(() => {
        setFrequencyGraphData((prev) => (
            {...prev, datasets: [{
                label: '% Frekwencji',
                data: frequency,
                backgroundColor: ['rgba(27, 162, 49, 0.5)', 'rgba(220, 40, 40, 0.5)'],
                borderColor: ['transparent']
            }]}
        ))
      }, [frequency])

    const excusingAbsence = (email: string, p: SingleStudentPresence) => {
        const oldPresence = cloneDeep(studentsInfo[email].presence)
        const newPresence: SingleStudentPresence[] = []

        oldPresence.forEach(item => {
            if(item.date === p.date && item.hour === p.hour) {
                newPresence.push({
                    ...item,
                    status: 'US'
                })
            } else {
                newPresence.push(item)
            }
        })

        const data = {
            [email]: {
                ...studentsInfo[email],
                presence: newPresence,
            }
        }
        setDocument(domain as string, 'students', data)
    }

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

    return (
        <>
            <div className="w-full flex flex-col items-center justify-center mb-4">
                <div>
                    <Pie data={frequencyGraphData} options={FrequencyOptions} />
                </div>
            </div>
            {Object.values(studentsInfo)?.map((item, index) => (
                <div key={item.email} className="collapse w-full border rounded-box border-base-300 collapse-arrow">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                        {index + 1}. {item.lastName} {item.firstName}
                    </div>
                    <div className="collapse-content">
                        <table className="table w-full">
                        <thead>
                            <tr className="">
                                <th className="w-1">Data</th>
                                <th className="w-1">Nr lekcji</th>
                                <th className="w-1">Dodano przez</th>
                                <th>Przedmiot</th>
                                <th className="w-1">Status</th>
                                <th className="w-1"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {item.presence?.map((p,i) => (
                                <tr key={i}>
                                    <th>{p.date}</th>
                                    <td>{p.hour}</td>
                                    <td>{allTeachears && `${allTeachears[p.addedBy].lastName} ${allTeachears[p.addedBy].firstName}`} </td>
                                    <td>{p.lessonName}</td>
                                    <td>
                                        <span className={`badge ${presenceTypes[p.status]} mx-1 p-4 font-bold flex z-10 cursor-pointer`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td>
                                        {p.status !== 'US' ? (
                                            <button onClick={() => excusingAbsence(item.email, p)} className="btn btn-square btn-warning btn-sm" >
                                                <BsFillCheckCircleFill size={20} />
                                            </button>
                                        ) : (
                                            <button className="btn btn-square btn-success btn-sm" >
                                                <BsFillCheckCircleFill size={20} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </>
    )
}