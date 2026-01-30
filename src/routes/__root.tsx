import { createRootRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import LoadingScreen from "../components/LoadingScreen";
import { AuthProvider } from "../contexts/AuthContext";

function RootComponent() {
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(true);

  const handleLoadingComplete = () => {
    setShowLoading(false);
    // Pequeno delay para garantir que o LoadingScreen foi removido antes de navegar
    setTimeout(() => {
      navigate({ to: "/signin" });
    }, 50);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen">
        {showLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
        <Outlet />
      </div>
    </AuthProvider>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
