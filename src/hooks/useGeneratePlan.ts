import { cloneDeep } from "lodash"
import nProgress from "nprogress"
import { useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import { RootState } from "../redux/store"
import { daysOfWeek, SingleClassData, singleClassLessonPlan, TeachersDataFromFirebase, teacherWorkingHours } from "../utils/interfaces"
import { useSetDocument } from "./useSetDocument"

export const useGeneratePlan = () => {
    const { setDocument } = useSetDocument()
    const daysOfWeekArray: daysOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']  
    const schoolData = useSelector((state: RootState) => state.schoolData.schoolData)
    const [newTeachersState, setNewTeachersState] = useState<TeachersDataFromFirebase | null>(null)
    const [newPlan, setNewPlan] = useState<singleClassLessonPlan | null>(null)

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

    const generatePlan = (hoursValue: { [key: string]: any }, singleClassInfo: SingleClassData | undefined) => {
        let newTeachers = cloneDeep(teachers as TeachersDataFromFirebase)
        const startedHoursValue = Object.values(hoursValue).reduce((a, b) => a + b)
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
        
        for(let [key, value] of Object.entries(hoursValue)) {
            const workingHours: teacherWorkingHours[] = getWorkingHourOfTeacher(teacherOfSubjects[key])
            let generatedDay: daysOfWeek
            while(value > 0) {
                while(true) {
                    generatedDay = daysOfWeekArray[getRandomDay()]
                    const filteredArray = plan[generatedDay].filter(item => item !== undefined) //tablice z lekcjami z danego dnia bez undefined
                    if(filteredArray.length < 11) { //sprawdza czy dzien jest pełny
                        if(filteredArray.length <= Math.floor((startedHoursValue - value) * 0.2)) { //sprawdza czy plan jest równo rozłożony 
                            break
                        }
                    }
                }

                for(let i = 0; i < 11; i++) {
                    if(plan[generatedDay][i] === undefined) { // sprawdzanie czy klasa ma o tej godzinie lekcje
                        if(workingHours.length < 22) {
                            // eslint-disable-next-line
                            const temp = workingHours.some(item => item.dayOfWeek === generatedDay && item.hour === i+1) //sprawdzanie czy nauczyciel uczy o tej godzinie
                            if(!temp) {
                                plan[generatedDay][i] = {
                                    subject: key,
                                    teacher: teacherOfSubjects[key],
                                    hour: i+1
                                }
                                if(newTeachers) {
                                    const newWorkingHour: teacherWorkingHours = {
                                        dayOfWeek: generatedDay,
                                        className: singleClassInfo?.name as string,
                                        hour: i + 1
                                    }
                                    newTeachers[teacherOfSubjects[key]].workingHours = [ ...newTeachers[teacherOfSubjects[key]].workingHours, newWorkingHour]
                                }
                                value--
                                break
                            }
                        } else {
                            console.log('Nauczyciel ma już wykorzystane 22 godziny lekcyjne w tygodniu');
                        }                        
                    }
                }
            }
        }
        setNewTeachersState(newTeachers)
        setNewPlan(plan)
        return plan
    }

    const savePlan = (className: string) => {
        const domain = schoolData?.information.domain
        nProgress.start()
        if(newPlan && newTeachersState) {
            //zapis całego planu
            setDocument(domain as string, 'lessonPlans', { [className]: newPlan })
            //zapis obiektu teachers
            setDocument(domain as string, 'teachers', newTeachersState)
            toast.success(`Udało się zapisać plan lekcji dla klasy ${className}`, { autoClose: 3000 })
        }
        nProgress.done()
    }

    return { generatePlan, savePlan }
}