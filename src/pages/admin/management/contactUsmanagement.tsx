import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../components/loader";
import Model from "../../../components/admin/Model";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useToast } from "../../../components/context/toastprovider";

interface IMessage {
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

const ContactUsManagement = () => {
  const { email } = useParams<{ email: string }>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState<string>("");
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();
const { showToast } = useToast();

  if (!email) {
   showToast("Email not found in URL","error");
    return null; // or navigate somewhere
  }

  const userEmail = email || "";
  // Fetch all messages
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/v1/contact/email/${email}`
      );
      setMessages(response.data);
    } catch (err) {
      console.error(err);
     showToast("Failed to fetch messages","error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Reply to message
  const handleReplyByEmail = async (_id: string) => {
    if (!replyText) return showToast("Reply cannot be empty!","error");

    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER}/api/v1/contact/reply/${userEmail}?id=${
          user?._id
        }`,
        { reply: replyText }
      );
      showToast("Replied successfully!","success");
      navigate("/admin/contact")
      setReplyText("");
      fetchMessages(); // refresh messages
    } catch (err) {
      console.error(err);
      showToast("Failed to send reply.","error");
    }
  };

  // Delete message
  const handleDelete = async (_id: string) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER}/api/v1/contact/${userEmail}`
      );
     showToast("Message deleted!","success");
      navigate("/admin/contact"); // Redirect to the banners page
      fetchMessages();
    } catch (err) {
      console.error(err);
     showToast("Failed to delete message","error");
    }
  };

  return (
    <div>
      <Model />
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-2xl pt-32 sm:pt-20 font-bold mb-8 text-gray-800">
          Contact Us Management
        </h1>

        {loading ? (
          <Loader />
        ) : messages.length === 0 ? (
          <p className="text-gray-500 text-center text-lg">
            No messages found.
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className="bg-white shadow-xl p-6 mb-8 hover:shadow-2xl transition duration-300"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h2 className="font-bold text-xl text-gray-900">
                    {msg.name || "Anonymous"}
                  </h2>
                  <p className="text-sm text-blue-500">{msg.email}</p>
                </div>
                <button
                  onClick={() => handleDelete(msg._id)}
                  className="bg-red-100 p-3 rounded-full hover:bg-red-200 transition shadow-lg flex items-center justify-center"
                  title="Delete Message"
                >
                  <FaTrash className="text-red-500 w-5 h-5" />
                </button>
              </div>

              {/* Subject & Message */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-800 font-semibold">
                    {msg.subject}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      msg.status === "Pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {msg.status}
                  </span>
                </div>
                <p className="text-gray-700 mb-2">{msg.message}</p>
                <p className="text-gray-400 text-xs">
                  Sent At: {new Date(msg.messageCreatedAt).toLocaleString()}
                </p>
              </div>

              {/* Reply Section */}
              <div className="rounded-2xl">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-800 text-lg">Reply</h3>
                  <span className="text-gray-400 text-xs">
                    {msg.replyCreatedAt
                      ? new Date(msg.replyCreatedAt).toLocaleString()
                      : "Not Replied Yet"}
                  </span>
                </div>

                {/* Default Replies Select */}
                <select
                  className="w-full border border-gray-300 rounded-xl p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                >
                  <option value="">Select a default reply...</option>
                  <option value="Thank you for your feedback!">
                    Thank you for your feedback!
                  </option>
                  <option value="We are looking into your query and will get back to you shortly.">
                    We are looking into your query and will get back to you
                    shortly.
                  </option>
                  <option value="We appreciate you reaching out!">
                    We appreciate you reaching out!
                  </option>
                  <option value="Your issue has been resolved. Please check.">
                    Your issue has been resolved. Please check.
                  </option>
                </select>

                {/* Custom Reply Textarea */}
                <textarea
                  placeholder="Or type your reply here..."
                  className="w-full border border-gray-300 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-3 shadow-inner"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                ></textarea>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleReplyByEmail(msg._id)}
                    className="bg-yellow-400 text-gray-900 font-bold py-2 px-6 rounded-full shadow-lg hover:bg-yellow-300 transition"
                  >
                    Send Reply
                  </button>
                  {msg.reply && (
                    <p className="text-gray-700 italic text-sm">
                      <span className="font-semibold">Already Replied:</span>{" "}
                      {msg.reply}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ContactUsManagement;
