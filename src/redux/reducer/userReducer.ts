import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookie from "js-cookie";

interface User {
  _id: string;
  name: string;
  avatar: string;
  email: string;
  isVerified: boolean;
  role: string;
}

interface UserState {
  user: Partial<User> | null;
}

// Utility to safely load user from localStorage
const loadUserFromLocalStorage = (): Partial<User> | null => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
    return null;
  }
};

const saveUser = (user: Partial<User>) => {
  try {
    localStorage.setItem("user", JSON.stringify(user));
    Cookie.set("user", JSON.stringify(user), { expires: 7 });
  } catch (error) {
    console.error("Failed to save user", error);
  }
};

const clearStoredUser = () => {
  try {
    localStorage.removeItem("user");
    Cookie.remove("user");
  } catch (error) {
    console.error("Failed to clear user", error);
  }
};

const initialState: UserState = {
  user: loadUserFromLocalStorage(),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      const { _id, name, avatar, email, isVerified, role } = action.payload;
      state.user = { _id, name, avatar, email, isVerified, role };
      saveUser(state.user);
    },
    clearUser(state) {
      state.user = null;
      clearStoredUser();
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
