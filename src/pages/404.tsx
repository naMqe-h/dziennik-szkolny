import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";
import "../../node_modules/react-lazy-load-image-component/src/effects/blur.css";
import Empty from "../images/404.png";
export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <section className="flex flex-col items-center gap-6 w-screen justify-center mt-2">
      <figure>
        <LazyLoadImage src={Empty} />
      </figure>
      <h1 className="text-xl md:text-2xl">
        Ups! Nie znaleźliśmy podanej strony
      </h1>
      <button className="btn btn-primary" onClick={() => navigate("/")}>
        Powrót na stronę główną
      </button>
    </section>
  );
};
