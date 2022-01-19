import { useState } from "react";
import { db } from "../firebase/firebase.config";

import { doc, getDoc, DocumentData } from "firebase/firestore";

export const useDocument = () => {
  const [document, setDocument] = useState<DocumentData | undefined>(undefined);

  const getDocument = async (c: string, id: string) => {
    await getDoc(doc(db, c, id))
      .then((doc) => {
        const data = doc.data();
        setDocument(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return { getDocument, document };
};
