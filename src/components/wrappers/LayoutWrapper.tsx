import { Navbar } from "../Navbar";

export const LayoutWrapper: React.FC = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="mt-20">{children}</main>
    </>
  );
};
