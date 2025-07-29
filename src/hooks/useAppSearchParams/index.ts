import { useSearchParams } from "react-router-dom";
import { useMemo, useCallback } from "react";
import {
  SEARCH_PARAMS_CONFIG,
  getParamConfig,
} from "hooks/useAppSearchParams/config";
import {
  SearchParamKey,
  SearchParamValue,
} from "hooks/useAppSearchParams/types";

export const useAppSearchParams = <K extends SearchParamKey>(key: K) => {
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
          // Handle string values that might be JSON
          if (
            rawValue.includes('"') &&
            rawValue.startsWith('"') &&
            rawValue.endsWith('"')
          ) {
            try {
              result[paramKey] = JSON.parse(rawValue);
            } catch {
              result[paramKey] = rawValue;
            }
          } else {
            result[paramKey] = rawValue;
          }
          break;
      }
    });

    return result as SearchParamValue<K>;
  }, [searchParams, config]);
  const setParams = useCallback(
    (newParams: Partial<SearchParamValue<K>>) => {
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

  const clearAllParams = useCallback(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    Object.values(config).forEach((paramConfig) => {
      newSearchParams.delete(paramConfig.key);
    });
    setSearchParams(newSearchParams);
  }, [searchParams, setSearchParams, config]);

  const clearParam = useCallback(
    (paramKey: keyof SearchParamValue<K> | (keyof SearchParamValue<K>)[]) => {
      const newSearchParams = new URLSearchParams(searchParams);

      // Handle both single parameter and array of parameters
      const paramKeys = Array.isArray(paramKey) ? paramKey : [paramKey];

      paramKeys.forEach((paramKeyItem) => {
        const paramConfig = getParamConfig(key, paramKeyItem);
        if (paramConfig) {
          newSearchParams.delete(paramConfig.key);
        }
      });

      setSearchParams(newSearchParams);
    },
    [searchParams, setSearchParams, key]
  );

  const setParam = useCallback(
    (paramKey: keyof SearchParamValue<K>, value: any) => {
      const paramConfig = getParamConfig(key, paramKey);
      if (!paramConfig) return;

      const newSearchParams = new URLSearchParams(searchParams);

      if (value === null || value === undefined) {
        newSearchParams.delete(paramConfig.key);
      } else {
        const stringValue =
          paramConfig.type === "json" ? JSON.stringify(value) : String(value);
        newSearchParams.set(paramConfig.key, stringValue);
      }

      setSearchParams(newSearchParams);
    },
    [searchParams, setSearchParams, key]
  );

  return {
    params,
    setParams,
    setParam,
    clearAllParams,
    clearParam,
  };
};
