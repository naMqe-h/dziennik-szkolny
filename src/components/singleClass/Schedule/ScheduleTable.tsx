import { Item } from "framer-motion/types/components/Reorder/Item"
import moment from "moment"
import { AiFillDelete } from "react-icons/ai"
import { FaUserEdit } from "react-icons/fa"
import { useSelector } from "react-redux"
import { RootState } from "../../../redux/store"
import { scheduleItemsArray, userType } from "../../../utils/interfaces"

interface ScheduleTableItf{
    schedule: scheduleItemsArray;
    userEmail: string;
    userType: userType | undefined;
} 
export const ScheduleTable:React.FC<ScheduleTableItf> = ({schedule, userEmail, userType}) => {
    return (
        <table className="table w-full table-zebra">
      <thead>
        <tr>
          <th>Nazwa wydarzenia</th>
          <th>Data</th>
          <th>Dodał</th>
          <th className="w-1"></th>
        </tr>
      </thead>
      <tbody>
        {schedule.map((item, index) => (
            <tr key={item.name + index}>
                <td>{item.name}</td>
                <td>{moment(Number(item.date.replaceAll(/\s/g, ""))).format("DD.MM.yyyy")}</td>
                <td>{item.teacher}</td>
                <td>
                {(userType === 'principals' || item.teacher === userEmail) && (
                    <>
                        <button className="btn btn-square btn-warning btn-sm">
                            <FaUserEdit size={20} />
                        </button>
                        <button className="btn btn-square btn-error btn-sm ml-2">
                            <AiFillDelete size={20} />
                        </button>
                    </>
                )}
                </td>
            </tr>
        ))}
      </tbody>
    </table>
    )
}