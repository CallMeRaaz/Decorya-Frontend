import { ChangeEvent, FormEvent, useState, useEffect, Key } from "react";
import { FaImage, FaTrash } from "react-icons/fa";
import Model from "../../../components/admin/Model";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useParams, useNavigate } from "react-router-dom";
import {
  useDeleteProductMutation,
  useProductDetailsQuery,
  useUpdateProductMutation,
} from "../../../redux/api/productApi";
import Loader from "../../../components/loader";
import Breadcrumbs from "../../../components/breadcrumbs";
import { useToast } from "../../../components/context/toastprovider";

const ProductManagement = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const params = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { data, isLoading, isError } = useProductDetailsQuery(params.id!);

  const breadcrumbData = [
    { label: "Home", href: "/" },
    { label: "Admin", href: "/admin/dashboard" },
    { label: "Products", href: "/admin/product" },
    { label: "Edit", href: `/admin/product/${params.id}` },
  ];
  const {
    photo = [],
    name,
    stock,
    mainPrice,
    category,
    subCategory,
    description,
    salePrice,
    onSale,
  } = data?.product || {
    photo: [],
    name: "",
    stock: 0,
    mainPrice: 0,
    category: "",
    subCategory: "",
    description: "",
    salePrice: 0,
    onSale: false,
  };

  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [priceUpdate, setPriceUpdate] = useState<number>(mainPrice);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [photoPrevs, setPhotoPrevs] = useState<string[]>(Array(5).fill(""));
  const [, setCategoryUpdate] = useState<string>(category);
  const [, setSubCategoryUpdate] = useState<string>(subCategory);
  const [descriptionUpdate, setDescriptionUpdate] =
    useState<string>(description);
  const [originalPriceUpdate, setOriginalPriceUpdate] =
    useState<number>(salePrice);
  const [onSaleUpdate, setOnSaleUpdate] = useState<boolean>(onSale);
  const [photoUpdates, setPhotoUpdates] = useState<(string | ArrayBuffer)[]>(
    [],
  );
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [, setPhotos] = useState<File[]>([]);

  const [selectedOptionUpdate, setSelectedOptionUpdate] = useState("");
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (data?.product) {
      setPriceUpdate(data.product.mainPrice);
      setStockUpdate(data.product.stock);
      setNameUpdate(data.product.name);
      setCategoryUpdate(data.product.category);
      setSubCategoryUpdate(data.product.subCategory);
      setDescriptionUpdate(data.product.description);
      setOriginalPriceUpdate(data.product.salePrice);
      setOnSaleUpdate(data.product.onSale);
      setPhotoUpdates([]);

      // ✅ Set the select value as "Category - SubCategory"
      setSelectedOptionUpdate(
        data.product.subCategory
          ? `${data.product.category} - ${data.product.subCategory}`
          : data.product.category,
      );
    }
  }, [data]);

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
     if (files.length > 5) {
      showToast("You can only upload up to 5 images.", "error");
      return;
    }

    const newPhotoPrevs: string[] = Array(5).fill(""); // 👈 default placeholders

    files.forEach((file, i) => {
      if (i < 5) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            newPhotoPrevs[i] = reader.result;
            setPhotoPrevs(newPhotoPrevs);
          }
        };
      }
    });

    setPhotoFiles(files);
    setPhotos(files);
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBtnLoading(true);

    const formData = new FormData();
    if (nameUpdate) formData.set("name", nameUpdate);
    if (descriptionUpdate) formData.set("description", descriptionUpdate);
    if (priceUpdate) formData.set("mainPrice", priceUpdate.toString());
    if (originalPriceUpdate)
      formData.set("salePrice", originalPriceUpdate.toString());
    if (stockUpdate !== undefined)
      formData.set("stock", stockUpdate.toString());

    // Split selected option into main and sub
    if (selectedOptionUpdate) {
      const [mainCat, subCat] = selectedOptionUpdate.split(" - ");
      formData.set("category", mainCat);
      formData.set("subCategory", subCat || "");
    }

    formData.set("onSale", String(onSaleUpdate));

    // Append photos
    photoFiles.forEach((file) => formData.append("photos", file));

    interface ApiError {
      response?: {
        data?: {
          message?: string;
        };
      };
    }

    try {
      const res = await updateProduct({
        formData,
        userId: user?._id!,
        productId: data?.product._id!,
      });

      if (res?.data) {
        showToast("Product updated successfully.", "success");
        navigate("/admin/product");
      } else {
        showToast(
          "Product update was unsuccessful. Please try again.",
          "error",
        );
      }
    } catch (error) {
      const err = error as ApiError; // Use the custom error type

      if (err.response?.data?.message) {
        showToast(
          `Failed to update the product: ${err.response.data.message}`,
          "error",
        );
      } else {
        showToast(
          "Failed to update the product. Please check your inputs.",
          "error",
        );
      }
    } finally {
      setBtnLoading(false);
    }
  };

  const deleteProductHandler = async () => {
    if (confirm("Are you sure you want to delete this product?")) {
      const productId = data?.product._id;

      if (productId) {
        try {
          await deleteProduct({ productId, userId: "" });
          showToast("Product deleted successfully.", "success");
          navigate("/admin/product");
        } catch (error) {
          showToast("Failed to delete the product.", "error");
        }
      } else {
        alert("Product ID is not defined, cannot delete product.");
      }
    }
  };

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );
  if (isError) return <div>Error loading product details.</div>;

  return (
    <div>
      <Model />

      <section className="min-h-screen bg-gray-50 flex flex-col sm:ml-16 pt-28 px-5">
        <div className="relative pb-10">
          <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-xl lg:col-span-3 border border-gray-100">
            <form onSubmit={submitHandler} className="space-y-4">
              <div className="bg-white rounded-lg mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">
                      Update Product
                    </h2>
                    <p className="text-gray-500 mt-1">
                      Update your product details and upload images.
                    </p>

                    {/* <div className="flex flex-wrap gap-4 mb-2">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          stock > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {stock > 0
                          ? `Stock: ${stock} Available`
                          : "Not Available"}
                      </span>

                      <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-800 text-sm font-medium">
                        ID: {params.id}
                      </span>
                    </div> */}

                    {/* <div className="flex flex-wrap gap-4 text-gray-700">
                      <h4 className="font-medium">Price: ₹ {mainPrice}</h4>
                      {onSaleUpdate && (
                        <h4 className="font-medium">
                          Sale or Fake Price: ₹ {originalPriceUpdate}
                        </h4>
                      )}
                      <h4 className="font-medium">
                        On Sale:{" "}
                        <span
                          className={
                            onSaleUpdate
                              ? "text-green-600 font-bold"
                              : "text-red-700 font-bold"
                          }
                        >
                          {onSaleUpdate ? "Yes" : "No"}
                        </span>
                      </h4>
                    </div> */}
                  </div>

                  <button
                    onClick={deleteProductHandler}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Delete Product"
                  >
                    <FaTrash className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-black focus:bg-white"
                  type="text"
                  placeholder="Enter product name"
                  value={nameUpdate}
                  onChange={(e) => setNameUpdate(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Main Price
                  </label>
                  <input
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-black focus:bg-white"
                    type="number"
                    placeholder="Price"
                    value={priceUpdate}
                    onChange={(e) => setPriceUpdate(Number(e.target.value))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Stock Quantity
                  </label>
                  <input
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-black focus:bg-white"
                    type="number"
                    placeholder="Stock"
                    value={stockUpdate}
                    onChange={(e) => setStockUpdate(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              {/* Sale Toggle */}
              <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Put Product on Sale
                  </h4>
                  <p className="text-sm text-gray-500">
                    Enable to add a fake/original price.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setOnSaleUpdate(!onSaleUpdate);
                    if (onSaleUpdate) setOriginalPriceUpdate(0);
                  }}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 ${
                    onSaleUpdate ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-all ${
                      onSaleUpdate ? "translate-x-8" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div>
                {onSaleUpdate && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Fake Price / Original Price
                    </label>
                    <input
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-black focus:bg-white"
                      type="number"
                      placeholder="Original Price"
                      value={originalPriceUpdate}
                      onChange={(e) =>
                        setOriginalPriceUpdate(Number(e.target.value))
                      }
                      required
                    />
                  </div>
                )}

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Category
                  </label>
                  <select
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-black focus:bg-white"
                    value={selectedOptionUpdate}
                    onChange={(e) => setSelectedOptionUpdate(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select Category
                    </option>

                    {/* Wall Decor */}
                    <optgroup label="Wall Decor">
                      <option value="Wall Decor - Paintings">Paintings</option>
                      <option value="Wall Decor - Clocks">Clocks</option>
                      <option value="Wall Decor - Mirrors">Mirrors</option>
                      <option value="Wall Decor - Wall Art">Wall Art</option>
                    </optgroup>

                    {/* Lighting */}
                    <optgroup label="Lighting">
                      <option value="Lighting - Lamps">Lamps</option>
                      <option value="Lighting - Lanterns">Lanterns</option>
                      <option value="Lighting - Fairy Lights">
                        Fairy Lights
                      </option>
                      <option value="Lighting - Candles">Candles</option>
                    </optgroup>

                    {/* Home Accents */}
                    <optgroup label="Home Accents">
                      <option value="Home Accents - Showpieces">
                        Showpieces
                      </option>
                      <option value="Home Accents - Vases">Vases</option>
                      <option value="Home Accents - Figurines">
                        Figurines
                      </option>
                      <option value="Home Accents - Idols">Idols</option>
                    </optgroup>

                    {/* Floral Decor */}
                    <optgroup label="Floral Decor">
                      <option value="Floral Decor - Artificial Flowers">
                        Artificial Flowers
                      </option>
                      <option value="Floral Decor - Plants">Plants</option>
                      <option value="Floral Decor - Pots">Pots</option>
                    </optgroup>

                    {/* Festive Decor */}
                    <optgroup label="Festive Decor">
                      <option value="Festive Decor - Diwali">Diwali</option>
                      <option value="Festive Decor - Christmas">
                        Christmas
                      </option>
                      <option value="Festive Decor - Wedding">Wedding</option>
                      <option value="Festive Decor - Party">Party</option>
                    </optgroup>

                    {/* Table Decor */}
                    <optgroup label="Table Decor">
                      <option value="Table Decor - Centerpieces">
                        Centerpieces
                      </option>
                      <option value="Table Decor - Table Runners">
                        Table Runners
                      </option>
                      <option value="Table Decor - Coasters">Coasters</option>
                    </optgroup>

                    {/* Room Decor */}
                    <optgroup label="Room Decor">
                      <option value="Room Decor - Living Room">
                        Living Room
                      </option>
                      <option value="Room Decor - Bedroom">Bedroom</option>
                      <option value="Room Decor - Kids Room">Kids Room</option>
                    </optgroup>

                    {/* Outdoor Decor */}
                    <optgroup label="Outdoor Decor">
                      <option value="Outdoor Decor - Garden Lights">
                        Garden Lights
                      </option>
                      <option value="Outdoor Decor - Wind Chimes">
                        Wind Chimes
                      </option>
                      <option value="Outdoor Decor - Planters">Planters</option>
                    </optgroup>

                    {/* Seasonal Decor */}
                    <optgroup label="Seasonal Decor">
                      <option value="Seasonal Decor - Summer">Summer</option>
                      <option value="Seasonal Decor - Winter">Winter</option>
                      <option value="Seasonal Decor - Monsoon">Monsoon</option>
                    </optgroup>

                    {/* Customized Gifts */}
                    <optgroup label="Customized Gifts">
                      <option value="Customized Gifts - Name Frames">
                        Name Frames
                      </option>
                      <option value="Customized Gifts - Photo Lamps">
                        Photo Lamps
                      </option>
                      <option value="Customized Gifts - Personalized Art">
                        Personalized Art
                      </option>
                    </optgroup>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Description
                </label>
                <textarea
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm outline-none transition focus:border-black focus:bg-white"
                  value={descriptionUpdate} // Use descriptionUpdate instead of description
                  onChange={(e) => setDescriptionUpdate(e.target.value)}
                  placeholder="Enter the product description here..."
                  required
                  rows={8}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Upload Product Images
                </label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-48 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 cursor-pointer transition hover:bg-gray-100"
                  >
                    <svg
                      className="w-12 h-12 mb-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>

                    <p className="font-medium text-gray-700">
                      Click to upload or drag & drop
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG up to 5MB (Multiple allowed)
                    </p>

                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={changeImageHandler}
                      className="hidden"
                      required
                    />
                  </label>
                </div>
              </div>
              <div className="flex flex-wrap w-full">
                {(Array.isArray(photo) && photo.length > 0 ? photo : []).map(
                  (img: string, index: Key | null | undefined) => (
                    <img
                      key={index !== null ? index : Math.random()} // Use a fallback key or random value
                      className="w-12 h-12 m-1 rounded-md"
                      src={`${import.meta.env.VITE_SERVER}/${img}`}
                      alt={`Product ${
                        typeof index === "number" ? (index + 1).toString() : ""
                      }`} // Check if index is number
                    />
                  ),
                )}

                {photoUpdates.map((img, index) => (
                  <img
                    key={index}
                    src={img as string}
                    alt={`Preview ${index}`}
                    className="w-12 h-12 m-2 rounded-md"
                  />
                ))}
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                {photoPrevs.map((photo, index) => (
                  <div
                    key={index}
                    className="relative h-20 w-20 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm"
                  >
                    {!photo ? (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                        <FaImage size={24} />
                      </div>
                    ) : (
                      <img
                        src={photo}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  className={`inline-block w-full rounded-lg bg-green-500 px-5 py-3 font-medium text-white ${
                    btnLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={btnLoading}
                >
                  {btnLoading ? "Updating..." : "Update Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductManagement;
