import { NavLink, Link } from "react-router-dom";
import { FaBook, FaUserTie, FaPlus } from "react-icons/fa";
import { useLogout } from "../hooks/useLogout";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export const Navbar = () => {
  const principal = useSelector((state: RootState) => state.principal);
  const student = useSelector((state: RootState) => state.student)
  const { logoutUser } = useLogout();

  const handleLogout = () => {
    logoutUser()
  };

  return (
    <div className="navbar mb-2 shadow-lg bg-neutral text-neutral-content fixed top-0 z-20 w-screen">
      <div className="flex-1 px-2 mx-2">
        <NavLink to="/" className="text-xl text-center font-bold flex">
          <FaBook className="mr-3" size={30} />
            Dziennik szkolny
        </NavLink>
      </div>

      {student.user || principal.user ? (
        <>
          <div className="flex-none mx-6">
            <div className="dropdown dropdown-end dropdown-hover">
              <FaPlus size={30} className="cursor-pointer" />
              <ul className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
                <li>
                  <Link to="/add/class">Dodaj Klasę</Link>
                </li>
                <li>
                  <Link to="/add/teacher">Dodaj Nauczyciela</Link>
                </li>
                <li>
                  <Link to="/add/student">Dodaj Ucznia</Link>
                </li>
                <li>
                  <Link to="/add/subject">Dodaj Przedmiot</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex-none mx-6">
            <div className="dropdown dropdown-end dropdown-hover">
              <FaUserTie size={30} className="cursor-pointer" />
              <ul className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
                {(!principal.user || student.user) && (!student.user || principal.user) ? (
                  <>
                    <li>
                      <Link to="/login">Zaloguj się</Link>
                    </li>
                    <li>
                      <Link to="/signup">Zarejestruj się</Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/profile">Profil</Link>
                    </li>
                    <li>
                      <Link to="/settings/profile">Ustawienia</Link>
                    </li>
                    <li>
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
