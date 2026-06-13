import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import api from "../api/api";

const API_URL = "http://localhost:5000";

const MyContactReplies = () => {
  const { user } = useAuth();

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchReplies();
    }
  }, [user]);

  const fetchReplies = async () => {
    try {
      const res = await api.get("/contacts");
      
      const list = res.data.data;


      console.log("Logged user:", user.email);
      console.log("Contacts:", res.data);

      const myMessages = list.filter(
  (item) => item.email?.toLowerCase() === user.email?.toLowerCase()
);


      setContacts(myMessages.reverse());

    } catch {
      toast.error("Failed to load replies");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">
        My Replies
      </h1>

      {contacts.length === 0 ? (
        <div className="bg-white shadow rounded-xl p-6 text-gray-500">
          No messages found
        </div>
      ) : (
        <div className="space-y-4">

          {contacts.map((contact) => (
            <div
              key={contact._id}
              className="bg-white shadow rounded-xl p-5"
            >

              <div className="flex justify-between items-center mb-3">

                <h2 className="font-semibold text-lg">
                  Your Message
                </h2>

                {contact.reply ? (
                  <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                    Replied
                  </span>
                ) : (
                  <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full">
                    Waiting
                  </span>
                )}

              </div>

              <p className="text-gray-700">
                {contact.message}
              </p>

              <p className="text-xs text-gray-400 mt-2">
                {new Date(contact.createdAt).toLocaleString()}
              </p>

              {contact.reply?.text && (
                <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">

                  <h3 className="font-semibold text-blue-600 mb-2">
                    Admin Reply
                  </h3>

                  <p className="text-gray-700">
                    {contact.reply.text}
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    {contact.reply.repliedAt ? new Date(
                      contact.reply?.createdAt
                    ).toLocaleString() : ""}
                  </p>

                </div>
              )}

            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default MyContactReplies;