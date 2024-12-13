import { Link } from "react-router-dom";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components";
import {
  Car,
  Wrench,
  DollarSign,
  User,
  LogOut,
  Info,
  ShoppingCart,
} from "lucide-react";
import { FC } from "react";
import { AppRoutes } from "@/router";
import { useAppDispatch, useAppState } from "@/hooks";
import { logout } from "@/redux/store";
import { getFirstLetterOfUserName } from "@/utils";

const { VITE_APP_BASE_URL } = import.meta.env;

interface HeaderProps {}

export const Header: FC<HeaderProps> = () => {
  const { authenticate } = useAppState();
  const dispatch = useAppDispatch();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center mx-auto">
        <Link to="/" className="flex items-center space-x-2">
          <Car className="h-8 w-8" />
          <span className="text-2xl font-bold w-max">Atta Motors</span>
        </Link>
        <nav className="ml-8 flex items-center justify-between space-x-4 w-full">
          <div className="flex gap-4 sm:gap-6">
            <Link
              to="#"
              className="flex items-center text-sm font-medium hover:underline underline-offset-4"
            >
              <ShoppingCart className="mr-2 h-6 w-6" /> Buy
            </Link>
            <Link
              to="#"
              className="flex items-center text-sm font-medium hover:underline underline-offset-4"
            >
              <DollarSign className="mr-2 h-5 w-5" /> Sell
            </Link>
            <Link
              to="#"
              className="flex items-center text-sm font-medium hover:underline underline-offset-4"
            >
              <Wrench className="mr-2 h-5 w-5" /> Services
            </Link>
            <Link
              to="#"
              className="flex items-center text-sm font-medium hover:underline underline-offset-4"
            >
              <Info className="mr-2 h-5 w-5" /> About
            </Link>
          </div>

          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-4 w-4 mr-2" />
                Menu
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href="#" className="flex items-center">
                  <Car className="mr-2 h-4 w-4" /> Buy
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="#" className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4" /> Sell
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="#" className="flex items-center">
                  <Wrench className="mr-2 h-4 w-4" /> Services
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="#" className="flex items-center">
                  About
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}

          {authenticate.isLoggedIn && authenticate.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage
                    src={`${VITE_APP_BASE_URL}/api/${authenticate.user.avatar}`}
                  />
                  <AvatarFallback>
                    {getFirstLetterOfUserName(authenticate.user.name)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  Signed in as <br /> @{authenticate.user.username}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="#" className="flex items-center">
                    <User className="mr-2 h-4 w-4" /> View Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="#" className="flex items-center">
                    <Car className="mr-2 h-4 w-4" /> My Purchases
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="#" className="flex items-center">
                    <Wrench className="mr-2 h-4 w-4" /> Maintenance Appointments
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <button
                    className="flex items-center w-full"
                    onClick={() => dispatch(logout())}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Log Out
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="space-x-4">
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
        </nav>
      </div>
    </header>
  );
};
