import { MessageResponse } from "../types/api-types";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { SerializedError } from "@reduxjs/toolkit";
import { NavigateFunction } from "react-router-dom";
import moment from "moment";

type ResType =
  | { data: MessageResponse }
  | { error: FetchBaseQueryError | SerializedError };

/**
 * responseToast: Shows success or error toast based on API response
 * @param res - API response
 * @param toast - showToast function from useToast()
 * @param navigate - optional navigate function
 * @param url - redirect URL if needed
 */
export const responseToast = (
  res: ResType,
  toast: (message: string, type: "success" | "error") => void,
  navigate: NavigateFunction | null = null,
  url: string = ""
) => {
  if ("data" in res) {
    toast(res.data.message, "success");
    if (navigate && url) navigate(url);
  } else {
    const error = res.error as FetchBaseQueryError;
    const messageResponse = error.data as MessageResponse;
    toast(messageResponse?.message || "Something went wrong", "error");
  }
};

/**
 * Get last 6 and 12 months
 */
export const getLastMonths = () => {
  const currentDate = moment().date(1); // set to first day of month

  const last6Months: string[] = [];
  const last12Months: string[] = [];

  for (let i = 0; i < 6; i++) {
    const monthName = currentDate.clone().subtract(i, "months").format("MMMM");
    last6Months.unshift(monthName);
  }

  for (let i = 0; i < 12; i++) {
    const monthName = currentDate.clone().subtract(i, "months").format("MMMM");
    last12Months.unshift(monthName);
  }

  return { last6Months, last12Months };
};

/**
 * Transform Cloudinary image URL for width
 */
export const transformImage = (url: string, width = 200) =>
  url.replace("upload/", `upload/dpr_auto/w_${width}/`);
