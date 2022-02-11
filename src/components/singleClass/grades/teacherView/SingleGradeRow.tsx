import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../../../redux/store"
import { SchoolGrade, SingleStudentDataFromFirebase } from "../../../../utils/interfaces"
import { SingleGrade } from "../SingleGrade"

interface SingleGradeRowProps {
    student: SingleStudentDataFromFirebase,
    number: number
}

export const SingleGradeRow: React.FC<SingleGradeRowProps> = ({ student, number }) => {
    const subject = useSelector((state: RootState) => state.teacher.data?.subject)
    const [grades, setGrades] = useState<SchoolGrade[]>([])
    const [avg, setAvg] = useState<string>()
    let allGrades: number[] = []

    useEffect(() => {
        setGrades(student.grades[subject as string])
        // eslint-disable-next-line
    }, [student])

    useEffect(() => {
        if(grades?.length > 0) {
            grades?.forEach(grade => {
                allGrades.push(grade.grade)
            })
            let zero = 0
            const tempAvg = (allGrades?.reduce((prev, curr) => {
                if(curr === 0) zero++
                return prev + curr
            }) / (allGrades.length - zero)).toFixed(2)
            setAvg(tempAvg)
        }
        // eslint-disable-next-line 
    }, [grades])

    return (
        <tr>
            <td>{number}</td>
            <td>{student.lastName} {student.firstName}</td>
            <td className="flex flex-wrap gap-y-2">
                {grades ? grades?.map((grade, index) => (
                    <SingleGrade key={index} grade={grade} />
                )) : 'Brak ocen'}
            </td>
            <td className={`text-${avg && +avg > 0 && +avg < 2 ? 'error' : 'success'} font-bold text-center`}>{avg}</td>
            <td className="text-center">
                <div className="badge font-bold">-</div>
            </td>
        </tr>
    )
}