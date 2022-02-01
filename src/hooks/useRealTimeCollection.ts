import { db } from "../firebase/firebase.config";
import { collection, onSnapshot } from "firebase/firestore";
import { CombinedSchoolDataFromFirebase } from "../utils/interfaces";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState } from "../redux/store";

export const useRealTimeCollection = () => {
  const state = useSelector((state: RootState) => state.principal);
  const [realTimeDocuments, setRealTimeDocuments] = useState<CombinedSchoolDataFromFirebase>()

  useEffect(() => {
    if (state.user) {
      const domain = state.user.displayName?.split("~")[0];
      const ref = collection(db, domain as string);
      const unsub = onSnapshot(ref, (snapshot) => {
        let data = {};
        snapshot.docs.forEach((doc) => {
          data = { ...data, [doc.id]: { ...doc.data() } };
        });
        setRealTimeDocuments(data as CombinedSchoolDataFromFirebase)
      });

      return () => unsub();
    }
    // eslint-disable-next-line
  }, [state.user]);

  return { realTimeDocuments };
};
