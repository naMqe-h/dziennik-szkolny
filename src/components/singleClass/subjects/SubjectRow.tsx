import { useState } from "react"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../../redux/store"
import { SingleSubjectInClasses, SubjectData } from "../../../utils/interfaces"

interface SubjectRowProps {
    number: number
    subject: SingleSubjectInClasses
}

export const SubjectRow: React.FC<SubjectRowProps> = ({ subject, number }) => {
    const allSubjects = useSelector((state: RootState) => state.user.schoolData?.subjects)
    const allTeachers = useSelector((state: RootState) => state.user.schoolData?.teachers)
    const [subjectInfo, setSubjectInfo] = useState<SubjectData>()
    const [teacher, setTeacher] = useState<string>()

    useEffect(() => {
        if(allSubjects) {
            for (const [key, value] of Object.entries(allSubjects)) {
                if(key === subject.name) {
                    setSubjectInfo(value)
                }
            }
        }
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if(allTeachers) {
            for (const [key, value] of Object.entries(allTeachers)) {
                if(key === subject.teacher) {
                    setTeacher(`${value.lastName} ${value.firstName}`)
                }
            }
        }
        // eslint-disable-next-line
    }, [allTeachers, subjectInfo])

    return (
        <tr>
            <th>{number}</th> 
            <td>{subject.name}</td> 
            <td>{teacher}</td> 
            <td className="text-center">{subjectInfo?.includedAvg ? 'tak' : 'nie'}</td>
        </tr>
    )
}