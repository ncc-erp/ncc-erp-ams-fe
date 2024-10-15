import { useCustom } from "@pankod/refine-core";
import { CATEGORIES_API } from "api/baseApi";
interface Categories {
  id: number;
  name: string;
}
interface CategoriesResponse {
    total: number;
    rows: Categories[];
  }
export const useGetCaterogyData = () => {
  const { data, refetch, isFetching } = useCustom<CategoriesResponse>({
    url: CATEGORIES_API,
    method: "get",
    queryOptions: {
      enabled: true,
    },
  });
  const dataCategory: Categories[] =
  data?.data?.rows?.map((category) => ({
    id: category.id,
    name: category.name,
  })) || [];
  return {
    dataCategory,
    refetch,
    isFetching,
  };
};
