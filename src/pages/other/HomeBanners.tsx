import DecoryaMainBanner from "../../assets/frontend_assets/DecoryaMainBanner.jpg";
import DecoryaMainBanner2 from "../../assets/frontend_assets/DecoryaMainBanner2.jpg";
import DecoryaMainBanner3 from "../../assets/frontend_assets/DecoryaMainBanner3.png";

const HomeBanners = () => {
  return (
    <div className="pt-16 md:pt-0 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px] md:h-[400px]">
        {/* 🌟 Main Banner */}
        <div className="md:col-span-2 relative rounded-2xl overflow-hidden h-[300px] md:h-full group">
          <img
            src={DecoryaMainBanner}
            alt="Main Banner"
            className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex flex-col justify-center items-start p-8 md:p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-wide drop-shadow-md">
              New <span className="text-pink-400">Festive</span> Collection 🎉
            </h2>
            <p className="mt-3 text-base md:text-lg text-gray-50 font-medium tracking-wide">
              Up to{" "}
              <span className="text-yellow-300 font-semibold">50% OFF</span> on
              all decor items
            </p>
            <button className="mt-3 p-3 text-white font-semibold text-lg relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[3px] after:bg-gradient-to-r from-pink-200 to-yellow-500 hover:after:scale-x-110 after:transition-transform after:duration-300">
              Shop Now
            </button>
          </div>
        </div>

        {/* 🎨 Side Banners */}
        <div className="flex flex-col gap-4 h-[300px] md:h-full">
          {/* Wall Art */}
          <div className="relative flex-1 rounded-2xl overflow-hidden group">
            <img
              src={DecoryaMainBanner3}
              alt="Wall Decor"
              className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
              <h3 className="text-2xl font-bold tracking-wide drop-shadow-md">
                Wall <span className="text-pink-400">Art</span>
              </h3>
              <p className="text-sm md:text-base text-gray-200 font-medium">
                Modern & Elegant
              </p>
            </div>
          </div>

          {/* Lighting Magic */}
          <div className="relative flex-1 rounded-2xl overflow-hidden group">
            <img
              src={DecoryaMainBanner2}
              alt="Lighting Decor"
              className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
              <h3 className="text-2xl font-bold tracking-wide drop-shadow-md">
                Lighting <span className="text-yellow-300">Magic</span>
              </h3>
              <p className="text-sm md:text-base text-gray-200 font-medium">
                Brighten Your Space
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBanners;
