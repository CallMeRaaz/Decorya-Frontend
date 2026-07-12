import { useEffect, useState } from "react";
import axios from "axios";
import Model from "../../../components/admin/Model";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useToast } from "../../../components/context/toastprovider";

interface Coupon {
  _id: string;
  code: string;
  amount: number;
  expiryDate: string;
  minPurchaseAmount: number;
  active: boolean;
  __v: number;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Coupons = () => {
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState<Coupon | null>(null);
  const [formValues, setFormValues] = useState({
    code: "",
    amount: "",
    expiryDate: "",
    minPurchaseAmount: "",
    active: true,
  });

  const userId = useSelector((state: RootState) => state.user.user?._id);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER
          }/api/v1/payment/coupon/all?id=${userId}`
        );
        setCoupons(response.data.coupons);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, [userId]);

  const handleDelete = async (couponId: string) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_SERVER
        }/api/v1/payment/coupon/${couponId}?id=${userId}`
      );
      if (response.data.success) {
        setCoupons((prev) => prev.filter((c) => c._id !== couponId));
        showToast("Coupon deleted successfully!!", "success");
      }
    } catch (error) {
      console.error(error);
      showToast("Error deleting coupon", "error");
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setIsEditing(true);
    setCurrentCoupon(coupon);
    const expDate = new Date(coupon.expiryDate);
    const formatted = expDate.toISOString().split("T")[0];
    setFormValues({
      code: coupon.code,
      amount: coupon.amount.toString(),
      expiryDate: formatted,
      minPurchaseAmount: coupon.minPurchaseAmount.toString(),
      active: coupon.active,
    });
  };

  const handleCreate = () => {
    setIsCreating(true);
    setFormValues({
      code: "",
      amount: "",
      expiryDate: "",
      minPurchaseAmount: "",
      active: true,
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (isEdit = false) => {
    try {
      const payload = {
        ...formValues,
        amount: Number(formValues.amount),
        minPurchaseAmount: Number(formValues.minPurchaseAmount || 0),
        userId,
      };

      const url = isEdit
        ? `${import.meta.env.VITE_SERVER}/api/v1/payment/coupon/${
            currentCoupon?._id
          }?id=${userId}`
        : `${
            import.meta.env.VITE_SERVER
          }/api/v1/payment/coupon/new?id=${userId}`;

      const method = isEdit ? axios.put : axios.post;
      const response = await method(url, payload);

      if (response.data.success) {
        if (isEdit) {
          setCoupons((prev) =>
            prev.map((c) =>
              c._id === currentCoupon?._id ? response.data.coupon : c
            )
          );
          setIsEditing(false);
          setCurrentCoupon(null);
          showToast("Coupon updated successfully!", "success");
        } else {
          setCoupons((prev) => [...prev, response.data.coupon]);
          setIsCreating(false);
          showToast("Coupon created successfully!", "success");
        }
        setFormValues({
          code: "",
          amount: "",
          expiryDate: "",
          minPurchaseAmount: "",
          active: true,
        });
      }
    } catch (error) {
      console.error(error);
      showToast("Error saving coupon. Please try again.", "error");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Model />
      <div className="pt-28">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Coupons
          </h1>

          <div className="flex justify-end mb-6">
            <button
              onClick={handleCreate}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300"
            >
              + Create Coupon
            </button>
          </div>

          {loading ? (
            <p className="text-center text-gray-500 text-lg font-medium">
              Loading coupons...
            </p>
          ) : coupons.length === 0 ? (
            <p className="text-center text-gray-500 text-lg font-medium">
              No coupons found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div
                  key={c._id}
                  className="p-4 bg-white h-36 rounded-xl shadow hover:shadow-lg transition flex flex-col justify-between border-l-4 border-blue-500"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-bold text-blue-600">
                      {c.code}
                    </h2>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        c.active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {c.active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 text-gray-700 text-sm">
                    <span>
                      <strong>Amount:</strong> ₹{c.amount}
                    </span>
                    <span>
                      <strong>Expires:</strong> {formatDate(c.expiryDate)}
                    </span>
                    <span>
                      <strong>Min Purchase:</strong> ₹{c.minPurchaseAmount}
                    </span>
                  </div>

                  <div className="flex relative bottom-12 justify-end gap-3 mt-3">
                    <button
                      onClick={() => handleEdit(c)}
                      className="p-2 bg-green-500 rounded hover:bg-green-600 text-white"
                      title="Edit"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="p-2 bg-red-500 rounded hover:bg-red-600 text-white"
                      title="Delete"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

  {(isEditing || isCreating) && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
    <div className="bg-white w-96 p-6 rounded-2xl shadow-2xl space-y-5 transform scale-95 animate-scaleIn">
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        {isEditing ? "Edit Coupon" : "Create Coupon"}
      </h2>

      <div className="flex flex-col gap-3">
        <input
          type="text"
          name="code"
          placeholder="Coupon Code"
          value={formValues.code}
          onChange={handleFormChange}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
        />
        <input
          type="number"
          name="amount"
          placeholder="Discount Amount"
          value={formValues.amount}
          onChange={handleFormChange}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
        />
        <label className="text-gray-500 pt-2 font-semibold text-sm">Select Expiry Date</label>
        <input
          type="date"
          name="expiryDate"
          value={formValues.expiryDate}
          onChange={handleFormChange}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
        />
        <input
          type="number"
          name="minPurchaseAmount"
          placeholder="Minimum Purchase Amount"
          value={formValues.minPurchaseAmount}
          onChange={handleFormChange}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
        />
      </div>

      <label className="flex items-center gap-2 mt-1">
        <input
          type="checkbox"
          name="active"
          checked={formValues.active}
          onChange={handleFormChange}
          className="w-5 h-5 accent-blue-500"
        />
        <span className="text-gray-700 font-medium">Active</span>
      </label>

      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={() => {
            setIsEditing(false);
            setIsCreating(false);
            setCurrentCoupon(null);
          }}
          className="flex items-center gap-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Cancel
        </button>
        <button
          onClick={() => handleSubmit(isEditing)}
          className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-md transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {isEditing ? "Save" : "Create"}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Coupons;
