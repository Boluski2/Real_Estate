"use client"
import React, { useState } from 'react'
import {useMutation, useQuery} from 'react-query'
import { useLocation } from 'react-router-dom'
import { getAllProperty, removeBooking } from '../../utils/api.js'
import { PuffLoader } from "react-spinners"
import { AiFillHeart } from "react-icons/ai"
import "./Property.css"
import { FaShower } from "react-icons/fa"
import { AiTwotoneCar } from "react-icons/ai"
import { MdMeetingRoom, MdLocationPin } from "react-icons/md"
import Map from '../../components/Map/Map'
import UseAuthCheck from '../../hooks/UseAuthCheck'
import { useAuth0 } from '@auth0/auth0-react'
import BookingModal from '../../components/BookingModal/BookingModal'
import { useContext } from 'react'
import UserDetailContext from '../../context/UserDetailContext.js'
import { Button } from '@mantine/core'
import { toast } from 'react-toastify'
import Heart from '../../components/Heart/Heart.jsx'





const Property = () => {
    const {pathname} = useLocation()
    const id = pathname.split("/").slice(-1)[0]
    const {data, isLoading, isError} = useQuery(["resd", id], ()=> 
    getAllProperty(id))

    const [modalOpened, setModalOpened] = useState(false);
    const validateLogin = UseAuthCheck();
    const {user} = useAuth0()


    const {
    userDetails : { token, bookings }, 
    setUserDetails,
   } = useContext(UserDetailContext)

   const {mutate: cancelBooking, isLoading: cancelling} = useMutation ({
    mutationFn: () => removeBooking (id, user?.email, token),
    onSuccess: () => {
        setUserDetails((prev)=> ({
            ...prev,
            bookings: prev.bookings.filter((booking) => booking?.id !== id)
        }))

        toast.success("Booking cancelled", {position: 'bottom-right'});
    }
   })


   if(isLoading) {
    return (
        <div className="wrapper">
            <div className="flexCenter padddings">
                <PuffLoader />
            </div>
        </div>
    )}

    if(isError) {
        return (
            <div className="wrapper">
                <div className="flexCenter paddings">
                    <span>Error While feactching the Property Details</span>
                </div>
            </div>
        )
    }


  return (
    <div className="wrapper">
     <div className="flexColStart padddings innerWidth property-container">

        {/* Like Buuton */}
        <div className="like">
          <Heart id={id}/>
        </div>

        {/* image */}
        <img src={data?.image} alt="Home Image" />



    <div className="flexCenter property-details">

        {/* left */}
        <div className="flexColStar left">

            {/* heade to details */}
            <div className="flexStart head">
                <span className='primaryText'>{data?.title}</span>
                <span className='orangeText' style={{fontSize: "1.5rem"}}>${data?.price}</span>
            </div>


            {/* Facility */}
            <div className="flexStart facilities">
                <div className="flexStart facility">
                    <FaShower size={20} color="#1F3E72" />
                    <span>{data?.facilities?.bathrooms} Bathroom</span>
                </div>
                <div className="flexStart facility">
                <AiTwotoneCar size={20} color="#1F3E72" />
                <span>{data?.facilities?.parkings} Parkings</span>

                </div>
                <div className="flexStart facility">
                <MdMeetingRoom  size={20} color="#1F3E72" />
                <span>{data?.facilities?.bedrooms} Room/s</span>
                </div>
            </div>


            {/* description */}
            <span className="secordaryText" style={{textAlign: "justify"}}>
                {data?.description}
            </span>

            {/* Address */}
            <div className="flexStart" style={{gap: "1rem"}}>
                <MdLocationPin size={25} />
                <span className="secondaryText">
                    {
                        data?.address
                    }{""}
                    {
                        data?.city
                    }{""}
                    {
                        data?.county
                    }
                </span>
            </div>

                    {/* booking button */}
        {
            bookings?.map((booking)=> booking.id).includes(id) ? (
                <>
                <Button variant='outline' w={'100%'} color='red'onClick={()=> 
                cancelBooking()}
                disabled={cancelling}
                >
                    <span>Cancle Booking</span>
                </Button>
                <span>
                    Your visit already booked for date {bookings?.filter((booking) => booking?.id === id)[0].date}
                </span>
                </>
            ) : (
            <button className="button"
            onClick={() => {
                validateLogin() && setModalOpened(true);
            }}
            >
                Book your visit
            </button>)
        }
            <BookingModal 
            opened={modalOpened}
            setOpened={setModalOpened}
            propertyId = {id}
            email={user?.email}
            />
        </div>


        {/* right side */}

        <div className="map">
           <Map
           address={data?.address} 
           city={data?.city}
           country={data?.country}
           email = {user?.email}
           />
        </div>
    </div>
     </div>
    </div>
  );
};

export default Property
