import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import Model from "../../components/admin/Model";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../components/loader";
import { useToast } from "../../components/context/toastprovider";

const EditCustomerRole = () => {
  const { id } = useParams<{ id: string }>();
  const adminUserId = useSelector((state: RootState) => state.user.user?._id);
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
const { showToast } = useToast();

  // State for edited data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const Navigate = useNavigate();
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER}/api/v1/user/${id}`,
          {
            params: { id: adminUserId }, // Pass the admin ID as a query parameter
          }
        );

        setCustomer(response.data.user);
        setName(response.data.user.name); // Initialize the name
        setEmail(response.data.user.email); // Initialize the email
        setRole(response.data.user.role); // Initialize the role
        // setPhoto(response.data.user.photo)
      } catch (err) {
        setError("Failed to fetch customer data.");
      } finally {
        setLoading(false);
      }
    };

    if (adminUserId) {
      fetchCustomerData();
    }
  }, [id, adminUserId]);

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission

    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER}/api/v1/user/${customer._id}`,
        {
          name,
          email,
          role,
        },
        {
          params: { id: adminUserId },
        }
      );
      // Handle success (e.g., show a success message or redirect)
      Navigate("/admin/customer");
     showToast("Customer updated successfully!","success");
    } catch (err) {
      setError("Failed to update customer data.");
      showToast("Failed to update customer data.","error");
    }
  };

  // const imgURL = `${import.meta.env.VITE_SERVER}/${photo}`

  return (
    <div className="pt-5">
      {loading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>
          <Model />
          <div className="w-full flex justify-center">
            <div className="flex-grow p-10 pt-28">
              <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between">
                  <h2 className="text-lg font-semibold mb-4">
                    Edit Customer Role
                  </h2>
                  {/* <img className="w-12 h-12 rounded-full" src={imgURL} alt=""/> */}
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700">ID:</label>
                    <p className="text-gray-900 bg-gray-100 p-3 rounded-md text-sm">
                      {customer._id}
                    </p>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Name:</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Email:</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Role:</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full sm:w-1/3 p-2 border outline-none border-gray-300 rounded"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="mt-4 p-2 w-full sm:w-1/3 bg-green-600 hover:bg-green-700 px-7 text-white rounded"
                  >
                    Update User
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditCustomerRole;
