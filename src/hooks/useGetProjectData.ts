import { useCustom } from "@pankod/refine-core";
import { CLIENT_HARDWARE_CREATE } from "api/baseApi";
interface Customer {
  id: number;
  name: string;
  code: string;
}

interface Project {
  id: number;
  name: string;
  code: string;
}
interface ApiResponse {
  customers: {
    result: Array<{
      id: number;
      name: string;
      code: string;
    }>;
  };
  projects: {
    result: Array<{
      id: number;
      name: string;
      code: string;
    }>;
  };
}
export const useGetProjectData = () => {
  const { data, refetch, isFetching } = useCustom<ApiResponse>({
    url: CLIENT_HARDWARE_CREATE,
    method: "get",
    queryOptions: {
      enabled: true,
    },
  });
  const customer: Customer[] =
    data?.data?.customers?.result?.map((customer) => ({
      id: customer.id,
      name: customer.name,
      code: customer.code,
    })) || [];

  const project: Project[] =
    data?.data?.projects?.result?.map((project) => ({
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
