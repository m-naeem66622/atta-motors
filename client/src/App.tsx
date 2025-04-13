import "./App.css";
import {
    HomePage,
    LoginPage,
    NotFoundPage,
    ProfilePage,
    RegisterPage,
    VehicleSalesPage,
    CreateVehicleListingPage,
} from "@/pages";
import { Footer, Header, SplashScreen } from "@/components";
import { Route, Routes } from "react-router-dom";
import { AppRoutes } from "@/router";
import { PrivateRoute, RestrictedRoute } from "@/hocs";
import { useAppState, useRefresh } from "@/hooks";
import { Toaster } from "@/components/ui/toaster";

function App() {
    useRefresh();
    const { authenticate } = useAppState();

    return authenticate.isRefreshing ? (
        <SplashScreen />
    ) : (
        <>
            <div className="min-h-screen bg-background">
                <Header />
                <main>
                    <Routes>
                        <Route
                            path={AppRoutes.notFound}
                            element={<NotFoundPage />}
                        />
                        <Route path={AppRoutes.home} element={<HomePage />} />
                        <Route
                            path={AppRoutes.vehicleSales}
                            element={<VehicleSalesPage />}
                        />
                        <Route
                            path={AppRoutes.createVehicle}
                            element={
                                <PrivateRoute
                                    redirectTo={AppRoutes.login}
                                    component={<CreateVehicleListingPage />}
                                    role=""
                                />
                            }
                        />
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
                    </Routes>
                </main>
                <Footer />
                <Toaster />
            </div>
        </>
    );
}

export default App;
