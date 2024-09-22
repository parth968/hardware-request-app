import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode"; 
import { setUser, logout } from "../slice/authSlice";

const ProtectedRoute = ({ role, children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);

        // Check if the token is expired
        if (decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          dispatch(logout()); // Logout if expired
          navigate('/')
        } else {
          dispatch(
            setUser({
              id: decodedToken.id,
              email: decodedToken.email,
              role: decodedToken.role,
            })
          );
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem("token");
        dispatch(logout()); // Logout if invalid
        navigate('/')
      }
    } else {
      dispatch(logout()); // Logout if no token
      navigate('/')
    }
  }, [dispatch]);

  // If user is not set, return null to prevent rendering children prematurely
  if (!user) {
    return null; // Optionally, you can display a loading indicator here
  }

  // Redirect if user role does not match the required role
  if (role && user.role !== role) {
    console.log(
      "Redirected through ProtectedRoute:",
      user,
      "Role:",
      user.role
    );
    return <Navigate to="/" />;
  }

  // Return the children components if everything is valid
  return children;
};

export default ProtectedRoute;
