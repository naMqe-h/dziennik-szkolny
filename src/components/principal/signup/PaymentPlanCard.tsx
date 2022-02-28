import { FaArrowRight } from "react-icons/fa";
import { currentStepType, PlanTypes } from "../../../utils/interfaces";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Card1 from "../../../images/card-1.jpg";
import Card2 from "../../../images/card-2.jpg";
import "../../../../node_modules/react-lazy-load-image-component/src/effects/blur.css";
interface cardProps {
  name: PlanTypes;
  badge: string;
  image: string;
  price: number;
  setStep?: React.Dispatch<React.SetStateAction<currentStepType>>;
  set: React.Dispatch<React.SetStateAction<PlanTypes>>;
  currentPlanType?: PlanTypes;
}

const basicPros = [
  "Limit 1000 uczniów w szkole",
  "Limit 100 nauczycieli",
  "Limit 30 klas w szkole",
  "Podstawowa pomoc techniczna",
  "Podstawowa ilośc motywów",
];

const premiumPros = [
  "Bez limitu uczniów w szkole",
  "Bez limitu nauczycieli",
  "Bez limitu klas w szkole",
  "Pełna pomoc techniczna 24/7",
  "3 Unikalne motywy Premium",
];

export const PaymentPlanCard: React.FC<cardProps> = ({
  name,
  badge,
  image,
  price,
  set,
  setStep,
  currentPlanType,
}) => {
  return (
    <div className="card card-bordered bg-base-200 md:w-96 max-w-lg">
      <figure>
        <LazyLoadImage
          className="h-52 w-full"
          src={`${image === "card-1.jpg" ? Card1 : Card2}`}
          alt="Plan card"
          effect="blur"
        />
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
          {setStep ? (
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
          ) : (
            <>
              {currentPlanType === name ? (
                <label className="btn btn-success">Aktualny</label>
              ) : (
                <label
                  htmlFor={`my-modal-${name}`}
                  className="btn btn-primary modal-button"
                >
                  Wybierz
                </label>
              )}

              <input
                type="checkbox"
                id={`my-modal-${name}`}
                className="modal-toggle"
              />
              <div className="modal">
                <div className="modal-box flex flex-col items-center justify-center">
                  <p>Czy napewno chcesz zmienić plan?</p>
                  <div className="modal-action">
                    <label
                      htmlFor={`my-modal-${name}`}
                      className="btn btn-primary"
                      onClick={() => set(name)}
                    >
                      Akceptuj
                    </label>
                    <label
                      htmlFor={`my-modal-${name}`}
                      className="btn btn-neutral"
                    >
                      Zamknij
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
