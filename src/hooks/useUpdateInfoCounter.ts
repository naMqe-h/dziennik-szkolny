import { setDoc, doc, FirestoreError, increment } from "firebase/firestore"
import { db } from "../firebase/firebase.config";
import { toast } from "react-toastify";

export const useUpdateInfoCounter = () => {

    const updateCounter = async (c: string, field: string) => {
        const data = {[field] : increment(1)}
        await setDoc(doc(db, c, 'information'), data, { merge : true })
            .catch((err: FirestoreError) => {
                toast.error(`${err.message}`)
            })
    }

    return { updateCounter }
}