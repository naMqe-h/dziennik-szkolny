import { AiFillInfoCircle } from "react-icons/ai";
import { RiBookMarkFill } from "react-icons/ri";
import { GiTeacher } from "react-icons/gi";
import {
  SingleStudentDataFromFirebase,
  SingleTeacherData,
} from "../../utils/interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useDocument } from "../../hooks/useDocument";
import { useEffect, useState } from "react";

export const Stats: React.FC = () => {
  const userData = useSelector(
    (state: RootState) => state.student.data
  ) as SingleStudentDataFromFirebase;
  const allClasses = useSelector(
    (state: RootState) => state.schoolData.schoolData?.classes
  );
  const { getDocument, document } = useDocument();
  const domain = userData.email.split("@")[1];
  const [studentClassTeacher, setStudentClassTeacher] = useState<
    SingleTeacherData | undefined
  >(undefined);
  const [frequence, setFrequence] = useState<number>(0);
  const userPhoto = useSelector(
    (state: RootState) => state.student.user?.photoURL
  );

  useEffect(() => {
    getDoc();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    const studentClass = userData.class;
    if (allClasses && allClasses[studentClass]) {
      if (
        userData.presence.length === 0 ||
        allClasses[studentClass].completedLessons.length === 0
      ) {
        setFrequence(100);
      } else {
        setFrequence(
          (100 * userData.presence.length) /
            allClasses[studentClass].completedLessons.length
        );
      }
    }
  }, [allClasses]);
  useEffect(() => {
    if (document) {
      setStudentClassTeacher(
        Object.values(document).find(
          (doc) => doc.classTeacher === userData.class
        )
      );
    }
    // eslint-disable-next-line
  }, [document]);

  const getDoc = async () => {
    await getDocument(domain, "teachers");
  };

  const getFrequenceClasses = (): string => {
    if (frequence < 51) {
      return "text-error";
    } else if (frequence < 80) {
      return "text-warning";
    } else {
      return "text-success";
    }
  };

  return (
    <div className="stats grid-flow-row w-full">
      <div className="stat bg-base-300">
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
          ) : (
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

      <div className="stat bg-base3200">
        <div className="stat-figure text-primary items-center">
          <AiFillInfoCircle size={35} className="text-primary" />
        </div>
        <div className="stat-title">Klasa</div>
        <div className="stat-value">{userData.class}</div>
      </div>

      <div className="stat bg-base-300">
        <div className="stat-figure text-primary items-center">
          <RiBookMarkFill size={35} className="text-primary" />
        </div>
        <div className="stat-title">Wychowawca</div>
        <div className="stat-value">
          {studentClassTeacher?.firstName}
          <br />
          {studentClassTeacher?.lastName}
        </div>
      </div>

      <div className="stat bg-base-300">
        <div className="stat-figure text-secondary">
          <GiTeacher size={35} className="text-primary" />
        </div>
        <div className="stat-title">Frekwencja</div>
        <div className={`stat-value ${getFrequenceClasses()}`}>
          {frequence}%
        </div>
        <div className="stat-desc text-success">↗︎ 22%</div>
      </div>
    </div>
  );
};