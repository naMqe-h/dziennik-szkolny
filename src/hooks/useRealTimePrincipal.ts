import { db } from "../firebase/firebase.config";
import { collection, onSnapshot } from "firebase/firestore";
import { CombinedPrincipalData } from "../utils/interfaces";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState } from "../redux/store";

export const useRealTimePrincipal = () => {
  const principalUser = useSelector((state: RootState) => state.principal.user);
  const [realTimePrincipal, setRealTimePrincipal] = useState<CombinedPrincipalData>()

  useEffect(() => {
    if (principalUser) {
      const ref = collection(db, 'principals');
      const unsub = onSnapshot(ref, (snapshot) => {
        let data = {};
        snapshot.docs.forEach((doc) => {
            if(doc.id === principalUser.uid) {
                data = doc.data()
            }
        });
        setRealTimePrincipal(data as CombinedPrincipalData)
      });

      return () => unsub();
    }
    // eslint-disable-next-line
  }, [principalUser]);

  return { realTimePrincipal };
};
