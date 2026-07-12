import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../../components/context/toastprovider";

const EditDeleteBanner = () => {
  const { id } = useParams(); // Get the banner ID from the URL
  const navigate = useNavigate(); // For navigation after update
  const [banner, setBanner] = useState<{
    title: string;
    subtitle: string;
    mainPrice: number;
    img: string; // Assuming the banner includes an image URL
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState<File | null>(null); // State for the selected image
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State for image preview
const { showToast } = useToast();
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER}/api/v1/banner/${id}`
        );
        setBanner(response.data.banner);
      } catch (error) {
       showToast("Failed to fetch banner details","error");
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (banner) {
      setBanner({ ...banner, [e.target.name]: e.target.value });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImage(file);
      // Create a preview URL for the uploaded image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (banner) {
      const formData = new FormData();
      formData.append("title", banner.title);
      formData.append("subtitle", banner.subtitle);
      formData.append("mainPrice", banner.mainPrice.toString());
      if (image) {
        formData.append("photo", image); // Append the selected image file
      }

      try {
        await axios.put(
          `${import.meta.env.VITE_SERVER}/api/v1/banner/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // Important for file uploads
            },
          }
        );
      showToast("Banner updated successfully!","success");
        navigate("/admin/banner"); // Redirect to the banners page
      } catch (error) {
      showToast("Failed to update the banner","error");
      }
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_SERVER}/api/v1/banner/${id}`);
    showToast("Banner deleted successfully!","success");
      navigate("/admin/banners"); // Redirect after deletion
    } catch (error) {
     showToast("Failed to delete the banner","error");
    }
  };

  // Show loading state
  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  // Handle case where no banner is found
  if (!banner) {
    return <div className="text-center mt-10">No banner found.</div>;
  }

  // Construct the URL for the current banner image
  const server = import.meta.env.VITE_SERVER;
  const currentImageUrl = `${server}/${banner.img}`;

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 pt-28">
      <h2 className="text-2xl font-semibold mb-4 text-center">Edit Banner</h2>

      {/* Display Current Banner Image */}
      <div className="mb-4">
        <img
          src={currentImageUrl}
          alt="Current Banner"
          className="w-full h-48 object-cover rounded-md"
        />
      </div>

      {/* Display New Image Preview if it exists */}
      {imagePreview && (
        <div className="mb-4">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-md"
          />
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">Title:</label>
          <input
            type="text"
            name="title"
            value={banner.title}
            onChange={handleChange}
            required
            className="mt-1 border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Subtitle:</label>
          <input
            type="text"
            name="subtitle"
            value={banner.subtitle}
            onChange={handleChange}
            required
            className="mt-1 border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Price:</label>
          <input
            type="number"
            name="mainPrice"
            value={banner.mainPrice}
            onChange={handleChange}
            required
            className="mt-1 border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Update Banner
        </button>
      </form>
      <button
        onClick={handleDelete}
        className="w-full mt-4 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition duration-200"
      >
        Delete Banner
      </button>
    </div>
  );
};

export default EditDeleteBanner;
