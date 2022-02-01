import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"

export const DashboardView = () => {
    const student = useSelector((state: RootState) => state.student)

    return (
        <p>Hello {student.data?.firstName}</p>
    )
}