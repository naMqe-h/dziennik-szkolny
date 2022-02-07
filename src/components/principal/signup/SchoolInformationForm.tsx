import { useEffect } from "react";
import { toast } from "react-toastify";
import {currentStepType, errorsInterface, SchoolInformation } from "../../../utils/interfaces";


const schoolTypes = [
  "Szkoła Podstawowa",
  "Szkoła Zawodowa",
  "Technikum",
  "Liceum",
  "Uniwersytet",
];

interface SchoolInformationFormProps {
  set: React.Dispatch<React.SetStateAction<SchoolInformation>>;
  setStep: (step: currentStepType, current: currentStepType) => void;
  credentialsData: SchoolInformation;
  fieldErrors: errorsInterface;
}

export const SchoolInformationForm: React.FC<SchoolInformationFormProps> = ({
  set,
  setStep,
  credentialsData,
  fieldErrors,
}) => {

  // useEffect(() => {
  //   Object.values(fieldErrors).filter((f) => f.error === true).map((field) => (
  //     toast.error(field.text, { autoClose: 2000 })
  //   ))
  // }, [fieldErrors]);

  const validateData = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setStep(4, 3);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (
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
    } else {
      set((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };
  return (
    <section className="p-10 card justify-center items-center bg-base-200  mt-5 md:mt-20">
      <form className="md:w-96 w-full">
        <h2 className="text-2xl text-center mb-4 text-primary">Dane szkoły</h2>

        <label className="label">
          <span className="label-text">Nazwa szkoły</span>
        </label>
        <input
          className={`input w-full ${fieldErrors.name.error ? "border-red-500" : ''}`}
          type="text"
          placeholder="Nazwa szkoły"
          name="name"
          value={credentialsData.name}
          onChange={handleChange}
        />
        <label className="label">
          <span className="label-text">Domena Szkoły</span>
        </label>
        <input
          className={`input w-full ${fieldErrors.domain.error ? "border-red-500" : ''}`}
          type="text"
          placeholder="DomenaSzkolna.pl"
          name="domain"
          value={credentialsData.domain}
          onChange={handleChange}
        />

        <label className="label">
          <span className="label-text">Typ szkoły</span>
        </label>
        <select
          className="select select-bordered w-full"
          value={credentialsData.type}
          name="type"
          onChange={(e) => handleChange(e)}
        >
          {schoolTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <div className="divider"></div>
        <h2 className="text-2xl text-center mb-4 text-primary">Adres szkoły</h2>
        <div className="grid grid-rows-1 grid-cols-1 md:grid-cols-2 md:grid-rows-2">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Miasto</span>
            </label>
            <input
              type="text"
              name="city"
              value={credentialsData.address.city}
              className={`input ${fieldErrors.city.error ? "border-red-500" : ''}`}
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
              className={`input ${fieldErrors.postCode.error ? "border-red-500" : ''}`}
              onChange={handleChange}
              placeholder="xx/xxx"
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
              className={`input ${fieldErrors.street.error ? "border-red-500" : ''}`}
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
              className={`input ${fieldErrors.houseNumber.error ? "border-red-500" : ''}`}
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
      </form>
    </section>
  );
};