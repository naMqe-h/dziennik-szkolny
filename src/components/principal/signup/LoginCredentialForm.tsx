import { useState } from "react";
import { toast } from "react-toastify";
import {
  currentStepType,
  PrincipalLoginCredentials,
} from "../../../utils/interfaces";
import { validateEmail } from "../../../utils/utils";
interface setLoginCredentials {
  set: React.Dispatch<React.SetStateAction<PrincipalLoginCredentials>>;
  setStep: React.Dispatch<React.SetStateAction<currentStepType>>;
}

export const LoginCredentialForm: React.FC<setLoginCredentials> = ({
  set,
  setStep,
}) => {
  const [userData, setuserData] = useState<PrincipalLoginCredentials>({
    email: "",
    password: "",
    repeatedPassword: "",
  });
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setuserData((prev) => {
      return { ...prev, [name]: value };
    });
  }
  function validateData(e: React.SyntheticEvent) {
    e.preventDefault();
    if (
      userData.email.length === 0 &&
      userData.password.length === 0 &&
      userData.repeatedPassword.length === 0
    )
      return toast.error("Podaj dane", { autoClose: 2000 });
    if (userData.email.length === 0)
      return toast.error("Podaj Email", { autoClose: 2000 });
    if (
      userData.password.length === 0 &&
      userData.repeatedPassword.length === 0
    )
      return toast.error("Podaj Hasło", { autoClose: 2000 });
    if (!validateEmail(userData.email))
      return toast.error("Podaj Poprawny Email", { autoClose: 2000 });
    //Todo Add auth
    if (userData.password.length < 6)
      return toast.error("Hasło musi mieć 6 liter ", { autoClose: 2000 });
    if (userData.password !== userData.repeatedPassword)
      return toast.error("Podane hasła się nie zgadzają", { autoClose: 2000 });
    set({
      email: userData.email,
      password: userData.password,
      repeatedPassword: userData.repeatedPassword,
    });
    setStep(2);
  }
  return (
    <section className="p-10 card justify-center items-center bg-base-200  mt-5 md:mt-20">
      <form>
        <div className="form-control  md:w-96 w-[100%]">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            className="input"
            placeholder="your@email.com"
            value={userData.email}
          />

          <label className="label mt-3">
            <span className="label-text">Hasło</span>
          </label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            className="input"
            value={userData.password}
            placeholder="********"
          />
          <label className="label mt-3">
            <span className="label-text">Powtórz Hasło</span>
          </label>
          <input
            type="password"
            name="repeatedPassword"
            onChange={handleChange}
            className="input"
            value={userData.repeatedPassword}
            placeholder="********"
          />
          <button
            className="btn-primary btn mt-4 self-end"
            onClick={(e) => validateData(e)}
          >
            Dalej
          </button>
        </div>
      </form>
    </section>
  );
};
