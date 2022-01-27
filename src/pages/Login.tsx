import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FormData } from "../utils/interfaces";
import { useLogin } from "../hooks/useLogin";
import nProgress from "nprogress";
import { validateEmail } from "../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { setUserType } from "../redux/userSlice";
import { RootState } from "../redux/store";

interface LoginProps {
  loading: boolean;
}

type LoginCredentialsErrors = {
  email: {error:boolean, text: string};
  password: {error:boolean, text: string};
};
const defaultErrorState:LoginCredentialsErrors = {
  email: {error:false, text: ''},
  password: {error:false, text: ''},
};


export const Login: React.FC<LoginProps> = ({ loading }) => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.user);
  const { login } = useLogin();

  const [fieldErrors, setFieldErrors] = useState<LoginCredentialsErrors>(defaultErrorState);

  const [userData, setUserData] = useState<FormData>({
    email: "",
    password: "",
    role: "principals",
  });

  useEffect(() => {
    Object.values(fieldErrors).filter((f) => f.error === true).map((field) => (
      toast.error(field.text, { autoClose: 2000 })
    ))
  }, [fieldErrors]);

  const validateInputs = () => {
    setFieldErrors(defaultErrorState);
    let errors = false;
    if (userData.email.length === 0){
      setFieldErrors((prev) => (
            {...prev, ['email']: {'error':true, 'text':"Podaj Email"}}))
      errors = true
    }
    if (userData.password.length === 0){
      setFieldErrors((prev) => (
        {...prev, ['password']: {'error':true, 'text':"Podaj Hasło"}}))
       errors = true
    }
    if (!validateEmail(userData.email)){
      setFieldErrors((prev) => (
        {...prev, ['password']: {'error':true, 'text':"Podaj Poprawny Email"}}))
       errors = true
    }
    return errors
  }

  function validateData(e: React.SyntheticEvent) {
    e.preventDefault();
    if(validateInputs()) return
    
    //Todo Add auth
    handleLogin();
  }
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setUserData((prev) => {
      return { ...prev, [name]: value };
    });
  }

  const handleLogin = async () => {
    nProgress.start();
    dispatch(setUserType(userData.role));
    await login(userData.email, userData.password, userData.role);
    nProgress.done();
  };

  if (!loading) {
    return state.user && state.data && state.schoolData && state.userType ? (
      <Navigate to="/" />
    ) : (
      <div className="mt-12 flex items-center justify-center">
        <form className="form-control card bg-base-200 p-14" action="none">
          <label className="input-group my-4">
            <span className="bg-primary">Email</span>
            <input
              type="text"
              name="email"
              className={`input ${fieldErrors.email.error ? "border-red-500" : ''}`}
              autoComplete="email"
              value={userData.email}
              placeholder="Email"
              onChange={handleChange}
            />
          </label>
          <label className="input-group my-4">
            <span className="bg-primary">Hasło</span>
            <input
              type="password"
              name="password"
              className={`input ${fieldErrors.password.error ? "border-red-500" : ''}`}
              autoComplete="current-password"
              value={userData.password}
              placeholder="********"
              onChange={handleChange}
            />
          </label>
          <label className="input-group my-4  ">
            <span className="bg-primary">Zaloguj jako</span>
            <select
              name="role"
              className="select"
              value={userData.role}
              onChange={handleChange}
            >
              <option value="principals">Dyrektor</option>
              <option value="teachers">Nauczyciel</option>
              <option value="students">Uczeń</option>
            </select>
          </label>
          <div className="flex items-center justify-center w-full">
            <button
              className="btn-primary text-white btn w-[40%]"
              onClick={(e) => validateData(e)}
            >
              Zaloguj
            </button>
          </div>
          <div className=" text-bold text-2xl mt-4 flex justify-center items-center flex-col">
            <span>Jesteś Dyrektorem?</span>
            <Link to={"/signup"} className="text-accent">
              Zarejestruj Szkołe
            </Link>
          </div>
        </form>
      </div>
    );
  } else {
    return null;
  }
};
