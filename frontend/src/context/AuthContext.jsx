import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import api from "../services/api"; // Assuming api is configured

// Define keys for localStorage
const TOKEN_KEY = "authToken";
const USER_KEY = "authUser";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to load user data from localStorage and validate with API
  const loadUserFromStorage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUserString = localStorage.getItem(USER_KEY);

    if (storedToken) {
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      try {
        // Validate token with the backend and get fresh user data
        const response = await api.get("/auth/me"); // Endpoint to verify token & get user
        const freshUser = response.data.user || response.data; // Adjust based on your /auth/me response

        if (freshUser) {
          setUser(freshUser);
          localStorage.setItem(USER_KEY, JSON.stringify(freshUser)); // Update stored user data if needed
        } else {
          // Token might be valid but no user data returned, treat as logout
          throw new Error("User data not found with token.");
        }
      } catch (err) {
        console.error(
          "Failed to load or validate user from token:",
          err.response?.data?.message || err.message
        );
        setUser(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        delete api.defaults.headers.common["Authorization"];
        // Optionally, set an error message here if it's a validation failure
        // setError("Session expired. Please login again.");
      }
    } else if (storedUserString) {
      // If there's a stored user but no token, it's an inconsistent state. Clear it.
      console.warn(
        "User data found in localStorage without a token. Clearing."
      );
      localStorage.removeItem(USER_KEY);
      setUser(null);
    } else {
      // No token, no user in storage
      setUser(null);
    }
    setIsLoading(false);
  }, []); // No dependencies, runs based on its usage in useEffect

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  const login = useCallback(async (username, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/login", { username, password });
      // Assuming the backend returns:
      // { message: "Login successful", user: { ... }, token: "..." }
      const { user: loggedInUser, token } = response.data;

      if (!loggedInUser || !token) {
        throw new Error("Login response did not include user or token.");
      }

      setUser(loggedInUser);
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser)); // Store user object as string
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return { success: true, user: loggedInUser };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setError(errorMessage);
      localStorage.removeItem(TOKEN_KEY); // Clean up on failed login
      localStorage.removeItem(USER_KEY);
      delete api.defaults.headers.common["Authorization"];
      setUser(null); // Ensure user state is cleared
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem(TOKEN_KEY);

    try {
      if (token) {
        // Inform the backend about logout, if applicable
        await api.post("/auth/logout"); // This endpoint might invalidate the token on the server
      }
    } catch (err) {
      console.error(
        "Logout API call failed:",
        err.response?.data?.message || err.message
      );
      // Still proceed with client-side logout
      // setError("Logout failed on server, but you have been logged out locally.");
    } finally {
      setUser(null);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      delete api.defaults.headers.common["Authorization"];
      setIsLoading(false);
    }
    return { success: true };
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      isLoading,
      error,
      login,
      logout,
      isAuthenticated: !!user,
      clearError: () => setError(null),
    }),
    [user, isLoading, error, login, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined || context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
