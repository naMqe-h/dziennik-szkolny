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
export const generateEmail = (
  firstName: string,
  lastName: string,
  domain: string
): string => {
  const login = (
    firstName.slice(0, 3) +
    lastName.slice(0, 3) +
    Math.floor(Math.random() * 1000)
  ).toLowerCase();
  const email = `${login.toLowerCase()}@${domain}`;
  return email;
};
export const generatePassword = (): string => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_-+=";
  let password = "",
    temp;

  for (let i = 0; i < 10; i++) {
    temp = Math.floor(Math.random() * characters.length);
    password += characters.charAt(temp);
  }
  return password;
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
export const isValidHttpUrl = (checkedUrl: string) => {
  let url;

  try {
    url = new URL(checkedUrl);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
};
