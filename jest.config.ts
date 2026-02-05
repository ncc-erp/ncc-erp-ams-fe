import { pathsToModuleNameMapper, JestConfigWithTsJest } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";

const jestConfig: JestConfigWithTsJest = {
  preset: "ts-jest",
  moduleDirectories: ["node_modules", "<rootDir>"],
  modulePaths: ["<rootDir>/src"],
  moduleNameMapper: {
    "^untils/(.*)$": "<rootDir>/src/untils/$1",
    "^constants/(.*)$": "<rootDir>/src/constants/$1",
    "^components/(.*)$": "<rootDir>/src/components/$1",
    "^pages/(.*)$": "<rootDir>/src/pages/$1",
    "^hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^providers/(.*)$": "<rootDir>/src/providers/$1",
    "^interfaces/(.*)$": "<rootDir>/src/interfaces/$1",
    "^context/(.*)$": "<rootDir>/src/context/$1",
    "^api/(.*)$": "<rootDir>/src/api/$1",
    "^styles/(.*)$": "<rootDir>/src/styles/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  testMatch: [
    "**/__tests__/**/*.(test|spec).(ts|tsx|js|jsx)",
    "**/*.(test|spec).(ts|tsx|js|jsx)",
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "src/__tests__/constants/",
    "src/__tests__/utils/(?!.*\\.(test|spec)\\.(ts|tsx|js|jsx)$)",
  ],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{ts,tsx}"],
  coverageDirectory: "coverage",
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    browsers: ["chrome", "firefox", "safari"],
  },
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/coverage",
    "package.json",
    "package-lock.json",
    "reportWebVitals.ts",
    "setupTests.ts",
    "index.tsx",
    "src/(hooks|constants|styles|context|types|pages|components|interfaces|providers|api|ultils)/",
    "src/theme.ts",
    "src/App.tsx",
    "src/i18n.ts",
    "src/mock.tsx",
    "src/setupProxy.ts",
    "src/react-app-env.d.ts",
    "src/AccessControl.ts",
    "src/__tests__/",
    "src/__tests__/constants/data-test-id.ts",
  ],
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
    "^.+\\.(css|less|scss|sass)$": "jest-transform-css",
  },
  transformIgnorePatterns: ["/node_modules/(?!@pankod/refine-.*)"],
};
export default jestConfig;
