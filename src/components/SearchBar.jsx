import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

function SearchBar({ onSearch, placeholder = "Search products..." }) {
  const [query, setQuery] = useState("");

  
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="relative w-full md:w- 100">
     
      <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
        <Search size={18} />
      </span>

      
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
      />

      
      {query && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-black"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
