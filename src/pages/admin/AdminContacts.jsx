import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API = "http://localhost:5000";

function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const fetchContacts = async () => {
    try {
      const res = await fetch(`${API}/api/contacts`);
      const data = await res.json();
      setContacts(data.data.reverse());
    } catch {
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await fetch(`${API}/api/contacts/${id}`, { method: "DELETE" });
      setContacts((prev) => prev.filter((c) => c._id !== id));
      toast.success("Message deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const openReply = (contact) => {
    setReplyingTo(contact);
    setReplyText(contact.reply?.text || "");
  };

  const sendReply = async () => {
    if (!replyText.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    setSending(true);
    try {
      const updatedContact = {
        ...replyingTo,
        reply: {
          text: replyText.trim(),
          repliedAt: new Date().toISOString(),
        },
      };

      await fetch(`${API}/api/contacts/${replyingTo._id}/reply`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
  text: replyText.trim(),
}),
      });

      setContacts((prev) =>
        prev.map((c) => (c._id === replyingTo._id ? updatedContact : c))
      );

      toast.success("Reply saved");
      setReplyingTo(null);
      setReplyText("");
    } catch {
      toast.error("Failed to save reply");
    } finally {
      setSending(false);
    }
  };

  const filteredContacts = contacts.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const currentContacts = filteredContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <p className="p-6">Loading contacts...</p>;

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Contact Messages</h1>

      <input
        type="text"
        placeholder="Search contacts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded mb-6 w-full md:w-64"
      />

      {filteredContacts.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow text-gray-500">
          {contacts.length === 0 ? "No messages found" : "No contacts match your search"}
        </div>
      ) : (
        <div className="grid gap-4">
          {currentContacts.map((contact) => (
            <div
              key={contact._id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-md transition"
            >
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-semibold text-lg">{contact.name}</h2>
                    {contact.reply ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        Replied
                      </span>
                    ) : (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{contact.email}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(contact.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openReply(contact)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    {contact.reply ? "Edit Reply" : "Reply"}
                  </button>
                  <button
                    onClick={() => deleteContact(contact._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="mt-3 text-gray-700">{contact.message}</p>

              {contact.reply && (
                <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg">
                  <p className="text-xs text-blue-500 font-medium mb-1">
                    Admin replied · {new Date(contact.reply.repliedAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-700">{contact.reply.text}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

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

      {replyingTo && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-1">Reply to {replyingTo.name}</h2>
            <p className="text-sm text-gray-500 mb-4">{replyingTo.email}</p>

            <div className="bg-gray-50 border rounded-lg p-3 mb-4 text-sm text-gray-600">
              <p className="text-xs text-gray-400 mb-1">Original message:</p>
              {replyingTo.message}
            </div>

            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply..."
              rows={5}
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => { setReplyingTo(null); setReplyText(""); }}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={sendReply}
                disabled={sending}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-60"
              >
                {sending ? "Saving..." : "Save Reply"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminContacts;