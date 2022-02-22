import React, {  useState } from "react"
import { AiOutlineClose } from "react-icons/ai";
import { useSelector } from "react-redux";
import makeAnimated from 'react-select/animated';
import { useValidateInputs } from "../../hooks/useValidateInputs";
import { RootState } from "../../redux/store";
import { messagesStateModalItf, singleMessage } from "../../utils/interfaces";

interface messagesModalItf{
    modalOptions: messagesStateModalItf ;
    setModalOptions: React.Dispatch<React.SetStateAction<messagesStateModalItf>>;
}

export const Modal:React.FC<messagesModalItf> = ({modalOptions, setModalOptions}) => {

    const userType = useSelector((state: RootState) => state.userType.userType);
    const userEmail = useSelector((state: RootState) => {
        if(userType === 'principals'){
            return state.principal.data?.email
        } else if (userType === 'teachers'){
            return state.teacher.data?.email
        } else {
            return state.student.data?.email
        }
    }) 

    const initialFormData:singleMessage = {
        date: new Date().toISOString().split("T")[0],
        title: '',
        author: userEmail ? userEmail : '',
        status: 'Seen',
        content: '',
        reciver: [modalOptions.reciever?.email ? modalOptions.reciever.email : '']
    }

    const [formData, setFormData] = useState<singleMessage>(initialFormData);
    const animatedComponents = makeAnimated();

    const { validateData, inputErrors, errors } = useValidateInputs();


  const handleChange = (name: string, value: string, checked?: Boolean) => {
    setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
//   const handleSubmit = () => {
//     setValidated(false);
//     validateData(formData);
//     setValidated(true);
//   };
  if(!modalOptions.reciever) return null
  return (
    <div className={`modal ${modalOptions.isOpen ? "modal-open" : ""} `}>
      <div className="modal-box flex flex-col items-center gap-2 bg-base-300">
        <AiOutlineClose
          onClick={() => setModalOptions({
              isOpen: false,
              reciever: null
          })}
          size={30}
          className="absolute top-2 right-2 cursor-pointer"
        />
            <h2 className="mb-3">
               Wyślij wiadomość do {modalOptions.reciever?.firstName +" "+ modalOptions.reciever?.lastName}
            </h2>
            <label htmlFor="title">tytuł</label>
            <input 
                type="text" 
                name="title"
                value={formData.title} 
                className={`input w-full ${inputErrors.title.error ? "border-red-500" : ''}`}
                onChange={(e) => handleChange(e.target.name, e.target.value)} />
            <label htmlFor="content">Treść</label>
            <textarea
                name="content"
                value={formData.content}
                className={`textarea w-full min-h-[10rem] ${inputErrors.content.error ? "border-red-500" : ''}`}
                onChange={(e) => handleChange(e.target.name, e.target.value)}    
            />
            <button onClick={() => undefined} className="btn btn-primary w-44 mt-3">
                Wyślij
            </button>
            </div>
        </div>
    )
}