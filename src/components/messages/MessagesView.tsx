import { cloneDeep, isEqual, union } from "lodash";
import moment, { unix } from "moment";
import { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineMail } from "react-icons/ai";
import { BsFillArrowLeftCircleFill, BsTrash } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useMediaQuery from "../../hooks/useMediaQuery";
import { useSetDocument } from "../../hooks/useSetDocument";
import { RootState } from "../../redux/store";
import {
  CombinedPrincipalData,
  messagesObject,
  singleMessage,
  SingleStudentDataFromFirebase,
  SingleTeacherData,
} from "../../utils/interfaces";
import { SingleMessage } from "./SingleMessage";
type messagesTabType = "Recived" | "Sended" | "Deleted";
export const MessagesView = () => {
  const { setDocument } = useSetDocument();
  const [messages, setMessages] = useState<messagesObject>({
    sended: [],
    recived: [],
  });
  const [checkedMessages, setCheckedMessages] = useState<singleMessage[]>([]);
  const [selectedTab, setSelectedTab] = useState<messagesTabType>("Recived");
  const userType = useSelector((state: RootState) => state.userType.userType);
  const state = useSelector((state: RootState) => state);
  const isMobile = useMediaQuery("(max-width:768px)");
  useEffect(() => {
    if (userType === "principals" && state.principal.data)
      return setMessages(cloneDeep(state.principal.data?.messages));
    if (userType === "teachers" && state.teacher.data)
      return setMessages(cloneDeep(state.teacher.data.messages));
    if (userType === "students" && state.student.data)
      return setMessages(cloneDeep(state.student.data.messages));
  }, [userType, state.principal, state.student, state.teacher]);
  const setSingleMessageToSeen = (message: singleMessage) => {
    if (message.status === "Unseen") {
      const newMessage: singleMessage = { ...message, status: "Seen" };
      const newRecived = messages.recived.map((x) => {
        return isEqual(x, message) ? newMessage : x;
      });
      const newMessages: messagesObject = { ...messages, recived: newRecived };
      if (userType === "principals") {
        const newPrincipalObject: Partial<CombinedPrincipalData> = {
          ...state.principal.data,
          messages: newMessages,
        };
        setDocument(
          "principals",
          state.principal.user?.uid as string,
          newPrincipalObject
        );
      } else if (userType === "teachers") {
        if (state.schoolData.schoolData?.teachers) {
          const oldTeacher = cloneDeep(
            state.schoolData.schoolData?.teachers[
              state.teacher.data?.email as string
            ]
          );
          const newTeacher: Partial<SingleTeacherData> = {
            ...oldTeacher,
            messages: newMessages,
          };
          const newTeachers = cloneDeep(state.schoolData.schoolData?.teachers);
          newTeachers[newTeacher.email as string] =
            newTeacher as SingleTeacherData;
          setDocument(
            state.schoolData.schoolData.information.domain as string,
            "teachers",
            newTeachers
          );
        }
      } else {
        if (state.schoolData.schoolData?.students) {
          const oldStudent = cloneDeep(
            state.schoolData.schoolData?.students[
              state.student.data?.email as string
            ]
          );
          const newStudent: Partial<SingleStudentDataFromFirebase> = {
            ...oldStudent,
            messages: newMessages,
          };
          const newStudents = cloneDeep(state.schoolData.schoolData?.students);
          newStudents[newStudent.email as string] =
            newStudent as SingleStudentDataFromFirebase;
          setDocument(
            state.schoolData.schoolData.information.domain as string,
            "students",
            newStudents
          );
        }
      }
      setMessages(newMessages);
    }
  };
  const handleCheckedActions = (type: "Delete" | "MarkAsSeen") => {};
  return (
    <div className="w-screen flex justify-center">
      <section className="card bg-base-200 md:w-3/4 w-full p-4">
        <Link
          to="/"
          className="flex w-max items-center mb-2 gap-2 absolute left-6"
        >
          <BsFillArrowLeftCircleFill
            className={`transition-all hover:-translate-x-1.5 duration-300 text-2xl`}
          />
          {!isMobile &&
            `Powrót do Panelu ${
              userType === "principals"
                ? "Dyrektora"
                : userType === "teachers"
                ? "Nauczyciela"
                : "Ucznia"
            }`}
        </Link>
        <div className="flex justify-center items-center w-full mt-6">
          <div className="tabs">
            <a
              className={`tab tab-bordered  transition-all duration-200 ${
                selectedTab === "Recived" && "tab-active"
              }`}
              onClick={() => setSelectedTab("Recived")}
            >
              Otrzymane
            </a>
            <a
              className={`tab tab-bordered  transition-all duration-200 ${
                selectedTab === "Sended" && "tab-active"
              }`}
              onClick={() => setSelectedTab("Sended")}
            >
              Wysłane
            </a>
            <a
              className={`tab tab-bordered  transition-all duration-200 ${
                selectedTab === "Deleted" && "tab-active"
              }`}
              onClick={() => setSelectedTab("Deleted")}
            >
              Usunięte
            </a>
          </div>
        </div>
        <div className="divider"></div>
        <h2 className="text-2xl font-bold flex justify-center items-center gap-2">
          {<AiOutlineMail className="self-end text-3xl" />}Wiadomości
        </h2>
        <div className="container flex justify-center md:justify-end">
          <div className="border rounded-lg border-base-100 flex justify-center items-center p-4 gap-4 text-2xl my-4 ">
            <BsTrash
              className={`cursor-pointer transition-all ${
                checkedMessages.length === 0 &&
                "brightness-50 cursor-not-allowed"
              }`}
            />
            <AiOutlineEye
              className={`cursor-pointer transition-all ${
                checkedMessages.length === 0 &&
                "brightness-50 cursor-not-allowed"
              }`}
            />
          </div>
        </div>
        <div className="flex flex-col justify-self-center">
          {selectedTab === "Recived"
            ? messages.recived
                .sort((a, b) => +b.date - +a.date)
                .map((x) => (
                  <SingleMessage
                    message={x}
                    key={x.date}
                    setIsChecked={setCheckedMessages}
                    setMessageToSeen={setSingleMessageToSeen}
                  />
                ))
            : selectedTab === "Sended"
            ? messages.sended
                .sort((a, b) => +b.date - +a.date)
                .map((x) => (
                  <SingleMessage
                    message={x}
                    setIsChecked={setCheckedMessages}
                    setMessageToSeen={setSingleMessageToSeen}
                  />
                ))
            : union(messages.sended, messages.recived).filter(
                (x) => x.status === "Deleted"
              )}
        </div>
      </section>
    </div>
  );
};
