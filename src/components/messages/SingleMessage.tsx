import { isEqual } from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import { singleMessage } from "../../utils/interfaces";
import { ModalMessage } from "./ModalMessage";

interface SingleMessageInterface {
  message: singleMessage;
  checkedMessages:singleMessage[];
  decodingObj:{[key:string]:string};
  setIsChecked: React.Dispatch<React.SetStateAction<singleMessage[]>>;
  setMessageToSeen: (message: singleMessage) => void;
  
}
export const SingleMessage: React.FC<SingleMessageInterface> = ({
  message,
  setIsChecked,
  decodingObj,
  setMessageToSeen,
  checkedMessages
}) => {
  const [isCheckedLocal, setIsCheckedLocal] = useState<boolean>(false);
  const [isOpen, setisOpen] = useState<boolean>(false);
  const handleSeenClick = () => {
    if (message.status === "Unseen") {
      setMessageToSeen(message);
    }
    setisOpen(true);
  };
  const isChecked = checkedMessages.some(x=>isEqual(x,message));
    const handleCheckboxChange = ():void =>{
      if (!isChecked) {
        setIsChecked((prev) => {
          return [...prev,message];
        });
      } else {
        setIsChecked((prev) => {
          return prev.filter((x) => !isEqual(x, message));
        });
      }
    }
  return (
    <>
      <ModalMessage isOpen={isOpen} message={message} setIsOpen={setisOpen} decodingObj={decodingObj} />
      <div
        className={`flex items-center justify-center w-full gap-4  p-2 border-b-[1px] border-base-100 cursor-pointer hover:brightness-125  ${
          message.status !== "Deleted" &&
          message.status === "Unseen" &&
          "font-bold brightness-110"
        }`}
      >
        <div className="w-7 flex justify-center items-center">
          <input
            type="checkbox"
            checked={checkedMessages.some(x=>isEqual(x,message))}
            className="checkbox checkbox-primary checkbox-sm"
            onChange={() => {
              handleCheckboxChange()
            }}
          />
        </div>
        <span className="truncate grow text-xl" onClick={handleSeenClick}>
          {message.title}
        </span>
        <span className="w-28 text-sm" onClick={handleSeenClick}>
          {moment(+message.date * 1000).fromNow()}
        </span>
      </div>
    </>
  );
};
