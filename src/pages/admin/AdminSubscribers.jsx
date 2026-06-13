import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search,setSearch] = useState("");
const [currentPage,setCurrentPage] = useState(1);
const itemsPerPage = 6;

  const filteredSubs = subscribers.filter(sub =>
  sub.email?.toLowerCase().includes(search.toLowerCase())
);


//pagination

const indexOfLast = currentPage * itemsPerPage;
const indexOfFirst = indexOfLast - itemsPerPage;

const currentSubscribers = filteredSubs.slice(indexOfFirst,indexOfLast);

const totalPages = Math.ceil(filteredSubs.length / itemsPerPage);


  const API_URL = "http://localhost:5000";

  useEffect(() => {
   
    fetchSubscribers();
  }, []);

  useEffect(()=>{
  setCurrentPage(1)
},[search])


  const fetchSubscribers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/subscribers`);
      const data = await res.json();
      setSubscribers(data.data.reverse());
    } catch {
      toast.error("Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subscriber?")) return;

    try {
      await fetch(`${API_URL}/api/subscribers/${id}`, {
        method: "DELETE",
      });

      setSubscribers(prev => prev.filter(sub => sub._id !== id));
      toast.success("Subscriber removed");
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Subscribers</h1>

      <input
  type="text"
  placeholder="Search subscribers..."
  value={search}
  onChange={(e)=>setSearch(e.target.value)}
  className="border px-3 py-2 rounded mb-6 w-full md:w-64"
/>

      {subscribers.length === 0 ? (
        <p className="text-gray-500">No subscribers yet.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Subscribed On</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentSubscribers.map(sub => (
                  <tr key={sub._id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{sub.email}</td>
                    <td className="p-4">
                      {new Date(sub.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDelete(sub._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {currentSubscribers.map(sub => (
              <div
                key={sub._id}
                className="bg-white p-4 rounded-xl shadow space-y-2"
              >
                <p><strong>Email:</strong> {sub.email}</p>
                <p className="text-xs text-gray-500">
                  {new Date(sub.createdAt).toLocaleString()}
                </p>
                <button
                  onClick={() => handleDelete(sub._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded w-full"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-6">
  {[...Array(totalPages)].map((_, i) => (
    <button
      key={i}
      onClick={() => setCurrentPage(i + 1)}
      className={`px-3 py-1 rounded ${
        currentPage === i + 1
          ? "bg-blue-600 text-white"
          : "bg-gray-200"
      }`}
    >
      {i + 1}
    </button>
  ))}
</div>
        </>
      )}
    </div>
  );
}

export default AdminSubscribers;