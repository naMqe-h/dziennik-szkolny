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



    const validateData = (data: any) => {
        setInputErrors(errorsInitial);
        setErrors(false);
        console.log(data);

        if(data?.firstName) if(data.firstName.length === 0){
            setInputErrors((prev) => (
                {...prev, 'firstName': {'error':true, 'text':"Podaj Imię"}}))
            setErrors(true);
            console.log('name');
        }
        
        if(data?.lastName) if (data.lastName.length === 0){
            setInputErrors((prev) => (
              {...prev, 'lastName': {'error':true, 'text':"Podaj Nazwisko"}}))
              setErrors(true);
          }
        
        if(data?.birth) if(data.birth === ""){
            setInputErrors((prev) => (
              {...prev, 'birth': {'error':true, 'text':"Podaj datę urodzenia"}}))
              setErrors(true);
          }
        
        if(data?.pesel){
            if (data.pesel.length !== 11){
                setInputErrors((prev) => (
                  {...prev, 'pesel': {'error':true, 'text':"Podaj poprawny pesel"}}))
                  setErrors(true);
            }
            if (!validatePesel(data.pesel)){
                setInputErrors((prev) => (
                  {...prev, 'pesel': {'error':true, 'text':"Podaj poprawny pesel"}}))
                  setErrors(true);
            }
        } 
        
        if(data?.email) if (!validateEmail(data.email)){
            setInputErrors((prev) => (
              {...prev, 'email': {'error':true, 'text':"Podaj Poprawny Email"}}))
              setErrors(true);
            console.log('email');
          }

        if(data?.password && data?.repeatedPassword){
            if (data.password.length < 6){
                setInputErrors((prev) => (
                  {...prev, 'password': {'error':true, 'text':"Hasło musi mieć 6 liter"}}))
                  setErrors(true);
            }
            if (data.password !== data.repeatedPassword){
                setInputErrors((prev) => (
                  {...prev, 'repeatedPassword': {'error':true, 'text':"Podane hasła się nie zgadzają"}}))
                  setErrors(true);
            }            
            console.log('psw');
        } 

        if(data?.name) if (data.name.length === 0) {
            setInputErrors((prev) => (
              {...prev, 'name': {'error':true, 'text':"Podaj nazwę szkoły"}}))
            setErrors(true);
          }

        if(data?.domain) {
            if (takenDomains) {
                for (const item of takenDomains.names) {
                  if (data.domain === item) {
                    setInputErrors((prev) => (
                      {...prev, 'domain': {'error':true, 'text':"Szkoła z podaną domena jest już zarejestrowana"}}))
                    setErrors(true);
                  }
                }
              }
              if (data.domain.split("").find((x: any) => x === "@")){
                setInputErrors((prev) => (
                  {...prev, 'domain': {'error':true, 'text':"Podaj domenę bez @"}}))
                  setErrors(true);
                }
              if (data.domain.length === 0){
                setInputErrors((prev) => (
                  {...prev, 'domain': {'error':true, 'text':"Podaj poprawną domene"}}))
                  setErrors(true);
              }
        }

        if(data?.address) {
            if (data.address.city.length === 0){
                setInputErrors((prev) => (
                  {...prev, 'city': {'error':true, 'text':"Podaj miasto"}}))
                  setErrors(true);
              }
              if (data.address.street.length === 0){
                setInputErrors((prev) => (
                  {...prev, 'street': {'error':true, 'text':"Podaj poprwaną ulicę"}}))
                  setErrors(true);
              }
              if (
                data.address.postCode.length !== 6 ||
                data.address.postCode[2] !== "-"
              ){
                setInputErrors((prev) => (
                  {...prev, 'postCode': {'error':true, 'text':"Podaj poprawny kod pocztowy"}}))
                  setErrors(true);
              }
              if (data.address.houseNumber === 0){
                setInputErrors((prev) => (
                  {...prev, 'houseNumber': {'error':true, 'text':"Podaj poprawny numer budynku"}}))
                  setErrors(true);
              }
        }
    }



    return {validateData, inputErrors, errors};
}
