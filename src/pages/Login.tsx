import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CombinedPrincipalData, FormData } from "../utils/interfaces";
import nProgress from "nprogress";
import { validateEmail } from "../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { setUserType } from "../redux/userTypeSlice";
import { RootState } from "../redux/store";

// importy logowania
import { useLogin } from "../hooks/useLogin";
import { useStudentLogin } from "../hooks/useStudentLogin";
import { useCollection } from "../hooks/useCollection";
import { useTeacherLogin } from "../hooks/useTeacherLogin";

interface LoginProps {
  loading: boolean;
}

type LoginCredentialsErrors = {
  email: { error: boolean; text: string };
  password: { error: boolean; text: string };
};
const defaultErrorState: LoginCredentialsErrors = {
  email: { error: false, text: "" },
  password: { error: false, text: "" },
};

export const Login: React.FC<LoginProps> = ({ loading }) => {
  const dispatch = useDispatch();
  const principal = useSelector((state: RootState) => state.principal);
  const student = useSelector((state: RootState) => state.student);
  const teacher = useSelector((state: RootState) => state.teacher);
  const userType = useSelector((state: RootState) => state.userType.userType);
  const schoolData = useSelector(
    (state: RootState) => state.schoolData.schoolData
  );
  const [allPrincipalsEmails, setAllPrincipalsEmails] = useState<string[]>([]);

  const { principalLogin } = useLogin();
  const { studentLogin } = useStudentLogin();
  const { teacherLogin } = useTeacherLogin();
  const { getCollection, documents } = useCollection();

  useEffect(() => {
    getCollection("principals");
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setAllPrincipalsEmails([]);
    // eslint-disable-next-line
    for (const [key, _value] of Object.entries(documents)) {
      const value: CombinedPrincipalData = _value as CombinedPrincipalData;
      setAllPrincipalsEmails((prev) => [...prev, value.email]);
    }
  }, [documents]);

  const [fieldErrors, setFieldErrors] =
    useState<LoginCredentialsErrors>(defaultErrorState);

  const [userData, setUserData] = useState<FormData>({
    email: "",
    password: "",
    role: "principals",
  });

  useEffect(() => {
    Object.values(fieldErrors)
      .filter((f) => f.error === true)
      .map((field) => toast.error(field.text, { autoClose: 2000 }));
  }, [fieldErrors]);

  const validateInputs = () => {
    setFieldErrors(defaultErrorState);
    let errors = false;
    if (userData.email.length === 0) {
      setFieldErrors((prev) => ({
        ...prev,
        email: { error: true, text: "Podaj Email" },
      }));
      errors = true;
    }
    if (userData.password.length === 0) {
      setFieldErrors((prev) => ({
        ...prev,
        password: { error: true, text: "Podaj Hasło" },
      }));
      errors = true;
    }
    if (!validateEmail(userData.email)) {
      setFieldErrors((prev) => ({
        ...prev,
        password: { error: true, text: "Podaj Poprawny Email" },
      }));
      errors = true;
    }
    return errors;
  };

  function validateData(e: React.SyntheticEvent) {
    e.preventDefault();
    if (validateInputs()) return;

    if (userData.role === "principals") {
      if (allPrincipalsEmails.includes(userData.email)) {
        handlePrincipalLogin();
      } else {
        return toast.error("Nie ma dyrektora z takim adresem email", {
          autoClose: 4000,
        });
      }
    }

    if (userData.role === "students") {
      if (allPrincipalsEmails.includes(userData.email)) {
        return toast.error("Wybierz poprawny typ logowania", {
          autoClose: 4000,
        });
      } else {
        handleStudentLogin();
      }
    }

    if (userData.role === "teachers") {
      if (allPrincipalsEmails.includes(userData.email)) {
        return toast.error("Wybierz poprawny typ logowania", {
          autoClose: 4000,
        });
      } else {
        handleTeacherLogin();
      }
    }
  }
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setUserData((prev) => {
      return { ...prev, [name]: value };
    });
  }

  //logowanie dla dyrektora
  const handlePrincipalLogin = async () => {
    nProgress.start();
    dispatch(setUserType(userData.role));
    await principalLogin(userData.email, userData.password, userData.role);
    nProgress.done();
  };

  //logowanie dla ucznia
  const handleStudentLogin = async () => {
    nProgress.start();
    await studentLogin(userData.email, userData.password);
    nProgress.done();
  };

  //logowanie dla nauczyciela
  const handleTeacherLogin = async () => {
    nProgress.start();
    await teacherLogin(userData.email, userData.password);
    nProgress.done();
  };

  if (!loading) {
    return (principal.user && principal.data && schoolData && userType) ||
      (student.data && student.user && userType) ||
      (teacher.data && schoolData) ? (
      <Navigate to="/" />
    ) : (
      <div className="mt-12 flex items-center justify-center">
        <form className="form-control card bg-base-200 p-14" action="none">
          <label className="input-group my-4">
            <span className="bg-primary text-primary-content">Email</span>
            <input
              type="text"
              name="email"
              className={`input ${
                fieldErrors.email.error ? "border-red-500" : ""
              }`}
              autoComplete="email"
              value={userData.email}
              placeholder="Email"
              onChange={handleChange}
            />
          </label>
          <label className="input-group my-4">
            <span className="bg-primary text-primary-content">Hasło</span>
            <input
              type="password"
              name="password"
              className={`input ${
                fieldErrors.password.error ? "border-red-500" : ""
              }`}
              autoComplete="current-password"
              value={userData.password}
              placeholder="********"
              onChange={handleChange}
            />
          </label>
          <label className="input-group my-4  ">
            <span className="bg-primary text-primary-content">
              Zaloguj jako
            </span>
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
              className="btn-primary text-primary-content btn w-[40%]"
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
