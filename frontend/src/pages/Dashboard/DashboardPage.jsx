import DashboardHeader from "./DashboardHeader";
import DashboardBody from "./DashboardBody";
import OvidotLoader from "../../components/Loader";
import PeriodSelector from "./PeriodSelectorPage";
import { apiService } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAction, setUserAction] = useState(false); // To track if user has selected a period
  const navigate = useNavigate();

  const redirectToSignIn = useCallback(() => {
    navigate("/sign-in");
  }, [navigate]);

  // Memoized function to fetch user data
  const fetchUserData = async () => {
    try {
      // const token = tokenStorage.getToken();
      // const [accessToken, refreshToken] = token ? token : [null, null];

      // if (!accessToken && !refreshToken) {
      //   setError("Authentication Failed, Please sign in again");
      //   setLoading(false);
      //   return null;
      // }

      // if (accessToken) {
      //   const response = await apiService.getData("/auth/users/fetch");
      //   return response.user;
      // }

      // if (refreshToken) {
      //   await apiService.refreshAuthToken();
      //   const response = await apiService.getData("/auth/users/fetch");
      //   return response.user;
      // }

      const response = await apiService.getData("/auth/users/fetch");
      return response.user;
    } catch (err) {
      setError(err?.message || "Failed to fetch user data");
      console.error("Error fetching user data:", err);
      return null;
    }
  };

  // Main data fetching effect
  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        setError(null);

        // Fetch user data first
        const userData = await fetchUserData();
        if (!isMounted) return;

        if (userData) {
          setUser(userData);
        } else {
          setError("Failed to fetch user data");
          return;
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || "Failed to fetch dashboard data");
          console.error("Error fetching dashboard data:", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Effect to handle authentication errors
  useEffect(() => {
    if (error && error.includes("Authentication")) {
      // Redirect after a short delay to show error message
      const timer = setTimeout(redirectToSignIn, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, redirectToSignIn]);

  return (
    <>
      {isLoading ? (
        <OvidotLoader />
      ) : !user?.period && !userAction && !error ? (
        <PeriodSelector setUserAction={setUserAction} />
      ) : (
        <div className="bg-[#4D0B5E] bg-opacity-20 mt-5">
          <DashboardHeader user={user} page="Dashboard" />
          <DashboardBody
            user={user}
            error={error}
            setError={setError}
            redirect={redirectToSignIn}
          />
        </div>
      )}
    </>
  );
};

export default Dashboard;
