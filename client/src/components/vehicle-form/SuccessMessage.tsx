import React from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessMessageProps {
    onClose: () => void;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ onClose }) => {
    return (
        <div className="py-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
                Listing Created Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
                Your vehicle listing has been created and is now visible to
                potential buyers.
            </p>
            <Button onClick={onClose}>Return to Vehicle Sales</Button>
        </div>
    );
};
