import type React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { MaintenanceHistory } from "@/components";
import { Helmet } from "react-helmet-async";

export const MaintenanceHistoryPage: React.FC = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate("/maintenance");
    };

    return (
        <>
            <Helmet>
                <title>Maintenance History | Atta Motors</title>
            </Helmet>
            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="container mx-auto max-w-6xl">
                    <Button
                        variant="ghost"
                        onClick={handleGoBack}
                        className="mb-6 text-black hover:text-gray-700"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Maintenance Services
                    </Button>

                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-black px-6 py-4">
                            <h1 className="text-2xl font-bold text-white">
                                Maintenance History
                            </h1>
                            <p className="text-gray-300">
                                View your past and upcoming maintenance
                                appointments
                            </p>
                        </div>

                        <div className="p-6">
                            <MaintenanceHistory />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
