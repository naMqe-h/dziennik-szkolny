import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { currentStepType, SchoolInformation } from "../../../utils/interfaces";
import { useDocument } from "../../../hooks/useDocument";

const schoolTypes = [
  "Szkoła Podstawowa",
  "Szkoła Zawodowa",
  "Technikum",
  "Liceum",
  "Uniwersytet",
];
interface SchoolInformationFormProps {
  set: React.Dispatch<React.SetStateAction<SchoolInformation>>;
  setStep: React.Dispatch<React.SetStateAction<currentStepType>>;
}
export const SchoolInformationForm: React.FC<SchoolInformationFormProps> = ({
  set,
  setStep,
}) => {
  const { getDocument, document: takenDomains } = useDocument();
  const [userData, setUserData] = useState<SchoolInformation>({
    name: "",
    address: {
      street: "",
      houseNumber: 0,
      postCode: "",
      city: "",
    },
    type: "Technikum",
    domain: "",
  });

  useEffect(() => {
    getDocument("utils", "domains");
  }, []);

  const validateData = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (takenDomains) {
      for (const item of takenDomains.names) {
        if (userData.domain === item) {
          return toast.error("Szkoła z podaną domena jest już zarejestrowana", {
            autoClose: 3000,
          });
        }
      }
    }
    if (
      userData.name.length === 0 &&
      userData.address.city.length === 0 &&
      userData.address.houseNumber === 0 &&
      userData.address.postCode.length === 0 &&
      userData.address.city.length === 0 &&
      userData.domain.length === 0
    )
      return toast.error("Podaj poprawnie wszystkie dane", { autoClose: 2000 });
    if (userData.name.length === 0) {
      return toast.error("Podaj nazwę szkoły", { autoClose: 2000 });
    }
    if (userData.domain.length === 0)
      return toast.error("Podaj poprawną domene", { autoClose: 2000 });
    if (userData.domain.split("").find((x) => x === "@"))
      return toast.error("Podaj domenę bez @", { autoClose: 2000 });
    if (userData.address.city.length === 0)
      return toast.error("Podaj miasto", { autoClose: 2000 });
    if (userData.address.street.length === 0)
      return toast.error("Podaj ulicę, na której znajduje się szkoła", {
        autoClose: 2000,
      });
    if (
      userData.address.postCode.length !== 6 ||
      userData.address.postCode[2] !== "-"
    )
      return toast.error("Podaj poprawny kod pocztowy", { autoClose: 2000 });
    if (userData.address.houseNumber === 0)
      return toast.error("Podaj poprawny numer budynku szkoły", {
        autoClose: 2000,
      });

    set({
      address: userData.address,
      name: userData.name,
      type: userData.type,
      domain: userData.domain,
    });
    setStep(4);
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (
      name === "city" ||
      name === "houseNumber" ||
      name === "postCode" ||
      name === "street"
    ) {
      let addressObject = { ...userData.address };
      const newObj = { ...addressObject, [name]: value };
      setUserData((prev) => {
        return { ...prev, address: newObj };
      });
    } else {
      setUserData((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };
  return (
    <section className="p-10 card justify-center items-center bg-base-200  mt-5 md:mt-20">
      <form className="md:w-96 w-full">
        <h2 className="text-2xl text-center mb-4 text-primary">Dane szkoły</h2>

        <label className="label">
          <span className="label-text">Nazwa szkoły</span>
        </label>
        <input
          className="input w-full"
          type="text"
          placeholder="Nazwa szkoły"
          name="name"
          onChange={handleChange}
        />
        <label className="label">
          <span className="label-text">Domena Szkoły</span>
        </label>
        <input
          className="input w-full"
          type="text"
          placeholder="DomenaSzkolna.pl"
          name="domain"
          onChange={handleChange}
        />

        <label className="label">
          <span className="label-text">Typ szkoły</span>
        </label>
        <select
          className="select select-bordered w-full"
          value={userData.type}
          name="type"
          onChange={(e) => handleChange(e)}
        >
          {schoolTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <div className="divider"></div>
        <h2 className="text-2xl text-center mb-4 text-primary">Adres szkoły</h2>
        <div className="grid grid-rows-1 grid-cols-1 md:grid-cols-2 md:grid-rows-2">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Miasto</span>
            </label>
            <input
              type="text"
              name="city"
              value={userData.address.city}
              className="input"
              onChange={handleChange}
              placeholder="Miasto"
            />
          </div>
          <div className="form-control mt-4 md:ml-4 md:mt-0">
            <label className="label">
              <span className="label-text">Kod pocztowy</span>
            </label>
            <input
              type="text"
              name="postCode"
              value={userData.address.postCode}
              className="input"
              onChange={handleChange}
              placeholder="xx/xxx"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Ulica</span>
            </label>
            <input
              type="text"
              name="street"
              value={userData.address.street}
              className="input"
              onChange={handleChange}
              placeholder="Ulica"
            />
          </div>
          <div className="form-control mt-4 md:ml-4 md:mt-0">
            <label className="label">
              <span className="label-text">Numer Domu</span>
            </label>
            <input
              type="number"
              name="houseNumber"
              value={userData.address.houseNumber}
              className="input"
              onChange={handleChange}
              placeholder="Numer Domu"
            />
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <button
            className="btn-primary btn mt-4 self-end"
            onClick={(e) => validateData(e)}
          >
            Dalej
          </button>
        </div>
      </form>
    </section>
  );
};
