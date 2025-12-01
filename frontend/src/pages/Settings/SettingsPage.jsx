import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../Dashboard/DashboardHeader";
import OvidotLoader from "../../components/Loader";
import { apiService } from "../../services/api";
import SettingsBody from "./SettingsBody";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const redirectToSignIn = useCallback(() => {
    navigate("/sign-in");
  }, [navigate]);

  const fetchUserData = async () => {
    try {
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

    const fetchProfileData = async () => {
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
          setError(err?.message || "Failed to fetch profile data");
          console.error("Error fetching profile data:", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfileData();

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
      ) : (
        <div className="bg-[#4D0B5E] bg-opacity-20 mt-5">
          <DashboardHeader user={user} page="Settings" />
          <SettingsBody
            user={user}
            setUser={setUser}
            error={error}
            redirect={redirectToSignIn}
          />
        </div>
      )}
    </>
  );
};

export default Settings;
