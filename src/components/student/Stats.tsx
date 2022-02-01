import { AiFillInfoCircle } from "react-icons/ai";
import { RiBookMarkFill } from "react-icons/ri";
import { GiTeacher } from "react-icons/gi";
import { SingleStudentDataFromFirebase, SingleTeacherData } from "../../utils/interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useDocument } from "../../hooks/useDocument";
import { useEffect, useState } from "react";

export const Stats: React.FC = () => {
    const userData = useSelector(
        (state: RootState) => state.student.data
    ) as SingleStudentDataFromFirebase;
    const { getDocument, document } = useDocument();
    const domain = userData.email.split("@")[1];
    const [studentClassTeacher, setStudentClassTeacher] = useState<SingleTeacherData | undefined>(undefined);

    const frequence = 70;

    useEffect(() => {
        getDoc();
        // eslint-disable-next-line
    },[]);

    useEffect(() => {
        if(document){
            setStudentClassTeacher(Object.values(document).find((doc) => doc.classTeacher === userData.class));
        }
        // eslint-disable-next-line
    },[document])    

    const getDoc = async () => {
        await getDocument(domain, 'teachers'); 
    }

    const getFrequenceClasses = ():string => {
        if(frequence < 51){
            return 'text-error';
        } else if(frequence < 80){
            return 'text-warning';
        } else {
            return 'text-success';
        }
    }

  

    return (
        <div className="stats grid-flow-row w-full">
        <div className="stat bg-base-200">
            <div className="stat-figure text-info">
            <div className="avatar online">
                <div className="w-16 h-16 p-1 mask mask-squircle bg-base-100">
                <img
                    src="https://images.unsplash.com/photo-1546456073-92b9f0a8d413?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                    alt="Avatar Tailwind CSS Component"
                    className="mask mask-squircle"
                />
                </div>
            </div>
            </div>
            <div className="stat-title">Witaj,</div>
            <div className="stat-value">{userData.firstName}</div>
        </div>

        <div className="stat bg-base-200">
            <div className="stat-figure text-primary items-center">
            <AiFillInfoCircle size={35} className="text-primary" />
            </div>
            <div className="stat-title">Klasa</div>
            <div className="stat-value">{userData.class}</div>
        </div>

        <div className="stat bg-base-200">
            <div className="stat-figure text-primary items-center">
            <RiBookMarkFill size={35} className="text-primary" />
            </div>
            <div className="stat-title">Wychowawca</div>
            <div className="stat-value">{studentClassTeacher?.firstName}<br/>{studentClassTeacher?.lastName}</div>
        </div>

        <div className="stat bg-base-200">
            <div className="stat-figure text-secondary">
            <GiTeacher size={35} className="text-primary" />
            </div>
            <div className="stat-title">Frekwencja</div>
            <div className={`stat-value ${getFrequenceClasses()}`}>{frequence}%</div>
            <div className="stat-desc text-success">↗︎ 22%</div>
        </div>
        </div>
    );
};
