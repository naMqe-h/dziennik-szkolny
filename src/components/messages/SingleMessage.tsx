import { isEqual } from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import { singleMessage } from "../../utils/interfaces";

interface SingleMessageInterface {
  message: singleMessage;
  setIsChecked: React.Dispatch<React.SetStateAction<singleMessage[]>>;
}
export const SingleMessage: React.FC<SingleMessageInterface> = ({
  message,
  setIsChecked,
}) => {
  const [isCheckedLocal, setIsCheckedLocal] = useState<boolean>(false);
  useEffect(() => {
    if (isCheckedLocal) {
      setIsChecked((prev) => {
        const copy = [...prev];
        copy.push(message);
        return copy;
      });
    } else {
      setIsChecked((prev) => {
        return prev.filter((x) => !isEqual(x, message));
      });
    }
  }, [isCheckedLocal, message]);
  console.log(isCheckedLocal);
  return (
    <div className="flex items-center justify-center w-full gap-4 text-xl p-2 border-b-[1px] border-base-100 ">
      <div className="w-7 flex justify-center items-center">
        <input
          type="checkbox"
          checked={isCheckedLocal}
          className="checkbox checkbox-primary checkbox-sm"
          onClick={() => setIsCheckedLocal(!isCheckedLocal)}
        />
      </div>
      <span className="break-all grow">{message.title}</span>
      <span className="w-28">
        {moment(+message.date * 1000).format("DD-MM-yyyy")}
      </span>
    </div>
  );
};
