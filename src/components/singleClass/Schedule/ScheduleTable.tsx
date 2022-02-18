import moment from "moment";
import { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { FaUserEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import useMediaQuery from "../../../hooks/useMediaQuery";
import {
  scheduleItem,
  scheduleItemsArray,
  userType,
} from "../../../utils/interfaces";
import { AddModal } from "./AddModal";
import { RemoveEventModal } from "./RemoveEventModal";

type selectOption = { value: string; label: string };

interface ScheduleTableItf {
  schedule: scheduleItemsArray;
  userEmail: string;
  userType: userType | undefined;
  edit: (data: any, oldItem: any) => void;
  selectItems: selectOption[];
}
export interface ModalOptionsEvent {
  isOpen: boolean;
  removedEvent: scheduleItem | null;
}
export const ScheduleTable: React.FC<ScheduleTableItf> = ({
  schedule,
  userEmail,
  userType,
  edit,
  selectItems,
}) => {

  const [isOpen, setIsOpen] = useState(false);
  const [modalOptionsEvent, setModalOptionsEvent] = useState<ModalOptionsEvent>(
    { isOpen: false, removedEvent: null }
  );
  const [eventEdit, setEventEdit] = useState({
    event: {
      name: "",
      dateFrom: "",
      dateTo: "",
      addedBy: "",
      receiver: [""],
    },
    edit: isOpen,
  });

  const isMobile = useMediaQuery("(max-width:768px)");


  useEffect(() => {
    setEventEdit((prev) => ({
      ...prev,
      edit: isOpen,
    }));
  }, [isOpen]);
  return (
    <>
      <RemoveEventModal modalOptions={modalOptionsEvent} setModalOptions={setModalOptionsEvent}/>
      {!isMobile ? (
        <table className="table w-full table-zebra">
        <thead>
          <tr>
            <th className="!static">Nazwa wydarzenia</th>
            <th>Data rozpoczęcia</th>
            <th>Data zakończenia</th>
            <th>Odbiorcy</th>
            <th>Dodał</th>
            <th className="w-1"></th>
          </tr>
        </thead>
        <tbody>
          {schedule
            .filter((x) => x.isActive !== false)
            .map((item, index) => (
              <tr key={item.name + index}>
                <td>{item.name}</td>
                <td>
                  {moment(Number(item.dateFrom.replaceAll(/\s/g, ""))).format(
                    "DD.MM.yyyy"
                  )}
                </td>
                <td>
                  {moment(Number(item.dateTo.replaceAll(/\s/g, ""))).format(
                    "DD.MM.yyyy"
                  )}
                </td>
                <td>
                  {item.receiver.map((rec) => {
                    if (rec === "global") {
                      return "Wszyscy";
                    }
                    return (
                      <Link
                        to={`/class/${rec}/info`}
                        className="kbd mx-1 border-primary"
                        key={index + rec}
                      >
                        {rec}
                      </Link>
                    );
                  })}
                </td>
                <td>{item.addedBy}</td>
                <td>
                  {(userType === "principals" ||
                    item.addedBy === userEmail) && (
                    <>
                      <AddModal
                        key={item.name + index}
                        isOpen={eventEdit.edit && eventEdit.event === item}
                        setIsOpen={setIsOpen}
                        userEmail={userEmail}
                        add={edit}
                        event={item}
                        reciever={item.receiver}
                        selectItems={selectItems}
                      />
                      <button
                        className="btn btn-square btn-warning btn-sm"
                        onClick={() => {
                          setIsOpen((prev) => !prev);
                          setEventEdit((prev) => ({ ...prev, event: item }));
                        }}
                      >
                        <FaUserEdit size={20} />
                      </button>
                      <button
                        className="btn btn-square btn-error btn-sm ml-2"
                        onClick={() =>
                          setModalOptionsEvent({
                            isOpen: true,
                            removedEvent: item,
                          })
                        }
                      >
                        <AiFillDelete size={20} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      ) : (
        <div className="grid grid-cols-1 gap-4 w-full"> 
          {schedule
            .filter((x) => x.isActive !== false)
            .map((item, index) =>(
              <div className="bg-base-300 p-4 rounded-lg shadow " key={item.name+index}>
                  <div className="text-xl text-accent">
                      {item.name}
                  </div>
                  <div className="py-2">
                    <div>{item.addedBy}</div>
                    <div className="flex items-center space-x-2">
                      <div>{moment(Number(item.dateFrom.replaceAll(/\s/g, ""))).format(
                        "DD.MM.yyyy"
                      )}</div>
                      <div>-</div>
                      <div>{moment(Number(item.dateTo.replaceAll(/\s/g, ""))).format(
                        "DD.MM.yyyy"
                      )}</div>
                    </div>
                  </div>
                  <div className="py-3 flex justify-between">
                    <div>
                    {item.receiver.map((rec, index) => {
                        if (rec === "global") {
                          return "Wszyscy";
                        }
                        return (
                          <Link
                            to={`/class/${rec}/info`}
                            className={`kbd border-primary ${index !== 0 ? 'mx-1' : 'mr-1'}`}
                            key={index + rec}
                          >
                            {rec}
                          </Link>
                        );
                      })}
                    </div>
                    <div>
                      {(userType === "principals" ||
                      item.addedBy === userEmail) && (
                        <>
                          <AddModal
                            key={item.name + index}
                            isOpen={eventEdit.edit && eventEdit.event === item}
                            setIsOpen={setIsOpen}
                            userEmail={userEmail}
                            add={edit}
                            event={item}
                            reciever={item.receiver}
                            selectItems={selectItems}
                          />
                          <button
                            className="btn btn-square btn-warning btn-sm"
                            onClick={() => {
                              setIsOpen((prev) => !prev);
                              setEventEdit((prev) => ({ ...prev, event: item }));
                            }}
                          >
                            <FaUserEdit size={20} />
                          </button>
                          <button
                            className="btn btn-square btn-error btn-sm ml-2"
                            onClick={() =>
                              setModalOptionsEvent({
                                isOpen: true,
                                removedEvent: item,
                              })
                            }
                          >
                            <AiFillDelete size={20} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
              </div>
                
            ))
          }
        </div>
      )}
      
    </>
  );
};
