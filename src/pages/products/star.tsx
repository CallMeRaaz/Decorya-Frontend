// import { FaStar, FaStarHalfAlt } from "react-icons/fa";
// interface StarRatingProps {
//   rating: number;
// }
// const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
//   const fullStars = Math.floor(rating);
//   const hasHalfStar = rating % 1 !== 0;
//   const stars = Array.from({ length: 5 }, (_, index) => {
//     if (index < fullStars) {
//       return <FaStar key={index} className="h-5 w-5 text-yellow-500" />;
//     } else if (index === fullStars && hasHalfStar) {
//       return <FaStarHalfAlt key={index} className="h-5 w-5 text-yellow-500" />;
//     } else {
//       return <FaStar key={index} className="h-5 w-5 text-gray-300" />;
//     }
//   });
//   return <div className="flex gap-1">{stars}</div>;
// };
// export default StarRating;

import { FaStar, FaStarHalfAlt } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  const stars = Array.from({ length: 5 }, (_, index) => {
    if (index < fullStars) {
      return <FaStar key={index} className="h-3 w-3 text-yellow-500" />;
    } else if (index === fullStars && hasHalfStar) {
      return <FaStarHalfAlt key={index} className="h-3 w-3 text-yellow-500" />;
    } else {
      return <FaStar key={index} className="h-3 w-3 text-gray-300" />;
    }
  });

  return <div className="flex items-center gap-0.5">{stars}</div>;
};

export default StarRating;
