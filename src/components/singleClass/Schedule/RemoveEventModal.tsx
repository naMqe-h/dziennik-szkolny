import { cloneDeep, isEqual } from "lodash";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useSetDocument } from "../../../hooks/useSetDocument";
import { RootState } from "../../../redux/store";
import { eventsFromFirebase, scheduleItem } from "../../../utils/interfaces";
import { ModalOptionsEvent } from "./ScheduleTable";

interface RemoveEventModalInterface {
  modalOptions: ModalOptionsEvent;
  setModalOptions: React.Dispatch<React.SetStateAction<ModalOptionsEvent>>;
}
export const RemoveEventModal: React.FC<RemoveEventModalInterface> = ({
  modalOptions,
  setModalOptions,
}) => {
  const schoolData = useSelector(
    (state: RootState) => state.schoolData.schoolData
  );
  const { setDocument } = useSetDocument();
  function removeEvent(removedEvent: scheduleItem) {
    if (schoolData?.events) {
      const eventType =
        removedEvent.receiver[0] === "global" ? "global" : "classes";
      const newEvents: eventsFromFirebase = cloneDeep(schoolData?.events);
      newEvents[eventType] = newEvents[eventType].map((x) => {
        if (isEqual(x, removedEvent)) {
          return { ...removedEvent, isActive: false };
        }
        return x;
      });
      try {
        setDocument(
          schoolData.information.domain as string,
          "events",
          newEvents
        );
        toast.success("Udało ci się usunąc wydarzenie!");
      } catch (error) {
        toast.error("Wystąpił bląd przy usuwaniu wydarzenia");
      } finally {
        setModalOptions({ isOpen: false, removedEvent: null });
      }
    } else {
      setModalOptions({ isOpen: false, removedEvent: null });
    }
  }
  return (
    <div className={`modal ${modalOptions.isOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h2 className="text-2xl text-center">
          {`Czy napewno chcesz usunąć to wydarzenie ${modalOptions.removedEvent?.name}?`}
        </h2>
        <span className=" text-success select-none text text-center justify-center flex mt-4">
          Usunięte wydarzenie można przywrócić w każdej chwili!
        </span>
        <div className="modal-action">
          <button
            className={`btn btn-primary`}
            onClick={() => {
              removeEvent(modalOptions.removedEvent as scheduleItem);
            }}
          >
            Usuń
          </button>
          <button
            className="btn"
            onClick={() => {
              setModalOptions(() => {
                return {
                  removedEvent: null,
                  isOpen: false,
                };
              });
            }}
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
};
