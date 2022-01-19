import { useState } from "react";
import { db } from "../firebase/firebase.config";
import { doc, setDoc, DocumentData } from "firebase/firestore";
import { CombinedPrincipalData } from "../utils/interfaces";

export const useAddDocument = () => {
  const [document, setDocument] = useState<DocumentData | undefined>(undefined);

  const addDocument = async (
    c: string,
    uid: string,
    data: CombinedPrincipalData
  ) => {
    await setDoc(doc(db, c, uid), data)
      .then((doc) => {
        console.log(doc);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return { addDocument, document };
};
