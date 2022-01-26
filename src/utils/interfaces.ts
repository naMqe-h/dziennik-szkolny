export interface StepsProps {
  currentStep: number;
}
export type currentStepType = 1 | 2 | 3 | 4 | 5;
export type userType = "principals" | "teachers" | "students";
export interface FormData {
  email: string;
  password: string;
  role: userType;
}
export interface PrincipalLoginCredentials {
  email: string;
  password: string;
  repeatedPassword: string;
}
export type genderType = "Kobieta" | "Mężczyzna" | "Inna";
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
//Tworze nowy typ który jest tylko emailem z PrincipalLoginCredentials
type PrincipalEmail = Pick<PrincipalLoginCredentials, "email">;
//Interfejs danych o dyrektorze
export interface CombinedPrincipalData
  extends PrincipalEmail,
    PrincipalPersonalInformation {
  planType: PlanTypes;
  schoolInformation: SchoolInformation;
}
export type PlanTypes = "Basic" | "Premium";

export interface Event {
  id: number;
  name: string;
  date: string;
  done: boolean;
}
//? Interfejs do dodawania z formularza nowego nauczyciela
export interface TeacherData {
  firstName: string;
  lastName: string;
  gender: genderType;
  subject: string;
  email: string;
  password: string;
}
//! Domyslne zmienic
type schoolSubject =
  | "Matematyka"
  | "Angielski"
  | "Język Polski"
  | "WF"
  | "Historia";
//?? Interfejs przy dodawaniu formularza dla nowego studenta
export interface StudentData {
  firstName: string;
  lastName: string;
  gender: genderType;
  email: string;
  password: string;
  pesel: string;
  birth: string;
  class: string;
}
//?Interfejs Pojedynczej oceny
export interface SchoolGrade {
  grade: number;
  weight: number;
  topic: string;
  date: string;
  addedBy: string;
}
//? Interfejs Klasy do formularza dodawania
export interface ClassData {
  name: string;
  fullName: string;
  classTeacher: string; //?Mail
  profile: string;
  subjects: string[];
}
//?Interfejs dla pojedynczego przedmiotu szkolnego

export interface SubjectData {
  name: string;
  teachers: string[];
  includedAvg: boolean;
}
//? Interfejs Klasy ze Studentami do np sprawdzania frekwencji  || Wyświetlania informacji o danej klasie
export interface SingleClassData extends ClassData {
  students: string[];
}
//! Here are the interaces from Firebase
//? Interfejs Danych z firebasa o pojedynczym uczniu
export interface StudentsDataFromFirebase {
  [key: string]: {
    firstName: string;
    lastName: string;
    gender: genderType;
    email: string;
    password: string;
    pesel: string;
    birth: string;
    class: string;
    grades: { [key: string]: SchoolGrade[] };
  };
}

//? Interfejs Danych z firebasa o pojedynczym uczniu
export interface SingleStudentDataFromFirebase {
  firstName: string;
  lastName: string;
  gender: genderType;
  email: string;
  password: string;
  pesel: string;
  birth: string;
  class: string;
  grades: { [key: string]: SchoolGrade[] };
}
//? Interfejs Danych z firebasa o pojedynczym nauczycielu
export interface SingleTeacherData extends TeacherData {
  classTeacher: string;
}
//? Interfejs Danych z firebasa o wszystkich klasach
export interface ClassesDataFromFirebase {
  [key: string]: SingleClassData;
}
//? Interfejt Danych z firebasa o szkole
export interface CombinedSchoolInformationFromFirebase
  extends SchoolInformation {
  principalUID: string;
  classesCount: number;
  teachersCount: number;
  studentsCount: number;
  subjectsCount: number;
  planType: PlanTypes;
}
//?Interfejs dla dokumentu z firebasa z wszystkimi przedmiotami szkolnymi oraz nauczycielami którzy ich uczą
export interface SchoolSubjectsDataFromFirebase {
  [key: string]: SubjectData;
}

//? Interfejs Danych z firebasa o wszystkich nauczycielach
export interface TeachersDataFromFirebase {
  [key: string]: SingleTeacherData;
}

//?Interfejs dla całej kolekcji szkoły z firebase
export interface CombinedSchoolDataFromFirebase {
  classes: ClassesDataFromFirebase;
  information: CombinedSchoolInformationFromFirebase;
  students: StudentsDataFromFirebase;
  subjects: SchoolSubjectsDataFromFirebase;
  teachers: TeachersDataFromFirebase;
}
export interface updateTeacherClass {
  [key: string]: {
    classTeacher: string;
  };
}
export interface updateSubjectTeachers {
  [key: string]: {
    teachers: string[];
  };
}
export interface updateClassStudents {
  [key: string]: {
    students: string[];
  };
}
