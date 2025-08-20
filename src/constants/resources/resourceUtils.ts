import { RESOURCE_CONFIGS } from "./resourceConfigs";

// Function to generate resources from configuration
export const generateResources = (t: any): any[] => {
  return RESOURCE_CONFIGS.map((config) => ({
    name: t(config.translationKey),
    list: config.component,
    options: {
      route: config.route,
      ...(config.label && { label: config.label }),
    },
  }));
};
