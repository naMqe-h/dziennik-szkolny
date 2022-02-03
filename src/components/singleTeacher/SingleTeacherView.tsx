import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../redux/store";

export const SingleTeacherView = () => {
  const { email } = useParams();
  const schoolData = useSelector((state: RootState) => state.schoolData.schoolData)
  useEffect(() => {
    const domain = schoolData?.information.domain; 
    //! z user auth
    const queryEmail = `${email}@${domain}`;
  //   //!State Nauczyciela
    console.log(schoolData?.teachers[queryEmail]);
  }, [email, schoolData?.information.domain, schoolData?.teachers]);
  return <div></div>;
};
