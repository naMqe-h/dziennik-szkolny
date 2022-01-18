import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaBook, FaUserTie, FaPlus } from "react-icons/fa";

export const Navbar = () => {
  const [auth, setAuth] = useState<boolean>(false);
  useEffect(() => {
    setAuth(true);
  }, []);
  return (
    <div className="navbar mb-2 shadow-lg bg-neutral text-neutral-content fixed top-0 z-20 w-screen">
      <div className="flex-none px-2 mx-2">
        <FaBook className="mr-3" size={30} />
        <NavLink to="/" className="text-xl text-center font-bold">
          Dziennik szkolny
        </NavLink>
      </div>

      {auth ? (
        <>
          <div className="flex-1 px-2 mx-2">
            <div className="items-stretch hidden lg:flex">
              <NavLink
                to="/classes"
                className="btn btn-ghost btn-sm rounded-btn"
              >
                Lista klas
              </NavLink>
              <NavLink
                to="/teachers"
                className="btn btn-ghost btn-sm rounded-btn"
              >
                Lista nauczycieli
              </NavLink>
              <NavLink
                to="/subjects"
                className="btn btn-ghost btn-sm rounded-btn"
              >
                Lista przedmiotów
              </NavLink>
            </div>
          </div>

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
                <li>
                  <Link to="/login">Zaloguj się</Link>
                </li>
                <li>
                  <Link to="/signup">Zarejestruj się</Link>
                </li>
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
