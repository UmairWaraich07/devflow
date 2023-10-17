"use client";
import { HomePageFilters } from "@/constants/filters";
import React from "react";
import { Button } from "../ui/button";

const HomeFilters = () => {
  const active = "newest";
  return (
    <div className="mt-10 hidden w-full flex-wrap items-center gap-3 sm:flex">
      {HomePageFilters.map((filter) => (
        <Button
          key={filter.value}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-sm dark:shadow-none
          ${
            active === filter.value
              ? "bg-primary-100 text-primary-500"
              : "bg-light-800 text-light-500  dark:bg-dark-300 "
          }`}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
