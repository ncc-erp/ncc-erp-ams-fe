import { EPermissions } from "constants/permissions";

export const useTranslate = jest.fn(() => (key: string) => key);

export const useNavigation = jest.fn(() => ({
  push: jest.fn(),
}));

export const usePermissions = jest.fn(() => ({
  data: {
    admin: EPermissions.ADMIN,
    branchadmin: EPermissions.BRANCHADMIN,
  },
}));

export const useRouterContext = jest.fn(() => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));
