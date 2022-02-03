import { useSelector } from "react-redux"
import { RootState } from "../../../redux/store"
import { daysOfWeek, SingleClassData, singleClassLessonPlan, teacherWorkingHours } from "../../../utils/interfaces"

export const useGeneratePlanFunc = () => {
    const daysOfWeekArray: daysOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']  
    const schoolData = useSelector((state: RootState) => state.schoolData.schoolData)

    const teachers = schoolData?.teachers

    const getWorkingHourOfTeacher = (teacherEmail: string) => {
        if(teachers) {
            return teachers[teacherEmail].workingHours
        }
        return []
    }

    const getRandomDay = () => {
        return Math.floor(Math.random() * 5)
    }

    const generatePlanFunc = (hoursValue: { [key: string]: any }, singleClassInfo: SingleClassData | undefined) => {
        let teacherOfSubjects: {[key: string]: string} = {}
        singleClassInfo?.subjects.forEach(item => {
            teacherOfSubjects[item.name] = item.teacher
        })

        const plan: singleClassLessonPlan = {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: []
        }

        // dodac ilość godzin pracy dla nauczyciela - 20 godzin
        // dodac wiecej godzin na dzien

        // 1. sprawdzanie czy klasa ma o tej godzinie lekcje
        // 2. sprawdzanie czy nauczyciel uczy o tej godzinie
        
        // gotowy plan sprawdzic czy nie ma w srodku dnia wolnych godzin -  na później


        console.log(hoursValue)
        
        for(let [key, value] of Object.entries(hoursValue)) {
            const workingHours: teacherWorkingHours[] = getWorkingHourOfTeacher(teacherOfSubjects[key])
            console.log(workingHours)
            let generatedDay: daysOfWeek
            while(value > 0) {
                while(true) {
                    generatedDay = daysOfWeekArray[getRandomDay()]
                    console.log(generatedDay);
                    const filteredArray = plan[generatedDay].filter(item => item !== undefined)
                    console.log(filteredArray);
                    if(filteredArray.length < 11) {
                        console.log(key, value);
                        break
                    }
                    console.log(key, value, 'pełne');
                }

                for(let i = 0; i < 11; i++) {
                    if(plan[generatedDay][i] === undefined) { // 1
                        // eslint-disable-next-line
                        const temp = workingHours.some(item => item.dayOfWeek === generatedDay && item.hour === i+1)
                        if(!temp) {
                            plan[generatedDay][i] = {
                                subject: key,
                                teacher: teacherOfSubjects[key],
                                hour: i+1
                            }
                            value--
                            break
                        } else {

                        }
                    }
                }
            }
        }
        console.log(plan)
        return plan
    }

    return { generatePlanFunc }
}