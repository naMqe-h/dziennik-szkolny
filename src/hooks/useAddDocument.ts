import { useState } from "react";
import { db } from "../firebase/firebase.config";
import { doc, setDoc, DocumentData, FirestoreError } from "firebase/firestore";
import {
  CombinedPrincipalData as CPD,
  CombinedSchoolInformationFromFirebase as CSIFF,
  TeachersDataFromFirebase as TDFF,
  StudentsDataFromFirebase as SDFF
} from "../utils/interfaces";
import { toast } from "react-toastify";

export const useAddDocument = () => {
  const [document] = useState<DocumentData | undefined>(undefined);
  const addDocument = async (
    c: string,
    id: string,
    data: CPD | CSIFF | TDFF | SDFF
  ) => {
    await setDoc(doc(db, c, id), data,{merge:true}).catch((err: FirestoreError) => {
      toast.error(`${err.message}`);
    });
  };

  return { addDocument, document };
};
