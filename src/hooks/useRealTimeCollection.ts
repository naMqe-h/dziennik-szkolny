import { db } from "../firebase/firebase.config";
import { collection, onSnapshot } from "firebase/firestore";
import { CombinedSchoolDataFromFirebase } from "../utils/interfaces";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState } from "../redux/store";

export const useRealTimeCollection = () => {
  const principalUser = useSelector((state: RootState) => state.principal.user);
  const teacherUser = useSelector((state: RootState) => state.teacher.user)
  const [realTimeDocuments, setRealTimeDocuments] = useState<CombinedSchoolDataFromFirebase>()

  useEffect(() => {
    if (principalUser || teacherUser) {
      const domain = principalUser?.displayName?.split("~")[0] || teacherUser?.displayName?.split("~")[0]
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
  }, [principalUser, teacherUser]);

  return { realTimeDocuments };
};
