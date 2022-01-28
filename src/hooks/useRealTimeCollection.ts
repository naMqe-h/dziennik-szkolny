import { db } from "../firebase/firebase.config";
import { collection, onSnapshot } from "firebase/firestore";
import { setSchoolData } from "../redux/principalSlice";
import { CombinedSchoolDataFromFirebase } from "../utils/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "../redux/store";

export const useRealTimeCollection = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.principal);

  useEffect(() => {
    if (state.user) {
      const domain = state.user.displayName?.split("~")[0];
      const ref = collection(db, domain as string);
      const unsub = onSnapshot(ref, (snapshot) => {
        let data = {};
        snapshot.docs.forEach((doc) => {
          data = { ...data, [doc.id]: { ...doc.data() } };
        });
        dispatch(setSchoolData(data as CombinedSchoolDataFromFirebase));
      });

      return () => unsub();
    }
    // eslint-disable-next-line
  }, [state.user]);

  return {};
};
