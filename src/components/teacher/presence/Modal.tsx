import { cloneDeep, reject } from "lodash"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { AiOutlineClose } from "react-icons/ai"
import { useSelector } from "react-redux"
import { useSetDocument } from "../../../hooks/useSetDocument"
import { RootState } from "../../../redux/store"
import { SingleClassData, StudentsDataFromFirebase, teacherWorkingHours, PresenceStatusType, SingleStudentPresence } from "../../../utils/interfaces"

type ModalProps = {
    open: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
    currentHour: teacherWorkingHours | undefined
}

type presenceTypesType = {
    name: PresenceStatusType,
    color: string
}[]

const presenceTypes: presenceTypesType = [
    { name: 'OB', color: 'badge-success' },
    { name: 'NB', color: 'badge-info' },
    { name: 'SP', color: 'badge-warning' },
    { name: 'ZW', color: 'badge-neutral' },
]

export const Modal: React.FC<ModalProps> = ({ open, setIsOpen, currentHour }) => {
    const { setDocument } = useSetDocument()

    const allClasses = useSelector((state: RootState) => state.schoolData.schoolData?.classes)
    const allStudents = useSelector((state: RootState) => state.schoolData.schoolData?.students)
    const domain = useSelector((state: RootState) => state.schoolData.schoolData?.information.domain)
    const teacher = useSelector((state: RootState) => state.teacher.data)

    const [newPresence, setNewPresence] = useState<{ [key: string] : PresenceStatusType }>({})
    const [newAllPresence, setNewAllPresence] = useState<PresenceStatusType | 0>(0)

    const [students, setStudents] = useState<StudentsDataFromFirebase>()
    const [currentClass, setCurrentClass] = useState<SingleClassData>()


    const handleSetPresence = (email: string, presence: PresenceStatusType) => {
        setNewPresence(prev => ({
            ...prev,
            [email]: presence
        }))
    }

    const handleSetAllPresence = (presence: PresenceStatusType) => {
        setNewAllPresence(presence)
        let temp: { [key: string] : PresenceStatusType } = {}
        
        currentClass?.students.forEach(item => {
            temp = {
                ...temp,
                [item]: presence
            }
        })

        setNewPresence(prev => ({
            ...prev,
            ...temp,
        }))
    }

    const handleClose = () => {
        setNewPresence({})
        setNewAllPresence(0)
        setIsOpen(prev => !prev)
    }

    const handleSumbit = () => {
        let data = cloneDeep(students)

        if(students && data) {
            for(const [key] of Object.entries(students)) {
                let newPresenceObj: SingleStudentPresence
                if(data[key].presence && newPresence[key] === 'OB') {
                    data[key].presence = reject(data[key].presence, (item) => ( item.date === new Date().toLocaleDateString('en-CA') && item.hour === currentHour?.hour))
                    continue
                }
                if(!newPresence[key]) {
                    continue
                } else {
                    if(data[key].presence) {
                        data[key].presence = reject(data[key].presence, (item) => ( item.date === new Date().toLocaleDateString('en-CA') && item.hour === currentHour?.hour))
                    }
                    
                    newPresenceObj = {
                        dayOfWeek: new Date().toLocaleString('en', {weekday: 'long'}).toLowerCase(),
                        addedBy: teacher?.email as string,
                        date: new Date().toLocaleDateString('en-CA'),
                        hour: currentHour?.hour as number,
                        lessonName: teacher?.subject as string,
                        status: newPresence[key]
                    }
                }

                if(data[key].presence) {
                    data[key].presence.push(newPresenceObj)
                } else {
                    data[key].presence = [ newPresenceObj ]
                }
            }
            setDocument(domain as string, 'students', data)
        }
    }

    useEffect(() => {
        if(allClasses && currentHour) setCurrentClass(allClasses[currentHour?.className])
    }, [allClasses, currentHour])

    useEffect(() => {
        let tempStudents: StudentsDataFromFirebase = {}
        if(allStudents) {
            for(const [key, value] of Object.entries(allStudents)) 
                if(currentClass?.students.includes(key)) tempStudents = { ...tempStudents, [key]: value }
        }
        setStudents(tempStudents)
    }, [currentClass, allStudents])

    return (
        <div className={`modal ${open && 'modal-open'}`}>
            <div className="modal-box max-w-[1000px]">
                <AiOutlineClose
                    onClick={() => handleClose()}
                    size={30}
                    className="absolute top-2 right-2 cursor-pointer"
                />
                <div className="flex justify-end items-center gap-2 mt-6">
                    <p className="font-bold">Ustaw dla wszystkich:</p>
                    {presenceTypes.map(p => (
                        <span onClick={() => handleSetAllPresence(p.name)} key={p.name} className={`badge ${p.color} mx-1 p-4 font-bold flex z-10 cursor-pointer
                        ${newAllPresence === p.name ? 'scale-[1.2]' : 'opacity-30 hover:opacity-100 hover:scale-110'} 
                    `}>
                        {p.name}
                    </span>
                    ))}
                </div>
                <table className="table table-zebra w-full mt-4">
                    <thead>
                        <tr>
                            <th className="w-0">Nr</th>
                            <th>Nazwisko Imię</th>
                            <th className="w-0 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students && currentClass?.students.map((item, index) => (
                            <tr key={item}>
                                <th>{index + 1}</th>
                                <td>{students[item]?.lastName} {students[item]?.firstName}</td>
                                <td className="flex gap-2">
                                    {presenceTypes.map(p => (
                                        <span onClick={() => handleSetPresence(item, p.name)} key={p.name} className={`badge ${p.color} mx-1 p-4 font-bold flex z-10 cursor-pointer
                                            ${newPresence[item] === p.name ? 'scale-[1.2]' : 'opacity-30 hover:opacity-100 hover:scale-110'} 
                                        `}>
                                            {p.name}
                                        </span>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-end w-full">
                    <button onClick={handleSumbit} className="btn btn-success mt-6">Zatwierdź</button>
                </div>
            </div>
        </div>
    )
}