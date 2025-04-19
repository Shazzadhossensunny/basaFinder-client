"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, User, LogOut, Home, PlusCircle } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { logout } from "@/services/AuthService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { protectedRoutes } from "@/contants";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, setUser, setIsLoading } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const getDashboardPath = () => {
    if (!user?.role) {
      // If no role but user exists (loading state), return empty
      return user ? "#" : "/login";
    }
    switch (user.role) {
      case "admin":
        return "/dashboard/admin";
      case "landlord":
        return "/dashboard/landlord";
      case "tenant":
        return "/dashboard/tenant";
      default:
        return "/";
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      setUser(null);
      toast.success("Logged out successfully.");
      router.push("/");
      if (protectedRoutes.some((route) => pathname.match(route))) {
        router.push("/");
      }
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Base nav items for all users
  const baseNavItems = [
    { label: "Home", path: "/" },
    { label: "Listings", path: "/listings" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  // Conditional items
  const conditionalNavItems = [];

  if (user) {
    // Add Dashboard for logged-in users
    conditionalNavItems.push({
      label: "Dashboard",
      path: getDashboardPath(),
    });

    // Add "Create Listing" for landlords
    if (user.role === "landlord") {
      conditionalNavItems.push({
        label: "Create Listing",
        path: "/listings/create",
      });
    }
  }

  const navItems = [...baseNavItems, ...conditionalNavItems];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">BasaFinder</span>
            <span className="text-2xl">🏡</span>
          </Link>

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
              <div className="flex items-center gap-4 ml-4">
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
              <div className="flex gap-2 ml-4">
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
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-primary"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md absolute w-full">
          <div className="px-4 pt-4 pb-3 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === item.path
                    ? "text-primary bg-primary/10"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  href="/profile"
                  className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="pt-2 space-y-2">
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
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
