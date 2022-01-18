import {
  PrincipalLoginCredentials,
  PrincipalPersonalInformation,
  SchoolInformation,
  PlanTypes,
} from "../../../utils/interfaces";

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 card card-bordered p-10 m-2 bg-base-200">
      <div>
        <h2>Dane logowania</h2>
        <p>Email: {PrincipalLoginCredentials.email}</p>
      </div>
      <div>
        <h2>Dane personalne</h2>
        <p>Imię: {PrincipalPersonalInformation.firstName}</p>
        <p>Nazwisko: {PrincipalPersonalInformation.lastName}</p>
        <div>
          Adres:
          <p>Miasto: {PrincipalPersonalInformation.address.city}</p>
          <p>Ulica: {PrincipalPersonalInformation.address.street}</p>
          <p>Numer Domu: {PrincipalPersonalInformation.address.houseNumber}</p>
          <p>Kod pocztowy: {PrincipalPersonalInformation.address.postCode}</p>
        </div>
        <p>Data urodzenia: {PrincipalPersonalInformation.birth}</p>
        <p>Płeć: {PrincipalPersonalInformation.gender}</p>
        <p>Pesel: {PrincipalPersonalInformation.pesel}</p>
      </div>
      <div>
        <h2>Dane szkoły</h2>
        <p>Nazwa szkoły: {SchoolInformation.name}</p>
        <div>
          Adres szkoły:
          <p>Miasto {SchoolInformation.address.city}</p>
          <p>Ulica: {SchoolInformation.address.street}</p>
          <p>Numer Domu: {SchoolInformation.address.houseNumber}</p>
          <p>Kod pocztowy: {SchoolInformation.address.postCode}</p>
        </div>
        <p>Rodzaj szkoły: {SchoolInformation.type}</p>
      </div>
      <div>
        <h2>Wybrany plan</h2>
        <p>{chosenPlan}</p>
      </div>
      <div className="md:col-span-2 flex items-center justify-center mt-2">
        <button className="btn btn-success">Potwierdzam</button>
      </div>
    </div>
  );
};

// export interface PrincipalLoginCredentials {
//   email: string;
//   password: string;
//   repeatedPassword: string;
// }
// export interface PrincipalPersonalInformation {
//   firstName: string;
//   lastName: string;
//   pesel: string;
//   birth: string;
//   gender: genderType;
//   address: Address;
// }
// export interface SchoolInformation {
//   name: string;
//   address: Address;
//   type: schoolType;
// }
