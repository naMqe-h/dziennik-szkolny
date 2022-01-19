import { createUserWithEmailAndPassword, AuthError } from "firebase/auth";
import nProgress from "nprogress";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth } from "../../../firebase/firebase.config";
import {
  PrincipalLoginCredentials,
  PrincipalPersonalInformation,
  SchoolInformation,
  PlanTypes,
} from "../../../utils/interfaces";
import { useSignup } from "../../../hooks/useSignup";

interface summaryProps {
  PrincipalLoginCredentials: PrincipalLoginCredentials;
  PrincipalPersonalInformation: PrincipalPersonalInformation;
  SchoolInformation: SchoolInformation;
  chosenPlan: PlanTypes;
}

export const Summary: React.FC<summaryProps> = ({
  PrincipalLoginCredentials,
  PrincipalPersonalInformation,
  SchoolInformation,
  chosenPlan,
}) => {
  const navigate = useNavigate();
  const { email, password } = PrincipalLoginCredentials;
  const { firstName, birth, lastName, address, gender, pesel } =
    PrincipalPersonalInformation;
  const { signupPrincipal } = useSignup();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 card card-bordered p-10 m-2 bg-base-200 break-words md:gap-8">
      <div>
        <h2 className="text-2xl text-primary">Dane logowania</h2>
        <p>Email: {email}</p>
      </div>
      <div>
        <h2 className="text-2xl  text-primary">Dane personalne</h2>
        <p>Imię: {firstName}</p>
        <p>Nazwisko: {lastName}</p>
        <div>
          Adres:
          <p>Miasto: {address.city}</p>
          <p>Ulica: {address.street}</p>
          <p>Numer Domu: {address.houseNumber}</p>
          <p>Kod pocztowy: {address.postCode}</p>
        </div>
        <p>Data urodzenia: {birth}</p>
        <p>Płeć: {gender}</p>
        <p>Pesel: {pesel}</p>
      </div>
      <div>
        <h2 className="text-2xl  text-primary">Dane szkoły</h2>
        <p>Nazwa szkoły: {SchoolInformation.name}</p>
        <div>
          Adres szkoły:
          <p>Miasto: {SchoolInformation.address.city}</p>
          <p>Ulica: {SchoolInformation.address.street}</p>
          <p>Numer Domu: {SchoolInformation.address.houseNumber}</p>
          <p>Kod pocztowy: {SchoolInformation.address.postCode}</p>
        </div>
        <p>Rodzaj szkoły: {SchoolInformation.type}</p>
      </div>
      <div>
        <h2 className="text-2xl  text-primary">Wybrany plan</h2>
        <p>{chosenPlan}</p>
      </div>
      <div className="md:col-span-2 flex items-center justify-center mt-2">
        <button
          className="btn btn-success"
          onClick={() => signupPrincipal(email, password)}
        >
          Potwierdzam
        </button>
      </div>
    </div>
  );
};
