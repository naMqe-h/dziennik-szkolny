import { useEffect } from "react";
import { toast } from "react-toastify";
import {
  currentStepType,
  LoginCredentialsErrors,
  PrincipalLoginCredentials,
} from "../../../utils/interfaces";


interface setLoginCredentials {
  set: React.Dispatch<React.SetStateAction<PrincipalLoginCredentials>>;
  setStep: (step: currentStepType, current: currentStepType) => void;
  credentialsData: PrincipalLoginCredentials;
  fieldErrors: LoginCredentialsErrors;
}

export const LoginCredentialForm: React.FC<setLoginCredentials> = ({
  set,
  setStep,
  credentialsData,
  fieldErrors
}) => {

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    set((prev) => {
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
    setStep(2, 1);
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
            value={credentialsData.email}
          />

          <label className="label mt-3">
            <span className="label-text">Hasło</span>
          </label>
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            onChange={handleChange}
            className={`input ${fieldErrors.password.error ? "border-red-500" : ''}`}
            value={credentialsData.password}
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
            className={`input ${fieldErrors.repeatedPassword.error ? "border-red-500" : ''}`}
            value={credentialsData.repeatedPassword}
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