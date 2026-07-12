import { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaBell } from "react-icons/fa";

import Model from "../../components/admin/Model";
interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  createdAt: string;
}

const Notifications = () => {
  const API = `${import.meta.env.VITE_SERVER}/api/v1/notification`;

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState("");

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<Notification["type"]>("info");

  const getNotifications = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(`${API}/all`);

      setNotifications(data.notifications || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  const resetForm = () => {
    setEditingId("");
    setTitle("");
    setMessage("");
    setType("info");
    setShowForm(false);
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, {
          title,
          message,
          type,
        });
      } else {
        await axios.post(`${API}/new`, {
          title,
          message,
          type,
        });
      }

      resetForm();
      getNotifications();
    } catch (error) {
      console.log(error);
    }
  };

  const editHandler = (notification: Notification) => {
    setEditingId(notification._id);
    setTitle(notification.title);
    setMessage(notification.message);
    setType(notification.type);
    setShowForm(true);
  };

  const deleteHandler = async (id: string) => {
    const confirmDelete = window.confirm("Delete this notification?");

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/${id}`);
      getNotifications();
    } catch (error) {
      console.log(error);
    }
  };

  const badgeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-600";

      case "warning":
        return "bg-yellow-100 text-yellow-700";

      case "error":
        return "bg-red-100 text-red-600";

      default:
        return "bg-blue-100 text-blue-600";
    }
  };

  return (
    <>
      <Model />

      <div className="bg-gray-50 min-h-screen sm:ml-16 pt-28 px-5 pb-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>

            <p className="text-gray-500 mt-1">
              Create and manage announcements.
            </p>
          </div>

          <button onClick={() => setShowForm(true)}>
            <div className="h-14 w-14 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center">
              <FaPlus className="text-purple-700 text-xl" />
            </div>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-gray-100 text-center">
            <FaBell className="mx-auto text-5xl text-gray-300 mb-4" />

            <h2 className="text-xl font-semibold text-gray-700">
              No Notifications
            </h2>

            <p className="text-gray-500 mt-2">
              Create your first notification.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColor(
                        notification.type,
                      )}`}
                    >
                      {notification.type}
                    </span>

                    <h2 className="text-xl font-semibold text-gray-800 mt-4">
                      {notification.title}
                    </h2>

                    <p className="text-gray-500 mt-3">{notification.message}</p>

                    <p className="text-xs text-gray-400 mt-5">
                      {new Date(notification.createdAt).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => editHandler(notification)}
                      className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => deleteHandler(notification._id)}
                      className="h-10 w-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-5">
            <form
              onSubmit={submitHandler}
              className="bg-white rounded-3xl p-7 w-full max-w-xl"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editingId ? "Update Notification" : "Create Notification"}
              </h2>

              <input
                type="text"
                placeholder="Notification Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-2xl p-4 mb-4 outline-none focus:border-black"
              />

              <textarea
                rows={5}
                placeholder="Notification Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-2xl p-4 mb-4 outline-none focus:border-black resize-none"
              />

              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value as Notification["type"])
                }
                className="w-full border border-gray-200 rounded-2xl p-4 mb-6 outline-none"
              >
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-black text-white py-4 rounded-2xl font-medium"
                >
                  {editingId ? "Update Notification" : "Create Notification"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 border border-gray-200 rounded-2xl py-4 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default Notifications;
