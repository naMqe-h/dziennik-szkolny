import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../redux/store";

export const SingleTeacherView = () => {
  const { email } = useParams();
  const state = useSelector((state: RootState) => state.principal);
  useEffect(() => {
    const domain = state.schoolData?.information.domain;
    const queryEmail = `${email}@${domain}`;
    //!State Nauczyciela
    console.log(state.schoolData?.teachers[queryEmail]);
  }, [email]);
  return <div></div>;
};
