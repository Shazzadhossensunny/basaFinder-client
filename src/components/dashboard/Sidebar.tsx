"use client";
import { useState } from "react";
import {
  Home,
  FileText,
  Users,
  List,
  User,
  ChevronDown,
  PlusCircle,
  HandCoins,
  ClipboardList,
  Lock,
  UserCog,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "@/services/AuthService";
import { toast } from "sonner";
import { IUser } from "@/types/user"; // Assuming you have an IUser interface
import Image from "next/image";

interface SidebarProps {
  children?: React.ReactNode;
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  setIsLoading: (loading: boolean) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  submenu?: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({
  children,
  user,
  setUser,
  setIsLoading,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const getRolePath = () => {
    if (!user || !user.role) return "/dashboard";
    return `/dashboard/${user.role}`;
  };

  const getMenuItems = (): MenuItem[] => {
    const rolePath = getRolePath();

    const baseItems: MenuItem[] = [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: <Home className="h-5 w-5" />,
        path: rolePath,
      },
    ];

    if (!user) return baseItems;

    switch (user.role) {
      case "admin":
        return [
          ...baseItems,
          {
            id: "users",
            label: "User Management",
            icon: <Users className="h-5 w-5" />,
            path: `${rolePath}/user-management`,
          },
          {
            id: "rentals",
            label: "Rental Management",
            icon: <List className="h-5 w-5" />,
            path: `${rolePath}/rental-management`,
          },
        ];
      case "landlord":
        return [
          ...baseItems,
          {
            id: "my-listings",
            label: "My Listings",
            icon: <Home className="h-5 w-5" />,
            path: `${rolePath}/listings`,

            // submenu: [
            //   {
            //     id: "create-listing",
            //     label: "Create Listing",
            //     path: `${rolePath}/listings/create`,
            //     icon: <PlusCircle className="h-4 w-4" />,
            //   },
            //   {
            //     id: "manage-listings",
            //     label: "Manage Listings",
            //     path: `${rolePath}/listings`,
            //     icon: <List className="h-4 w-4" />,
            //   },
            // ],
          },
          {
            id: "manage-listings",
            label: "Manage Listings",
            path: `${rolePath}/manage-listings`,
            icon: <List className="h-4 w-4" />,
          },
          {
            id: "requests",
            label: "Rental Requests",
            icon: <ClipboardList className="h-5 w-5" />,
            path: `${rolePath}/rental-requests`,
          },
        ];
      case "tenant":
        return [
          ...baseItems,
          {
            id: "my-requests",
            label: "My Requests",
            icon: <ClipboardList className="h-5 w-5" />,
            path: `${rolePath}/my-requests`,
          },
          {
            id: "payments",
            label: "Payment History",
            icon: <HandCoins className="h-5 w-5" />,
            path: `${rolePath}/payments`,
          },
        ];
      default:
        return baseItems;
    }
  };

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      setUser(null);
      toast.success("Logged out successfully.");
      router.push("/");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 shadow-xl lg:shadow-none transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b dark:border-gray-700">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
            </span>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {getMenuItems().map((item) => (
                <li key={item.id}>
                  {item.submenu ? (
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-between"
                        onClick={() => toggleSubmenu(item.id)}
                      >
                        <div className="flex items-center">
                          {item.icon}
                          <span className="ml-3">{item.label}</span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            expandedMenus.includes(item.id) ? "rotate-180" : ""
                          }`}
                        />
                      </Button>
                      {expandedMenus.includes(item.id) && (
                        <ul className="pl-6 space-y-2">
                          {item.submenu.map((subitem) => (
                            <li key={subitem.id}>
                              <Button
                                variant={
                                  pathname === subitem.path
                                    ? "default"
                                    : "ghost"
                                }
                                className={`w-full justify-start text-sm ${
                                  pathname === subitem.path
                                    ? "bg-purple-600 text-white hover:bg-purple-700"
                                    : ""
                                }`}
                                onClick={() => handleNavigation(subitem.path)}
                              >
                                {subitem.icon}
                                <span className="ml-2">{subitem.label}</span>
                              </Button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Button
                      variant={pathname === item.path ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        pathname === item.path
                          ? "bg-purple-600 text-white hover:bg-purple-700"
                          : ""
                      }`}
                      onClick={() => handleNavigation(item.path)}
                    >
                      {item.icon}
                      <span className="ml-1">{item.label}</span>
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t dark:border-gray-700 p-4">
            <div className="relative">
              <Button
                variant="ghost"
                className="w-full justify-between items-center"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="flex items-center min-w-0 flex-1">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                  )}
                  <div className="ml-3 min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`h-4 w-4 ml-2 ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>

              {isProfileOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      handleNavigation(`${getRolePath()}/profile`);
                      setIsProfileOpen(false);
                    }}
                  >
                    <UserCog className="h-4 w-4 mr-3" />
                    Edit Profile
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      handleNavigation(`${getRolePath()}/change-password`);
                      setIsProfileOpen(false);
                    }}
                  >
                    <Lock className="h-4 w-4 mr-3" />
                    Change Password
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 dark:text-red-400"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64 min-h-screen flex flex-col">
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? "Close" : "Menu"}
            </Button>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Sidebar;
