"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, User, LogOut, Home, PlusCircle } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { logout } from "@/services/AuthService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, setUser, setIsLoading } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const getDashboardPath = () => {
    if (!user || !user?.role) return "/login";
    return user?.role === "admin"
      ? "/admin/dashboard"
      : user?.role === "landlord"
      ? "/landlord/dashboard"
      : user?.role === "tenant"
      ? "/tenant/dashboard"
      : "/";
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      setUser(null); // Clear user context
      toast.success("Logged out successfully.");
      router.push("/");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    } finally {
      setIsLoading(false);
      setIsMenuOpen(false);
    }
  };

  // Define base nav items
  const baseNavItems = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "Listings", path: "/listings" },
    { label: "Dashboard", path: getDashboardPath() },
  ];

  // Add "Create Listing" for landlords
  const navItems = [...baseNavItems];
  if (user?.role === "landlord") {
    navItems.push({
      label: "Create Listing",
      path: "/listings/create",
    });
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              {/* <Image
                src="/logo.svg"
                alt="BasaFinder Logo"
                width={40}
                height={40}
              /> */}
              <span className="text-xl font-bold text-primary">BasaFinder</span>
              <span className="text-2xl">🏡</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-3 py-2 text-sm font-medium hover:text-primary transition ${
                  pathname === item.path ? "text-primary" : "text-gray-700"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-sm font-medium hover:text-primary"
                >
                  <User size={16} /> Profile
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-1"
                >
                  <LogOut size={16} /> Logout
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:text-primary"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-4 pt-4 pb-3 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium hover:text-primary ${
                  pathname === item.path ? "text-primary" : "text-gray-700"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium hover:text-primary"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 px-4 pb-4">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
