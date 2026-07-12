import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/loader";
import Model from "../../components/admin/Model";
import axios from "axios";
// import { FaTrash } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import { useToast } from "../../components/context/toastprovider";

// Define the Banner interface
interface Banner {
  _id: string; // Use the correct type based on your API response
  title: string;
  subtitle: string;
  mainPrice: number; // Assuming mainPrice is a number
}

const AdminBanner = () => {
  const [banners, setBanners] = useState<Banner[]>([]); // Use the Banner type
  const [loading, setLoading] = useState(true);
const { showToast } = useToast();
  // Fetch banners
  const fetchBanners = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/v1/banner/all`
      );
      setBanners(response.data.banners);
    } catch (error) {
    showToast("Failed to fetch banners","error");
    } finally {
      setLoading(false);
    }
  };

  // Delete banner handler
  // const deleteHandler = async (bannerId: string) => {
  //     try {
  //         await axios.delete(`${import.meta.env.VITE_SERVER}/api/v1/banner/${bannerId}`); // Update with your actual API endpoint
  //         setBanners((prev) => prev.filter(banner => banner._id !== bannerId));
  //         toast.success("Banner deleted successfully!");
  //     } catch (error) {
  //         toast.error("Failed to delete the banner");
  //         console.error(error);
  //     }
  // };

  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <div>
      <Model />
      <main className="pt-28 pb-10">
        {loading ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-3 px-4">Title</th>
                  {/* <th className="py-3 px-4">Subtitle</th> */}
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {banners.length > 0 ? (
                  banners.map((banner) => {
                    return (
                      <tr key={banner._id} className="border-b">
                        <td className="py-3 px-4">{banner.title}</td>
                        {/* <td className="py-3 px-4">{banner.subtitle}</td> */}
                        <td className="py-3 px-4">{banner.mainPrice} Rs</td>
                        <td className="py-3 px-4">
                          <Link
                            to={`/admin/edit-banner/${banner._id}`}
                            className="text-blue-600 "
                          >
                            <AiFillEdit className="text-2xl" />
                          </Link>
                          {/* <button onClick={() => deleteHandler(banner._id)} className="text-red-600 ml-4"><FaTrash /></button> */}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      No banners found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Link
        to="/admin/product/new"
        className="w-10 h-10 bg-slate-100 z-20 absolute right-10 bottom-10 flex justify-center py-3 rounded-full"
      >
        <FaPlus />
      </Link>
    </div>
  );
};

export default AdminBanner;
