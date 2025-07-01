import { useSearchParams } from "react-router-dom";
import { useMemo, useCallback } from "react";
import { SEARCH_PARAMS_CONFIG } from "constants/searchParams";
import { IAppSearchParams } from "types/searchParams";

export const useAppSearchParams = <K extends keyof IAppSearchParams>(
  key: K
) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const config = SEARCH_PARAMS_CONFIG[key];

  const params = useMemo(() => {
    const result: any = {};

    Object.entries(config).forEach(([paramKey, paramConfig]) => {
      const rawValue = searchParams.get(paramConfig.key);

      if (rawValue === null) {
        result[paramKey] = paramConfig.defaultValue;
        return;
      }

      switch (paramConfig.type) {
        case "json":
          try {
            result[paramKey] = JSON.parse(rawValue);
          } catch {
            result[paramKey] = paramConfig.defaultValue;
          }
          break;
        case "number":
          const numValue = Number(rawValue);
          result[paramKey] = isNaN(numValue)
            ? paramConfig.defaultValue
            : numValue;
          break;
        case "boolean":
          result[paramKey] = rawValue === "true";
          break;
        case "string":
        default:
          result[paramKey] = rawValue;
          break;
      }
    });

    return result as IAppSearchParams[K];
  }, [searchParams, config]);

  const setParams = useCallback(
    (newParams: Partial<IAppSearchParams[K]>) => {
      const newSearchParams = new URLSearchParams(searchParams);

      Object.entries(newParams).forEach(([paramKey, value]) => {
        const paramConfig = config[paramKey];
        if (!paramConfig) return;

        if (value === null || value === undefined) {
          newSearchParams.delete(paramConfig.key);
        } else {
          const stringValue =
            paramConfig.type === "json" ? JSON.stringify(value) : String(value);
          newSearchParams.set(paramConfig.key, stringValue);
        }
      });

      setSearchParams(newSearchParams);
    },
    [searchParams, setSearchParams, config]
  );

  const clearParams = useCallback(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    Object.values(config).forEach((paramConfig) => {
      newSearchParams.delete(paramConfig.key);
    });
    setSearchParams(newSearchParams);
  }, [searchParams, setSearchParams, config]);

  const clearParam = useCallback(
    (paramKey: keyof IAppSearchParams[K]) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete(paramKey as string);
      setSearchParams(newSearchParams);
    },
    [searchParams, setSearchParams]
  );

  return {
    params,
    setParams,
    clearParams,
    clearParam,
  };
};
