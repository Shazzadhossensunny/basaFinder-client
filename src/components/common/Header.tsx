import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "./ModeToggle";

const Header = () => {
  const pathname = usePathname();
  // const dispatch = useAppDispatch();
  // const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // dispatch(logout());
    setIsOpen(false);
  };

  // const getDashboardPath = () => {
  //   if (!user) return "/login";

  //   switch (user.role) {
  //     case "admin":
  //       return "/admin";
  //     case "landlord":
  //       return "/landlord";
  //     case "tenant":
  //       return "/tenant";
  //     default:
  //       return "/";
  //   }
  // };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "All Listings", path: "/listings" },
    // { label: "Dashboard", path: getDashboardPath() },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">BasaFinder</span>
            <span className="text-2xl">🏡</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.path
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
          {/* {isAuthenticated ? ( */}
          <>
            <Link
              href="/profile"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/profile"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              My Profile
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </>
          {/* ) : ( */}
          <Link href="/login">
            <Button>Login / Register</Button>
          </Link>
          {/* )} */}
          <ModeToggle />
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center md:hidden space-x-2">
          {/* <ModeToggle /> */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-6">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      pathname === item.path
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                {/* {isAuthenticated ? ( */}
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      pathname === "/profile"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    My Profile
                  </Link>
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
                {/* // ) : ( */}
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button>Login / Register</Button>
                </Link>
                {/* // )} */}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
