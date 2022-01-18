import { currentStepType, PlanTypes } from "../../../utils/interfaces";
import { PaymentPlanCard } from "./PaymentPlanCard";
export interface ChoosePlanFormProps {
  setStep: React.Dispatch<React.SetStateAction<currentStepType>>;
  set: React.Dispatch<React.SetStateAction<PlanTypes>>;
}
export const ChoosePlanForm: React.FC<ChoosePlanFormProps> = ({
  setStep,
  set,
}) => {
  return (
    <div className="flex flex-row gap-3 mt-10">
      <PaymentPlanCard
        name="Basic"
        badge=""
        image="card-1.jpg"
        price={0}
        set={set}
        setStep={setStep}
      />
      <PaymentPlanCard
        name="Premium"
        badge="BESTSELLER"
        image="card-2.jpg"
        price={500}
        set={set}
        setStep={setStep}
      />
    </div>
  );
};
