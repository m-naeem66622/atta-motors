export const AppRoutes = {
    root: "/",
    home: "/",
    login: "/login",
    register: "/register",
    account: "/account",
    profile: "/account/profile",
    purchases: "/account/purchases",
    maintenance: "/account/maintenance",
    createVehicle: "/account/vehicles/create",
    vehicleSales: "/vehicle-sales",
    vehicles: "/vehicles",
    vehicleDetails: "/vehicle/:id",
    services: "/services",
    about: "/about",
    contact: "/contact",
    notFound: "*",
} as const;

export type RoutesType = (typeof AppRoutes)[keyof typeof AppRoutes];
