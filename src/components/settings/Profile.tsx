import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useValidateInputs } from "../../hooks/useValidateInputs";
import {
  CombinedPrincipalData,
  genderType,
  SingleStudentDataFromFirebase,
  SingleTeacherData,
  userType,
} from "../../utils/interfaces";

interface profileProps {
  userType: userType;
  userProfilePicture: string | null | undefined;
  userData:
    | CombinedPrincipalData
    | SingleStudentDataFromFirebase
    | SingleTeacherData;
  save: (
    data:
      | CombinedPrincipalData
      | SingleStudentDataFromFirebase
      | SingleTeacherData
  ) => React.ReactText;
}

export const Profile: React.FC<profileProps> = ({
  userType,
  userData,
  save,
}) => {
  const genders: genderType[] = ["Kobieta", "Mężczyzna", "Inna"];
  const [formData, setFormData] = useState<any>(userData);
  const [validated, setValidated] = useState<Boolean>(false);
  const { validateData, inputErrors, errors } = useValidateInputs();

  useEffect(() => {
    if (validated) {
      if (errors) return;
      save(formData);
    }
    setValidated(false);
  }, [validated, errors]);

  // TODO zmiana zdjęcia profilowego

  const handleChange = (name: string, value: string) => {
    if (name === "pesel") {
      setFormData((prev: Object) => {
        return { ...prev, [name]: String(value) };
      });
    } else if (
      name === "city" ||
      name === "houseNumber" ||
      name === "postCode" ||
      name === "street"
    ) {
      let addressObject = { ...formData.address };
      const newObj = { ...addressObject, [name]: value };
      setFormData((prev: Object) => {
        return { ...prev, address: newObj };
      });
    } else {
      setFormData((prevState: Object) => {
        return {
          ...prevState,
          [name]: value,
        };
      });
    }
  };

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (formData === userData)
      return toast.error("Żadne dane się nie zmieniły", { autoClose: 2000 });

    setValidated(false);
    validateData({ ...formData });
    setValidated(true);
  }

  return (
    <div>
      <form className="form-control p-10 m-5">
        <span className="card-title">Edycja Profilu</span>
        <div className="divider" />
        <div className="form-control grid grid-cols-1 md:grid-cols-2">
          <label className="label w-full">
            <span className="label-text w-full">Imię</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            className={`input max-w-96 ${
              inputErrors.firstName.error ? "border-red-500" : ""
            }`}
            disabled={userType !== "principals" ? true : false}
            placeholder="Imię"
          />

          <div className="divider md:col-span-2" />

          <label className="label w-full">
            <span className="label-text w-full">Nazwisko</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            className={`input max-w-96 ${
              inputErrors.lastName.error ? "border-red-500" : ""
            }`}
            disabled={userType !== "principals" ? true : false}
            placeholder="Nazwisko"
          />

          <div className="divider md:col-span-2" />

          <label className="label w-full">
            <span className="label-text w-full">Zdjęcie profilowe</span>
          </label>
          <input
            type="text"
            name="profilePicture"
            value={formData.profilePicture}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            className={`input max-w-96 ${
              inputErrors.profilePicture.error ? "border-red-500" : ""
            }`}
            placeholder="Adres url zdjęcia profilowego"
          />

          <div className="divider md:col-span-2" />

          <label className="label">
            <span className="label-text">Płeć</span>
          </label>
          <select
            className="select select-bordered w-full max-w-xs"
            name="gender"
            value={formData.gender}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
          >
            {genders.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>

          <div className="divider md:col-span-2" />

          {userType !== "teachers" ? (
            <>
              <label className="label">
                <span className="label-text">Pesel</span>
              </label>
              <input
                type="number"
                name="pesel"
                value={formData.pesel}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                className={`input ${
                  inputErrors.pesel.error ? "border-red-500" : ""
                }`}
                placeholder="Pesel"
                disabled={userType === "students"}
              />

              <div className="divider md:col-span-2" />

              <label className="label">
                <span className="label-text">Data Urodzenia</span>
              </label>
              <input
                type="date"
                name="birth"
                value={formData.birth}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className={`input ${
                  inputErrors.birth.error ? "border-red-500" : ""
                }`}
                disabled={userType === "students"}
                placeholder={new Date().toLocaleDateString()}
              />
            </>
          ) : (
            ""
          )}

          {userType === "principals" ? (
            <>
              <span className="card-title text-center md:col-span-2 mt-10">
                Adres
              </span>
              <div className="divider md:col-span-2" />

              <label className="label">
                <span className="label-text">Miasto</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.address.city}
                className={`input ${
                  inputErrors.city.error ? "border-red-500" : ""
                }`}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                placeholder="Miasto"
              />

              <div className="divider md:col-span-2" />

              <label className="label">
                <span className="label-text">Kod pocztowy</span>
              </label>
              <input
                type="text"
                name="postCode"
                value={formData.address.postCode}
                className={`input ${
                  inputErrors.postCode.error ? "border-red-500" : ""
                }`}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                placeholder="xx-xxx"
              />

              <div className="divider md:col-span-2" />

              <label className="label">
                <span className="label-text">Ulica</span>
              </label>
              <input
                type="text"
                name="street"
                value={formData.address.street}
                className={`input ${
                  inputErrors.street.error ? "border-red-500" : ""
                }`}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                placeholder="Ulica"
              />

              <div className="divider md:col-span-2" />

              <label className="label">
                <span className="label-text">Numer Domu</span>
              </label>
              <input
                type="number"
                name="houseNumber"
                value={formData.address.houseNumber}
                className={`input ${
                  inputErrors.houseNumber.error ? "border-red-500" : ""
                }`}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                placeholder="Numer Domu"
              />
            </>
          ) : (
            ""
          )}
          <div className="md:col-span-2 flex items-center justify-center mt-10">
            <button
              className="btn-primary btn mt-4 self-end"
              onClick={(e) => handleSubmit(e)}
            >
              Zapisz
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
