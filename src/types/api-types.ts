import {
  Bar,
  CartItem,
  CouponType,
  Line,
  Order,
  Pie,
  Product,
  Review,
  ShippingInfo,
  Stats,
  User,
} from "./types";

export type CustomError = {
  status: number;
  data: {
    message: string;
    success: boolean;
  };
};

export type CategoryType = {
  name: string;
  subCategories: string[];
};

export type CategoriesResponse = {
  categories: CategoryType[] | null; // could be null or undefined
};


export type MessageResponse = {
  success: boolean;
  message: string;
};

export type AllUsersResponse = {
  success: boolean;
  users: User[];
};

export type UserResponse = {
  success: boolean;
  user: User;
};

export type UpdateUserRequest = {
  avatar:string;
  id: string; // User ID
  name?: string; // Optional fields to update
  email?: string; // Optional fields to update
  role?: string; // Optional fields to update
};

export type AllProductsResponse = {
  success: boolean;
  products: Product[];
};

export type AllReviewsResponse = {
  map(
    arg0: (review: {
      id: import("react").Key | null | undefined;
      title:
        | string
        | number
        | boolean
        | import("react").ReactElement<
            any,
            string | import("react").JSXElementConstructor<any>
          >
        | Iterable<import("react").ReactNode>
        | import("react").ReactPortal
        | null
        | undefined;
      content:
        | string
        | number
        | boolean
        | import("react").ReactElement<
            any,
            string | import("react").JSXElementConstructor<any>
          >
        | Iterable<import("react").ReactNode>
        | import("react").ReactPortal
        | null
        | undefined;
      rating:
        | string
        | number
        | boolean
        | import("react").ReactElement<
            any,
            string | import("react").JSXElementConstructor<any>
          >
        | Iterable<import("react").ReactNode>
        | import("react").ReactPortal
        | null
        | undefined;
    }) => import("react/jsx-runtime").JSX.Element
  ): import("react").ReactNode;
  length: number;
  success: boolean;
  reviews: Review[];
};

// export type CategoriesResponse = {
//   success: boolean;
//   categories: string[];
// };

export type SearchProductsResponse = AllProductsResponse & {
  totalPage: number;
};

export type SearchProductsRequest = {
  mainPrice: number;
  page: number;
  category: string;
  subCategory: string;
  search: string;
  sort: string;
};

export type ProductResponse = {
  productoriginalPrice(productoriginalPrice: any): unknown;
  success: boolean;
  product: Product;
};

export type AllOrdersResponse = {
  success: boolean;
  orders: Order[];
};

export type OrderDetailsResponse = {
  success: boolean;
  order: Order;
};

export type StatsResponse = {
  success: boolean;
  stats: Stats;
};

export type PieResponse = {
  success: boolean;
  charts: Pie;
};

export type BarResponse = {
  success: boolean;
  charts: Bar;
};

export type LineResponse = {
  success: boolean;
  charts: Line;
};

export type NewReviewRequest = {
  name: string;
  avatar: string;
  city: string;
  rating: number;
  comment: string;
  userId?: string;
  productId: string;
};

export type DeleteReviewRequest = {
  userId?: string;
  reviewId: string;
};

export type NewProductRequest = {
  id: string;
  formData: FormData;
};

export type UpdateProductRequest = {
  userId: string;
  productId: string;
  formData: FormData;
};

export type DeleteProductRequest = {
  userId: string;
  productId: string;
};

export type NewOrderRequest = {
  shippingInfo: ShippingInfo;
  orderItems: CartItem[];
  subtotal: number;
  // tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  user: string;
};

export type UpdateOrderRequest = {
  userId: string;
  orderId: string;
};
export type CancelOrderRequest = {
  userId: string;
  orderId: string;
};

// ✅ Type for rating breakdown (used in filter review feature)
export type FilterReviewResponse = {
  success: boolean;
  ratings: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
};

export type DeleteUserRequest = {
  userId: string;
  adminUserId: string;
};

export type AllDiscountResponse = {
  success: boolean;
  coupons: CouponType[];
};

export type SingleDiscountResponse = {
  success: boolean;
  coupon: CouponType;
};
