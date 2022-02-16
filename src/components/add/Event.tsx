import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useValidateInputs } from "../../hooks/useValidateInputs";
import { RootState } from "../../redux/store"
import { scheduleItem, scheduleItemsArray } from "../../utils/interfaces";
import { ScheduleTable } from "../singleClass/Schedule/ScheduleTable";

export const Event:React.FC = () => {

    // initials
    const initialFormData:scheduleItem = {
        name: '',
        dateFrom: new Date().toISOString().split("T")[0],
        dateTo: new Date().toISOString().split("T")[0],
        teacher: '',
    }
    
    // selectors
    const classes = useSelector((state: RootState) => state.schoolData.schoolData?.classes);
    const userData = useSelector((state: RootState) => state.principal.data);
    const userType = useSelector((state: RootState) => state.userType.userType)

    // States
    const [events, setEvents] = useState<scheduleItemsArray>([])
    const [formData, setFormData] = useState(initialFormData)

    // Hooks
    const { validateData, inputErrors, errors } = useValidateInputs();


    useEffect(() => {
      if(classes){

        let schedules = Object.values(classes).map(({schedule}) => schedule).filter((ev) => ev.length !== 0).map(schedule => schedule.filter((ev) => ev.teacher === userData?.email)).flat();
        
        
        setEvents(schedules);
      }
    }, [])
    
    const handleChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev, [name]:value
        }));
    }

    const handleEdit = () => {
        
    }
    
    const handleSubmit = (e:React.SyntheticEvent) => {
        e.preventDefault();
    }

    if(!userData){
        return <div>Brak obiektu użytkownika</div>
    }
    return (
        <div className="flex flex-col items-center">
            <form className="form-control w-96 mt-12 p-10 card bg-base-200">
                <label className="label">
                    <span className="label-text">Nazwa wydarzenia</span>
                </label>
                <input
                    className={`input ${inputErrors.name.error ? "border-red-500" : ""}`}
                    type="text"
                    placeholder="Nazwa wydarzenia"
                    name="name"
                    value={formData.name}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
                <label className="label">
                    <span className="label-text">Data od</span>
                </label>
                <input
                    type="date"
                    name="dateFrom"
                    value={formData.dateFrom}
                    min={new Date().toISOString().split("T")[0]}
                    className={`input ${inputErrors.dateFrom.error ? "border-red-500" : ''}`}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                />

                <label className="label">
                    <span className="label-text">Data do</span>
                </label>
                <input
                    type="date"
                    name="dateTo"
                    value={formData.dateTo}
                    min={formData.dateFrom}
                    className={`input ${inputErrors.dateTo.error ? "border-red-500" : ''}`}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
                <div className="flex items-center justify-center w-full">
                    <button
                    className="btn btn-primary mt-4 self-end"
                    onClick={(e) => handleSubmit(e)}
                    >
                    Stwórz
                    </button>
                </div>
            </form>
            <div className="text-2xl text-center my-5 text-primary">Twoje wydarzenia</div>
            <ScheduleTable schedule={events} userEmail={userData.email} userType={userType} edit={handleEdit} />
        
        </div>
    )
}