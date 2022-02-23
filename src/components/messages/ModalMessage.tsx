import React from "react";
import { singleMessage } from "../../utils/interfaces";

interface ModalMessageProps {
  message: singleMessage;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export const ModalMessage: React.FC<ModalMessageProps> = ({
  message,
  isOpen,
  setIsOpen,
}) => {
  return (
    <div className={`modal ${isOpen && "modal-open"}`}>
      <div className="modal-box">
        <h3 className="font-bold text-2xl p-2">{message.title}</h3>
        <h6 className="text-sm text-right font-bold">
          Nadawca: {message.author}
        </h6>
        <div className="divider"></div>
        <p className="py-4">{message.content}</p>
        <div className="container flex justify-end">
          <button className="btn btn-success" onClick={() => setIsOpen(false)}>
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
};
