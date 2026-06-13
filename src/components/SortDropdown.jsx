import { ChevronDown } from "lucide-react";

function SortDropdown({
  onSortChange,
  currentSort = "recommended",
}) {
  return (
    <div className="relative inline-block w-full sm:w-60">
      <select
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
        className="appearance-none w-full px-4 py-2 pr-10 border rounded-lg bg-white
                   focus:outline-none focus:ring-2 focus:ring-primary-600"
      >
       <option value="recommended">Recommended</option>
<option value="price_asc">Price: Low to High</option>
<option value="price_desc">Price: High to Low</option>
<option value="newest">Newest First</option>
<option value="rating_desc">Rating: High to Low</option>
      </select>

      
      <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
        <ChevronDown size={18} />
      </span>
    </div>
  );
}

export default SortDropdown;
