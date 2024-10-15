import { useCustom } from "@pankod/refine-core";
import { CATEGORIES_API } from "api/baseApi";
interface Categories {
  name: string;
}

export const useGetCaterogyData = () => {
  const { data, refetch, isFetching } = useCustom<Categories>({
    url: CATEGORIES_API,
    method: "get",
    queryOptions: {
      enabled: true,
    },
  });
  const customer: Categories[] =
    data?.data?.customers.result?.map((customer) => ({
      id: customer.id,
      name: customer.name,
      code: customer.code,
    })) || [];

  const project: Project[] =
    data?.data?.projects.result?.map((project) => ({
      id: project.id,
      name: project.name,
      code: project.code,
    })) || [];
  return {
    customer,
    project,
    refetch,
    isFetching,
  };
};
