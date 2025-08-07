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
     if (userIdFromStorage) {
         setUser({ id: userIdFromStorage });
     } else {
         setUser(null);
     }
    });
   
}
