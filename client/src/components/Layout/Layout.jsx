// "use client"
import React, { useEffect, useContext } from 'react'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import { Outlet } from "react-router-dom"
import { useAuth0 } from '@auth0/auth0-react';
import UserDetailContext from '../../context/UserDetailContext';
import { useMutation } from 'react-query';
import { createUser } from '../../utils/api';
import useFavourites from '../../hooks/useFavourites';
import useBooking from '../../hooks/useBooking';


const Layout = () => {

  useFavourites ()
  useBooking()
  const {isAuthenticated, user, getAccessTokenWithPopup} = useAuth0()
  const {setUserDetails} = useContext(UserDetailContext) 

  const {mutate} = useMutation({
    mutationKey: [user?.email],
    mutationFn: (token) => createUser(user?.email, token)
  })

  useEffect(()=> {

    const getTokenAndRegister = async () =>{
      
      try {
        const res = await getAccessTokenWithPopup({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            scope: import.meta.env.VITE_AUTH0_SCOPE
          },
        });
    
        if (!res) {
          console.error("No token received");
          return;
        }
    
        localStorage.setItem("access_token", res);
        setUserDetails((prev) => ({ ...prev, token: res }));
        mutate(res);
      } catch (error) {
        console.error("Error getting token:", error);
      }
    };
    isAuthenticated && getTokenAndRegister()
  }, [isAuthenticated])
  return (
    <>
      <div style={{background: "var(--black)", overflow:"hidden" }}>
        <Header />
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout
