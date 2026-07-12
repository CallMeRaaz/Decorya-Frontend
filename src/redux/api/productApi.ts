import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AllProductsResponse,
  AllReviewsResponse,
  CategoriesResponse,
  DeleteProductRequest,
  DeleteReviewRequest,
  MessageResponse,
  NewProductRequest,
  NewReviewRequest,
  ProductResponse,
  SearchProductsRequest,
  SearchProductsResponse,
  UpdateProductRequest,
} from "../../types/api-types";

export const productAPI = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`,
  }),
  tagTypes: ["product"],
  endpoints: (builder) => ({

    // ✅ Latest Products
    latestProducts: builder.query<AllProductsResponse, string>({
      query: () => "latest",
      providesTags: ["product"],
    }),

    // ✅ Featured Products
    featuredProducts: builder.query<AllProductsResponse, string>({
      query: () => "featured",
      providesTags: ["product"],
    }),

    // ✅ All Products (Admin)
    allProducts: builder.query<AllProductsResponse, string>({
      query: (id) => `admin-products?id=${id}`,
      providesTags: ["product"],
    }),

    // ✅ Categories
    categories: builder.query<CategoriesResponse, string>({
      query: () => `categories`,
      providesTags: ["product"],
    }),

// ✅ Search Products with category & subCategory
searchProducts: builder.query<SearchProductsResponse, SearchProductsRequest>({
  query: ({ mainPrice, search, sort, category, subCategory, page }) => {
    let base = `all?search=${search}&page=${page}`;
    if (mainPrice) base += `&mainPrice=${mainPrice}`;
    if (sort) base += `&sort=${sort}`;
    if (category) base += `&category=${category}`;
    if (subCategory) base += `&subCategory=${subCategory}`; // <-- added
    return base;
  },
  providesTags: ["product"],
}),


    // ✅ Product Details
    productDetails: builder.query<ProductResponse, string>({
      query: (id) => id,
      providesTags: ["product"],
    }),

    // ✅ All Reviews
    allReviewsOfProducts: builder.query<AllReviewsResponse, string>({
      query: (productId) => `reviews/${productId}`,
      providesTags: ["product"],
    }),

    // ✅ Rating Filter
    ratingFilterOfProduct: builder.query<
      {
        success: boolean;
        message: string;
        ratingCount: Record<number, number>;
        numOfReviews: number;
        ratings: number;
      },
      string
    >({
      query: (productId) => `ratings/${productId}`,
      providesTags: ["product"],
    }),

    // ✅ New Review
    newReview: builder.mutation<MessageResponse, NewReviewRequest>({
      query: ({ userId, name,avatar,city, rating, comment, productId }) => ({
        url: `review/new/${productId}?id=${userId}`,
        method: "POST",
        body: { user: userId,avatar,city, name, rating, comment },
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["product"],
    }),

    // ✅ Delete Review
    deleteReview: builder.mutation<MessageResponse, DeleteReviewRequest>({
      query: ({ reviewId, userId }) => ({
        url: `/review/${reviewId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["product"],
    }),

    // ✅ New Product
    newProduct: builder.mutation<MessageResponse, NewProductRequest>({
      query: ({ formData, id }) => ({
        url: `new?id=${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),

    // ✅ Update Product
    updateProduct: builder.mutation<MessageResponse, UpdateProductRequest>({
      query: ({ formData, userId, productId }) => ({
        url: `${productId}?id=${userId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),

    // ✅ Delete Product
    deleteProduct: builder.mutation<MessageResponse, DeleteProductRequest>({
      query: ({ userId, productId }) => ({
        url: `${productId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["product"],
    }),
  }),
});

export const {
  useLatestProductsQuery,
  useFeaturedProductsQuery, // ✅ <-- Added
  useAllProductsQuery,
  useAllReviewsOfProductsQuery,
  useCategoriesQuery,
  useSearchProductsQuery,
  useNewReviewMutation,
  useRatingFilterOfProductQuery,
  useDeleteReviewMutation,
  useNewProductMutation,
  useProductDetailsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productAPI;
