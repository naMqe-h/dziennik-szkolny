import { useState } from "react";
import { db } from "../firebase/firebase.config";
import { doc, setDoc, DocumentData, FirestoreError } from "firebase/firestore";
import { toast } from "react-toastify";

export const useSetDocument = () => {
  const [document] = useState<DocumentData | undefined>(undefined);
  const setDocument = async ( c: string, id: string, data: any ) => {
    await setDoc(doc(db, c, id), data, { merge: true }).catch(
      (err: FirestoreError) => {
        toast.error(`${err.message}`);
      }
    );
  };

  return { setDocument, document };
};
