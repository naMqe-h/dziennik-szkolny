import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useSetDocument } from "../../../hooks/useSetDocument";
import { RootState } from "../../../redux/store";
import { SingleClassData } from "../../../utils/interfaces"
import { AddModal } from "./AddModal"
import { ScheduleTable } from "./ScheduleTable"


interface scheduleItf{
    singleClass: SingleClassData | undefined;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    userData: any;
    domain: string | undefined;
}
export const Schedule:React.FC<scheduleItf> = ({singleClass, isOpen, setIsOpen, userData, domain}) => {

    const userType = useSelector((state: RootState) => state.userType.userType); 


    const { setDocument } = useSetDocument();

    console.log(singleClass);
    const handleAdd = (data: any) => {
        if(singleClass && domain){
            let objWrapper = {
                [singleClass.name]: {schedule: [...singleClass?.schedule, data]}
            }
            setDocument(domain as string, "classes", objWrapper);
            toast.success("Wydarzenie zostało dodane.", {autoClose: 2000});
        } else{
            toast.error("Brak obiektu klasy", {autoClose: 2000})
        }
    }


    const handleEdit = (data: any, oldItem: any) => {
        if(singleClass && domain){
            let oldSchedule = singleClass.schedule;
            let newSchedule = oldSchedule.filter((item) => item !== oldItem);
            newSchedule.push(data);


            console.log({oldSchedule ,newSchedule});
            console.log(domain);
            let objWrapper = {
                [singleClass.name]: {schedule: newSchedule}
            }
            setDocument(domain as string, "classes", objWrapper);
            toast.success("Edycja wydarzenia została wykonana.", {autoClose: 2000});
        } else{
            toast.error("Brak obiektu klasy", {autoClose: 2000})
        }
    }
    
    return(
        <div>
            <AddModal isOpen={isOpen} setIsOpen={setIsOpen} teacherEmail={userData.email} add={handleAdd} />
            {singleClass?.schedule ? (
                <ScheduleTable schedule={singleClass.schedule} userEmail={userData.email} userType={userType} edit={handleEdit} />
            ) : ("Brak wydarzeń") }
        </div>
    )
}