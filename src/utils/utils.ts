import { AuthError } from "firebase/auth";
import { toast } from "react-toastify";

export const validateEmail = (email: string) => {
  return email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
export const validatePesel = (pesel: string): boolean => {
  const controlSum = Number(pesel[10]);
  const weight = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
  let total = 0;
  const numericPesel = pesel.split("").map((x) => +x);
  numericPesel.pop();
  numericPesel.forEach((x, i) => {
    const s = x * weight[i];
    total += s % 10;
  });
  total = total % 10;
  return 10 - total === controlSum;
};
export const showToastError = (error: AuthError) => {
  switch (error.code) {
    case "auth/wrong-password":
      toast.error("Podaj poprawne hasło");
      break;
    case "auth/user-not-found":
      toast.error("Nie znaleziono użytkownika");
      break;
    case "auth/invalid-email":
      toast.error("Podaj Poprawny Email");
      break;
    default:
      toast.error(`${error.code}`);
  }
};
