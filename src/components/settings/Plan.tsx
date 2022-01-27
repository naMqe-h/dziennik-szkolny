import { useEffect, useState } from "react";
import { PlanTypes } from "../../utils/interfaces";
import { PaymentPlanCard } from "../principal/signup/PaymentPlanCard";

interface planProps{
    currentPlanType: PlanTypes;
    planChange: (plan: PlanTypes) => void;
}

export const Plan: React.FC<planProps> = ({currentPlanType, planChange}) => {

    const [planType, setPlanType] = useState<PlanTypes>(currentPlanType);

    useEffect(() => {
        if(planType !== currentPlanType) {
            planChange(planType);
        }
    }, [planType])

    return (
        <div className="flex flex-col md:flex-row p-10 md:justify-center">
            <PaymentPlanCard
            name="Basic"
            badge=""
            image="card-1.jpg"
            price={0}
            set={setPlanType}
            currentPlanType={planType}
            />
            <div className="divider md:divider-vertical md:px-20" />
            <PaymentPlanCard
            name="Premium"
            badge="BESTSELLER"
            image="card-2.jpg"
            price={500}
            set={setPlanType}
            currentPlanType={planType}
            />
      </div>
      );
}