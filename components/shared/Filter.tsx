"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { createUrlQuery } from "@/lib/utils";

interface Props {
  filters: {
    name: string;
    value: string;
  }[];
  otherClasses?: string;
  containerClasses?: string;
}

const Filters = ({ filters, otherClasses, containerClasses }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlParam = searchParams.get("filter") || "";

  const handleFiltering = (value: string) => {
    const newUrl = createUrlQuery({
      params: searchParams.toString(),
      key: "filter",
      value: value.toString(),
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className={`relative ${containerClasses}`}>
      <Select onValueChange={handleFiltering} defaultValue={urlParam}>
        <SelectTrigger
          className={`background-light800_dark300 text-dark500_light700 body-regular light-border border px-5 py-2.5 ${otherClasses}`}
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a Filter" />
          </div>
        </SelectTrigger>
        <SelectContent className="background-light900_dark200 text-dark300_light900">
          <SelectGroup>
            {filters.map((filter) => (
              <SelectItem
                className="hover:bg-light-800"
                key={filter.value}
                value={filter.value}
              >
                {filter.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filters;
