import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartReducerInitialState } from "../../types/reducer-types";
import { CartItem, ShippingInfo } from "../../types/types";

const loadCartStateFromLocalStorage = (): CartReducerInitialState | null => {
  const savedCartState = localStorage.getItem("cartState");
  return savedCartState ? JSON.parse(savedCartState) : null;
};


// Helper function to save the entire cart state to localStorage
const saveCartStateToLocalStorage = (state: CartReducerInitialState) => {
  localStorage.setItem("cartState", JSON.stringify(state));
};

// Initialize the cart state by either loading it from localStorage or using default values
const initialState: CartReducerInitialState =
  loadCartStateFromLocalStorage() ?? {
    loading: false,
    cartItems: [],
    subtotal: 0,
    shippingCharges: 0,
    discount: 0,
    total: 0,
    shippingInfo: {
      name: "",
      email: "",
      address: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
      mobNo: "",
      altMob: "",
    },
  };

export const cartReducer = createSlice({
  name: "cartReducer",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.loading = true;

      const index = state.cartItems.findIndex(
        (i) => i._id === action.payload._id
      );

      if (index !== -1) {
        // Update the existing item
        state.cartItems[index] = action.payload;
      } else {
        // Add new item
        state.cartItems.push(action.payload);
      }

      saveCartStateToLocalStorage(state); // Save updated cart state to localStorage
      state.loading = false;
    },

    removeCartItem: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.cartItems = state.cartItems.filter((i) => i._id !== action.payload);

      saveCartStateToLocalStorage(state); // Save updated cart state to localStorage
      state.loading = false;
    },

calculatePrice: (state) => {
  const subtotal = state.cartItems.reduce(
    (total, item) => total + item.mainPrice * item.quantity,
    0
  );

  state.subtotal = subtotal;

  // Shipping logic
  if (subtotal === 0) {
    state.shippingCharges = 0;
  } else if (subtotal < 499) {
    state.shippingCharges = 79;
  } else {
    state.shippingCharges = 0;
  }

  state.total = state.subtotal + state.shippingCharges - state.discount;

  saveCartStateToLocalStorage(state);
},


    discountApplied: (state, action: PayloadAction<number>) => {
      state.discount = action.payload;

      saveCartStateToLocalStorage(state); // Save updated cart state to localStorage
    },

    saveShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
      state.shippingInfo = action.payload;

      saveCartStateToLocalStorage(state); // Save updated cart state to localStorage
    },

    resetCart: () => {
      localStorage.removeItem("cartState"); // Clear cart from localStorage
      return {
        loading: false,
        cartItems: [], // Reset to an empty cart
        subtotal: 0,
        // tax: 0,
        shippingCharges: 0,
        discount: 0,
        total: 0,
        shippingInfo: {
          name: "",
          email: "",
          address: "",
          city: "",
          state: "",
          country: "",
          pinCode: "",
          mobNo: "",
          altMob: "",
        },
      };
    },
  },
});

export const {
  addToCart,
  removeCartItem,
  calculatePrice,
  discountApplied,
  saveShippingInfo,
  resetCart,
} = cartReducer.actions;

export default cartReducer.reducer;
