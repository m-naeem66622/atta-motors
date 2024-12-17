"use client";

import { useState, useEffect, FC } from "react";
import { Button } from "@/components";
import { Car, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface NotFoundPageProps {}

export const NotFoundPage: FC<NotFoundPageProps> = () => {
  const [carPosition, setCarPosition] = useState<number>(0);

  useEffect(() => {
    const interval: NodeJS.Timeout = setInterval(() => {
      setCarPosition((prev: number) => (prev + 1) % 101);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-8">
          Oops! Looks like this page took a wrong turn.
        </p>

        <div className="relative h-16 bg-gray-300 rounded mb-8">
          <div
            className="absolute bottom-0 left-0 transition-all duration-100 ease-linear"
            style={{ transform: `translate(${carPosition}%, -20px)` }}
          >
            <Car className="w-16 h-16 text-primary" />
          </div>
          <div className="absolute top-1/2 left-0 w-full border-t-2 border-dashed border-gray-400" />
        </div>

        <p className="text-lg text-gray-600 mb-8">
          Don't worry, our expert mechanics are on the case. Let's get you back
          on the right road!
        </p>

        <Link to="/">
          <Button size="lg" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
