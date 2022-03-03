import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { RootState } from "../../redux/store";

// react icons
import { HiOutlineMail } from "react-icons/hi";
import { CgGenderMale, CgGenderFemale, CgWebsite } from "react-icons/cg";
import { FaBirthdayCake, FaCity } from "react-icons/fa";
import { AiFillInfoCircle } from "react-icons/ai";
import { MdOutlineSchool } from "react-icons/md";

export const Profile = () => {
  const userType = useSelector((state: RootState) => state.userType.userType);

  const userData: any = useSelector((state: RootState) => {
    if (userType === "principals") {
      return state.principal.data;
    } else if (userType === "students") {
      return state.student.data;
    } else {
      return state.teacher.data;
    }
  });
  // eslint-disable-next-line
  const userAuth = useSelector((state: RootState) => {
    if (userType === "principals") {
      return state.principal.user;
    } else if (userType === "students") {
      return state.student.user;
    } else {
      return state.teacher.user;
    }
  });

  const schoolData = useSelector(
    (state: RootState) => state.schoolData.schoolData
  );

  const navigate = useNavigate();
  //   if(schoolData)
  //   console.log(Object.values(schoolData?.classes))

  return (
    <div className="h-full m-4">
      <div className="flex justify-center">
        <div className="max-w-screen-2xl w-full rounded-box md:border bg-base-200">
          <div className="flex flex-col justify-center items-center p-10">
            <div className="avatar placeholder flex flex-col justify-center items-center">
              {userData?.profilePicture ? (
                <div className="avatar flex flex-col justify-center items-center">
                  <div className="mb-8 rounded-full w-32 h-32">
                    <img src={userData.profilePicture} alt="Student" />
                  </div>
                </div>
              ) : (
                <div className="bg-neutral-focus text-neutral-content rounded-full w-32 h-32 mb-8">
                  <span className="text-3xl">
                    {userData?.firstName[0]}
                    {userData?.lastName[0]}
                  </span>
                </div>
              )}
              <div className="text-xl flex flex-col justify-center items-center">
                <span>
                  {userData?.firstName + " "} {userData?.lastName}
                </span>
                {(userType === "teachers") ? (
                  <Link
                    to={`/class/${ userData.classTeacher }/info`}
                    className="mt-2"
                  >
                    <span className="text-accent">{userData?.classTeacher}</span>{" "}
                  </Link>
                ) : (
                  <span className="text-accent mt-2">{userData?.class}</span>
                )}
              </div>
              <div className="pt-5">
                <button
                  className="btn btn-warning"
                  onClick={() => navigate("/settings/profile")}
                >
                  Edytuj
                </button>
              </div>
            </div>
          </div>
          <div className="bg-base-300 rounded-b-2xl">
            <div className="p-10 flex flex-col h-full items-center justify-evenly">
              <div className="card-title divider w-full">Dane osobiste</div>

              <div className="grid grid-cols-1 md:grid-cols-2 mb-6 w-full">
                <div className="flex items-center text-xl p-5">
                  <HiOutlineMail className="mr-2 text-primary" />
                  Email: {userData?.email}
                </div>
                <div className="flex items-center text-xl p-5">
                  <FaBirthdayCake className="mr-2 text-primary" />
                  Data urodzenia: {userData?.birth}
                </div>
                <div className="flex items-center text-xl p-5">
                  {userData?.gender !== "Kobieta" ? (
                    <CgGenderMale className="mr-2 text-primary" />
                  ) : (
                    <CgGenderFemale className="mr-2 text-primary" />
                  )}
                  Płeć: {userData?.gender}
                </div>
                {userType !== "teachers" && (
                  <div className="flex items-center text-xl p-5">
                    <AiFillInfoCircle className="mr-2 text-primary" />
                    Pesel: {userData?.pesel}
                  </div>
                )}
              </div>
              <div className="card-title divider w-full">Dane szkoły</div>
              <div className="grid grid-cols-1 md:grid-cols-2 mb-6 w-full">
                <div className="flex items-center text-xl p-5">
                  <CgWebsite className="mr-2 text-primary" />
                  Domena: {schoolData?.information.domain}
                </div>

                <div className="flex items-center text-xl p-5">
                  <AiFillInfoCircle className="mr-2 text-primary" />
                  Nazwa: {schoolData?.information.name}
                </div>
                <div className="flex items-center text-xl p-5">
                  <MdOutlineSchool className="mr-2 text-primary" />
                  Rodzaj: {schoolData?.information?.type}
                </div>
                <div className="flex items-center text-xl p-5">
                  <FaCity className="mr-2 text-primary" />
                  Miasto: {schoolData?.information?.address?.city}
                </div>
              </div>
              {userType === "principals" && (
                <>
                  <div className="card-title divider w-full">
                    Dane szkolne dyrektora
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 mb-6 w-full">
                    <div className="flex items-center text-xl p-5">
                      <CgWebsite className="mr-2 text-primary" />
                      Ilość klas: {schoolData?.information.classesCount}
                    </div>

                    <div className="flex items-center text-xl p-5">
                      <AiFillInfoCircle className="mr-2 text-primary" />
                      ilość uczniów: {schoolData?.information.studentsCount}
                    </div>
                    <div className="flex items-center text-xl p-5">
                      <MdOutlineSchool className="mr-2 text-primary" />
                      Ilość nauczycieli:{" "}
                      {schoolData?.information?.teachersCount}
                    </div>
                    <div className="flex items-center text-xl p-5">
                      <FaCity className="mr-2 text-primary" />
                      Ilość przedmiotów:{" "}
                      {schoolData?.information?.subjectsCount}
                    </div>
                  </div>
                </>
              )}
              {userType === "teachers" && (
                <>
                  <div className="card-title divider w-full">
                    Dane Nauczyciela
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 mb-6 w-full">
                    <div className="flex items-center text-xl p-5">
                      <CgWebsite className="mr-2 text-primary" />
                      Wychowawstwo:{" "}
                      {userData?.classTeacher ? (
                        <Link to={`/class/${userData?.classTeacher}/info`}>
                          {userData?.classTeacher}
                        </Link>
                      ) : (
                        "Brak"
                      )}
                    </div>
                    <div className="flex items-center text-xl p-5">
                      <AiFillInfoCircle className="mr-2 text-primary" />
                      Uczone klasy: {userData?.teachedClasses.length}
                    </div>
                    <div className="flex items-center text-xl p-5">
                      <MdOutlineSchool className="mr-2 text-primary" />
                      Uczony przedmiot: {userData?.subject}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
