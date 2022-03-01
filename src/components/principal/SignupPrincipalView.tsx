import { useEffect, useState } from "react";
import { LoginCredentialForm } from "./signup/LoginCredentialForm";
import { PersonalInformationForm } from "./signup/PersonalInformationForm";
import Steps from "./signup/Steps";
import {
  currentStepType,
  PlanTypes,
  PrincipalLoginCredentials,
  PrincipalPersonalInformation,
  SchoolInformation,
} from "../../utils/interfaces";
import { SchoolInformationForm } from "./signup/SchoolInformationForm";
import { AnimatePresence, motion } from "framer-motion";
import { ChoosePlanForm } from "./signup/ChoosePlanForm";
import { Summary } from "./signup/Summary";

import { useValidateInputs } from "../../hooks/useValidateInputs";
export const SignupPrincipalView: React.FC = () => {
  
  const [currentStep, setCurrentStep] = useState<currentStepType>(1);
  const [maxStep, setMaxStep] = useState<currentStepType>(1);
  const [PrincipalLoginCredentials, setPrincipalLoginCredentials] =
    useState<PrincipalLoginCredentials>({
      email: "",
      passwords:{
        password: "",
        repeatedPassword: "",
      }
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
      domain: "",
      address: {
        city: "",
        houseNumber: 0,
        postCode: "",
        street: "",
      },
    }
  );
  const [chosenPlan, setchosenPlan] = useState<PlanTypes>("Basic");


  const { validateData, inputErrors, errors } = useValidateInputs();

  

  interface changingStepsInterface {
    to: null | currentStepType;
    current: null | currentStepType;
    validated: boolean;
  }
  const [changingStep, setChangingStep] = useState<changingStepsInterface>({
    to: null,
    current: null,
    validated: false,
  });


  useEffect(() => {
    if(changingStep.to && changingStep.current){
    if(changingStep.current === 1){
      validateData(PrincipalLoginCredentials);
    }
    else if(changingStep.current === 2){
      validateData(PrincipalPersonalInformation);
    }
    else if(changingStep.current === 3){
      validateData(SchoolInformation);
    }
    setChangingStep((prev) => ({...prev, validated: true}));
    } else {
      return
    }
  }, [changingStep.to, changingStep.current]);

  useEffect(() => {
    if(changingStep.validated){
      if(!errors){
        if(changingStep.to){
          setCurrentStep(changingStep.to);
        }
      }
      setChangingStep({
          to: null,
          current: null,
          validated: false
        })
    }
  }, [changingStep.validated]);
  
  

  // ? Funckja przed zmiana stepu
  const changeStep = (step: currentStepType, current:currentStepType) => {
    setChangingStep({to:step, current: current, validated: false});
  }
  

  useEffect(() => {
    if(currentStep > maxStep){
        setMaxStep(currentStep);
    }
  }, [currentStep, maxStep]);

    

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
                fieldErrors={inputErrors}
              />
            )}
            {currentStep === 2 && (
              <PersonalInformationForm
                set={setPrincipalPersonalInformation}
                setStep={changeStep}
                credentialsData={PrincipalPersonalInformation}
                fieldErrors={inputErrors}
              />
            )}
            {currentStep === 3 && (
              <SchoolInformationForm
                set={setSchoolInformation}
                setStep={changeStep}
                credentialsData={SchoolInformation}
                fieldErrors={inputErrors}
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