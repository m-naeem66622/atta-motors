"use client";

import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Car,
    Wrench,
    Users,
    // Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";

// Admin navigation items
const navItems = [
    {
        title: "Dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
        path: "/admin",
        exact: true,
    },
    {
        title: "Vehicles",
        icon: <Car className="h-5 w-5" />,
        path: "/admin/vehicles",
    },
    {
        title: "Maintenance",
        icon: <Wrench className="h-5 w-5" />,
        path: "/admin/maintenance",
    },
    {
        title: "Users",
        icon: <Users className="h-5 w-5" />,
        path: "/admin/users",
    },
    // {
    //     title: "Settings",
    //     icon: <Settings className="h-5 w-5" />,
    //     path: "/admin/settings",
    // },
];

export const AdminDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useMobile();
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    const isActive = (path: string, exact = false) => {
        if (exact) {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside
                className={cn(
                    "bg-white fixed inset-y-0 z-50 flex w-64 flex-col border-r transition-transform duration-300 ease-in-out",
                    isMobile && !sidebarOpen
                        ? "-translate-x-full"
                        : "translate-x-0"
                )}
            >
                <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Car className="h-6 w-6" />
                        <span className="text-xl font-bold">Admin</span>
                    </div>
                    {isMobile && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleSidebar}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    )}
                </div>

                <div className="flex-1 overflow-auto py-2">
                    <nav className="grid gap-1 px-2">
                        {navItems.map((item) => (
                            <Button
                                key={item.path}
                                variant={
                                    isActive(item.path, item.exact)
                                        ? "default"
                                        : "ghost"
                                }
                                className={cn(
                                    "justify-start h-10",
                                    isActive(item.path, item.exact)
                                        ? "bg-black text-white hover:bg-black/90"
                                        : ""
                                )}
                                onClick={() => handleNavigation(item.path)}
                            >
                                {item.icon}
                                <span className="ml-3">{item.title}</span>
                            </Button>
                        ))}
                    </nav>
                </div>

                <div className="border-t p-4">
                    <Button
                        variant="outline"
                        className="w-full justify-start text-red-500"
                        onClick={() => navigate("/login")}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div
                className={cn(
                    "flex-1 transition-all duration-300 ease-in-out",
                    sidebarOpen ? "md:ml-64" : "ml-0"
                )}
            >
                {/* Top Navigation */}
                <header className="bg-white border-b sticky top-0 z-40">
                    <div className="flex h-16 items-center justify-between px-4">
                        <div className="flex items-center">
                            {isMobile && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="mr-2"
                                    onClick={toggleSidebar}
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            )}
                            <div className="relative w-full max-w-md">
                                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                <Input
                                    type="search"
                                    placeholder="Search..."
                                    className="w-full rounded-lg bg-gray-100 pl-8 focus-visible:ring-1"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative"
                            >
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="relative h-8 w-8 rounded-full"
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage
                                                src="/placeholder.svg"
                                                alt="Admin"
                                            />
                                            <AvatarFallback>AD</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                        My Account
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() =>
                                            navigate("/admin/profile")
                                        }
                                    >
                                        Profile
                                    </DropdownMenuItem>
                                    {/* <DropdownMenuItem
                                        onClick={() =>
                                            navigate("/admin/settings")
                                        }
                                    >
                                        Settings
                                    </DropdownMenuItem> */}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => navigate("/login")}
                                    >
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 md:p-6">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Overlay */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50"
                    onClick={toggleSidebar}
                />
            )}
        </div>
    );
};
