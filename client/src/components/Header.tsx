import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Car,
    Wrench,
    User,
    LogOut,
    Menu,
    Home,
    Info,
    Phone,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMobile } from "@/hooks/use-mobile";
import { useAppDispatch, useAppState } from "@/hooks";
import { logout } from "@/redux/store";
import { AppRoutes } from "@/router";

export function Header() {
    useMobile();
    const { authenticate } = useAppState();
    const dispatch = useAppDispatch();
    const [isScrolled, setIsScrolled] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);

    const closeSheet = () => setSheetOpen(false);

    const navItems = [
        { label: "Home", href: AppRoutes.home, icon: Home },
        { label: "Buy", href: AppRoutes.vehicleSales, icon: Car },
        { label: "Maintenance", href: AppRoutes.maintenance, icon: Wrench },
        { label: "About", href: AppRoutes.about, icon: Info },
        { label: "Contact", href: AppRoutes.contact, icon: Phone },
    ];

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur transition-all duration-200 ${
                isScrolled
                    ? "bg-background/95 supports-[backdrop-filter]:bg-background/60"
                    : "bg-background"
            }`}
        >
            <div className="container flex h-16 items-center justify-between px-4 mx-auto">
                <div className="flex gap-x-4">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <Car className="h-8 w-8" />
                            <span className="text-xl font-bold sm:text-2xl">
                                Atta Motors
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <Link to={item.href} key={item.label}>
                                <Button
                                    key={item.label}
                                    variant="ghost"
                                    size="sm"
                                    className="text-sm"
                                >
                                    <item.icon className="h-4 w-4 mr-2" />
                                    {item.label}
                                </Button>
                            </Link>
                        ))}

                        {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-sm"
                            >
                                More
                                <ChevronDown className="h-4 w-4 ml-1" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {navItems.slice(5).map((item) => (
                                <DropdownMenuItem key={item.label}>
                                    <Link to={item.href}>
                                        <item.icon className="h-4 w-4 mr-2" />
                                        {item.label}
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu> */}
                    </nav>
                </div>

                <div className="flex items-center space-x-2">
                    {/* Authentication Section */}
                    {authenticate.isLoggedIn && authenticate.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative h-8 w-8 rounded-full"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src="/placeholder.svg"
                                            alt="User"
                                        />
                                        <AvatarFallback>U</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                    My Account
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link to={AppRoutes.profile}>
                                        <User className="mr-2 h-4 w-4" /> View
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link to={AppRoutes.myVehicles}>
                                        <Car className="mr-2 h-4 w-4" /> My
                                        Listing
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link to={AppRoutes.maintenanceHistory}>
                                        <Wrench className="mr-2 h-4 w-4" /> My
                                        Maintenance
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => dispatch(logout())}
                                >
                                    <LogOut className="mr-2 h-4 w-4" /> Log Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="hidden sm:flex items-center space-x-2">
                            <Link to={AppRoutes.login}>
                                <Button variant="ghost" size="sm">
                                    Log In
                                </Button>
                            </Link>
                            <Link to={AppRoutes.register}>
                                <Button size="sm">Register</Button>
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu */}
                    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="w-[80vw] sm:w-[350px] pr-0"
                        >
                            <div className="flex flex-col h-full">
                                <div className="px-4 py-6 border-b">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center space-x-2">
                                            <Car className="h-8 w-8" />
                                            <span className="text-xl font-bold">
                                                Atta Motors
                                            </span>
                                        </div>
                                    </div>

                                    {!authenticate.isLoggedIn && (
                                        <div className="flex flex-col space-y-2 sm:hidden">
                                            <Link
                                                to={AppRoutes.login}
                                                onClick={closeSheet}
                                            >
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start"
                                                >
                                                    <User className="mr-2 h-4 w-4" />{" "}
                                                    Log In
                                                </Button>
                                            </Link>
                                            <Link
                                                to={AppRoutes.register}
                                                onClick={closeSheet}
                                            >
                                                <Button className="w-full justify-start">
                                                    <User className="mr-2 h-4 w-4" />{" "}
                                                    Register
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                <nav className="flex-1 overflow-auto py-4">
                                    <div className="flex flex-col space-y-1 px-4">
                                        {navItems.map((item) => (
                                            <Link
                                                to={item.href}
                                                key={item.label}
                                                onClick={closeSheet}
                                            >
                                                <Button
                                                    key={item.label}
                                                    variant="ghost"
                                                    className="justify-start h-10"
                                                >
                                                    <item.icon className="mr-2 h-4 w-4" />
                                                    {item.label}
                                                </Button>
                                            </Link>
                                        ))}
                                    </div>
                                </nav>

                                {authenticate.isLoggedIn &&
                                    authenticate.user && (
                                        <div className="border-t px-4 py-4">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage
                                                        src="/placeholder.svg"
                                                        alt="User"
                                                    />
                                                    <AvatarFallback>
                                                        U
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">
                                                        John Doe
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        john@example.com
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => {
                                                    dispatch(logout());
                                                    closeSheet();
                                                }}
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />{" "}
                                                Log Out
                                            </Button>
                                        </div>
                                    )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
