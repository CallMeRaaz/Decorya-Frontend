import { useEffect, useState } from "react";
import axios from "axios";
import Model from "../../components/admin/Model";
import { Link } from "react-router-dom";
import Loader from "../../components/loader";
import { useToast } from "../../components/context/toastprovider";

interface IContact {
  _id: string;
  name?: string;
  email: string;
  subject: string;
  message: string;
  messageCreatedAt: string;
  reply?: string;
  replyCreatedAt?: string | null;
  status: "Pending" | "Replied";
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<IContact[]>([]);
  const [loading, setLoading] = useState(true);
const { showToast } = useToast();

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/v1/contact/messages`
      );
      setMessages(response.data);
    } catch (err) {
     
      showToast("Failed to fetch messages.","error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div>
      <Model />
      <div className="min-h-screen px-6 sm:pt-32 pt-36">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">All Messages</h1>

        {loading ? (
          <Loader />
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-600">No messages found.</p>
        ) : (
          <div className="space-y-6 max-w-5xl mx-auto">
            {messages.map((msg) => (
              <div key={msg._id} className="space-y-4 relative">
                <Link to={`/admin/contact/${encodeURIComponent(msg?.email)}`}>
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                    <div className="flex justify-between mb-2">
                      <span className="font-bold">{msg.subject}</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          msg.status === "Pending"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-green-200 text-green-800"
                        }`}
                      >
                        {msg.status}
                      </span>
                      <span className="text-md text-gray-500">
                        <span className="text-xs text-gray-500">
                          {new Date(msg.messageCreatedAt).toLocaleDateString()}{" "}
                          {new Date(msg.messageCreatedAt).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </span>
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">
                      From: {msg.name || "Anonymous"} ({msg.email})
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
