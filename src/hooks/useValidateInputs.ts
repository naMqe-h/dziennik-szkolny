import { objectTraps } from "immer/dist/internal";
import { useEffect, useState } from "react";
import {errorsInterface} from "../utils/interfaces";
import { validateEmail, validatePesel } from "../utils/utils";
import { useDocument } from "./useDocument";



const errorsInitial:errorsInterface = {
    firstName: {error:false, text: ''},
    lastName: {error:false, text: ''},
    birth: {error:false, text: ''},
    pesel: {error:false, text: ''},
    email: {error:false, text: ''},
    password: {error:false, text: ''},
    repeatedPassword: {error:false, text: ''},
    name: {error:false, text: ''},
    domain: {error:false, text: ''},
    city: {error:false, text: ''},
    houseNumber: {error:false, text: ''},
    postCode: {error:false, text: ''},
    street: {error:false, text: ''},
}

export const useValidateInputs = () => {
    const [inputErrors, setInputErrors] = useState<errorsInterface>(errorsInitial);
    const [errors, setErrors] = useState<Boolean>(false);
    const { getDocument, document: takenDomains } = useDocument();
    

    useEffect(() => {
        getDocument("utils", "domains");
        // eslint-disable-next-line
      }, []);

    interface mappedNamesInterface{
      [key: string] : string;
    }
    const mappedNames: mappedNamesInterface = {
      firstName: 'Imię',
      lastName: 'Nazwisko',
      birth: 'Datę urodzenia',
      password: 'Hasło',
      name: 'Nazwę',
      domain: 'Domene',
      city: 'Miasto',
      houseNumber: 'Number domu',
      postCode: 'Kod pocztowy',
      street: 'ulicę'
    }



    const validateData = (data: object) => {
        setInputErrors(errorsInitial);
        setErrors(false);
        console.log(Object.entries(data));
        
        Object.entries(data).map((field) => {
          let fieldName = field[0];
          let fieldVal = field[1];

          if(fieldName !== 'address' && fieldName !== 'passwords'){
            if(fieldVal.length === 0){
              setInputErrors((prev) => (
                {...prev, [field[0]]: {'error':true, 'text': `Podaj ${mappedNames[fieldName] ? mappedNames[fieldName] : fieldName}`}}
              ))
              setErrors(true);
            }
            if(fieldName === 'pesel'){
              if(fieldVal.length !== 11){
                setInputErrors((prev) => (
                            {...prev, 'pesel': {'error':true, 'text':"Podaj poprawny pesel"}}))
                setErrors(true);
              }
              if (!validatePesel(fieldVal)){
                setInputErrors((prev) => (
                  {...prev, 'pesel': {'error':true, 'text':"Podaj poprawny pesel"}}))
                  setErrors(true);
              }
            }
            if(fieldName === 'email'){
              if (!validateEmail(fieldVal)){
                setInputErrors((prev) => (
                  {...prev, 'email': {'error':true, 'text':"Podaj Poprawny Email"}}))
                  setErrors(true);
              }
            }
            if(fieldName === 'domain'){
              if (takenDomains) {
                  for (const item of takenDomains.names) {
                    if (fieldVal === item) {
                      setInputErrors((prev) => (
                        {...prev, 'domain': {'error':true, 'text':"Szkoła z podaną domena jest już zarejestrowana"}}))
                      setErrors(true);
                    }
                  }
                }
                if (fieldVal.split("").find((x: any) => x === "@")){
                  setInputErrors((prev) => (
                    {...prev, 'domain': {'error':true, 'text':"Podaj domenę bez @"}}))
                    setErrors(true);
                  }
                if (fieldVal.length === 0){
                  setInputErrors((prev) => (
                    {...prev, 'domain': {'error':true, 'text':"Podaj poprawną domene"}}))
                    setErrors(true);
                }
            }
          } else{
            if(fieldName === 'address'){
              Object.entries(fieldVal).map((fieldObj) => {
                let fieldObjName:string = fieldObj[0];
                let fieldObjVal:any = fieldObj[1];
  
                if(fieldObjVal.length === 0){
                  setInputErrors((prev) => (
                    {...prev, [fieldObj[0]]: {'error':true, 'text': `Podaj ${mappedNames[fieldObjName] ? mappedNames[fieldObjName] : fieldObjName}`}}
                  ))
                  setErrors(true);
                }
  
              })
            } else{
              if (fieldVal.password.length < 6){
                  setInputErrors((prev) => (
                    {...prev, 'password': {'error':true, 'text':"Hasło musi mieć 6 liter"}}))
                  setErrors(true);
              }
              if (fieldVal.password !== fieldVal.repeatedPassword){
                  setInputErrors((prev) => (
                    {...prev, 'repeatedPassword': {'error':true, 'text':"Podane hasła się nie zgadzają"}}))
                    setErrors(true);
              }   
            }
            

          }
        })
    }



    return {validateData, inputErrors, errors};
}
