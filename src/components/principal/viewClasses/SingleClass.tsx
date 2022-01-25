import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { RootState } from "../../../redux/store"
import { SingleClassData } from "../../../utils/interfaces"
import { FcConferenceCall } from 'react-icons/fc'
import { SingleClassTable } from "./SingleClassTable"
import { toast } from "react-toastify"

export const SingleClass = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [singleClass, setSingleClass] = useState<SingleClassData>()
    const [classTeacherName, setClassTeacherName] = useState<string>()
    const [studentsInfo, setStudentsInfo] = useState({})
    const [checked, setChecked] = useState<boolean>(false)
    const classes = useSelector((state: RootState) => state.user.schoolData?.classes);
    const teachers = useSelector((state: RootState) => state.user.schoolData?.teachers);
    const allStudents = useSelector((state: RootState) => state.user.schoolData?.students)

    useEffect(() => {
        if(classes && id) {
            for (const [key, value] of Object.entries(classes)) {
                if(key === id) {
                    setSingleClass(value)
                }
            }
            setChecked(true)
        }
    }, [classes, id])

    useEffect(() => {
        if(checked && !singleClass) {
            toast.error(`Klasa "${id}" nie istnieje`, { autoClose: 2000 })
            navigate('/')
        }
        // eslint-disable-next-line 
    }, [checked])

    useEffect(() => {
        if(teachers) {
            for(const [key, value] of Object.entries(teachers)) {
                if(key === singleClass?.classTeacher) {
                    setClassTeacherName(`${value.firstName}  ${value.lastName}`)
                }
            }
        }

        if(singleClass && allStudents) {
            const { students } = singleClass
            for (const [key, value] of Object.entries(allStudents)){
                if(students.includes(key)) {
                    setStudentsInfo(prev => ({
                        ...prev,
                        [key]: value
                    }))
                }
            }
        }
        // eslint-disable-next-line 
    }, [singleClass])

    return (
        <div className="p-8 overflow-x-auto">
            <div className="flex flex-row h-20 card bg-base-300 rounded-box items-center px-10">
                <div className="flex items-center flex-1 font-bold text-lg">
                    <FcConferenceCall className="mr-2" size={32} />
                    {singleClass?.fullName}
                    <div className="badge badge-secondary badge-outline badge-lg ml-6">Uczniów: {singleClass?.students.length}</div> 
                </div>
                <div className="mx-5">Wychowawca: {classTeacherName}</div>
            </div> 
            
            <div className="flex flex-row h-20 card items-center mb-2">
                <div className="flex items-center flex-1 font-bold text-lg">
                    <button className="btn btn-secondary btn-outline mr-2">Lista przedmiotów</button>
                    <button className="btn btn-secondary btn-outline mr-2">Plan Lekcji</button>
                </div>
                <div>
                    <button className="btn btn-primary btn-outline ml-2">Dodaj ucznia</button>
                    <button className="btn btn-primary btn-outline ml-2">Wygeneruj uczniów</button>
                </div>
            </div> 

            <SingleClassTable studentsInfo={studentsInfo} />
        </div>
    )
}