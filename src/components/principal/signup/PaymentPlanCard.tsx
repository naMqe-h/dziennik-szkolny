import { FaArrowRight } from "react-icons/fa";
import { PlanTypes } from "../../../utils/interfaces";
import { ChoosePlanFormProps } from "./ChoosePlanForm";
interface cardProps extends ChoosePlanFormProps {
  name: PlanTypes;
  badge: string;
  image: string;
  price: number;
}

const basicPros = [
  "Limit 1000 uczniów w szkole",
  "Limit 100 nauczycieli",
  "Limit 30 klas w szkole",
  "Podstawowa pomoc techniczna",
];

const premiumPros = [
  "Bez limitu uczniów w szkole",
  "Bez limitu nauczycieli",
  "Bez limitu klas w szkole",
  "Pełna pomoc techniczna 24/7",
];

export const PaymentPlanCard: React.FC<cardProps> = ({
  name,
  badge,
  image,
  price,
  set,
  setStep,
}) => {
  return (
    <div className="card card-bordered bg-base-200 w-96">
      <figure>
        <img className="h-52" src={`/images/${image}`} alt="Plan card" />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-3xl">
          {name}
          {badge !== "" && (
            <div className="badge mx-2 badge-primary badge-outline">
              {badge}
            </div>
          )}
        </h2>
        <div className="text-center mt-4">
          {name === "Basic" &&
            basicPros.map((plus) => (
              <div key={plus}>
                <p>{plus}</p>
                <div className="divider opacity-30 h-1"></div>
              </div>
            ))}
          {name === "Premium" &&
            premiumPros.map((plus) => (
              <div key={plus}>
                <p>{plus}</p>
                <div className="divider opacity-30 h-1"></div>
              </div>
            ))}
        </div>
        <div>
          <h2 className="text-3xl font-bold text-center my-2">
            {price} PLN/rok
          </h2>
        </div>
        <div className="justify-end card-actions">
          <button
            className="btn btn-primary"
            onClick={() => {
              setStep(5);
              set(name);
            }}
          >
            Wybieram
            <FaArrowRight className="ml-3" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
