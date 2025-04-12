export const AppRoutes = {
    root: "/",
    login: "/login",
    register: "/register",
    account: "/account",
    profile: "/account/profile",
    home: "/",
    notFound: "*",
} as const;

export type RoutesType = (typeof AppRoutes)[keyof typeof AppRoutes];
