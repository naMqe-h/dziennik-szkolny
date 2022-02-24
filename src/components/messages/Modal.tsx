import React, {  useEffect, useState } from "react"
import { AiOutlineClose } from "react-icons/ai";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useSetDocument } from "../../hooks/useSetDocument";
import { useDocument } from "../../hooks/useDocument";
import { useValidateInputs } from "../../hooks/useValidateInputs";
import { RootState } from "../../redux/store";
import { CombinedPrincipalData, messagesStateModalItf, singleMessage } from "../../utils/interfaces";

interface messagesModalItf{
    modalOptions: messagesStateModalItf ;
    setModalOptions: React.Dispatch<React.SetStateAction<messagesStateModalItf>>;
}

export const Modal:React.FC<messagesModalItf> = ({modalOptions, setModalOptions}) => {

    const userType = useSelector((state: RootState) => state.userType.userType);
    const userData = useSelector((state: RootState) => {
        if(userType === 'principals'){
            return state.principal.data
        } else if (userType === 'teachers'){
            return state.teacher.data
        } else {
            return state.student.data
        }
    }) 
    const principalUid = useSelector((state: RootState) => state.principal.user?.uid);
    const schoolData = useSelector((state: RootState) => state.schoolData.schoolData);
    const domain = schoolData?.information?.domain;
    const initialFormData:singleMessage = {
        date: new Date().toISOString().split("T")[0],
        title: '',
        author: userData?.email ? userData.email : '',
        status: 'Seen',
        content: '',
        reciver: [modalOptions.reciever !== 'principal' ? (modalOptions.reciever?.email ? modalOptions.reciever.email : '') : ('principal')]
    }

    const [formData, setFormData] = useState<singleMessage>(initialFormData);
    const [validated, setValidated] = useState(false)
    const [principalDoc, setPrincipalDoc] = useState<CombinedPrincipalData | undefined>(undefined)
    const { validateData, inputErrors, errors } = useValidateInputs();
    const { setDocument } = useSetDocument();
    const { getDocument, document } = useDocument();
    

    

    useEffect(() => {
        if(principalUid && (modalOptions.reciever === 'principal' || formData.reciver[0] === 'principal')){
            getDocument('principals', principalUid) 
        }
    }, [principalUid, formData])

    useEffect(() => {
        if(document){
             setPrincipalDoc(document as CombinedPrincipalData);
        }
    }, [document])
    
    
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            reciver: [modalOptions.reciever !== 'principal' ? (modalOptions.reciever?.email ? modalOptions.reciever.email : '') : ('principal')]
        }));
    }, [modalOptions])
    

    useEffect(() => {
        if (validated) {
          if (errors) return;
          if (!userData){
            toast.error("brak danych użytkownika", {autoClose:2000})  
            return
          }
          if(!domain) {
              toast.error("Brak informacji o domenie szkoły", {autoClose: 2000})
              return
          }
          
          // ustawienie wartosci sended
          const userMessages = userData.messages;
          if(userType === 'principals'){
              if(!principalUid || !userMessages) {
                  toast.error('Brak uid użytkownika lub obiektu wiadomości', {autoClose: 2000});
                  return
                }

                setDocument(userType, principalUid, {messages:{
                    recived:[...userMessages.recived],
                    sended: [...userMessages.sended, formData]
                }})

          } else {
              if(!userMessages || !userType) {
                  toast.error('Brak obiektu wiadomości lub informacji o domenie szkoły lub typu użytkownika', {autoClose: 2000})
                  return
              }
              const dbObj = {[userData.email]: 
                {messages:{
                    recived:[...userMessages.recived],
                    sended: [...userMessages.sended, formData]
                }}
            }
              setDocument(domain, userType, dbObj);
          }

          // ustawienie wartości recived
          if(formData.reciver[0] === 'principal'){
            if(!principalDoc || !principalUid){
                toast.error('Brak obiektu wiadomości dyrektora lub uid')
                return
            }
            const principalMessages = principalDoc.messages;
            const dbObj = {messages:{
                recived:[...principalMessages.recived, {...formData, status: 'Unseen'}],
                sended: [...principalMessages.sended]
            }}

            setDocument('principals', principalUid, dbObj)

          } else {
            if(!schoolData){
                toast.error('Brak obiektu danych szkoły lub domeny', {autoClose: 2000})
                return
            }
            const teacherReciever = Object.values(schoolData?.teachers).find((teacher) => teacher.email === formData.reciver[0])

            const studentReciever = Object.values(schoolData?.students).find((student) => student.email === formData.reciver[0])

            if(teacherReciever){
                const teacherMessages = teacherReciever?.messages;
                if(!teacherMessages){
                    toast.error('Brak obiektu wiadomości użytkownika')
                    return
                }
                const dbObj = {[teacherReciever.email]: 
                    {messages:{
                        recived:[...teacherMessages.recived, {...formData, status: 'Unseen'}],
                        sended: [...teacherMessages.sended]
                    }}
                }
                
                setDocument(domain, 'students', dbObj)
            } else {
                const studentMessages = studentReciever?.messages;
                if(!studentMessages){
                    toast.error('Brak obiektu wiadomości użytkownika')
                    return
                }
                const dbObj = {[studentReciever.email]: 
                    {messages:{
                        recived:[...studentMessages.recived, {...formData, status: 'Unseen'}],
                        sended: [...studentMessages.sended]
                    }}
                }
                
                setDocument(domain, 'students', dbObj)
            }
          }
          toast.success('Wiadomość została wysłana', {autoClose: 2000})
          setFormData(initialFormData);
        }
        setValidated(false);
      }, [validated, errors]);


    const handleChange = (name: string, value: string, checked?: Boolean) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        }


    const handleSubmit = () => {
        setValidated(false);
        validateData(formData);
        setValidated(true);
    };


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
               Wyślij wiadomość do {modalOptions.reciever !== 
            'principal' ? modalOptions.reciever?.firstName +" "+ modalOptions.reciever?.lastName : 'Dyrektora'}
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
            <button onClick={() => handleSubmit()} className="btn btn-primary w-44 mt-3">
                Wyślij
            </button>
            </div>
        </div>
    )
}