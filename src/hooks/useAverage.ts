import { SchoolGrade } from "../utils/interfaces"

export const useAverage = () => {

    const calculateAvg = (grades: SchoolGrade[] ) => {
        let gradesValue = 0, gradesWeight = 0
        grades.forEach(({ grade, weight }) => {
            if(grade !== 0) {
                gradesValue += grade * weight
                gradesWeight += weight
            }
        })
        const avg = (gradesValue / gradesWeight).toFixed(2) || '0.00'
        return isNaN(+avg) ? '0.00' : avg 
    }

    return { calculateAvg }
}