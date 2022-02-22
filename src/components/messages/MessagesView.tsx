import { union } from "lodash";
import { useEffect, useState } from "react";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useMediaQuery from "../../hooks/useMediaQuery";
import { RootState } from "../../redux/store";
import { messagesObject, singleMessage } from "../../utils/interfaces";
import { SingleMessage } from "./SingleMessage";
type messagesTabType = "Recived" | "Sended" | "Deleted";
export const MessagesView = () => {
  const [messages, setMessages] = useState<messagesObject>({
    sended: [],
    recived: [],
  });
  const [checkedMessages, setCheckedMessages] = useState<singleMessage[]>([]);
  const [selectedTab, setSelectedTab] = useState<messagesTabType>("Recived");
  const userType = useSelector((state: RootState) => state.userType.userType);
  const state = useSelector((state: RootState) => state);
  const isMobile = useMediaQuery("(max-width:768px)");
  console.log(checkedMessages);
  useEffect(() => {
    if (userType === "principals" && state.principal.data)
      return setMessages(state.principal.data?.messages);
    if (userType === "teachers" && state.teacher.data)
      return setMessages(state.teacher.data.messages);
    if (userType === "students" && state.student.data)
      return setMessages(state.student.data.messages);
  }, [userType, state.principal, state.student, state.teacher]);
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
        <div className="flex flex-col justify-self-center">
          {selectedTab === "Recived"
            ? messages.recived.map((x) => (
                <SingleMessage message={x} setIsChecked={setCheckedMessages} />
              ))
            : selectedTab === "Sended"
            ? messages.sended.map((x) => (
                <SingleMessage message={x} setIsChecked={setCheckedMessages} />
              ))
            : union(messages.sended, messages.recived).filter(
                (x) => x.status === "Deleted"
              )}
        </div>
      </section>
    </div>
  );
};
