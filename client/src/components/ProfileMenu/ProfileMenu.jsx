// "use client"
import React from 'react'
import {Menu, Avatar} from "@mantine/core"
// import '@mantine/core/styles.css';
import { useNavigate } from 'react-router-dom';




const ProfileMenu = ({ user, logout }) => {
  const navigate = useNavigate()
  return (
  <Menu>
    <Menu.Target>
      <Avatar src={user?.picture} alt="user image" radius={"xl"} />
    </Menu.Target>
    <Menu.Dropdown>
    <Menu.Item onClick={() => navigate("./favourities", {replace: true})}>
        Favourites
    </Menu.Item>

    <Menu.Item onClick={() => navigate("./bookings", {replace: true})}>
       Bookings
    </Menu.Item>

    <Menu.Item onClick={()=>{
        localStorage.clear();
        logout()
    }}> 
        Logout
    </Menu.Item>
    </Menu.Dropdown>
  </Menu>
);
}

export default ProfileMenu