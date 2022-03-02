import { AuthError } from "firebase/auth";
import React from "react";
import reactSelect from "react-select";
import { toast } from "react-toastify";
import { daysOfWeek } from "./interfaces";

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
export const getDayOfTheWeek = (day: number): daysOfWeek => {
  if (day === 0 || day === 1 || day === 6) return "monday";
  if (day === 2) return "tuesday";
  if (day === 3) return "wednesday";
  if (day === 4) return "thursday";
  if (day === 5) return "friday";
  return "monday";
};

export const lessonHours = [
  `8:00 - 8:45`,
  `8:50 - 9:35`,
  `9:45 - 10:30`,
  `10:40 - 11:25`,
  `11:40 - 12:25`,
  `12:35 - 13:20`,
  `13:30 - 14:15`,
  `14:20 - 15:05`,
  `15:10 - 15:55`,
  `16:00 - 16:45`,
  `16:50 - 17:35`,
]
type setLoadingContextType = React.Dispatch<React.SetStateAction<boolean>> | null
export const SetLoadingContext = React.createContext<setLoadingContextType>(null)