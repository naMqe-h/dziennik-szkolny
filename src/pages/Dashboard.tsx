import { DashboardView as PrincipalView } from "../components/principal/DashboardView";
export const Dashboard = () => {
  // const state = useSelector((state: RootState) => state.user);

  // // console.log({ state });
  return (
    <div className="h-full m-4">
      <PrincipalView />
    </div>
  );
};
