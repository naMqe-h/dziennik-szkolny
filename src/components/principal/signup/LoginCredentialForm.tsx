import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  currentStepType,
  ErrorObj,
  PrincipalLoginCredentials,
} from "../../../utils/interfaces";
import { validateEmail } from "../../../utils/utils";


interface setLoginCredentials {
  set: React.Dispatch<React.SetStateAction<PrincipalLoginCredentials>>;
  setStep: React.Dispatch<React.SetStateAction<currentStepType>>;
}
// ! template error handeling
// ! --------------------------------
// type LoginCredentialsErrors = {
//   email: {error:boolean, text: string};
//   password: {error:boolean, text: string};
//   repeatedPassword: {error:boolean, text: string};
// };
// const defaultErrorState:LoginCredentialsErrors = {
//   email: {error:false, text: ''},
//   password: {error:false, text: ''},
//   repeatedPassword: {error:false, text: ''},
// };

// const [fieldErrors, setFieldErrors] = useState<LoginCredentialsErrors>(defaultErrorState);

// className={`input ${fieldErrors.email.error ? "border-red-500" : ''}`}

// useEffect(() => {
//   Object.values(fieldErrors).filter((f) => f.error === true).map((field) => (
//     toast.error(field.text, { autoClose: 2000 })
//   ))
// }, [fieldErrors]);

// const validateInputs = () => {
//   setFieldErrors(defaultErrorState);
//   let errors = false;
//   if (userData.email.length === 0){
//     setFieldErrors((prev) => (
//           {...prev, ['email']: {'error':true, 'text':"Podaj Email"}}))
//     errors = true
//   }
//   return errors
// }
// ! --------------------------------


type LoginCredentialsErrors = {
  email: ErrorObj;
  password: ErrorObj;
  repeatedPassword: ErrorObj;
};
const defaultErrorState:LoginCredentialsErrors = {
  email: {error:false, text: ''},
  password: {error:false, text: ''},
  repeatedPassword: {error:false, text: ''},
};

export const LoginCredentialForm: React.FC<setLoginCredentials> = ({
  set,
  setStep,
}) => {

  const [userData, setuserData] = useState<PrincipalLoginCredentials>({
    email: "",
    password: "",
    repeatedPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState<LoginCredentialsErrors>(defaultErrorState);

  const validateInputs = () => {
    setFieldErrors(defaultErrorState);
    let errors = false;
    if (!validateEmail(userData.email)){
      setFieldErrors((prev) => (
        {...prev, ['email']: {'error':true, 'text':"Podaj Poprawny Email"}}))
        errors = true
    }
    
    if (userData.password.length < 6){
      setFieldErrors((prev) => (
        {...prev, ['password']: {'error':true, 'text':"Hasło musi mieć 6 liter"}}))
        errors = true
    }
    if (userData.password !== userData.repeatedPassword){
      setFieldErrors((prev) => (
        {...prev, ['repeatedPassword']: {'error':true, 'text':"Podane hasła się nie zgadzają"}}))
        errors = true
    }

    return errors
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setuserData((prev) => {
      return { ...prev, [name]: value };
    });
  }

  useEffect(() => {
    Object.values(fieldErrors).filter((f) => f.error === true).map((field) => (
      toast.error(field.text, { autoClose: 2000 })
    ))
  }, [fieldErrors]);

  function validateData(e: React.SyntheticEvent) {
    e.preventDefault();
    if(validateInputs()) return;
    //Todo Add auth
    
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
            className={`input ${fieldErrors.email.error ? "border-red-500" : ''}`}
            autoComplete="email"
            placeholder="your@email.com"
            value={userData.email}
          />

          <label className="label mt-3">
            <span className="label-text">Hasło</span>
          </label>
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            onChange={handleChange}
            className={`input ${fieldErrors.email.error ? "border-red-500" : ''}`}
            value={userData.password}
            placeholder="********"
          />
          <label className="label mt-3">
            <span className="label-text">Powtórz Hasło</span>
          </label>
          <input
            type="password"
            name="repeatedPassword"
            autoComplete="repeat-password"
            onChange={handleChange}
            className={`input ${fieldErrors.email.error ? "border-red-500" : ''}`}
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
