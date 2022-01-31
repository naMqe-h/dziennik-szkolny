import { useState } from "react";
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
  const [currentStep, setCurrentStep] = useState<currentStepType>(1);
  const [PrincipalLoginCredentials, setPrincipalLoginCredentials] =
    useState<PrincipalLoginCredentials>({
      email: "",
      password: "",
      repeatedPassword: "",
    });
  const [PrincipalPersonalInformation, setPrincipalPersonalInformation] =
    useState<PrincipalPersonalInformation>({
      birth: "",
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
  const [chosenPlan, setchosenPlan] = useState<PlanTypes>("Basic");
  return (
    <div className="flex justify-center">
      <section className="flex justify-center items-center p-4 px-2 m-4  rounded-xl w-[80%] flex-col">
        <Steps currentStep={currentStep} />
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
                setStep={setCurrentStep}
              />
            )}
            {currentStep === 2 && (
              <PersonalInformationForm
                set={setPrincipalPersonalInformation}
                setStep={setCurrentStep}
              />
            )}
            {currentStep === 3 && (
              <SchoolInformationForm
                set={setSchoolInformation}
                setStep={setCurrentStep}
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
