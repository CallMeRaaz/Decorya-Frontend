export type User = {
  avatar:string;
  name: string;
  email: string;
  role: string;
  _id: string;
};

export type Product = {
  updatedAt: any;
  createdAt: string;
  onSale: boolean;
  name: string;
  mainPrice: number;
  stock: number;
  category: string;
  subCategory: string;
  ratings: number;
  salePrice: number;
  numOfReviews: number;
  description: string;
  photo: string;
  _id: string;
};

export type CategoryType = {
  name: string;
  subCategories: string[];
};

export type CategoriesResponse = {
  categories: CategoryType[] | null; // could be null or undefined
};


export type Review = {
  rating: number;
  comment: string;
  product: string;
  user: {
    name: string;
    avatar: string;
    _id: string;
  };
  _id: string;
};

export type ShippingInfo = {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  mobNo: string;
  altMob: string;
};

export type CartItem = {
  _id: string;
  photo: string;
  name: string;
  mainPrice: number;
  stock: number;
  quantity: number;
  category:string;
};

export type OrderItem = Omit<CartItem, "stock"> & { _id: string };

export type Order = {
  updatedAt: string;
  amount: any;
  modeOfPayment: string;
  customerName: any;
  orderItems: OrderItem[];
  shippingInfo: ShippingInfo;
  subtotal: number;
  shippingCharges: number;
  discount: number;
  total: number;
  status: string;
  trackingId: string;
  deliveryDate: string;
  message:string;
  user: {
    name: string;
    _id: string;
  };
  _id: string;
};

export interface UpdateOrderRequest {
  userId: string;
  orderId: string;
  trackingId?: string;     // optional
  deliveryDate?: string;   // optional
}


type CountAndChange = {
  revenue: number;
  product: number;
  user: number;
  order: number;
};

type LatestTransaction = {
  _id: string;
  amount: number;
  discount: number;
  quantity: number;
  status: string;
};

export type Stats = {
  categoryCount: Record<string, number>[];
  changePercent: CountAndChange;
  count: CountAndChange;
  chart: {
    order: number[];
    revenue: number[];
  };
  userRatio: {
    male: number;
    female: number;
  };
  latestTransaction: LatestTransaction[];
};

type OrderFullfillment = {
  processing: number;
  shipped: number;
  delivered: number;
};

type RevenueDistribution = {
  netMargin: number;
  discount: number;
  productionCost: number;
  burnt: number;
  marketingCost: number;
};

type UsersAgeGroup = {
  teen: number;
  adult: number;
  old: number;
};

export type Pie = {
  orderFullfillment: OrderFullfillment;
  productCategories: Record<string, number>[];
  stockAvailablity: {
    inStock: number;
    outOfStock: number;
  };
  revenueDistribution: RevenueDistribution;
  usersAgeGroup: UsersAgeGroup;
  adminCustomer: {
    admin: number;
    customer: number;
  };
};

export type Bar = {
  users: number[];
  products: number[];
  orders: number[];
};
export type Line = {
  users: number[];
  products: number[];
  discount: number[];
  revenue: number[];
};

export type CouponType = {
  code: string;
  amount: number;
  _id: string;
};
