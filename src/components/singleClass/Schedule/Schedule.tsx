import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useSetDocument } from "../../../hooks/useSetDocument";
import { RootState } from "../../../redux/store";
import { eventsFromFirebase, scheduleItem, scheduleItemsArray, SingleClassData } from "../../../utils/interfaces"
import { AddModal } from "./AddModal"
import { ScheduleTable } from "./ScheduleTable"


interface scheduleItf{
    singleClass: SingleClassData | undefined;
    events: eventsFromFirebase | undefined;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    userData: any;
    domain: string | undefined;
}
export const Schedule:React.FC<scheduleItf> = ({singleClass, events, isOpen, setIsOpen, userData, domain}) => {

    // selectors
    const userType = useSelector((state: RootState) => state.userType.userType); 

    // states
    const [classEvents, setClassEvents] = useState<scheduleItemsArray>()

    // hooks
    const { setDocument } = useSetDocument();

    useEffect(() => {
        if(events){
            setClassEvents(events?.classes.filter((classObj) => classObj.receiver.some((rec) => rec === singleClass?.name)  ));
        }
    }, [])
    
    useEffect(() => {
      console.log(classEvents);
    }, [classEvents])
    

    const handleAdd = (data: any) => {
        if(domain && events){
            
            setDocument(domain as string, "events", {classes: [...events.classes, data ]});

            toast.success("Wydarzenie zostało dodane.", {autoClose: 2000});
        } else{
            toast.error("Brak obiektu wydarzeń lub domeny szkoły", {autoClose: 2000})
        }
    }


    const handleEdit = (data: any, oldItem: any) => {
        if(events && domain){
            let oldEvents = events.classes.filter((ev) => ev !== oldItem);

            setDocument(domain as string, "events", {classes: [
                ...oldEvents, data
            ]});
            toast.success("Edycja wydarzenia została wykonana.", {autoClose: 2000});
        } else{
            toast.error("Brak obiektu klasy", {autoClose: 2000})
        }
    }
    if(!singleClass) return <div>Brak obiektu klasy</div>
    return(
        <div>
            <AddModal isOpen={isOpen} setIsOpen={setIsOpen} userEmail={userData.email} add={handleAdd} reciever={[singleClass.name]}/>
            {classEvents ? (
                <ScheduleTable schedule={classEvents} userEmail={userData.email} userType={userType} edit={handleEdit} />
            ) : ("Brak wydarzeń") }
        </div>
    )
}
