import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimestamp = (createdAt: Date): string => {
  const currentDate = new Date();
  const createdDate = new Date(createdAt);
  const timeDifference = currentDate.getTime() - createdDate.getTime();

  // Define time units in milliseconds
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;

  if (timeDifference < minute) {
    return `${Math.floor(timeDifference / 1000)} seconds ago`;
  } else if (timeDifference < hour) {
    return `${Math.floor(timeDifference / minute)} minutes ago`;
  } else if (timeDifference < day) {
    return `${Math.floor(timeDifference / hour)} hours ago`;
  } else if (timeDifference < month) {
    return `${Math.floor(timeDifference / day)} days ago`;
  } else if (timeDifference < year) {
    return `${Math.floor(timeDifference / month)} months ago`;
  } else {
    return `${Math.floor(timeDifference / year)} years ago`;
  }
};

export const abbreviateNumber = (num: number): string => {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + "B";
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + "M";
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + "K";
  } else {
    return num.toString();
  }
};
