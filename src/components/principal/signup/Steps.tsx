import React from "react";
import { StepsProps } from "../../../utils/interfaces";

const Steps: React.FC<StepsProps> = ({ currentStep, setStep }) => {
  return (
    <ul className="hidden md:visible steps steps-vertical md:steps-horizontal transition-all duration-1000 ">
      <li onClick={currentStep >= 1 ? () => setStep(1) : undefined}
        className={`step  ${
          currentStep >= 1 && "step-primary cursor-pointer"
        } `}
      >
        Logowanie
      </li>
      <li onClick={currentStep >= 2 ? () => setStep(2) : undefined}
        className={`step  step-neutral ${
          currentStep >= 2 && "step-primary cursor-pointer"
        } `}
      >
        Dane
      </li>
      <li onClick={currentStep >= 3 ? () => setStep(3) : undefined}
        className={`step   step-neutral ${
          currentStep >= 3 && "step-primary cursor-pointer"
        } `}
      >
        Szkoła
      </li>
      <li onClick={currentStep >= 4 ? () => setStep(4) : undefined}
        className={`step   step-neutral ${
          currentStep >= 4 && "step-primary cursor-pointer"
        } `}
      >
        Plan
      </li>
      <li onClick={currentStep >= 5 ? () => setStep(5) : undefined}
        className={`step   step-neutral ${
          currentStep >= 5 && "step-primary cursor-pointer"
        } `}
      >
        Podsumowanie
      </li>
    </ul>
  );
};
export default Steps;
