import { Link } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CartItem } from "../types/types";

interface CartItemsProps {
  cartItem: CartItem;
  incrementHandler: (cartItem: CartItem) => void;
  decrementHandler: (cartItem: CartItem) => void;
  removeHandler: (productId: string) => void;
}


const CartItems = ({
  cartItem,
  incrementHandler,
  decrementHandler,
  removeHandler,
}: CartItemsProps) => {
  const redirect = `/product/${cartItem._id}`;

  return (
    <div className="rounded-lg border p-4 shadow-sm md:p-6">
      <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
        <div className="flex justify-between">
          <Link to={redirect} className="shrink-0 md:order-1">
            <img
              className="rounded-md w-12 h-12 md:ml-10"
              src={`${import.meta.env.VITE_SERVER}/${cartItem.photo}`}
              alt={cartItem.name}
            />
          </Link>
          <div className="pt-1 pl-2 w-60">
            <Link
              to={redirect}
              className="text-base font-medium flex flex-col text-gray-700 hover:underline hover:text-yellow-700"
            >
              <div>{cartItem.name}</div>
            </Link>
          </div>
        </div>

        {/* Quantity controls */}
        <div className="flex items-center justify-between md:order-3 md:justify-end">
          <div className="flex items-center">
            <button
              type="button"
              className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100"
              onClick={() => decrementHandler(cartItem)}
            >
              <svg
                className="h-2.5 w-2.5 text-gray-900"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 2"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M1 1h16"
                />
              </svg>
            </button>
            <input
              type="text"
              value={cartItem.quantity}
              className="w-10 text-center outline-none text-sm font-medium text-gray-900"
              readOnly
            />
            <button
              type="button"
              className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100"
              onClick={() => incrementHandler(cartItem)}
            >
              <svg
                className="h-2.5 w-2.5 text-gray-900"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 18"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 1v16M1 9h16"
                />
              </svg>
            </button>
            <RiDeleteBin6Line
              onClick={() => removeHandler(cartItem._id)}
              className="text-xl text-gray-800 hover:text-red-600 ml-20 cursor-pointer"
            />
          </div>
          <div className="text-end md:order-4 md:w-32">
            <p className="text-base font-medium">
              ₹ {(cartItem.mainPrice * cartItem.quantity).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
