import moment from "moment";
import { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { FaUserEdit } from "react-icons/fa";
import { FcSettings } from "react-icons/fc";
import { Link } from "react-router-dom";
import {
  scheduleItem,
  scheduleItemsArray,
  SortingOptions,
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
interface SortingOfSchedule {
  name: SortingOptions;
  dateFrom: SortingOptions;
  dateTo: SortingOptions;
  addedBy: SortingOptions;
}
type SortingOfScheduleType = "name" | "dateFrom" | "dateTo" | "addedBy";
export interface ModalOptionsEvent {
  isOpen: boolean;
  removedEvent: scheduleItem | null;
}
const defaultSortingStateOfSchedule: SortingOfSchedule = {
  name: "Default",
  dateFrom: "Default",
  dateTo: "Default",
  addedBy: "Default",
};
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
  const [showOnlyYourEvents, setshowOnlyYourEvents] = useState<boolean>(false);
  const [sortedSchedule, setSortedSchedule] =
    useState<scheduleItemsArray>(schedule);
  const [sorting, setSorting] = useState<SortingOfSchedule>(
    defaultSortingStateOfSchedule
  );
  function sortTable(type: SortingOfScheduleType) {
    if (sorting[type] === "Descending") {
      setSorting(() => {
        return { ...defaultSortingStateOfSchedule, [type]: "Ascending" };
      });
    } else if (sorting[type] === "Ascending") {
      setSorting(defaultSortingStateOfSchedule);
    } else {
      setSorting(() => {
        return { ...defaultSortingStateOfSchedule, [type]: "Descending" };
      });
    }
  }
  useEffect(() => {
    if (schedule) {
      const newSchedule = schedule
        .filter((x) => x.isActive !== false)
        .filter((x) => {
          if (showOnlyYourEvents) {
            return x.addedBy === userEmail;
          } else {
            return x;
          }
        });
      //! Implementacja sortowania taka sama jak w classesView
      const key = Object.keys(sorting).find((x) => {
        return sorting[x as keyof SortingOfSchedule] !== "Default";
      });
      if (!key)
        return setSortedSchedule(
          newSchedule.sort((a, b) =>
            a.addedBy === userEmail ? -1 : b.addedBy === userEmail ? 1 : 0
          )
        );
      const type = sorting[key as keyof SortingOfSchedule];
      if (key === "dateFrom") {
        if (type === "Descending") {
          return setSortedSchedule(
            newSchedule.sort(
              (a, b) =>
                moment(+a.dateFrom).valueOf() - moment(+b.dateFrom).valueOf()
            )
          );
        } else if (type === "Ascending") {
          return setSortedSchedule(
            newSchedule.sort(
              (a, b) =>
                moment(+b.dateFrom).valueOf() - moment(+a.dateFrom).valueOf()
            )
          );
        }
      } else if (key === "dateTo") {
        if (type === "Descending") {
          return setSortedSchedule(
            newSchedule.sort(
              (a, b) =>
                moment(+a.dateFrom).valueOf() - moment(+b.dateFrom).valueOf()
            )
          );
        } else if (type === "Ascending") {
          return setSortedSchedule(
            newSchedule.sort(
              (a, b) =>
                moment(+b.dateFrom).valueOf() - moment(+a.dateFrom).valueOf()
            )
          );
        }
      } else {
        if (type === "Ascending") {
          return setSortedSchedule(
            newSchedule.sort((b, a) =>
              String(a[key as keyof scheduleItem]).localeCompare(
                String(b[key as keyof scheduleItem])
              )
            )
          );
        } else {
          return setSortedSchedule(
            newSchedule.sort((b, a) =>
              String(b[key as keyof scheduleItem]).localeCompare(
                String(a[key as keyof scheduleItem])
              )
            )
          );
        }
      }
    }
  }, [sorting, schedule, showOnlyYourEvents]);
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

  useEffect(() => {
    setEventEdit((prev) => ({
      ...prev,
      edit: isOpen,
    }));
  }, [isOpen]);
  return (
    <>
      <RemoveEventModal
        modalOptions={modalOptionsEvent}
        setModalOptions={setModalOptionsEvent}
      />
      <table className="table w-full">
        <thead>
          <tr className="cursor-pointer">
            <th
              onClick={() => sortTable("name")}
              className={` !static hover:brightness-125  ${
                sorting.name !== "Default" && "brightness-150"
              }`}
            >
              Nazwa wydarzenia
            </th>
            <th
              onClick={() => sortTable("dateFrom")}
              className={`  hover:brightness-125  ${
                sorting.dateFrom !== "Default" && "brightness-150"
              }`}
            >
              Data rozpoczęcia
            </th>
            <th
              onClick={() => sortTable("dateTo")}
              className={` hover:brightness-125 ${
                sorting.dateTo !== "Default" && "brightness-150"
              }`}
            >
              Data zakończenia
            </th>
            <th className="cursor-default">Odbiorcy</th>
            <th
              onClick={() => sortTable("addedBy")}
              className={`hover:brightness-125 ${
                sorting.addedBy !== "Default" && "brightness-150"
              }`}
            >
              Dodał
            </th>
            <th className="w-1 cursor-default text-center">
              <div className="dropdown dropdown-hover dropdown-left text-primary">
                <FcSettings className="text-3xl" />
                <ul
                  tabIndex={0}
                  className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52 drop-shadow-2xlxl"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="label-text">Twoje Wydarzenia</span>
                    <input
                      type="checkbox"
                      checked={showOnlyYourEvents}
                      onChange={() =>
                        setshowOnlyYourEvents(!showOnlyYourEvents)
                      }
                      className="checkbox checkbox-primary"
                    />
                  </div>
                </ul>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedSchedule
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
    </>
  );
};
