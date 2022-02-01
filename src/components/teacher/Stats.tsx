import { AiFillInfoCircle } from "react-icons/ai";
import { RiBookMarkFill } from "react-icons/ri";
import { GiTeacher } from "react-icons/gi";
import { SingleTeacherData } from "../../utils/interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export const Stats: React.FC = () => {
    const userData = useSelector(
        (state: RootState) => state.teacher.data
    ) as SingleTeacherData;


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
            <div className="stat-title">Wychowawca klasy</div>
            <div className="stat-value">{userData.classTeacher.length > 0 ? userData.classTeacher : "brak wychowawstwa"}</div>
        </div>

        <div className="stat bg-base-200">
            <div className="stat-figure text-primary items-center">
            <RiBookMarkFill size={35} className="text-primary" />
            </div>
            <div className="stat-title">Uczony przedmiot</div>
            <div className="stat-value">{userData.subject.split(' ').map((word, i) => {
                if(i !== 0){
                    return <span><br/>{word}</span>
                }
                return word
            })}</div>
        </div>

        <div className="stat bg-base-200">
            <div className="stat-figure text-secondary">
            <GiTeacher size={35} className="text-primary" />
            </div>
            <div className="stat-title">Uczone klasy</div>
            <div className="stat-value">{userData.teachedClasses.length}</div>
        </div>
        </div>
    );
};
