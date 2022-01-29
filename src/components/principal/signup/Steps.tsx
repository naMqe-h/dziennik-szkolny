import React from "react";
import { currentStepType} from "../../../utils/interfaces";

interface StepsProps {
  currentStep: currentStepType;
  maxStep: currentStepType;
  setStep: (step: currentStepType, current: currentStepType) => void;
}

const Steps: React.FC<StepsProps> = ({ currentStep, setStep, maxStep }) => {
  return (
    <ul className="hidden md:visible steps steps-vertical md:steps-horizontal transition-all duration-1000 ">
      <li onClick={maxStep>= 1 ? () => setStep(1, currentStep) : undefined}
        className={`step  ${
          maxStep >= 1 && "step-primary cursor-pointer"
        } `}
      >
        Logowanie
      </li>
      <li onClick={maxStep >= 2 ?  () => setStep(2, currentStep) : undefined}
        className={`step  step-neutral ${
          maxStep >= 2 && "step-primary cursor-pointer"
        } `}
      >
        Dane
      </li>
      <li onClick={maxStep >= 3 ?  () => setStep(3, currentStep) : undefined}
        className={`step   step-neutral ${
          maxStep >= 3 && "step-primary cursor-pointer"
        } `}
      >
        Szkoła
      </li>
      <li onClick={maxStep >= 4 ?  () => setStep(4, currentStep) : undefined}
        className={`step   step-neutral ${
          maxStep >= 4 && "step-primary cursor-pointer"
        } `}
      >
        Plan
      </li>
      <li onClick={maxStep >= 5 ?  () => setStep(5, currentStep) : undefined}
        className={`step   step-neutral ${
          maxStep >= 5 && "step-primary cursor-pointer"
        } `}
      >
        Podsumowanie
      </li>
    </ul>
  );
};
export default Steps;
