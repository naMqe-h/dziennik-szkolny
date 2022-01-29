import { useEffect, useState } from "react";
import { LoginCredentialForm } from "./signup/LoginCredentialForm";
import { PersonalInformationForm } from "./signup/PersonalInformationForm";
import Steps from "./signup/Steps";
import {
  AddressErrors,
  currentStepType,
  LoginCredentialsErrors,
  PersonalInfoCredentialsErrors,
  PlanTypes,
  PrincipalLoginCredentials,
  PrincipalPersonalInformation,
  SchoolCredentialsErrors,
  SchoolInformation,
} from "../../utils/interfaces";
import { SchoolInformationForm } from "./signup/SchoolInformationForm";
import { AnimatePresence, motion } from "framer-motion";
import { ChoosePlanForm } from "./signup/ChoosePlanForm";
import { Summary } from "./signup/Summary";
import reactSelect from "react-select";
import { toast } from "react-toastify";
import { validateEmail, validatePesel } from "../../utils/utils";
import { useDocument } from "../../hooks/useDocument";

// ? Interfaces
// ? ----------------------------------------------------------
// ! Login 
const LoginErrorState:LoginCredentialsErrors = {
  email: {error:false, text: ''},
  password: {error:false, text: ''},
  repeatedPassword: {error:false, text: ''},
};

// ! Personal
const PersonalErrorState:PersonalInfoCredentialsErrors = {
  firstName: {error:false, text: ''},
  lastName: {error:false, text: ''},
  birth: {error:false, text: ''},
  pesel: {error:false, text: ''},
};
const PersonalAddressErrors:AddressErrors ={
  city: {error:false, text: ''},
  houseNumber: {error:false, text: ''},
  postCode: {error:false, text: ''},
  street: {error:false, text: ''},
}
// ! School
const SchoolErrorState:SchoolCredentialsErrors = {
  name: {error:false, text: ''},
  domain: {error:false, text: ''},
};
const SchoolAddressErrors:AddressErrors ={
  city: {error:false, text: ''},
  houseNumber: {error:false, text: ''},
  postCode: {error:false, text: ''},
  street: {error:false, text: ''},
}
// ? ----------------------------------------------------------




export const SignupPrincipalView: React.FC = () => {
  
  // ? Error states
  //! login
  const [loginErrors, setLoginErrors] = useState<LoginCredentialsErrors>(LoginErrorState);

  //! personal
  const [personalErrors, setPersonalErrors] = useState<PersonalInfoCredentialsErrors>(PersonalErrorState);
  const [personalAddressErrors, setPersonalAddressErrors] = useState<AddressErrors>(PersonalAddressErrors);

  //! School
  const [schoolErrors, setSchoolErrors] = useState<SchoolCredentialsErrors>(SchoolErrorState);
  const [schoolAddressErrors, setSchoolAddressErrors] = useState<AddressErrors>(SchoolAddressErrors);

  // ? ----------------------------------------------------------
  
  const [currentStep, setCurrentStep] = useState<currentStepType>(1);
  const [maxStep, setMaxStep] = useState<currentStepType>(1);
  const [PrincipalLoginCredentials, setPrincipalLoginCredentials] =
    useState<PrincipalLoginCredentials>({
      email: "",
      password: "",
      repeatedPassword: "",
    });
  const [PrincipalPersonalInformation, setPrincipalPersonalInformation] =
    useState<PrincipalPersonalInformation>({
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
  const [SchoolInformation, setSchoolInformation] = useState<SchoolInformation>(
    {
      name: "",
      type: "Technikum",
      address: {
        city: "",
        houseNumber: 0,
        postCode: "",
        street: "",
      },
      domain: "",
    }
  );

  const { getDocument, document: takenDomains } = useDocument();
  const [chosenPlan, setchosenPlan] = useState<PlanTypes>("Basic");

  useEffect(() => {
    getDocument("utils", "domains");
    // eslint-disable-next-line
  }, []);

  // TODO
  // ? ----------------------------------------------------------
  // ! Przenieść walidacje
  // ! nowa funkcja setStep która najpierw sprawdza validate
  // ! switch currentStep na odpowiedni validator
  // ? ----------------------------------------------------------

  // ? Walidacja 
  // ? ----------------------------------------------------------
  //! Login
  const validateLogin = () => {
    setLoginErrors(LoginErrorState);
    let errors = false;
    if (!validateEmail(PrincipalLoginCredentials.email)){
      setLoginErrors((prev) => (
        {...prev, 'email': {'error':true, 'text':"Podaj Poprawny Email"}}))
        errors = true
    }
    
    if (PrincipalLoginCredentials.password.length < 6){
      setLoginErrors((prev) => (
        {...prev, 'password': {'error':true, 'text':"Hasło musi mieć 6 liter"}}))
        errors = true
    }
    if (PrincipalLoginCredentials.password !== PrincipalLoginCredentials.repeatedPassword){
      setLoginErrors((prev) => (
        {...prev, 'repeatedPassword': {'error':true, 'text':"Podane hasła się nie zgadzają"}}))
        errors = true
    }

    return errors
  } 

  //! Personal 
  const validatePersonal = () => {
    setPersonalErrors(PersonalErrorState);
    setPersonalAddressErrors(PersonalAddressErrors);
    let errors = false;
    

    
    if(PrincipalPersonalInformation.firstName.length === 0){
      setPersonalErrors((prev) => (
        {...prev, 'firstName': {'error':true, 'text':"Podaj Imię"}}))
        errors = true
    }
    if (PrincipalPersonalInformation.lastName.length === 0){
      setPersonalErrors((prev) => (
        {...prev, 'lastName': {'error':true, 'text':"Podaj Nazwisko"}}))
        errors = true
    }
    if(PrincipalPersonalInformation.birth === ""){
      setPersonalErrors((prev) => (
        {...prev, 'birth': {'error':true, 'text':"Podaj datę urodzenia"}}))
        errors = true
    }
    if (PrincipalPersonalInformation.pesel.length !== 11){
      setPersonalErrors((prev) => (
        {...prev, 'pesel': {'error':true, 'text':"Podaj poprawny pesel"}}))
        errors = true
    }
    if (!validatePesel(PrincipalPersonalInformation.pesel)){
      setPersonalErrors((prev) => (
        {...prev, 'pesel': {'error':true, 'text':"Podaj poprawny pesel"}}))
        errors = true
    }
    if (PrincipalPersonalInformation.address.city.length === 0){
      setPersonalAddressErrors((prev) => (
        {...prev, 'city': {'error':true, 'text':"Podaj Miasto"}}))
        errors = true
    }
    if (PrincipalPersonalInformation.address.street.length === 0){
      
      setPersonalAddressErrors((prev) => (
        {...prev, 'street': {'error':true, 'text':"Podaj ulicę na której mieszkasz"}}))
        errors = true
    }
    if (
      PrincipalPersonalInformation.address.postCode.length !== 6 ||
      PrincipalPersonalInformation.address.postCode[2] !== "-"
    ){
      setPersonalAddressErrors((prev) => (
        {...prev, 'postCode': {'error':true, 'text':"Podaj poprawny Kod Pocztowy"}}))
        errors = true
    }
    if (PrincipalPersonalInformation.address.houseNumber < 1 || PrincipalPersonalInformation.address.houseNumber.toString().length === 0){
      setPersonalAddressErrors((prev) => (
        {...prev, 'houseNumber': {'error':true, 'text':"Podaj poprawny Numer Domu"}}))
        errors = true
    }
    return errors
  }  

  //! School
  const validateSchool = () => {
    setSchoolErrors(SchoolErrorState);
    setSchoolAddressErrors(SchoolAddressErrors);
    let errors = false;

    if (takenDomains) {
      for (const item of takenDomains.names) {
        if (SchoolInformation.domain === item) {
          setSchoolErrors((prev) => (
            {...prev, ['domain']: {'error':true, 'text':"Szkoła z podaną domena jest już zarejestrowana"}}))
          errors = true
        }
      }
    }
    if (SchoolInformation.name.length === 0) {
      setSchoolErrors((prev) => (
        {...prev, ['name']: {'error':true, 'text':"Podaj nazwę szkoły"}}))
      errors = true
    }
    if (SchoolInformation.domain.split("").find((x) => x === "@")){
      setSchoolErrors((prev) => (
        {...prev, ['domain']: {'error':true, 'text':"Podaj domenę bez @"}}))
        errors = true
      }
    if (SchoolInformation.domain.length === 0){
      setSchoolErrors((prev) => (
        {...prev, ['domain']: {'error':true, 'text':"Podaj poprawną domene"}}))
        errors = true
    }
    if (SchoolInformation.address.city.length === 0){
      setSchoolAddressErrors((prev) => (
        {...prev, ['city']: {'error':true, 'text':"Podaj miasto"}}))
        errors = true
    }
    if (SchoolInformation.address.street.length === 0){
      setSchoolAddressErrors((prev) => (
        {...prev, ['street']: {'error':true, 'text':"Podaj ulicę, na której znajduje się szkoła"}}))
        errors = true
    }
    if (
      SchoolInformation.address.postCode.length !== 6 ||
      SchoolInformation.address.postCode[2] !== "-"
    ){
      setSchoolAddressErrors((prev) => (
        {...prev, ['postCode']: {'error':true, 'text':"Podaj poprawny kod pocztowy"}}))
        errors = true
    }
    if (SchoolInformation.address.houseNumber === 0){
      setSchoolAddressErrors((prev) => (
        {...prev, ['houseNumber']: {'error':true, 'text':"Podaj poprawny numer budynku szkoły"}}))
        errors = true
    }

    return errors
  } 

  // ? ----------------------------------------------------------

  // ? Funckja przed zmiana stepu
  const changeStep = (step: currentStepType, current:currentStepType) => {
    console.log(current);
    if(current === 1){
      if(!validateLogin()){
        setCurrentStep(step);
      }
    }
    else if(current === 2){
      if(!validatePersonal()){
        console.log('ddd')
        setCurrentStep(step);
      }
    }
    else if(current === 3){
      if(!validateSchool()){
        setCurrentStep(step);
      }
    }
    else{
      setCurrentStep(step);
    }
    

  }
  

    useEffect(() => {
      if(currentStep > maxStep){
        setMaxStep(currentStep);
      }
    }, [currentStep]);

    

  return (
    <div className="flex justify-center">
      <section className="flex justify-center items-center p-4 px-2 m-4  rounded-xl w-[80%] flex-col">
        <Steps currentStep={currentStep} maxStep={maxStep} setStep={changeStep} />
        <AnimatePresence exitBeforeEnter>
          <motion.div
            key={currentStep}
            initial={
              currentStep === 1 ? { opacity: 0, y: 200 } : { opacity: 0 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, display: "none", y: -200 }}
            transition={{ duration: 0.25 }}
          >
            {currentStep === 1 && (
              <LoginCredentialForm
                set={setPrincipalLoginCredentials}
                setStep={changeStep}
                credentialsData={PrincipalLoginCredentials}
                fieldErrors={loginErrors}
              />
            )}
            {currentStep === 2 && (
              <PersonalInformationForm
                set={setPrincipalPersonalInformation}
                setStep={changeStep}
                credentialsData={PrincipalPersonalInformation}
                fieldErrors={personalErrors}
                addressErrors={personalAddressErrors}
              />
            )}
            {currentStep === 3 && (
              <SchoolInformationForm
                set={setSchoolInformation}
                setStep={changeStep}
                credentialsData={SchoolInformation}
                fieldErrors={schoolErrors}
                addressErrors={schoolAddressErrors}
              />
            )}
            {currentStep === 4 && (
              <ChoosePlanForm setStep={setCurrentStep} set={setchosenPlan} />
            )}
            {currentStep === 5 && (
              <Summary
                PrincipalLoginCredentials={PrincipalLoginCredentials}
                PrincipalPersonalInformation={PrincipalPersonalInformation}
                SchoolInformation={SchoolInformation}
                chosenPlan={chosenPlan}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
};
