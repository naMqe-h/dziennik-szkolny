import { useSelector } from "react-redux";
import { Profile } from "../components/settings/Profile";
import { RootState } from "../redux/store";
import { PrincipalPersonalInformation, userType } from "../utils/interfaces";



export const Settings = () => {
  const userType = useSelector((state: RootState) => state.user.userType);
  const userData = useSelector((state: RootState) => state.user.data);
  
  return (
    <div className="h-full m-4">
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-5 max-w-screen-2xl w-full rounded-box border bg-base-200">
          <ul className="menu w-full p-3 rounded-tl-2xl rounded-bl-2xl">
            <li className="menu-title">
              <span>Ustawienia</span>
            </li>
            <li>
              <a>Edytuj profil</a>
            </li>
            <li>
              <a>Ustawienia szkoły</a>
            </li>
            <li>
              <a>Prywatność</a>
            </li>
            <li>
              <a>Plan</a>
            </li>
          </ul>
          <div className="col-span-4 bg-base-300 rounded-tr-2xl rounded-br-2xl min-h-[600px]">
              <Profile userType={userType as userType} userData={userData as PrincipalPersonalInformation} />


          </div>
        </div>
      </div>
    </div>
  );
};
