import { useState } from "react";
import { toast } from "react-toastify";
import {
  currentStepType,
  genderType,
  PrincipalPersonalInformation,
} from "../../../utils/interfaces";
import { validatePesel } from "../../../utils/utils";

interface PersonalInformationFormProps {
  set: React.Dispatch<React.SetStateAction<PrincipalPersonalInformation>>;
  setStep: React.Dispatch<React.SetStateAction<currentStepType>>;
}
export const PersonalInformationForm: React.FC<
  PersonalInformationFormProps
> = ({ set, setStep }) => {
  const [userData, setUserData] = useState<PrincipalPersonalInformation>({
    birth: new Date().toISOString().split("T")[0],
    firstName: "",
    lastName: "",
    pesel: "",
    gender: "Mężczyzna",
    address: {
      city: "",
      houseNumber: 0,
      postCode: "",
      street: "",
    },
  });
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    if (name === "pesel") {
      setUserData((prev) => {
        return { ...prev, [name]: String(value) };
      });
    } else if (
      name === "city" ||
      name === "houseNumber" ||
      name === "postCode" ||
      name === "street"
    ) {
      let addressObject = { ...userData.address };
      const newObj = { ...addressObject, [name]: value };
      setUserData((prev) => {
        return { ...prev, address: newObj };
      });
    }
    setUserData((prev) => {
      return { ...prev, [name]: value };
    });
  }
  function validateData(e: React.SyntheticEvent) {
    e.preventDefault();
    if (
      userData.firstName.length === 0 &&
      userData.birth === "" &&
      userData.pesel.length < 11 &&
      userData.address.postCode.length < 6 &&
      userData.address.city.length === 0 &&
      userData.address.houseNumber === 0 &&
      userData.address.street.length === 0 &&
      userData.lastName.length === 0
    )
      return toast.error("Podaj wszystkie dane", { autoClose: 2000 });
    if (userData.address.street.length === 0)
      return toast.error("Podaj Ulice na której mieszkasz", {
        autoClose: 2000,
      });
    if (userData.address.city.length === 0)
      return toast.error("Podaj Miasto", { autoClose: 2000 });
    if (userData.firstName.length === 0 || userData.lastName.length === 0)
      return toast.error("Podaj Imię i Nazwisko", { autoClose: 2000 });
    if (userData.pesel.length !== 11)
      return toast.error("Podaj poprawny pesel", { autoClose: 2000 });
    if (
      userData.address.postCode.length !== 6 ||
      userData.address.postCode[2] !== "-"
    )
      return toast.error("Podaj poprawny Kod Pocztowy", { autoClose: 2000 });
    if (userData.address.houseNumber === 0)
      return toast.error("Podaj poprawny Numer Domu", { autoClose: 2000 });

    if (!validatePesel(userData.pesel))
      return toast.error("Podaj poprawny Pesel", { autoClose: 2000 });
    set({
      address: userData.address,
      birth: userData.birth,
      firstName: userData.firstName,
      gender: userData.gender,
      lastName: userData.lastName,
      pesel: userData.pesel,
    });
    setStep(3);
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
                value={userData.firstName}
                className="input"
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
                value={userData.lastName}
                className="input"
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
                value={userData.birth}
                min={new Date().toISOString().split("T")[0]}
                className="input"
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
                value={userData.gender}
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
                value={userData.pesel}
                className="input "
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
                value={userData.address.city}
                className="input"
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
                value={userData.address.postCode}
                className="input"
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
                value={userData.address.street}
                className="input"
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
                value={userData.address.houseNumber}
                className="input"
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
