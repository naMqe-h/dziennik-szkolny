import { SchoolGrade } from "../utils/interfaces"

export const useAverage = () => {

    const calculateAvg = (grades: SchoolGrade[] ) => {
        let gradesValue = 0, gradesWeight = 0
        grades.forEach(item => {
            if(item.grade !== 0) {
                gradesValue += item.grade * item.weight
                gradesWeight += item.weight
            }
        })
        const avg = (gradesValue / gradesWeight).toFixed(2) || '0.00'
        return isNaN(+avg) ? '0.00' : avg 
    }

    return { calculateAvg }
}