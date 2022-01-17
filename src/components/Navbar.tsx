import { NavLink, Link } from "react-router-dom";
import { FaBook, FaUserTie, FaPlus } from "react-icons/fa";

export const Navbar = () => {
  return (
    <div className="navbar mb-2 shadow-lg bg-neutral text-neutral-content rounded-box">
      <div className="flex-none px-2 mx-2">
        <NavLink to="/" className="text-lg font-bold">
          Dziennik szkolny
        </NavLink>
      </div>
      <div className="flex-1 px-2 mx-2">
        <div className="items-stretch hidden lg:flex">
          <NavLink to="/classes" className="btn btn-ghost btn-sm rounded-btn">
            Lista klas
          </NavLink>
          <NavLink to="/teachers" className="btn btn-ghost btn-sm rounded-btn">
            Lista nauczycieli
          </NavLink>
        </div>
      </div>
      <div className="flex-none mx-6">
        <div className="dropdown dropdown-left dropdown-hover">
          <FaPlus size={20} className="cursor-pointer" />
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
          </ul>
        </div>
      </div>
      <div className="flex-none mx-6">
        <NavLink to="/login">
          <FaUserTie />
        </NavLink>
      </div>
    </div>
  );
};
