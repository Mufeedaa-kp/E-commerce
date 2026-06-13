import { useEffect, useState } from "react";
import api from "../../api/api";
import toast from "react-hot-toast";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingUser, setViewingUser] = useState(null); // Fixed: proper modal instead of toast
  const itemsPerPage = 6;

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users")
      setUsers(res.data.data)
    } catch {
      toast.error("Failed to fetch users")
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Reset page on search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const toggleBlock = async (user) => {
    try {
      await api.patch(`/users/${user._id}/block`, { isBlocked: !user.isBlocked });
      toast.success(user.isBlocked ? "User unblocked" : "User blocked");
      fetchUsers();
    } catch {
      toast.error("Action failed");
    }
  };

  // Fixed: was receiving user.id but needed full user object
  const toggleActive = async (user) => {
    if (!window.confirm(user.isActive ? "Deactivate this user?" : "Reactivate this user?")) return;
    try {
      await api.patch(`/users/${user._id}/active`, {isActive: !user.isActive });
      toast.success(user.isActive ? "User deactivated" : "User activated");
      fetchUsers();
    } catch {
      toast.error("Failed");
    }
  }

  const changeRole = async (user, role) => {
    try {
      await api.put(`/users/${user._id}`, { role });
      toast.success("Role updated");
      fetchUsers();
    } catch {
      toast.error("Role update failed");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Users Management</h1>
          <p className="text-gray-500">Manage all registered users</p>
        </div>
        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium">
          Total: {users.length}
        </div>
      </div>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded mb-4 w-full md:w-72"
      />

      <div className="bg-white shadow rounded-xl overflow-x-auto">
        {loading ? (
          <div className="p-6 text-center">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {users.length === 0 ? "No users found" : "No users match your search"}
          </div>
        ) : (
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Role</th>
                
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <select
                      value={user.role}
                      onChange={(e) => changeRole(user, e.target.value)}
                      className="border px-2 py-1 rounded"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                
                  <td className="p-4 space-x-2 whitespace-nowrap">

                    {/* Fixed: opens a proper modal instead of toast */}
                    <button
                      onClick={() => setViewingUser(user)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      View
                    </button>

                    <button
                      onClick={() => toggleBlock(user)}
                      className={`px-3 py-1 rounded text-white ${
                        user.isBlocked
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-orange-500 hover:bg-orange-600"
                      }`}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>

                    {/* Fixed: pass full user object, not user.id */}
                    <button
                      onClick={() => toggleActive(user)}
                      className={`px-3 py-1 rounded text-white ${
                        user.isActive !== false
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {user.isActive !== false ? "Deactivate" : "Activate"}
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* User Detail Modal — Fixed: replaced toast with a real modal */}
      {viewingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">User Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Name</span>
                <span className="font-medium">{viewingUser.name}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Email</span>
                <span className="font-medium">{viewingUser.email}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Role</span>
                <span className="font-medium capitalize">{viewingUser.role}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Status</span>
                <span className={`font-medium ${viewingUser.isBlocked ? "text-red-600" : "text-green-600"}`}>
                  {viewingUser.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Account</span>
                <span className={`font-medium ${viewingUser.isActive === false ? "text-red-600" : "text-green-600"}`}>
                  {viewingUser.isActive === false ? "Deactivated" : "Active"}
                </span>
              </div>
              
            </div>
            <button
              onClick={() => setViewingUser(null)}
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
