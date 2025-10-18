import { LuSearch } from "react-icons/lu";

const SearchBar = ({
  value,
  onChange
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  return (
    <div className="m-4 relative rounded-md ring-2 ring-[var(--color-gray-medium)]">
      <LuSearch className="absolute h-5 left-3 top-1/2 -translate-y-1/2 w-5 text-white" />
      <input
        type="text"
        placeholder="Search for an app..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="outline-none placeholder-gray-light pl-12 pr-4 py-2 focus:ring-2 focus:ring-[var(--color-blue)] rounded-md text-[var(--color-white)] text-sm w-full"
      />
    </div>
  );
};

export default SearchBar;
