import React from "react";
import { IResourceComponentsProps } from "@pankod/refine-core";
import { RESOURCE_CONFIGS } from "./resourceConfigs";

export interface ResourceProps {
  name: string;
  list?: React.FC<IResourceComponentsProps<unknown, unknown>>;
  options?: {
    route?: string;
    label?: string;
  };
}

//Generates resource data from configuration
export const generateResources = (
  t: (key: string, params?: Record<string, unknown>) => string,
  resourceNames: (keyof typeof RESOURCE_CONFIGS)[]
): ResourceProps[] => {
  return resourceNames.map((resourceName) => {
    const config = RESOURCE_CONFIGS[resourceName];
    if (!config) {
      throw new Error(`Resource config not found for: ${resourceName}`);
    }

    return {
      name: t(config.translationKey),
      list: config.component as React.FunctionComponent<
        IResourceComponentsProps<unknown, unknown>
      >,
      options: {
        route: config.route,
        ...(config.label && { label: config.label }),
      },
    };
  });
};
