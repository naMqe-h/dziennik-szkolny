import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Profile } from "../components/settings/Profile";
import { RootState } from "../redux/store";
import {
  CombinedPrincipalData,
  CombinedSchoolInformationFromFirebase,
  PlanTypes,
  SchoolInformation,
  SingleStudentDataFromFirebase,
  SingleTeacherData,
  StudentsDataFromFirebase,
  TeachersDataFromFirebase,
  userType,
} from "../utils/interfaces";
import { useSetDocument } from "../hooks/useSetDocument";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { School } from "../components/settings/School";
import { Plan } from "../components/settings/Plan";
import { Password } from "../components/settings/Password";
import { updatePassword, updateProfile } from "firebase/auth";

export const Settings = () => {
  const { userType } = useSelector((state: RootState) => state.userType);
  const userData = useSelector((state: RootState) => {
    if (userType === "principals") {
      return state.principal.data;
    } else if (userType === "students") {
      return state.student.data;
    } else {
      return state.teacher.data;
    }
  });
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
    (state: RootState) => state.schoolData.schoolData?.information
  );
  const { type } = useParams();
  const { setDocument } = useSetDocument();
  const navigate = useNavigate();

  const [activeRoute, setActiveRoute] = useState(type);

  const possibleRoutes =
    userType === "principals"
      ? ["profile", "school", "plan", "password"]
      : ["profile", "password"];

  useEffect(() => {
    setActiveRoute(type);
    if (!possibleRoutes.some((x) => x === activeRoute)) {
      navigate("/settings/profile");
    }
    // eslint-disable-next-line
  }, [type]);

  const handleProfileSubmit = (
    data:
      | CombinedPrincipalData
      | SingleStudentDataFromFirebase
      | SingleTeacherData
  ) => {
    if (!userAuth || !userType) {
      return toast.error("Brak obiektu auth lub typu użytkownika", {
        autoClose: 2000,
      });
    }
    if (data.profilePicture !== userAuth.photoURL) {
      updateProfile(userAuth, {
        photoURL: data.profilePicture,
      })
        .then(() => {
          toast.success("Zdjęcie profilowe zostało zmienione.", {
            autoClose: 2000,
          });
        })
        .catch((error) => {
          toast.error(error, {
            autoClose: 2000,
          });
        });
    }
    if (userType === "principals") {
      const uid = userAuth?.uid;
      setDocument(userType, uid, data as CombinedPrincipalData);
    } else {
      const domain = userAuth.displayName?.split("~")[0];

      if (userType === "students") {
        let tempData: StudentsDataFromFirebase = {
          [data.email]: {
            ...(userData as SingleStudentDataFromFirebase),
            ...data,
          },
        };
        setDocument(domain as string, userType, tempData);
      } else {
        let tempData: TeachersDataFromFirebase = {
          [data.email]: { ...(userData as SingleTeacherData), ...data },
        };
        setDocument(domain as string, userType, tempData);
      }
    }
    // ! Usunąć po naprawie buga z brakiem aktualizacji stanu po
    // ! zmianie autha usera
    // window.location.reload();
    return toast.success("Dane zapisane.", { autoClose: 2000 });
  };
  const handlePlanChange = (plan: PlanTypes) => {
    if (!userAuth || !userType) {
      return toast.error("Brak obiektu auth lub typu użytkownika", {
        autoClose: 2000,
      });
    } else {
      if (userType === "principals") {
        const uid = userAuth?.uid;
        const domain = userAuth.displayName?.split("~")[0];

        setDocument(userType, uid, { planType: plan });
        setDocument(domain as string, "information", { planType: plan });
      }
    }
  };

  const handleSchoolSubmit = (data: SchoolInformation) => {
    if (!userAuth || !userType) {
      return toast.error("Brak obiektu auth lub typu użytkownika", {
        autoClose: 2000,
      });
    } else {
      const uid = userAuth?.uid;
      console.log(data);
      const dataForPrincipal = {
        ...userData,
        schoolInformation: data,
      };
      const dataForSchool = {
        ...schoolData,
        ...data,
      };
      setDocument(userType, uid, dataForPrincipal as CombinedPrincipalData);
      console.log(dataForSchool);
      setDocument(
        data.domain,
        "information",
        dataForSchool as CombinedSchoolInformationFromFirebase
      );
      return toast.success("Dane zapisane.", { autoClose: 2000 });
    }
  };

  const handlePasswordChange = (password: string) => {
    if (!userAuth || !userType) {
      return toast.error("Brak obiektu auth lub typu użytkownika", {
        autoClose: 2000,
      });
    }
    updatePassword(userAuth, password)
      .then(() => {
        return toast.success("Hasło zmienione pomyślnie", { autoClose: 2000 });
      })
      .catch((error) => {
        return toast.error(error, {
          autoClose: 2000,
        });
      });
  };
  return (
    <div className="h-full m-4">
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-5 max-w-screen-2xl w-full rounded-box md:border bg-base-200">
          <ul className="menu w-full p-3 rounded-tl-2xl rounded-bl-2xl hidden md:flex">
            <li className="menu-title">
              <span>Ustawienia</span>
            </li>
            <li
              className={`rounded-2xl ${
                activeRoute === "profile"
                  ? "bg-primary text-primary-content"
                  : ""
              }`}
            >
              <Link to="/settings/profile">Edytuj profil</Link>
            </li>
            {userType === "principals" ? (
              <>
                <li
                  className={`rounded-2xl ${
                    activeRoute === "school"
                      ? "bg-primary text-primary-content"
                      : ""
                  }`}
                >
                  <Link to="/settings/school">Ustawienia szkoły</Link>
                </li>
                <li
                  className={`rounded-2xl ${
                    activeRoute === "plan"
                      ? "bg-primary text-primary-content"
                      : ""
                  }`}
                >
                  <Link to="/settings/plan">Zmień plan</Link>
                </li>
              </>
            ) : (
              ""
            )}
            <li
              className={`rounded-2xl ${
                activeRoute === "password"
                  ? "bg-primary text-primary-content"
                  : ""
              }`}
            >
              <Link to="/settings/password">Zmień hasło</Link>
            </li>
          </ul>

          {/* // mobile view */}
          <div className="collapse rounded-tl-2xl rounded-tr-2xl collapse-arrow md:hidden">
            <input type="checkbox" />
            <div className="collapse-title text-xl font-medium">Ustawienia</div>
            <div className="collapse-content">
              <ul className="menu w-full p-3 rounded-tl-2xl rounded-bl-2xl flex">
                <li
                  className={`rounded-2xl ${
                    activeRoute === "profile"
                      ? "bg-primary text-primary-content"
                      : ""
                  }`}
                >
                  <Link to="/settings/profile">Edytuj profil</Link>
                </li>
                {userType === "principals" ? (
                  <>
                    <li
                      className={`rounded-2xl ${
                        activeRoute === "school"
                          ? "bg-primary text-primary-content"
                          : ""
                      }`}
                    >
                      <Link to="/settings/school">Ustawienia szkoły</Link>
                    </li>
                    <li
                      className={`rounded-2xl ${
                        activeRoute === "plan"
                          ? "bg-primary text-primary-content"
                          : ""
                      }`}
                    >
                      <Link to="/settings/plan">Zmień plan</Link>
                    </li>
                  </>
                ) : (
                  ""
                )}
                <li
                  className={`rounded-2xl ${
                    activeRoute === "password"
                      ? "bg-primary text-primary-content"
                      : ""
                  }`}
                >
                  <Link to="/settings/password">Zmień hasło</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-span-4 bg-base-300 md:rounded-tr-2xl rounded-br-2xl rounded-bl-2xl md:rounded-bl-none min-h-[600px]">
            {type === "profile" && (
              <Profile
                userType={userType as userType}
                userData={
                  userData as
                    | CombinedPrincipalData
                    | SingleStudentDataFromFirebase
                    | SingleTeacherData
                }
                userProfilePicture={userAuth?.photoURL}
                save={handleProfileSubmit}
              />
            )}
            {type === "school" && (
              <School
                schoolData={schoolData as CombinedSchoolInformationFromFirebase}
                save={handleSchoolSubmit}
              />
            )}
            {type === "plan" && (
              <Plan
                currentPlanType={schoolData?.planType as PlanTypes}
                planChange={handlePlanChange}
              />
            )}
            {type === "password" && <Password save={handlePasswordChange} />}
          </div>
        </div>
      </div>
    </div>
  );
};
