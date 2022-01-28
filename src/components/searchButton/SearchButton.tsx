import React from "react";
import { FcSearch } from "react-icons/fc";
import "./SearchButton.css";
interface SearchButtonProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}
export const SearchButton: React.FC<SearchButtonProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
  }
  return (
    <div className="search-box">
      <button className="btn-search">
        <FcSearch className="text-2xl" />
      </button>
      <input
        type="text"
        className="input-search"
        placeholder="Wyszukaj klasę..."
        onChange={handleSearch}
        value={searchQuery}
      />
    </div>
  );
};
