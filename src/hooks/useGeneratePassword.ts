import { useState } from "react";

export const useGeneratePassword = () => {
  const [password, setPassword] = useState<string>("");
  const generatePassword = () => {
    const characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_-+=";
    let password = "",
      temp;

    for (let i = 0; i < 10; i++) {
      temp = Math.floor(Math.random() * characters.length);
      password += characters.charAt(temp);
    }
    setPassword(password);
  };
  return { password, generatePassword };
};
