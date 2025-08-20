import { RESOURCE_CONFIGS, ResourceConfig } from "./resourceConfigs";

// Function to generate resources from configuration
export const generateResources = (
  t: (key: string, params?: Record<string, any>) => string
): {
  name: string;
  list: any;
  options: {
    route: string;
    label?: string;
  };
}[] => {
  return RESOURCE_CONFIGS.map((config: ResourceConfig) => ({
    name: t(config.translationKey),
    list: config.component,
    options: {
      route: config.route,
      ...(config.label && { label: config.label }),
    },
  }));
};
