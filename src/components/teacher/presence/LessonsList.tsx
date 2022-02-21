import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { RootState } from "../../../redux/store"
import { teacherWorkingHours } from "../../../utils/interfaces"
import { Modal } from "./Modal"

export const LessonsList = () => {
    const workingHours = useSelector((state: RootState) => state.teacher.data?.workingHours)
    const allClasses = useSelector((state: RootState) => state.schoolData.schoolData?.classes) || {}

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
    }, [workingHours])


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
                            <th className="w-0"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {todayWorkingHours.map(item => (
                            <tr key={item.hour}>
                                <th className="text-primary">{item.hour}</th>
                                <td className="text-primary font-bold text-lg">
                                    <Link to={`/class/${item.className}/info`}>
                                        {allClasses[item.className]?.fullName}
                                    </Link>
                                </td>
                                <td>
                                <button
                                    className="btn btn-active btn-success"
                                    onClick={() => handleOpen(item)}
                                    >
                                    Sprawdź obecność
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