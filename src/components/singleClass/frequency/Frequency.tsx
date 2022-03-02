import { cloneDeep } from "lodash"
import { BsFillCheckCircleFill } from "react-icons/bs"
import { useSelector } from "react-redux"
import { useSetDocument } from "../../../hooks/useSetDocument"
import { RootState } from "../../../redux/store"
import { SingleStudentPresence, StudentsDataFromFirebase } from "../../../utils/interfaces"

type FrequencyProps = {
    studentsInfo: StudentsDataFromFirebase
}


const presenceTypes = {
    OB: 'badge-success',
    NB: 'badge-info',
    SP: 'badge-warning',
    ZW: 'badge-neutral',
    US: 'badge-success',
}


export const Frequency: React.FC<FrequencyProps> = ({ studentsInfo }) => {
    const { setDocument } = useSetDocument()
    
    const domain = useSelector((state: RootState) => state.schoolData.schoolData?.information.domain)
    const allTeachears = useSelector((state: RootState) => state.schoolData.schoolData?.teachers)

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

    return (
        <>
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
                            {item.presence?.map(p => (
                                <tr>
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