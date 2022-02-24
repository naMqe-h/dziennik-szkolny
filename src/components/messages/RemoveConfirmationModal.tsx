import React from "react";
interface RemoveConfirmationModalProps {
  isOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  removeMessages: (type: "Delete" | "MarkAsSeen" | "Recover") => void;
}
export const RemoveMessagesModal: React.FC<RemoveConfirmationModalProps> = ({
  isOpen,
  setIsModalOpen,
  removeMessages,
}) => {
  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h2 className="text-2xl text-center">
          Czy napewno chcesz usunąć zaznaczone wiadomości ?
        </h2>
        <span className=" text-success select-none text text-center justify-center flex mt-4">
          Usunięte wiadomości można w każdej chwili przywrócić!
        </span>
        <div className="modal-action">
          <button
            className={`btn btn-primary`}
            onClick={() => {
              removeMessages("Delete");
              setIsModalOpen(false);
            }}
          >
            Usuń
          </button>
          <button
            className="btn"
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
};
