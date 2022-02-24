import { useEffect, useState } from "react"
import { BsFillArrowLeftCircleFill } from "react-icons/bs"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { RootState } from "../../../redux/store"
import { lessonHours } from "../../../utils/utils"


const presenceTypes = {
    OB: 'badge-success',
    NB: 'badge-info',
    SP: 'badge-warning',
    ZW: 'badge-neutral',
    US: 'badge-success',
}

export const FrequencyList = () => {
    const student = useSelector((state: RootState) => state.student.data)
    const teachers = useSelector((state: RootState) => state.schoolData.schoolData?.teachers)
    //eslint-disable-next-line
    const completedLessons = useSelector((state: RootState) => state.schoolData.schoolData?.classes[student?.class as string].completedLessons) || []

    const [frequencyPercent, setFrequencyPercent] = useState<number>(0)
    const [counter, setCounter] = useState<{ [key: string]: number }>({nb: 0, sp: 0, zw: 0, us: 0})

    useEffect(() => {
        let percent = 0
        let tempCounter: { [key: string]: number } = {
            OB: 0,
            NB: 0,
            SP: 0,
            ZW: 0,
            US: 0,
        }

        if(student) {
            percent = (1 - (student?.presence.length / completedLessons.length)) * 100
            setFrequencyPercent(percent)

            student?.presence.forEach(item => {
                tempCounter[item.status as string] += 1
            })
            tempCounter.OB = completedLessons.length - student?.presence.length
            setCounter(tempCounter)
        }


    }, [student, completedLessons])
    
    return (
        <div className="card bg-base-200 border rounded-box border-base-300 py-6 px-6 mx-24">
            <Link to="/" className="flex w-max items-center mb-2 gap-2">
                <BsFillArrowLeftCircleFill className={`transition-all hover:-translate-x-1.5 duration-300 text-2xl`} />
                Powrót na stronę główną
            </Link>
            <div className="py-6 flex items-center">
                <div className="flex-1">
                    <h1 className="text-primary font-bold text-lg ml-3">Frekwencja: {frequencyPercent}%</h1>
                </div>
                <div className="flex gap-1">
                    <div className="badge badge-lg badge-success">Obecności: {counter?.OB}</div>
                    <div className="badge badge-lg badge-info">Nieobecności: {counter?.NB}</div>
                    <div className="badge badge-lg badge-warning">Spóźnienia: {counter?.SP}</div>
                    <div className="badge badge-lg">Zwolnienia: {counter?.ZW}</div>
                    <div className="badge badge-lg badge-accent">Usprawiedliwione: {counter?.US}</div>
                </div>
            </div>
            <table className="table w-full mx-auto">
                <thead>
                    <tr>
                        <th className="w-0">Data</th>
                        <th className="text-center">Nr lekcji</th>
                        <th className="text-center">Nauczyciel</th>
                        <th className="w-0">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {student?.presence.map((item, index) => (
                        <tr key={index}>
                            <th>{item.date} {`(${new Date(item.date).toLocaleString('pl', {weekday: 'short'}).toLowerCase()})`} </th>
                            <td className="text-center">{item.hour} - {lessonHours[item.hour - 1]}</td>
                            <td className="text-center">{teachers && teachers[item.addedBy]?.lastName} {teachers && teachers[item.addedBy].firstName}</td>
                            <td className="text-center">
                                <span className={`badge ${presenceTypes[item.status]} mx-1 p-4 font-bold flex z-10 cursor-pointer`}>
                                    {item.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}