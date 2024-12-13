import "./App.css";
import { HomePage, LoginPage, NotFoundPage, RegisterPage } from "@/pages";
import { Footer, Header, SplashScreen } from "@/components";
import { Route, Routes } from "react-router-dom";
import { AppRoutes } from "@/router";
import { RestrictedRoute } from "@/hocs";
import { useAppState, useRefresh } from "@/hooks";

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
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/" element={<HomePage />} />
            <Route
              path="/login"
              element={
                <RestrictedRoute
                  redirectTo={AppRoutes.profile}
                  component={<LoginPage />}
                />
              }
            />
            <Route
              path="/register"
              element={
                <RestrictedRoute
                  redirectTo={AppRoutes.profile}
                  component={<RegisterPage />}
                />
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
