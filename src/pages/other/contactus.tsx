import { useState, useEffect } from "react";
import axios from "axios";
import Breadcrumbs from "../../components/breadcrumbs";
import { FiPhone, FiMail } from "react-icons/fi";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { useToast } from "../../components/context/toastprovider";

const ContactUs = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]); // store all messages
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  const user = useSelector((state: RootState) => state.user.user);

  const getPlaceholder = (subj: string) => {
    switch (subj) {
      case "General Inquiry":
        return "Write your inquiry here...";
      case "Feedback":
        return "Share your feedback with us...";
      case "Question":
        return "Ask your question here...";
      case "Hi":
        return "Say hi to us!";
      default:
        return "Your Message";
    }
  };

  const breadcrumbData = [
    { label: "Home", href: "/" },
    { label: "Contact Us", href: "/contact" },
  ];

  // Fetch all messages
  const getMessages = async () => {
    if (!user?.email) return;
    setFetching(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/v1/contact/email/${user.email}`
      );

      if (response.data) {
        setMessages(response.data);
      }
    } catch (err: any) {
      showToast("Failed to fetch your messages.", "error");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    getMessages();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(`${import.meta.env.VITE_SERVER}/api/v1/contact/new`, {
        subject,
        message,
        email: user?.email,
        name: user?.name,
        avatar: user?.avatar,
      });

      showToast("Message submitted successfully!", "success");
      setMessage("");
      setSubject("");
      getMessages(); // refresh messages
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbData} />
      <section className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-4">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 md:p-12 grid md:grid-cols-2 gap-8">
          {/* Left Info */}
          <div className="flex flex-col justify-center space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Get in Touch</h2>
            <p className="text-gray-600 text-lg">
              Whether you have a question, feedback, or just want to say hi, we
              are here for you!
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-4 bg-yellow-50 rounded-xl p-4 shadow-md hover:shadow-lg transition">
                <div className="w-10 h-10 flex items-center justify-center bg-yellow-400 text-white rounded-full text-lg">
                  <FiPhone size={20} />
                </div>
                <p className="text-gray-800 font-medium"> {import.meta.env.VITE_PHONE_NO}</p>
              </div>

              <div className="flex items-center space-x-4 bg-blue-50 rounded-xl p-4 shadow-md hover:shadow-lg transition">
                <div className="w-10 h-10 flex items-center justify-center bg-blue-400 text-white rounded-full text-lg">
                  <FiMail size={20} />
                </div>
                <p className="text-gray-800 font-medium">
                 {import.meta.env.VITE_EMAIL_ID}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition bg-white text-gray-700"
            >
              <option value="" disabled>
                Select Subject
              </option>
              <option value="General Inquiry">General Inquiry</option>
              <option value="Feedback">Feedback</option>
              <option value="Question">Question</option>
              <option value="Hi">Say Hi</option>
            </select>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={getPlaceholder(subject)}
              rows={5}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none"
            ></textarea>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-yellow-400 text-gray-900 font-bold py-3 rounded-full shadow-lg hover:bg-yellow-300 transition transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>
        </div>

        <div className="w-full max-w-4xl mt-8 space-y-6 pb-12">
          {fetching ? (
            <p className="text-gray-600 text-center">Loading messages...</p>
          ) : (
            messages.map((msg) => (
              <div key={msg._id} className="space-y-4 relative">
                <div className="flex justify-between">
                  <button
                    onClick={async () => {
                      try {
                        await axios.delete(
                          `${import.meta.env.VITE_SERVER}/api/v1/contact/${
                            msg.email
                          }`
                        );
                        showToast("Message deleted successfully!", "success");
                        setTimeout(() => window.location.reload(), 1500); // wait 1.5 seconds
                      } catch (err) {
                        showToast("Failed to delete message.", "error");
                      }
                    }}
                    className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white w-10 h-10 flex items-center justify-center rounded-full transition-colors shadow-md"
                    title="Delete Message"
                  >
                    <FaTrash className="w-5 h-5" />
                  </button>{" "}
                  <span
                    className={`mr-4 px-4 py-2 rounded-full text-base font-semibold ${
                      msg.status === "Pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {msg.status}
                  </span>
                </div>

                <div className="bg-white  p-6 rounded-xl shadow-lg border relative group hover:shadow-xl transition">
                  <div className="flex justify-between items-start">
                    <h2 className="text-md font-semibold text-black mb-2">
                      {msg.subject}
                    </h2>
                    <div className="flex items-center space-x-2">
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
                  </div>
                  <p className="text-gray-700">{msg.message}</p>
                </div>

                {msg.status === "Replied" && (
                  <div className="bg-gradient-to-r p-6 rounded-xl shadow-lg border bg-white hover:shadow-xl transition">
                    <div className="flex justify-between items-start">
                      <h2 className="text-md font-semibold black mb-2">
                        Reply from Our Team
                      </h2>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.replyCreatedAt).toLocaleDateString()}{" "}
                        {new Date(msg.replyCreatedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-gray-700">{msg.reply}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
};

export default ContactUs;
