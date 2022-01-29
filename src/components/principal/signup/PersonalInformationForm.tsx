import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  AddressErrors,
  currentStepType,
  PersonalInfoCredentialsErrors,
  PrincipalPersonalInformation,
} from "../../../utils/interfaces";
import { validatePesel } from "../../../utils/utils";

interface PersonalInformationFormProps {
  set: React.Dispatch<React.SetStateAction<PrincipalPersonalInformation>>;
  setStep: (step: currentStepType, current: currentStepType) => void;
  credentialsData: PrincipalPersonalInformation;
  fieldErrors: PersonalInfoCredentialsErrors;
  addressErrors: AddressErrors
}

export const PersonalInformationForm: React.FC<
  PersonalInformationFormProps
> = ({ set, setStep, credentialsData, fieldErrors, addressErrors }) => {

 
  useEffect(() => {
    Object.values(fieldErrors).filter((f) => f.error === true).map((field) => (
      toast.error(field.text, { autoClose: 2000 })
    ))
    Object.values(addressErrors).filter((f) => f.error === true).map((field) => (
      toast.error(field.text, { autoClose: 2000 })
    ))
  }, [fieldErrors, addressErrors]);


  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    if (name === "pesel") {
      set((prev) => {
        return { ...prev, [name]: String(value) };
      });
    } else if (
      name === "city" ||
      name === "houseNumber" ||
      name === "postCode" ||
      name === "street"
    ) {
      let addressObject = { ...credentialsData.address };
      const newObj = { ...addressObject, [name]: value };
      set((prev) => {
        return { ...prev, address: newObj };
      });
    }
    set((prev) => {
      return { ...prev, [name]: value };
    });
  }

  function validateData(e: React.SyntheticEvent) {
    e.preventDefault();
    setStep(3, 2);
  }
  return (
    <section className="p-10 card justify-center items-center bg-base-200  mt-5 md:mt-20">
      <form className=" md:w-96 w-full">
        <h2 className="text-2xl text-center mb-4 text-primary">
          Dane Personalne
        </h2>
        <div className="form-control  md:w-96 w-full">
          <div className="grid grid-rows-1 grid-cols-1 md:grid-cols-2 md:grid-rows-2">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Imię</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={credentialsData.firstName}
                className={`input ${fieldErrors.firstName.error ? "border-red-500" : ''}`}
                onChange={handleChange}
                placeholder="Imię"
              />
            </div>
            <div className="form-control mt-4 md:ml-4 md:mt-0">
              <label className="label">
                <span className="label-text">Nazwisko</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={credentialsData.lastName}
                className={`input ${fieldErrors.lastName.error ? "border-red-500" : ''}`}
                onChange={handleChange}
                placeholder="Nazwisko"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Data Urodzenia</span>
              </label>
              <input
                type="date"
                name="birth"
                value={credentialsData.birth}
                max={new Date().toISOString().split("T")[0]}
                className={`input ${fieldErrors.birth.error ? "border-red-500" : ''}`}
                onChange={handleChange}
                placeholder={new Date().toLocaleDateString()}
              />
            </div>
            <div className="form-control mt-4 md:ml-4 md:mt-0">
              <label className="label">
                <span className="label-text">Płeć</span>
              </label>
              <select
                name="gender"
                value={credentialsData.gender}
                className="select"
                onChange={handleChange}
              >
                <option value="Mężczyzna">Mężczyzna</option>
                <option value="Kobieta">Kobieta</option>
                <option value="Inna">Inna</option>
              </select>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <div className="form-control items-center mb-2">
              <label className="label">
                <span className="label-text">Pesel</span>
              </label>
              <input
                type="number"
                name="pesel"
                value={credentialsData.pesel}
                className={`input ${fieldErrors.pesel.error ? "border-red-500" : ''}`}
                onChange={handleChange}
                placeholder="Pesel"
              />
            </div>
          </div>
          <div className="divider"></div>
          {/*!Do adresu */}
          <h2 className="text-2xl text-center mb-4 text-primary">
            Dane Zamieszkania
          </h2>
          <div className="grid grid-rows-1 grid-cols-1 md:grid-cols-2 md:grid-rows-2">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Miasto</span>
              </label>
              <input
                type="text"
                name="city"
                value={credentialsData.address.city}
                className={`input ${addressErrors.city.error ? "border-red-500" : ''}`}
                onChange={handleChange}
                placeholder="Miasto"
              />
            </div>
            <div className="form-control mt-4 md:ml-4 md:mt-0">
              <label className="label">
                <span className="label-text">Kod pocztowy</span>
              </label>
              <input
                type="text"
                name="postCode"
                value={credentialsData.address.postCode}
                className={`input ${addressErrors.postCode.error ? "border-red-500" : ''}`}
                onChange={handleChange}
                placeholder="xx-xxx"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Ulica</span>
              </label>
              <input
                type="text"
                name="street"
                value={credentialsData.address.street}
                className={`input ${addressErrors.street.error ? "border-red-500" : ''}`}
                onChange={handleChange}
                placeholder="Ulica"
              />
            </div>
            <div className="form-control mt-4 md:ml-4 md:mt-0">
              <label className="label">
                <span className="label-text">Numer Domu</span>
              </label>
              <input
                type="number"
                name="houseNumber"
                value={credentialsData.address.houseNumber}
                className={`input ${addressErrors.houseNumber.error ? "border-red-500" : ''}`}
                onChange={handleChange}
                placeholder="Numer Domu"
              />
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <button
              className="btn-primary btn mt-4 self-end"
              onClick={(e) => validateData(e)}
            >
              Dalej
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};
