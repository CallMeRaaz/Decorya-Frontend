import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import a1 from "../../assets/Category/1c.png";
import a2 from "../../assets/Category/2c.png";
import a3 from "../../assets/Category/3c.png";
import a4 from "../../assets/Category/4c.png";
import a5 from "../../assets/Category/5c.png";
import a6 from "../../assets/Category/6c.png";
import a7 from "../../assets/Category/7c.png";
// import a8 from "../../assets/Category/11c.png";
import a9 from "../../assets/Category/9c.png";
import a10 from "../../assets/Category/10c.png";
import Loader from "../../components/loader";
import { useImagePreloader } from "../../components/context/imgloader";

// ✅ Category Card Component
interface CategoryCardProps {
  imageSrc: string;
  altText: string;
  categoryName: string;
  onClick: (category: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  imageSrc,
  altText,
  categoryName,
  onClick,
}) => {
  return (
    <motion.div
      onClick={() => onClick(categoryName)}
      className="flex cursor-pointer flex-col items-center transition-transform duration-300 hover:scale-105"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.08 }}
    >
      <figure className="relative h-[86px] w-[86px] overflow-hidden rounded-full bg-[#F4F4F5] transition-colors duration-300 hover:bg-[#e0e0e0] shadow-sm">
        <img
          className="absolute inset-0 h-full w-full transform object-contain p-4 transition-transform duration-300 ease-in-out hover:scale-110"
          src={imageSrc}
          alt={altText}
        />
      </figure>
      <h3 className="mt-3 text-center text-base font-semibold text-slate-600">
        {categoryName}
      </h3>
    </motion.div>
  );
};

// ✅ Category List Component
interface CategoryListProps {
  categories: { imageSrc: string; altText: string; categoryName: string }[];
}

const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
  const navigate = useNavigate();

    const imagesToPreload = [
 a1,
 a2,
 a3,
 a4,
 a5,
 a6,
 a7,
 a9,
a10,
    ];
  
    const imagesLoaded = useImagePreloader(imagesToPreload);
  

  const handleCategoryClick = (category: string) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

    if (!imagesLoaded) {
      return (
        <div className="flex items-center justify-center h-screen">
          <Loader />
        </div>
      );
    }

  return (
    <section className="my-8 pt-10 md:pt-4">
      <div className="flex mb-8 justify-center">
        <motion.h1
          className="text-center text-2xl md:text-3xl font-bold relative inline-block"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Categories
          <span className="block mx-auto w-16 md:w-24 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mt-2 rounded"></span>
        </motion.h1>
      </div>

      <div className="flex flex-wrap justify-center gap-6 md:gap-9">
        {categories.map((category, index) => (
          <CategoryCard
            key={index}
            imageSrc={category.imageSrc}
            altText={category.altText}
            categoryName={category.categoryName}
            onClick={handleCategoryClick}
          />
        ))}
      </div>
    </section>
  );
};

// ✅ Categories Data
const categories = [
  { imageSrc: a9, altText: "Wall Decor", categoryName: "Wall Decor" },
  { imageSrc: a1, altText: "Lighting", categoryName: "Lighting" },
  { imageSrc: a10, altText: "Home Accents", categoryName: "Home Accents" },
  { imageSrc: a2, altText: "Floral Decor", categoryName: "Floral Decor" },
  { imageSrc: a3, altText: "Festive Decor", categoryName: "Festive Decor" },
  { imageSrc: a4, altText: "Table Decor", categoryName: "Table Decor" },
  { imageSrc: a5, altText: "Room Decor", categoryName: "Room Decor" },
  { imageSrc: a6, altText: "Outdoor Decor", categoryName: "Outdoor Decor" },
  { imageSrc: a7, altText: "Seasonal Decor", categoryName: "Seasonal Decor" },
  // { imageSrc: a8, altText: "Customized Gifts", categoryName: "Customized Gifts" },
];

// ✅ Main Page Component
const Categories: React.FC = () => {
  return (
    <div className="mx-auto max-w-6xl px-3">
      <CategoryList categories={categories} />
    </div>
  );
};

export default Categories;
