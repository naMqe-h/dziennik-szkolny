import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Profile } from "../components/settings/Profile";
import { RootState } from "../redux/store";
import { CombinedPrincipalData, CombinedSchoolInformationFromFirebase, SchoolInformation, StudentData, StudentsDataFromFirebase, TeacherData, TeachersDataFromFirebase, userType } from "../utils/interfaces";
import { useAddDocument } from "../hooks/useAddDocument";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { School } from "../components/settings/School";
import { Plan } from "../components/settings/Plan";




export const Settings = () => {
  const userType = useSelector((state: RootState) => state.user.userType);
  const userData = useSelector((state: RootState) => state.user.data);
  const userAuth = useSelector((state: RootState) => state.user.user);
  const schoolData = useSelector((state: RootState) => state.user.schoolData?.information)
  const { type } = useParams();
  const { addDocument } = useAddDocument();
  const navigate = useNavigate()

  const [activeRoute, setActiveRoute] = useState(type);

  const possibleRoutes = userType === "principals" ? ["profile", "school", "plan"] : ["profile"];

  useEffect(() => {
    
  }, []);
  

  useEffect(() => {
    setActiveRoute(type);
    if(!possibleRoutes.some(x => x === activeRoute)){
      navigate('/settings/profile');
    }
  }, [type]);
  

  const handleProfileSubmit = (data: CombinedPrincipalData | StudentData | TeacherData) => {
    if(!userAuth || !userType){
      return toast.error("Brak obiektu auth lub typu użytkownika", { autoClose: 2000 });
    }
    if(userType === "principals"){
        const uid = userAuth?.uid
        addDocument(userType, uid, data as CombinedPrincipalData);
    } 
    // TODO kiedy bedzie gotowe logowanie ucznia i nauczyicela
    // else {
    //   const domain = userAuth.displayName?.split("~")[0];
    //   if(userType ==="students"){
    //     let tempData: StudentsDataFromFirebase= {[data.email]: data };
    //   }
    //   console.log(tempData);
    //   addDocument(domain as string, userType, data )
    // }
    

  }

  const handleSchoolSubmit = (data: SchoolInformation) => {
    if(!userAuth || !userType){
      return toast.error("Brak obiektu auth lub typu użytkownika", { autoClose: 2000 });
    } else {
      const uid = userAuth?.uid
      const dataForPrincipal = {
        ...userData,
        schoolInformation: data
      }
      const dataForSchool = {
        ...schoolData,
        ...data
      }
      addDocument(userType, uid, dataForPrincipal as CombinedPrincipalData);

      addDocument(data.domain, "information", dataForSchool as CombinedSchoolInformationFromFirebase)
    }

  }
  
  return (
    <div className="h-full m-4">
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-5 max-w-screen-2xl w-full rounded-box border bg-base-200">
          <ul className="menu w-full p-3 rounded-tl-2xl rounded-bl-2xl">
            <li className="menu-title">
              <span>Ustawienia</span>
            </li>
            <li className={`rounded-2xl ${activeRoute ==="profile" ? "bg-primary" : ""}`}>
              <Link to="/settings/profile">Edytuj Profil</Link>
            </li>
            {userType ==="principals" ?<>
              <li className={`rounded-2xl ${activeRoute ==="school" ? "bg-primary" : ""}`}>
                <Link to="/settings/school">Ustawienia szkoły</Link>
              </li><li className={`rounded-2xl ${activeRoute ==="plan" ? "bg-primary" : ""}`}>
               <Link to="/settings/plan">Plan</Link>
              </li>
            </> : ""
            }
            <li className={activeRoute ==="" ? "" : ""}>
              <a>Prywatność</a>
            </li>
            
          </ul>
          <div className="col-span-4 bg-base-300 rounded-tr-2xl rounded-br-2xl min-h-[600px]">

              
              {type === "profile" && <Profile userType={userType as userType} userData={userData as CombinedPrincipalData} save={handleProfileSubmit}/>}
              {type === "school" && <School schoolData={schoolData as CombinedSchoolInformationFromFirebase} save={handleSchoolSubmit}/>}
              {type === "plan" && <Plan />}
              

          </div>
        </div>
      </div>
    </div>
  );
};
