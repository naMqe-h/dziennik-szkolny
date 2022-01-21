import { useState } from "react";
import { db } from "../firebase/firebase.config";
import { collection, getDocs } from "firebase/firestore";

export const useCollection = () => {
  const [documents, setDocuments] = useState({});

  const getCollection = async (c: string) => {
    const ref = collection(db, c);
    let data: any = {};
    let tempData = {};

    const snapshot = await getDocs(ref);
    snapshot.forEach((doc) => {
      tempData = { [doc.id]: doc.data() };
      data = { ...data, ...tempData };
    });
    setDocuments(data);
  };

  return { getCollection, documents };
};
