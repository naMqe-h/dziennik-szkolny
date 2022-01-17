import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FormData } from "../interfaces";
export const Login = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<FormData>({
    login: "",
    password: "",
  });
  function validateData(e: React.SyntheticEvent) {
    e.preventDefault();
    if (userData.login.length === 0 && userData.login.length === 0)
      return toast.error("Podaj dane", { autoClose: 2000 });
    if (userData.login.length === 0)
      return toast.error("Podaj Login", { autoClose: 2000 });
    if (userData.password.length === 0)
      return toast.error("Podaj Hasło", { autoClose: 2000 });
    //Todo Add auth
    // if (userData.password.length < 6)
    //   return toast.error("Hasło musi mieć 6 liter ", { autoClose: 2000 });
    if (userData.login === "admin" && userData.password === "admin") {
      toast.success("Udało ci się zalogować", { autoClose: 2000 });
      navigate("/");
    } else {
      toast.error("Błędny login lub hasło", { autoClose: 2000 });
    }
  }
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setUserData((prev) => {
      return { ...prev, [name]: value };
    });
  }
  return (
    <section className="mt-12 flex items-center justify-center">
      <form
        className="flex-col flex rounded-lg  justify-center items-center max-w-screen"
        action="none"
      >
        <label className="input-group my-4">
          <span className="bg-secondary">Login</span>
          <input
            type="text"
            name="login"
            className="input"
            value={userData.login}
            placeholder="your@email.com"
            onChange={handleChange}
          />
        </label>
        <label className="input-group my-4">
          <span className="bg-secondary">Hasło</span>
          <input
            type="password"
            name="password"
            className=" input"
            value={userData.password}
            placeholder="********"
            onChange={handleChange}
          />
        </label>
        <button
          className="btn-secondary btn font-bold w-[40%]"
          onClick={(e) => validateData(e)}
        >
          Wyślij
        </button>
        <div className="text-primary text-bold text-2xl mt-4 flex justify-center items-center flex-col">
          <span>Jesteś Dyrektorem?</span>
          <Link to={"/signup"}>Zarejestruj Szkołe</Link>
        </div>
      </form>
    </section>
  );
};
