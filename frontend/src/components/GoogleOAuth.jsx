import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import config from '../config';
import { apiService } from "../services/api";
import { tokenStorage } from "../services/storage";


const GoogleOAuth = ({ setSubmissionMessage }) => {
  const navigate = useNavigate();

  const sendRequest = async (idToken) => {
    try {
      const response = await apiService.postData(
        config.apiEndpoints.general.signupGoogle, 
        { token: idToken }
      );

      if (response) {
        if (response.data?.tokens) {
          tokenStorage.setTokens(
            response.data.tokens.accessToken,
            response.data.tokens.refreshToken
          );

          setSubmissionMessage("Successful! Redirecting to dashboard...");
          
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
          return
        }

        setSubmissionMessage("Successful! Redirecting to complete registration...");
        setTimeout(() => {
          navigate("/complete-registration");
        }, 2000);
      }
    } catch (err) {
      console.error('Error completing registration', err);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          // credentialResponse.credential is the ID token (JWT with 3 segments)
          const idToken = credentialResponse.credential;
          
          if (idToken) {
            // Verify it's a proper JWT (has 3 segments)
            const segments = idToken.split('.');
            
            if (segments.length === 3) {
              sendRequest(idToken);
            } else {
              console.error('Invalid token format - wrong number of segments:', segments.length);
            }
          } else {
            console.error('No credential received from Google');
          }
        }}
        onError={() => {
          console.log('Google Login Failed');
        }}
        theme="filled_blue"
        size="large"
        text="signup_with"
        shape="rectangular"
        logo_alignment="left"
        width="250"
        locale="en"
      />
    </div>
  );
};

export default GoogleOAuth;