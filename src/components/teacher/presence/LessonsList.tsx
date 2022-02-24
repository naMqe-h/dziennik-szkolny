import { useEffect, useState } from "react"
import { AiOutlineClose } from 'react-icons/ai'
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { RootState } from "../../../redux/store"
import { SingleCompletedLesson, teacherWorkingHours } from "../../../utils/interfaces"
import { Modal } from "./Modal"
import { lessonHours } from "../../../utils/utils"
import { FaCheck } from "react-icons/fa"

export const LessonsList = () => {
    const workingHours = useSelector((state: RootState) => state.teacher.data?.workingHours)
    const allClasses = useSelector((state: RootState) => state.schoolData.schoolData?.classes) || {}

    const [oldPresence, setOldPresence] = useState<{ [key: string]: SingleCompletedLesson }>({})
    const [open, setIsOpen] = useState<boolean>(false)
    const [currentHour, setCurrentHour] = useState<teacherWorkingHours>()
    const [todayWorkingHours, setTodayWorkingHours] = useState<teacherWorkingHours[]>([])

    useEffect(() => {
        const dayOfWeek = new Date().toLocaleString('en', {
            weekday: 'long'
        }).toLowerCase()
        
        const todayWorkingHours: teacherWorkingHours[] = []
        workingHours?.forEach(item => {
            if(item.dayOfWeek === dayOfWeek) {
                todayWorkingHours.push(item)
            }
        })
        todayWorkingHours.sort((a, b) => a.hour - b.hour)
        setTodayWorkingHours(todayWorkingHours)

        todayWorkingHours.forEach(item => {
            const today = new Date().toLocaleDateString('en-CA')
            let szukanaLekcja = allClasses[item.className]?.completedLessons?.filter(item => item.date === today) || []
            
            szukanaLekcja.forEach(item => {
                setOldPresence(prev => ({
                    ...prev,
                    [item.hour]: item
                }))
            })
            
        })
    }, [workingHours, allClasses])


    useEffect(() => {
        console.log(oldPresence);
    }, [oldPresence])

    const handleOpen = (item : teacherWorkingHours) => {
        setCurrentHour(item)
        setIsOpen(true)
    }

    return (
        <>
            <Modal open={open} setIsOpen={setIsOpen} currentHour={currentHour} />
            <div className="flex flex-col justify-center pt-12 container mx-auto">
                <div className="py-4">
                    <p className="text-2xl text-base-content font-bold text-center">Frekwencja {new Date().toLocaleDateString('pl')}</p>
                </div>
                <table className="table table-zebra min-w-[800px]">
                    <thead>
                        <tr>
                            <th className="w-0">Nr lekcji</th>
                            <th>Klasa</th>
                            <th className="w-0">Frekwencja</th>
                            <th className="w-0">Zrealizowana</th>
                            <th className="w-0"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {todayWorkingHours.map(item => (
                            <tr key={item.hour}>
                                <th className="text-primary">{item.hour}. {lessonHours[item.hour-1]}</th> 
                                <td className="text-primary font-bold text-lg">
                                    <Link to={`/class/${item.className}/info`}>
                                        {allClasses[item.className]?.fullName}
                                    </Link>
                                </td>
                                <td className="text-center">
                                    {oldPresence[item.hour] ? (
                                        <div className="badge badge-info badge-lg">
                                            {oldPresence[item.hour]?.presenceCount}/{oldPresence[item.hour]?.studentsCount}
                                        </div>
                                    ) : (
                                        <div className="badge badge-info badge-lg">
                                            -
                                        </div>
                                    )}
                                </td>
                                <td>
                                    {oldPresence[item.hour] ? (
                                        <FaCheck fill="green" size={32} className='mx-auto' />
                                    ) : (
                                        <AiOutlineClose fill='red' size={32} className='mx-auto' />
                                    )}
                                </td>
                                <td>
                                <button
                                    className="btn btn-active btn-success"
                                    onClick={() => handleOpen(item)}
                                    >
                                    Edytuj
                                </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}