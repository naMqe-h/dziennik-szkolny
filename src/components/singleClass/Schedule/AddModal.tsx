import moment from "moment"
import React, { useEffect, useState } from "react"
import { AiOutlineClose } from "react-icons/ai"
import { useValidateInputs } from "../../../hooks/useValidateInputs"
import { scheduleItem } from "../../../utils/interfaces"

 

interface addModalItf{
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>> ;
    userEmail: string;
    add: (data: any, oldItem?: any) => void;
    event?: scheduleItem;
    reciever: string[];
}

export const AddModal:React.FC<addModalItf> = ({isOpen, setIsOpen, userEmail, add, event, reciever}) => {

    const initialFormData:scheduleItem= {
        name: '',
        dateFrom:  new Date().toISOString().split("T")[0],
        dateTo: new Date().toISOString().split("T")[0],
        addedBy: userEmail,
        receiver: reciever 
    }
    const [formData, setFormData] = useState(event ? {...event, dateFrom: moment(Number(event.dateFrom.replaceAll(/\s/g, ""))).format(
        "yyyy-MM-DD"
      ),
    dateTo: moment(Number(event.dateTo.replaceAll(/\s/g, ""))).format(
        "yyyy-MM-DD"
      ), } : initialFormData);
    const [validated, setValidated] = useState(false)
    const { validateData, inputErrors, errors } = useValidateInputs();
    

    useEffect(() => {
        if(validated){
            if(errors) return;
            if(!event){
                add(formData)
                setFormData(initialFormData);
            } else {
                add(formData, event);
            }

        }
        setValidated(false);
    }, [validated, errors])
    


    const handleChange = (name: string, value: string) => {
        if(name === 'dateFrom'){
            let dateFrom = moment(value)
            let dateTo = moment(formData.dateTo)
            if(dateTo.isBefore(dateFrom)){
                setFormData((prev) => ({
                    ...prev, 'dateTo': value
                }))
            }
        }
        setFormData((prev) => ({
            ...prev, [name]:value
        }));
    }

    const handleSubmit = () => {
        setValidated(false);
        setFormData((prev) => ({
            ...prev, dateFrom: String(Date.parse(prev.dateFrom)),
            dateTo: String(Date.parse(prev.dateTo))
        }))
        validateData(formData);
        setValidated(true);
    }

    return(
        <div className={`modal ${isOpen ? "modal-open" : ""} `}>
            <div className="modal-box flex flex-col items-center gap-2 bg-base-300">
            <AiOutlineClose
                onClick={() => setIsOpen((prev) => !prev)}
                size={30}
                className="absolute top-2 right-2 cursor-pointer"
            />
            <h2 className="mb-3">
                {event ? "Edytuj wydarzenie" : "Dodaj wydarzenie"}
            </h2>
            <label>Nazwa</label>
            <input 
                type="text" 
                name="name"
                value={formData.name} 
                className={`input ${inputErrors.name.error ? "border-red-500" : ''}`}
                onChange={(e) => handleChange(e.target.name, e.target.value)} />
            <label>Data Rozpoczęcia</label>
            <input
                type="date"
                name="dateFrom"
                value={formData.dateFrom}
                min={new Date().toISOString().split("T")[0]}
                className={`input ${inputErrors.dateFrom.error ? "border-red-500" : ''}`}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
            <label>Data Zakończenia</label>
            <input
                type="date"
                name="dateTo"
                value={formData.dateTo}
                min={formData.dateFrom}
                className={`input ${inputErrors.dateTo.error ? "border-red-500" : ''}`}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
            <button onClick={handleSubmit} className="btn btn-primary w-44 mt-3">
                {event ? "Zmień" : "Dodaj"}
            </button>
            </div>
        </div>
    )
}