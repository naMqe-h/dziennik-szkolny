import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../../redux/store"
import { SingleDay } from "./SingleDay"
import { SingleClassData, SubjectData, singleClasslessonPlan } from '../../../utils/interfaces'

interface SubjectDataWithShortName extends SubjectData {
    shortName: string
}

interface SubejctsInputsValues {
    [key: string]: any
}

export const Generate = () => {
    // pojedyńcza wybrana klasa
    const [selectClassValue, setSelectClassValue] = useState<string>('')
    const [singleClassInfo, setSingleClassInfo] = useState<SingleClassData>()
    const [singleClassSubjects, setSingleClassSubjects] = useState<SubjectDataWithShortName[]>([])
    const [singleClassLessonPlan, setSingleClassLessonPlan] = useState<singleClasslessonPlan>()

    //tablica z nazwami przedmiotów z wybranej klasy
    const [subjectNames, setSubjectNames] = useState<string[]>([])

    //tablica z informacjami o wszystkich klasach
    const [allClassesArray, setAllClassesArray] = useState<SingleClassData[]>()

    // wartośći inputów od przedmiotów
    const [subejctsInputsValues, setSubejctsInputsValues] = useState<SubejctsInputsValues>({})

    // redux
    const schoolData = useSelector((state: RootState) => state.principal.schoolData)
    
    useEffect(() => {
        let tempArray = []
        if(schoolData?.classes) {
            // eslint-disable-next-line
            for(const [key, value] of Object.entries(schoolData?.classes)) {
                tempArray.push(value)
            }
            //!do zmiany
            // setSelectClassValue(tempArray[0].name)
            setSelectClassValue('1c')
            setAllClassesArray(tempArray)
        }
    }, [schoolData])

    useEffect(() => {
        let tempArray: string[] = []
        //tu zrobic pobieranie planu danej klasy
        if(schoolData?.lessonPlans) {
            setSingleClassLessonPlan(undefined)
            for(const [key, value] of Object.entries(schoolData.lessonPlans)) {
                if(key === selectClassValue) {
                    setSingleClassLessonPlan(value)
                }
            }
        }
        
        //tu zapisujemy informacje o wybranej w selectie klasie
        if(schoolData?.classes) {
            for(const [key, value] of Object.entries(schoolData?.classes)) {
                if(key === selectClassValue) {
                    //zbieranie nazw przedmiotów danej klasy
                    value.subjects.forEach(item => {
                        tempArray.push(item.name)
                    })
                    setSingleClassInfo(value)
                    setSubjectNames(tempArray)             
                }
            }
        }
    }, [selectClassValue, schoolData?.classes, schoolData?.lessonPlans])

    useEffect(() => {
        let tempArray = []
        // przypisujemy informacje o przedmiotach dla danej klasy
        if(schoolData?.subjects) {
            for(const [key, value] of Object.entries(schoolData.subjects)) {
                if(subjectNames.includes(key)) {
                    tempArray.push({...value, shortName: key})
                }
            }
            setSingleClassSubjects(tempArray)
        }
    }, [singleClassInfo, subjectNames, schoolData?.subjects])

    useEffect(() => {
        let tempState = {}
        if(singleClassSubjects.length > 0) {
            singleClassSubjects.forEach(item => {
                tempState = {
                    ...tempState,
                    [item.shortName]: 0,
                }
            })
            setSubejctsInputsValues(tempState)
        }
    }, [singleClassSubjects])

    // useEffect(() => {
    //     console.log(subejctsInputsValues);
    // }, [subejctsInputsValues])
    
    // useEffect(() => {
    //     console.log(singleClassLessonPlan);
    // }, [singleClassLessonPlan])

    return (
        <div className="mx-auto flex gap-4 pt-12 mr-8">
            <div className="flex-none w-64 p-4">
                <h1 className="text-xl font-bold text-center text-primary">Wybierz klasę:</h1>
                <select value={selectClassValue} onChange={(e) => setSelectClassValue(e.currentTarget.value)} className="select select-bordered w-full max-w-xs mt-4">
                    {allClassesArray?.map((item) => (
                        <option key={item.name} value={item.name}>{item.name}</option>
                    ))}
                </select>
                <div className="divider"></div>
                
                <div> {/*wszystkie przedmioty */}
                    <h1 className="text-xl font-bold text-center text-primary">Liczba godzin</h1>
                    {singleClassSubjects.map(item => (
                        <div key={item.name} className="form-control">
                            <label className="label">
                                <span className="label-text">{item.name}</span>
                            </label> 
                            <input value={subejctsInputsValues?.[item.shortName] || 0} onChange={(e) => setSubejctsInputsValues(prev => ({...prev, [item.shortName]: +e.target.value}))} type="number" placeholder="3" className="input input-bordered" />
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex-1 w-full overflow-x-auto">
                <table className="table w-full border-2 border-base-200">
                    <thead>
                        <tr className="text-primary-focus text-center">
                            <th></th> 
                            <th className="text-lg">8<sup>00</sup>-8<sup>45</sup></th> 
                            <th className="text-lg">8<sup>50</sup>-9<sup>35</sup></th> 
                            <th className="text-lg">9<sup>45</sup>-10<sup>30</sup></th> 
                            <th className="text-lg">10<sup>40</sup>-11<sup>25</sup></th> 
                            <th className="text-lg">11<sup>40</sup>-12<sup>25</sup></th> 
                            <th className="text-lg">12<sup>35</sup>-13<sup>20</sup></th> 
                            <th className="text-lg">13<sup>30</sup>-14<sup>15</sup></th> 
                            <th className="text-lg">14<sup>20</sup>-15<sup>05</sup></th> 
                        </tr>
                    </thead> 
                    <tbody>
                        <SingleDay dayOfWeek="Poniedziałek" lessons={singleClassLessonPlan?.monday} />
                        <SingleDay dayOfWeek="Wtorek" lessons={singleClassLessonPlan?.tuesday} />
                        <SingleDay dayOfWeek="Środa" lessons={singleClassLessonPlan?.wednesday} />
                        <SingleDay dayOfWeek="Czwartek" lessons={singleClassLessonPlan?.thursday} />
                        <SingleDay dayOfWeek="Piątek" lessons={singleClassLessonPlan?.friday} />
                    </tbody>
                </table>
            </div>
        </div>
    )
}