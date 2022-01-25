import { SingleStudentDataFromFirebase } from "../../../utils/interfaces"
import { IoIosArrowDown } from 'react-icons/io'

interface SingleClassTableRowProps {
    student: SingleStudentDataFromFirebase
    number: number
}

export const SingleClassTableRow: React.FC<SingleClassTableRowProps> = ({ student, number }) => {
    return (
        <tr>
            <th>{number}</th> 
            <td>{student.lastName}</td> 
            <td>{student.firstName}</td> 
            <td>{student.email}</td> 
            <td>{student.birth}</td> 
            <td>{student.pesel}</td> 
            <td>4 dni temu</td>
            <td><IoIosArrowDown size={26} /></td>
        </tr>
    )
}