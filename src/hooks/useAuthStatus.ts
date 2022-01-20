import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import nProgress from "nprogress";

export const useAuthStatus = () => {
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    setLoading(true);
    nProgress.start();
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoading(false);
        setIsLogged(true);
        nProgress.done();
      } else {
        setLoading(false);
        setIsLogged(false);
        nProgress.done();
      }
    });
    unsub();
  }, []);

  return { loading, isLogged };
};
