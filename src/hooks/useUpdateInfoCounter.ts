import { setDoc, doc, FirestoreError, increment } from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import { toast } from "react-toastify";

type updateInfo = 'increment' | 'decrement'

export const useUpdateInfoCounter = () => {
  const updateCounter = async (c: string, field: string, type: updateInfo) => {
    let data
    if(type === 'increment') {
      data = { [field]: increment(1) };
    } else {
      data = { [field]: increment(-1) };
    }
    await setDoc(doc(db, c, "information"), data, { merge: true }).catch(
      (err: FirestoreError) => {
        toast.error(`${err.message}`);
      }
    );
  };

  return { updateCounter };
};
