import { useEffect, useState } from "react"
import { SchoolGrade } from "../../../utils/interfaces"
import { SingleGrade } from "./SingleGrade"

interface SingleGradeRowProps {
    subject: string
    grades: SchoolGrade[]
}

export const SingleGradeRow: React.FC<SingleGradeRowProps> = ({ subject, grades }) => {
    const [avg, setAvg] = useState<string>()
    let allGrades: number[] = []

    useEffect(() => {
        grades.forEach(grade => {
            allGrades.push(grade.grade)
        })
        let zero = 0
        const tempAvg = (allGrades.reduce((prev, curr) => {
            if(curr === 0) zero++
            return prev + curr
        }) / (allGrades.length - zero)).toFixed(2)
        setAvg(tempAvg)
        // eslint-disable-next-line 
    }, [grades])

    return (
        <tr>
            <th>{subject}</th> 
            <td className="flex flex-wrap gap-y-2">
                {grades.map((grade, index) => (
                    <SingleGrade key={index} grade={grade} />
                ))}
            </td>
            <td className={`text-${avg && +avg > 0 && +avg < 2 ? 'error' : 'success'} font-bold text-center`}>{avg}</td>
            <td className="text-center">
                <div className="badge font-bold">-</div>
            </td>
        </tr>
    )
}