import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"

export const DashboardView = () => {
    const teacher = useSelector((state: RootState) => state.teacher)

    return (
        <p>Hello Teacher -  {teacher.data?.firstName}</p>
    )
}