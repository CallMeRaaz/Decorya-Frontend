import { ChangeEvent, FormEvent, useState } from "react";
import { FaImage } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Model from "../../../components/admin/Model";
import { useNewProductMutation } from "../../../redux/api/productApi";
import { RootState } from "../../../redux/store";
import { useToast } from "../../../components/context/toastprovider";

interface IErrorResponse {
  message: string;
}

const NewProduct = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [mainPrice, setPrice] = useState<number>();
  const [salePrice, setOriginalPrice] = useState<number>();
  const [onSale, setOnSale] = useState<boolean>(false); // Added state for onSale
  const [stock, setStock] = useState<number | "">("");
  const [description, setDescription] = useState<string>("");
  const [photoPrevs, setPhotoPrevs] = useState<string[]>(Array(5).fill(""));
  const [photos, setPhotos] = useState<File[]>([]);
  const { showToast } = useToast();
  const [selectedOption, setSelectedOption] = useState("");
  const [newProduct] = useNewProductMutation();
  const navigate = useNavigate();

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 5) {
      showToast("You can only upload up to 5 images.", "error");
      return;
    }

    setPhotos(files);

    const previews: string[] = Array(5).fill(""); // 👈 default placeholders

    files.forEach((file, i) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          previews[i] = reader.result; // replace placeholder with actual image
          setPhotoPrevs([...previews]); // trigger re-render
        }
      };
    });

    setPhotoPrevs(previews);
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Name validation
      if (!name) {
        showToast("Please enter the product name.", "error");
        return;
      }

      // Main price validation
      if (mainPrice === undefined || mainPrice < 0) {
        showToast("Please enter a valid main price.", "error");
        return;
      }

      // Stock validation
      if (stock === "" || Number(stock) < 0) {
        showToast("Please enter valid stock quantity.", "error");
        return;
      }

      // Category validation
      if (!selectedOption) {
        showToast("Please select a category/subcategory.", "error");
        return;
      }

      // Description validation
      if (!description) {
        showToast("Please enter product description.", "error");
        return;
      }

      // Photos validation
      if (photos.length === 0) {
        showToast("Please upload at least one product image.", "error");
        return;
      }

      const formData = new FormData();
      formData.set("name", name);
      formData.set("description", description);
      formData.set("mainPrice", mainPrice.toString());
      formData.set("salePrice", (salePrice ?? 0).toString());
      formData.set("onSale", onSale.toString());
      formData.set("stock", (stock ?? 1).toString());

      const [mainCat, subCat] = selectedOption.split(" - ");
      formData.set("category", mainCat);
      formData.set("subCategory", subCat || "");

      // Append photos
      photos.forEach((file) => {
        formData.append("photos", file);
      });

      // Send the new product request
      const res = await newProduct({ id: user?._id!, formData });

      if (res.error) {
        console.error("Error creating product:", res.error);

        // Type assertion for error response
        const errorResponse = res.error as IErrorResponse;

        // Use the message property from the error response
        const errorMessage =
          "message" in errorResponse
            ? errorResponse.message || "An unknown error occurred."
            : "An unknown error occurred.";

        showToast("Failed to create product: " + errorMessage, "error");
      } else {
        navigate("/admin/product");
        showToast("Product Created Successfully.", "success");
      }
    } catch (error) {
      showToast(
        "Failed to create product: An unexpected error occurred.",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Model />

      <section className="min-h-screen bg-gray-50 flex flex-col sm:ml-16 pt-28 px-5">
        <div className="relative pb-10">
          <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-xl lg:col-span-3 border border-gray-100">
            <form onSubmit={submitHandler} className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  Create Product
                </h2>
                <p className="text-gray-500 mt-1">
                  Add your product details and upload images.
                </p>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-black focus:bg-white"
                  type="text"
                  placeholder="Enter product name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                    placeholder="₹ Enter price"
                    value={mainPrice}
                    onChange={(e) => setPrice(Number(e.target.value))}
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
                    min="0"
                    placeholder="Enter stock"
                    defaultValue=""
                    onChange={(e) => setStock(Number(e.target.value))}
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
                  onClick={() => setOnSale(!onSale)}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 ${
                    onSale ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-all ${
                      onSale ? "translate-x-8" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {onSale && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fake Price / Original Price
                  </label>
                  <input
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-black focus:bg-white"
                    type="number"
                    placeholder="₹ Enter sale price"
                    value={salePrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    required={onSale}
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
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
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
                    <option value="Home Accents - Figurines">Figurines</option>
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
                    <option value="Festive Decor - Christmas">Christmas</option>
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

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Description
                </label>

                <textarea
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm outline-none transition focus:border-black focus:bg-white"
                  placeholder="Enter product description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={8}
                />
              </div>

              {/* Upload */}
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

              {/* Preview */}
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

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full rounded-2xl bg-black py-4 text-white font-semibold transition hover:bg-gray-800 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Creating Product..." : "Create Product"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewProduct;
