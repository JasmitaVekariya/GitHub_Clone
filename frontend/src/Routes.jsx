import React,{useEffect} from "react";
import {useNavigate,useRoutes } from "react-router-dom";
//pagelist
import Dashboard from "./components/dashboard/Dashboard";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Profile from "./components/user/Profile";

//auht context
import { useAuth } from "./authContext";
const ProjectRoutes = () => {
    const { currentUser,setUser } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
     const userIdFromStorage = localStorage.getItem("userId");   
     if (userIdFromStorage&&!currentUser) {
         setCurrentUser(userIdFromStorage );
     } 
    if (!userIdFromStorage&&!["/auth", "/signup"].includes(window.location.pathname)) {
            navigate("/auth");
    }
    if( userIdFromStorage && window.location.pathname=='/auth') {
            navigate("/");
        }
    }, [currentUser, navigate, setCurrentUser]);
   let elemet = useRoutes([
    {
        path: "/",
        element: <Dashboard />,
        
    },
      {
        path: "/auth",
        element: <Login/>,
        
    },
     {
        path: "/singup",
        element: <Signup/>,
        
    },
     {
        path: "/profile",
        element: <Profile/>,
        
    }
   ]);
   return elemet;
}
export default ProjectRoutes;
