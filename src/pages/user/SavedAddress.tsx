import { useDispatch } from "react-redux";
import { saveShippingInfo } from "../../redux/reducer/cartReducer";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Breadcrumbs from "../../components/breadcrumbs";
import { FaRegEdit } from "react-icons/fa";
import { useToast } from "../../components/context/toastprovider";

const breadcrumbData = [
  { label: "Home", href: "/" },
  { label: "Profile", href: "/profile" },
  { label: "Saved Address", href: "/saved-address" },
];

interface ShippingInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  mobNo: string;
  altMob: string;
}

const SavedAddress = () => {
  const dispatch = useDispatch();
  const savedShippingInfos: ShippingInfo[] = JSON.parse(
    localStorage.getItem("shippingInfos") || "[]"
  );
  const { showToast } = useToast();
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(-1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
    mobNo: "",
    altMob: "",
  });

  useEffect(() => {
    if (selectedAddressIndex !== -1) {
      // Selecting an existing address for editing
      const selectedShippingInfo = savedShippingInfos[selectedAddressIndex];
      setShippingInfo(selectedShippingInfo);
      dispatch(saveShippingInfo(selectedShippingInfo)); // Update redux state
    } else {
      // Resetting fields for new address
      setShippingInfo({
        name: "",
        email: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pinCode: "",
        mobNo: "",
        altMob: "",
      });
      dispatch(saveShippingInfo({} as ShippingInfo)); 
    }
  }, [selectedAddressIndex]); 

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let updatedShippingInfos = [...savedShippingInfos];

    if (selectedAddressIndex === -1) {
      // Add new address
      updatedShippingInfos.push(shippingInfo);
      showToast("New shipping address added!", "success");
    } else {
      // Update existing address
      updatedShippingInfos[selectedAddressIndex] = shippingInfo;
      showToast("Shipping address updated!", "success");
    }

    // Save to localStorage
    localStorage.setItem("shippingInfos", JSON.stringify(updatedShippingInfos));
    dispatch(saveShippingInfo(shippingInfo));
    setIsModalOpen(false);
    setSelectedAddressIndex(-1); // Reset after successful save
  };

  const deleteAddress = () => {
    const updatedShippingInfos = savedShippingInfos.filter(
      (_, index) => index !== selectedAddressIndex
    );
    localStorage.setItem("shippingInfos", JSON.stringify(updatedShippingInfos));
    showToast("Shipping address deleted!", "success");
    setIsModalOpen(false);
    setSelectedAddressIndex(-1); // Reset after deletion
    dispatch(saveShippingInfo({} as ShippingInfo));
  };

  return (
    <div>
      <Breadcrumbs breadcrumbs={breadcrumbData} />

      <section className="max-w-5xl mx-auto pt-1 px-4">
        {savedShippingInfos.length > 0 && (
          <div className="mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {savedShippingInfos.map((info, index) => (
                <div
                  key={index}
                  className={`p-5 rounded-lg shadow-lg cursor-pointer transform transition hover:scale-105 
                 flex justify-between items-start`}
                  onClick={(e) => {
                    // Prevent clicking the Edit button from selecting the radio
                    if (!(e.target as HTMLElement).closest("button")) {
                      setSelectedAddressIndex(index);
                    }
                  }}
                >
                  <div className="flex flex-col">
                    <label className="text-gray-800 font-medium mb-1">
                      {info.name}
                    </label>
                    <span className="text-gray-600 text-sm">
                      {info.address}, {info.city}, {info.state}, {info.country},{" "}
                      {info.pinCode}
                    </span>
                    <span className="text-gray-600 text-sm mt-1">
                      Mobile: {info.mobNo}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedAddressIndex(index);
                      setIsModalOpen(true);
                    }}
                    className="text-pink-500 ml-3 mt-1 hover:text-pink-600"
                  >
                    <FaRegEdit size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => {
              setSelectedAddressIndex(-1);
              setIsModalOpen(true);
            }}
            type="button"
            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            New
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">
                {selectedAddressIndex === -1
                  ? "Enter New Shipping Address"
                  : "Edit Shipping Address"}
              </h2>

              <form onSubmit={submitHandler} className="space-y-4">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
                  <div className="w-full">
                    <label className="block text-gray-600 mb-2" htmlFor="name">
                      Name
                    </label>
                    <input
                      required
                      name="name"
                      value={shippingInfo.name}
                      type="text"
                      onChange={changeHandler}
                      className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-gray-600 mb-2" htmlFor="email">
                      Email
                    </label>
                    <input
                      required
                      name="email"
                      value={shippingInfo.email}
                      type="email"
                      onChange={changeHandler}
                      className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
                  {/* Mobile Number */}
                  <div className="w-full">
                    <label className="block text-gray-600 mb-2" htmlFor="mobNo">
                      Mobile Number
                    </label>
                    <input
                      required
                      name="mobNo"
                      value={shippingInfo.mobNo}
                      type="tel"
                      pattern="\d{10}"
                      maxLength={10}
                      onChange={changeHandler}
                      className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                      placeholder="Enter 10-digit mobile number"
                    />
                  </div>
                  {/* Alternate Mobile */}
                  <div className="w-full">
                    <label
                      className="block text-gray-600 mb-2"
                      htmlFor="altMob"
                    >
                      Alternate Mob. No.
                    </label>
                    <input
                      name="altMob"
                      value={shippingInfo.altMob}
                      type="tel"
                      pattern="\d{10}"
                      maxLength={10}
                      onChange={changeHandler}
                      className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                      placeholder="Enter 10-digit alternate mobile number"
                    />
                  </div>
                </div>

                {/* Country and State */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
                  <div className="w-full">
                    <label
                      className="block text-gray-600 mb-2"
                      htmlFor="country"
                    >
                      Country
                    </label>
                    <input
                      required
                      name="country"
                      value={shippingInfo.country}
                      type="text"
                      onChange={changeHandler}
                      className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-gray-600 mb-2" htmlFor="state">
                      State
                    </label>
                    <input
                      required
                      name="state"
                      value={shippingInfo.state}
                      type="text"
                      onChange={changeHandler}
                      className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>

                {/* City and Pincode */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
                  <div className="w-full">
                    <label className="block text-gray-600 mb-2" htmlFor="city">
                      City
                    </label>
                    <input
                      required
                      name="city"
                      value={shippingInfo.city}
                      type="text"
                      onChange={changeHandler}
                      className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div className="w-full">
                    <label
                      className="block text-gray-600 mb-2"
                      htmlFor="pinCode"
                    >
                      Pincode
                    </label>
                    <input
                      required
                      name="pinCode"
                      value={shippingInfo.pinCode}
                      type="text"
                      onChange={changeHandler}
                      className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="w-full">
                  <label className="block text-gray-600 mb-2" htmlFor="address">
                    Address
                  </label>
                  <input
                    required
                    name="address"
                    value={shippingInfo.address}
                    type="text"
                    onChange={changeHandler}
                    className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                  />
                </div>

                <div className="mt-6 flex justify-between space-x-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    type="button"
                    className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  >
                    Cancel
                  </button>

                  {selectedAddressIndex !== -1 && (
                    <button
                      onClick={deleteAddress}
                      type="button"
                      className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    >
                      Delete
                    </button>
                  )}

                  <button
                    type="submit"
                    className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default SavedAddress;
