import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { SchoolGrade } from "../../../utils/interfaces"

interface SingleGradeProps {
    grade: SchoolGrade
}

export const SingleGrade: React.FC<SingleGradeProps> = ({ grade }) => {
    const [color, setColor] = useState<string>()

    useEffect(() => {
        if([1,2].includes(grade.grade)) setColor('badge-error')
        if([3,4].includes(grade.grade)) setColor('badge-warning')
        if(grade.grade === 5) setColor('badge-info')
        if(grade.grade === 6) setColor('badge-success')
    }, [grade.grade])

    return (
        <Link to='/grade' data-tip="Więcej szczegółów" className={`tooltip badge mx-1 p-4 font-bold flex z-10 cursor-pointer ${color}`}>
            <span>
                {grade.grade}
            </span>
        </Link>
    )
}