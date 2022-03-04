import { NavLink, Link } from "react-router-dom";
import { FaBook, FaUserTie, FaPlus } from "react-icons/fa";
import { useLogout } from "../hooks/useLogout";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect, useState } from "react";
import useMediaQuery from "../hooks/useMediaQuery";
import { useSetDocument } from "../hooks/useSetDocument";
import {
  ClassesDataFromFirebase,
  CombinedPrincipalData,
  SchoolSubjectsDataFromFirebase,
  StudentsDataFromFirebase,
  TeachersDataFromFirebase,
} from "../utils/interfaces";
export const Navbar = () => {
  const { setDocument } = useSetDocument();
  const state = useSelector((state: RootState) => state.schoolData);
  const principal = useSelector((state: RootState) => state.principal);
  const student = useSelector((state: RootState) => state.student);
  const teacher = useSelector((state: RootState) => state.teacher);
  const userType = useSelector((state: RootState) => state.userType.userType);
  const showThemeSwitcher = useMediaQuery("(min-width:600px)");
  const isPremiumUser =
    useSelector(
      (state: RootState) =>
        state.schoolData?.schoolData?.information?.planType === "Premium"
    ) || false;
  const [theme, setTheme] = useState<string>(
    localStorage.getItem("theme") ?? "halloween"
  );
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  const { logoutUser } = useLogout();

  const handleLogout = () => {
    logoutUser();
  };
  return (
    <div className="navbar mb-2 shadow-lg bg-neutral text-neutral-content fixed top-0 z-20 w-screen">
      <div className="flex-1 px-2 mx-2">
        <NavLink
          to="/"
          className="text-xl text-center font-bold flex items-center"
        >
          <FaBook className="mr-3" size={30} />
          Dziennik szkolny
        </NavLink>
      </div>
      {/* <button
        className="btn"
        onClick={() => {
          if (
            state.schoolData?.teachers &&
            state.schoolData.students &&
            state.schoolData.subjects &&
            state.schoolData.classes
          ) {
            const oldTeachers = state.schoolData?.teachers;
            const oldStudents = state.schoolData?.students;
            const oldPrincipal = principal.data;
            const newTeachers: TeachersDataFromFirebase = {};
            const newStudents: StudentsDataFromFirebase = {};
            const newPrincipal: Partial<CombinedPrincipalData> = {
              ...oldPrincipal,
              messages: {
                recived: [],
                sended: [],
              },
            };
            Object.entries(oldTeachers).forEach((item) => {
              newTeachers[item[0]] = {
                ...item[1],
                messages: {
                  recived: [],
                  sended: [],
                },
              };
            });
            Object.entries(oldStudents).forEach((item) => {
              newStudents[item[0]] = {
                ...item[1],
                messages: {
                  recived: [],
                  sended: [],
                },
              };
            });
            const domain = state.schoolData.information.domain;
            console.log(newStudents);
            console.log(newTeachers);
            console.log(newPrincipal);
            setDocument(domain as string, "teachers", newTeachers);
            setDocument(domain as string, "students", newStudents);
            setDocument(
              "principals",
              state.schoolData.information.principalUID,
              newPrincipal
            );
          }
        }}
      >
        Click
      </button> */}
      {showThemeSwitcher && (
        <select
          data-choose-theme
          className="select bg-base-100 text-primary mr-4"
          onChange={(e) => setTheme(e.target.value)}
          value={theme}
        >
          <optgroup label="Dark">
            <option value="halloween">Podstawowy 🎃</option>
            <option value="dark">Dark 🌛</option>
            <option value="forest">Forest 🌲</option>
          </optgroup>
          <optgroup label="Light">
            <option value="cupcake">Cupcake 🧁</option>
            <option value="cmyk">CMYK 🎏</option>
            <option value="fantasy">Fantasy 🐉</option>
          </optgroup>
          <optgroup label="Inne">
            <option value="valentine">Walentynkowy 🌸</option>
            <option value="wireframe">Ostry 📝</option>
            <option value="cyberpunk">Cyberpunk 🤖</option>
            <option value="retro">Retro 🛕</option>
          </optgroup>
          <optgroup label="Premium">
            <option value="synthwave" disabled={!isPremiumUser}>
              {isPremiumUser ? "SynthWave ☀️" : "🔒 SynthWave ☀️"}
            </option>
            <option value="emerald" disabled={!isPremiumUser}>
              {isPremiumUser ? "Szmaragdowy 💎" : "🔒 Szmaragdowy 💎"}
            </option>
            <option value="dracula" disabled={!isPremiumUser}>
              {isPremiumUser ? "Dracula 🧛" : "🔒 Dracula 🧛"}
            </option>
          </optgroup>
        </select>
      )}
      {/* zmienic ze tylko dyrektor widzi te linki do /add */}
      {student.user || principal.user || teacher.user ? (
        <>
          <div className="flex-none mx-6">
            {userType === "principals" && (
              <div className="dropdown dropdown-end dropdown-hover">
                <FaPlus size={30} className="cursor-pointer" />
                <ul className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
                  <li className="text-base-content">
                    <Link to="/add/class">Dodaj Klasę</Link>
                  </li>
                  <li className="text-base-content">
                    <Link to="/add/teacher">Dodaj Nauczyciela</Link>
                  </li>
                  <li className="text-base-content">
                    <Link to="/add/student">Dodaj Ucznia</Link>
                  </li>
                  <li className="text-base-content">
                    <Link to="/add/subject">Dodaj Przedmiot</Link>
                  </li>
                  <li className="text-base-content">
                    <Link to="/add/event">Dodaj Wydarzenie</Link>
                  </li>
                  <li className="text-base-content">
                    <Link to="/lesson-plan/generate">Generuj plan lekcji</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="flex-none mx-6">
            <div className="dropdown dropdown-end dropdown-hover">
              <FaUserTie size={30} className="cursor-pointer" />
              <ul className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
                {(!principal.user || student.user || teacher.user) &&
                (!student.user || principal.user || teacher.user) &&
                (!teacher.user || student.user || principal.user) ? (
                  <>
                    <li className="text-base-content">
                      <Link to="/login">Zaloguj się</Link>
                    </li>
                    <li className="text-base-content">
                      <Link to="/signup">Zarejestruj się</Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="text-base-content">
                      <Link to="/profile">Profil</Link>
                    </li>
                    <li className="text-base-content">
                      <Link to="/settings/profile">Ustawienia</Link>
                    </li>
                    <li className="text-base-content">
                      {/* eslint-disable-next-line*/}
                      <a onClick={handleLogout}>Wyloguj się</a>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-none ml-auto mr-6">
          <div className="dropdown dropdown-end dropdown-hover">
            <FaUserTie size={30} className="cursor-pointer" />
            <ul className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
              <li>
                <Link to="/login">Zaloguj się</Link>
              </li>
              <li>
                <Link to="/signup">Zarejestruj się</Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
