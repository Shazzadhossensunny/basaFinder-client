import { getCurrentUser, getNewToken } from "@/services/AuthService";
import { IUser } from "@/types/user";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface IUserProviderValues {
  user: IUser | null;
  isLoading: boolean;
  setUser: (user: IUser | null) => void;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const UserContext = createContext<IUserProviderValues | undefined>(undefined);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleUser = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        setUser(user);
      } else {
        await getNewToken(); // Try to refresh token if access token is expired
        const refreshedUser = await getCurrentUser();
        setUser(refreshedUser || null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null); // Ensure user is null if there's an error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleUser();
  }, []); // Removed isLoading from dependency to prevent infinite re-renders

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, setIsLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within the UserProvider context");
  }

  return context;
};

export default UserProvider;
