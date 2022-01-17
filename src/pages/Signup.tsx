import { useState } from "react";
import Steps from "../components/signup/Steps";
import { currentStepType } from "../interfaces";
// import { GiLevelTwo } from "react-icons/gi";
export const Signup: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<currentStepType>(4);
  return (
    <div className="w-screen flex justify-center">
      <section className="flex justify-center items-center p-4 px-2 m-4  rounded-xl w-[80%] md:w-[60%] lg:w-[40%] flex-col">
        <Steps currentStep={currentStep} />
      </section>
    </div>
  );
};
