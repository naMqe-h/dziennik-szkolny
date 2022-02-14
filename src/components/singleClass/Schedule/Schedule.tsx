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
}
export const Schedule:React.FC<scheduleItf> = ({singleClass, isOpen, setIsOpen, userData}) => {

    const userType = useSelector((state: RootState) => state.userType.userType); 

    const domain = userData.email.split("@")[1];

    const { setDocument } = useSetDocument();

    console.log(singleClass);
    const handleAdd = (data: any) => {
        if(singleClass){
            let objWrapper = {
                [singleClass.name]: {schedule: [...singleClass?.schedule, data]}
            }
            setDocument(domain as string, "classes", objWrapper);
            toast.success("Wydarzenie zostało dodane.", {autoClose: 2000});
        } else{
            toast.error("Brak obiektu klasy", {autoClose: 2000})
        }
    }

    return(
        <div>
            {userType === 'teachers' && (
                <AddModal isOpen={isOpen} setIsOpen={setIsOpen} teacherEmail={userData.email} singleClassName={singleClass?.name} add={handleAdd} />
            )}
            {singleClass?.schedule ? (
                <ScheduleTable schedule={singleClass.schedule} userEmail={userData.email} userType={userType} />
            ) : ("Brak wydarzeń") }
        </div>
    )
}