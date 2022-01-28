import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  AddressErrors,
  currentStepType,
  ErrorObj,
  PrincipalPersonalInformation,
} from "../../../utils/interfaces";
import { validatePesel } from "../../../utils/utils";

interface PersonalInformationFormProps {
  set: React.Dispatch<React.SetStateAction<PrincipalPersonalInformation>>;
  setStep: React.Dispatch<React.SetStateAction<currentStepType>>;
}

type PersonalInfoCredentialsErrors = {
  firstName: ErrorObj;
  lastName: ErrorObj;
  birth: ErrorObj;
  pesel: ErrorObj;
};
const defaultErrorState:PersonalInfoCredentialsErrors = {
  firstName: {error:false, text: ''},
  lastName: {error:false, text: ''},
  birth: {error:false, text: ''},
  pesel: {error:false, text: ''},
};
const defaultAddressErrors:AddressErrors ={
  city: {error:false, text: ''},
  houseNumber: {error:false, text: ''},
  postCode: {error:false, text: ''},
  street: {error:false, text: ''},
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

  const [fieldErrors, setFieldErrors] = useState<PersonalInfoCredentialsErrors>(defaultErrorState);
  const [addressErrors, setAddressErrors] = useState<AddressErrors>(defaultAddressErrors);
 
  useEffect(() => {
    Object.values(fieldErrors).filter((f) => f.error === true).map((field) => (
      toast.error(field.text, { autoClose: 2000 })
    ))
    Object.values(addressErrors).filter((f) => f.error === true).map((field) => (
      toast.error(field.text, { autoClose: 2000 })
    ))
  }, [fieldErrors, addressErrors]);

  const validateInputs = () => {
    setFieldErrors(defaultErrorState);
    setAddressErrors(defaultAddressErrors);
    let errors = false;
    

    
    if(userData.firstName.length === 0){
      setFieldErrors((prev) => (
        {...prev, ['firstName']: {'error':true, 'text':"Podaj Imię"}}))
        errors = true
    }
    if (userData.lastName.length === 0){
      setFieldErrors((prev) => (
        {...prev, ['lastName']: {'error':true, 'text':"Podaj Nazwisko"}}))
        errors = true
    }
    if(userData.birth === ""){
      setFieldErrors((prev) => (
        {...prev, ['birth']: {'error':true, 'text':"Podaj datę urodzenia"}}))
        errors = true
    }
    if (userData.pesel.length !== 11){
      setFieldErrors((prev) => (
        {...prev, ['pesel']: {'error':true, 'text':"Podaj poprawny pesel"}}))
        errors = true
    }
    if (!validatePesel(userData.pesel)){
      setFieldErrors((prev) => (
        {...prev, ['pesel']: {'error':true, 'text':"Podaj poprawny pesel"}}))
        errors = true
    }
    if (userData.address.city.length === 0){
      setAddressErrors((prev) => (
        {...prev, ['city']: {'error':true, 'text':"Podaj Miasto"}}))
        errors = true
    }
    if (userData.address.street.length === 0){
      
      setAddressErrors((prev) => (
        {...prev, ['street']: {'error':true, 'text':"Podaj ulicę na której mieszkasz"}}))
        errors = true
    }
    if (
      userData.address.postCode.length !== 6 ||
      userData.address.postCode[2] !== "-"
    ){
      setAddressErrors((prev) => (
        {...prev, ['postCode']: {'error':true, 'text':"Podaj poprawny Kod Pocztowy"}}))
        errors = true
    }
    if (userData.address.houseNumber < 1 || userData.address.houseNumber.toString().length === 0){
      setAddressErrors((prev) => (
        {...prev, ['houseNumber']: {'error':true, 'text':"Podaj poprawny Numer Domu"}}))
        errors = true
    }

    

    return errors
  }  

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
    if(validateInputs()) return;

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
                value={userData.lastName}
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
                value={userData.birth}
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
                value={userData.address.city}
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
                value={userData.address.postCode}
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
                value={userData.address.street}
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
                value={userData.address.houseNumber}
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
