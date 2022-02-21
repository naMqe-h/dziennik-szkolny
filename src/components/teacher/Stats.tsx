import { AiFillInfoCircle } from "react-icons/ai";
import { RiBookMarkFill } from "react-icons/ri";
import { GiTeacher } from "react-icons/gi";
import { SingleTeacherData } from "../../utils/interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { union } from "lodash";

export const Stats: React.FC = () => {
    const userData = useSelector(
        (state: RootState) => state.teacher.data
    ) as SingleTeacherData;
    const userPhoto = useSelector((state: RootState) => state.teacher.user?.photoURL)



    return (
        <div className="stats grid-flow-row w-full">
        <div className="stat bg-base-200">
            <div className="stat-figure text-info">
            {userPhoto ? (
                    <div className="avatar online">
                    <div className="w-16 h-16 p-1 mask mask-squircle bg-base-100">
                        <img
                            src={userPhoto}
                            alt="Avatar Tailwind CSS Component"
                            className="mask mask-squircle"
                        />
                    </div>
                    </div>
                ):(
                    <div className="avatar online placeholder flex flex-col justify-center items-center">

                        <div className="text-neutral-content rounded-full w-16 h-16 p-1 mask mask-squircle bg-base-100">

                            <span className="text-3xl">
                            {userData?.firstName[0]}
                            {userData?.lastName[0]}
                            </span>
                        </div>
                    </div>
                )}
            </div>
            <div className="stat-title">Witaj,</div>
            <div className="stat-value">{userData.firstName}</div>
        </div>

        <div className="stat bg-base-200">
            <div className="stat-figure text-primary items-center">
            <AiFillInfoCircle size={35} className="text-primary" />
            </div>
            <div className="stat-title">Wychowawca klasy</div>
            <div className="stat-value">{userData.classTeacher.length > 0 ? userData.classTeacher : "Nie dotyczy"}</div>
        </div>

        <div className="stat bg-base-200">
            <div className="stat-figure text-primary items-center">
            <RiBookMarkFill size={35} className="text-primary" />
            </div>
            <div className="stat-title">Uczony przedmiot</div>
            <div className="stat-value">{userData.subject.split(' ').map((word, i) => {
                if(i !== 0){
                    return <span key={word+i}><br/>{word}</span>
                }
                return word
            })}</div>
        </div>

        <div className="stat bg-base-200">
            <div className="stat-figure text-secondary">
            <GiTeacher size={35} className="text-primary" />
            </div>
            <div className="stat-title">Uczone klasy</div>
            <div className="stat-value">{union(userData.teachedClasses,userData.classTeacher!=="" ? [userData.classTeacher]:[]).length}</div>
        </div>
        </div>
    );
};
