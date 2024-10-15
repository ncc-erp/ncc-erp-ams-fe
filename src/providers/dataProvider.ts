import { AxiosInstance } from "axios";
import { stringify } from "query-string";
import {
  DataProvider,
  CrudOperators,
  CrudFilters,
  CrudSorting,
} from "@pankod/refine-core";
import { axiosInstance } from "./axios";

const mapOperator = (operator: CrudOperators): string => {
  switch (operator) {
    case "ne":
    case "gte":
    case "lte":
      return `_${operator}`;
    case "contains":
      return "_like";
    case "eq":
    default:
      return "";
  }
};

const generateSort = (sort?: CrudSorting) => {
  if (sort && sort.length > 0) {
    const _sort: string[] = [];
    const _order: string[] = [];

    // eslint-disable-next-line array-callback-return
    sort.map((item) => {
      _sort.push(item.field);
      _order.push(item.order);
    });

    return {
      _sort,
      _order,
    };
  }

  return;
};

const generateFilter = (filters?: CrudFilters) => {
  const queryFilters: { [key: string]: string | string[] } = {};
  if (filters) {
    // eslint-disable-next-line array-callback-return
    filters.map((filter) => {
      if (filter.operator !== "or") {
        const { field, operator, value } = filter;

        if (field === "q") {
          queryFilters[field] = value;
          // eslint-disable-next-line array-callback-return
          return;
        }

        const mappedOperator = mapOperator(operator);
        queryFilters[`${field}${mappedOperator}`] = value;
      }
    });
  }

  return queryFilters;
};

const JsonServer = (
  apiUrl: string,
  httpClient: AxiosInstance = axiosInstance
): {
  post: (item: { url: string; payload: any; config?: any }) => Promise<any>;
} & DataProvider => ({
  getList: async ({ resource, pagination, filters, sort }) => {
    const url = `${apiUrl}/${resource}`;

    // pagination
    const current = pagination?.current || 1;
    const pageSize = pagination?.pageSize || 10;

    const queryFilters = generateFilter(filters);

    const query: {
      offset: number;
      limit: number;
      sort?: string;
      order?: string;
    } = {
      offset: (current - 1) * pageSize,
      limit: pageSize,
    };

    const generatedSort = generateSort(sort);
    if (generatedSort) {
      const { _sort, _order } = generatedSort;
      query.sort = _sort.join(",");
      query.order = _order.join(",");
    }

    const { data } = await httpClient.get(
      `${url}?${stringify(query)}&${stringify(queryFilters, { arrayFormat: "index" })}`
    );
    // const total = +headers["x-total-count"];

    return {
      data: data.rows || data?.results,
      total: data.total,
    };
  },

  getMany: async ({ resource, ids }) => {
    const { data } = await httpClient.get(
      `${apiUrl}/${resource}?${stringify({ id: ids })}`
    );

    return {
      data,
    };
  },

  create: async ({ resource, variables }) => {
    const url = `${apiUrl}/${resource}`;

    const { data } = await httpClient.post(url, variables);

    return {
      data,
    };
  },

  createMany: async ({ resource, variables }) => {
    const response = await Promise.all(
      variables.map(async (param) => {
        const { data } = await httpClient.post(`${apiUrl}/${resource}`, param);
        return data;
      })
    );

    return { data: response };
  },

  update: async ({ resource, id, variables }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { data } = await httpClient.patch(url, variables);

    return {
      data,
    };
  },

  updateMany: async ({ resource, ids, variables }) => {
    const response = await Promise.all(
      ids.map(async (id, index) => {
        const { data } = await httpClient.patch(
          `${apiUrl}/${resource}/${id}`,
          index,
          variables
        );
        return data;
      })
    );

    return { data: response };
  },

  getOne: async ({ resource, id }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { data } = await httpClient.get(url);

    return {
      data,
    };
  },

  deleteOne: async ({ resource, id }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { data } = await httpClient.delete(url);

    return {
      data,
    };
  },

  deleteMany: async ({ resource, ids }) => {
    const response = await Promise.all(
      ids.map(async (id) => {
        const { data } = await httpClient.delete(`${apiUrl}/${resource}/${id}`);
        return data;
      })
    );
    return { data: response };
  },

  getApiUrl: () => {
    return apiUrl;
  },

  custom: async ({ url, method, filters, sort, payload, query, headers }) => {
    let requestUrl = `${apiUrl}/${url}?`;

    if (sort) {
      const generatedSort = generateSort(sort);
      if (generatedSort) {
        const { _sort, _order } = generatedSort;
        const sortQuery = {
          _sort: _sort.join(","),
          _order: _order.join(","),
        };
        requestUrl = `${requestUrl}&${stringify(sortQuery)}`;
      }
    }

    if (filters) {
      const filterQuery = generateFilter(filters);
      requestUrl = `${requestUrl}&${stringify(filterQuery)}`;
    }

    if (query) {
      requestUrl = `${requestUrl}&${stringify(query)}`;
    }

    if (headers) {
      httpClient.defaults.headers = {
        ...httpClient.defaults.headers,
        ...headers,
      };
    }

    let axiosResponse;
    switch (method) {
      case "put":
      case "post":
      case "patch":
        axiosResponse = await httpClient[method](requestUrl, payload);
        break;
      case "delete":
        axiosResponse = await httpClient.delete(requestUrl);
        break;
      default:
        axiosResponse = await httpClient.get(requestUrl);
        break;
    }

    const { data } = axiosResponse;

    return Promise.resolve({ data });
  },
  post: async ({ url, payload, config }) => {
    const rqUrl = `${apiUrl}/${url}`;

    const { data } = await httpClient.post(rqUrl, payload, config);

    return {
      data,
    };
  },
});

const apiUrl = "";
const dataProvider = JsonServer(apiUrl, axiosInstance);
export default dataProvider;
