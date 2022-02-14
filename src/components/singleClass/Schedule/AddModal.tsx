import React, { useEffect, useState } from "react"
import { AiOutlineClose } from "react-icons/ai"
import { useValidateInputs } from "../../../hooks/useValidateInputs"

interface addModalItf{
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    teacherEmail: string;
    singleClassName: string | undefined;
    add: (data: any) => void;
}

export const AddModal:React.FC<addModalItf> = ({isOpen, setIsOpen, teacherEmail, singleClassName, add}) => {

    const initialFormData = {
        name: '',
        date: Date.now().toLocaleString(),
        teacher: teacherEmail
    }
    const [formData, setFormData] = useState(initialFormData);
    const [validated, setValidated] = useState(false)
    const { validateData, inputErrors, errors } = useValidateInputs();
    

    useEffect(() => {
        if(validated){
            if(errors) return;
            add(formData)

        }
        setValidated(false);
    }, [validated, errors])
    


    const handleChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev, [name]:value
        }));
    }

    const handleSubmit = () => {
        setValidated(false);
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
                Dodaj wydarzenie
            </h2>
            <label>Nazwa</label>
            <input 
                type="text" 
                name="name"
                value={formData.name} 
                className={`input ${inputErrors.name.error ? "border-red-500" : ''}`}
                onChange={(e) => handleChange(e.target.name, e.target.value)} />
            <label>Data</label>
            <input
                type="date"
                name="date"
                value={formData.date}
                min={new Date().toISOString().split("T")[0]}
                className={`input ${inputErrors.date.error ? "border-red-500" : ''}`}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
            <button onClick={handleSubmit} className="btn btn-primary w-44 mt-3">
                Dodaj
            </button>
            </div>
        </div>
    )
}