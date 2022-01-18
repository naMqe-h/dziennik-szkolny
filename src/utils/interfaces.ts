export interface StepsProps {
  currentStep: number;
}
export type currentStepType = 1 | 2 | 3 | 4 | 5;
export interface FormData {
  login: string;
  password: string;
}
export interface PrincipalLoginCredentials {
  email: string;
  password: string;
  repeatedPassword: string;
}
type genderType = "Kobieta" | "Mężczyzna" | "Inna";
type schoolType =
  | "Liceum"
  | "Technikum"
  | "Szkoła Podstawowa"
  | "Uniwersytet"
  | "Szkoła Zawodowa";
interface Address {
  street: string;
  houseNumber: number;
  postCode: string;
  city: string;
}
export interface PrincipalPersonalInformation {
  firstName: string;
  lastName: string;
  pesel: string;
  birth: string;
  gender: genderType;
  address: Address;
}
export interface SchoolInformation {
  name: string;
  address: Address;
  domain: string;
  type: schoolType;
}
export type PlanTypes = "Basic" | "Premium";

export interface Event {
  id: number;
  name: string;
  date: string;
  done: boolean;
}
export interface Teacher {
  firstName: string;
  lastName: string;
  gender: genderType;
  subject: schoolSubject;
}
type schoolSubject =
  | "Matematyka"
  | "Angielski"
  | "Język Polski"
  | "WF"
  | "Historia";
