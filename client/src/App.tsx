import "./App.css";
import {
    HomePage,
    LoginPage,
    NotFoundPage,
    ProfilePage,
    RegisterPage,
    VehicleSalesPage,
    CreateVehicleListingPage,
    MaintenanceBookingPage,
    MaintenancePage,
    MaintenanceHistoryPage,
    VehicleDetailPage,
    AdminDashboard,
    AdminOverview,
    AdminVehicles,
    AdminMaintenance,
    AdminUsers,
    AdminVehicleDetail,
    AdminMaintenanceDetail,
    AdminUserDetail,
    EditVehicleListingPage,
} from "@/pages";
import { Footer, Header, SplashScreen } from "@/components";
import { Route, Routes, useLocation } from "react-router-dom";
import { AppRoutes } from "@/router";
import { PrivateRoute, RestrictedRoute } from "@/hocs";
import { useAppState, useRefresh } from "@/hooks";
import { Toaster } from "@/components/ui/toaster";

function App() {
    useRefresh();
    const { authenticate } = useAppState();
    const location = useLocation();

    return authenticate.isRefreshing ? (
        <SplashScreen />
    ) : (
        <>
            <div className="min-h-screen bg-background">
                {!location.pathname.startsWith("/admin") && <Header />}
                <main>
                    <Routes>
                        <Route
                            path={AppRoutes.notFound}
                            element={<NotFoundPage />}
                        />
                        <Route path={AppRoutes.home} element={<HomePage />} />
                        <Route
                            path={AppRoutes.maintenance}
                            element={<MaintenancePage />}
                        />
                        <Route
                            path={AppRoutes.vehicleSales}
                            element={<VehicleSalesPage />}
                        />
                        <Route
                            path={`${AppRoutes.vehicles}/:id`}
                            element={<VehicleDetailPage />}
                        />
                        {/* <Route
                            path={AppRoutes.createVehicle}
                            element={
                                <PrivateRoute
                                    redirectTo={AppRoutes.login}
                                    component={<CreateVehicleListingPage />}
                                    role="ADMIN"
                                />
                            }
                        /> */}
                        <Route
                            path={AppRoutes.login}
                            element={
                                <RestrictedRoute
                                    redirectTo={AppRoutes.profile}
                                    component={<LoginPage />}
                                />
                            }
                        />
                        <Route
                            path={AppRoutes.register}
                            element={
                                <RestrictedRoute
                                    redirectTo={AppRoutes.profile}
                                    component={<RegisterPage />}
                                />
                            }
                        />
                        <Route
                            path={AppRoutes.profile}
                            element={
                                <PrivateRoute
                                    redirectTo={AppRoutes.login}
                                    component={<ProfilePage />}
                                    role=""
                                />
                            }
                        />
                        <Route
                            path={AppRoutes.createMaintenance}
                            element={
                                <PrivateRoute
                                    redirectTo={AppRoutes.login}
                                    component={<MaintenanceBookingPage />}
                                    role=""
                                />
                            }
                        />
                        <Route
                            path={AppRoutes.maintenanceHistory}
                            element={
                                <PrivateRoute
                                    redirectTo={AppRoutes.login}
                                    component={<MaintenanceHistoryPage />}
                                    role=""
                                />
                            }
                        />

                        <Route
                            path={AppRoutes.admin}
                            element={
                                <PrivateRoute
                                    redirectTo={AppRoutes.login}
                                    component={<AdminDashboard />}
                                    role="ADMIN"
                                />
                            }
                        >
                            <Route index element={<AdminOverview />} />
                            <Route path="profile" element={<ProfilePage />} />
                            <Route
                                path="vehicles"
                                element={<AdminVehicles />}
                            />
                            <Route
                                path="vehicles/new"
                                element={<CreateVehicleListingPage />}
                            />
                            <Route
                                path="vehicles/:id"
                                element={<AdminVehicleDetail />}
                            />
                            <Route
                                path="vehicles/:id/edit"
                                element={<EditVehicleListingPage />}
                            />
                            <Route
                                path="maintenance"
                                element={<AdminMaintenance />}
                            />
                            <Route
                                path="maintenance/:id"
                                element={<AdminMaintenanceDetail />}
                            />
                            <Route path="users" element={<AdminUsers />} />
                            <Route
                                path="users/:id"
                                element={<AdminUserDetail />}
                            />
                        </Route>
                    </Routes>
                </main>
                {!location.pathname.startsWith("/admin") && <Footer />}
                <Toaster />
            </div>
        </>
    );
}

export default App;
