export const AppRoutes = {
    root: "/",
    home: "/",
    login: "/login",
    register: "/register",
    account: "/account",
    profile: "/account/profile",
    createVehicle: "/account/vehicles/create",
    vehicleSales: "/vehicle-sales",
    vehicles: "/vehicles",
    vehicleDetails: "/vehicle/:id",
    notFound: "*",
} as const;

export type RoutesType = (typeof AppRoutes)[keyof typeof AppRoutes];
