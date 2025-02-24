import asyncHandler from 'express-async-handler';
import { prisma } from '../config/prismaConfig.js';


export const createUser = asyncHandler(async (req, res) => {
    console.log('creating a user');

    let {email} = req.body;

    const userExists = await prisma.user.findUnique({where: {email}});

    if(!userExists) {
        const user = await prisma.user.create({data: req.body});
        res.send ({
            message: "user registered successfully",
            user: user,
        });
    } else res.status(201).send({ message: "user already registered"});
});

// Function to book a visit to Residence

export const bookVisit = asyncHandler(async (req, res) => {
    const { email, date} = req.body;
    const { id } = req.params;

    try {

      const alreadyBooked = await prisma.user.findUnique ({
        where: {email},
        select: {bookedVisit: true}
      })

      if (alreadyBooked.bookedVisit.some((visit)=> visit.id === id )){
        res.status(400).json({message: "You have already booked a visit to this residence"});
      } 
      else {
       await prisma.user.update ({
        where: {email: email},
        data: {
            bookedVisit: {push: {id, date}}
        }
       })
       res.send("Your Visit is booked successfully");
      }
        
    } catch (error) {
    throw new Error(error.message);
    }
});

// Function of get all booking of our User

export const getAllBookings = asyncHandler (async (req, res) => {
    const {email} = req.body

    try {
        const bookings = await prisma.user.findUnique({
            where: {email},
            select: {bookedVisit: true}
        })
        res.status(200).send(bookings)
    } catch (error) {
        throw new Error (error.message);
    }
})


//Function to cancel the booking

export const cancelBooking = asyncHandler ( async (req, res) => {

    const {email} = req.body;
    const {id} = req.params;

    try {
        const user = await prisma.user.findUnique ({
            where: {email: email},
            select: {bookedVisit: true}
        })

        const index = user.bookedVisit.findIndex((visit)=> visit.id === id)

        if (index === -1) {
            res.status(404).json({message: "Booking not found"})
        } else {
            user.bookedVisit.splice(index, 1)
            await prisma.user.update({
                where: {email},
                data: {
                    bookedVisit: user.bookedVisit
                }
            })

            res.send("Booking cancelled successfully")
        }

        
    } catch (error) {
        throw new Error (error.message)
    }
})


//Function to how to add Resisdence Favourite 

export const toFav = asyncHandler (async (req, res) => {
    const {email} = req.body;
    const {rid} = req.params;

    try {
        const user = await prisma.user.findUnique ({
            where: {email}
        })

        if (user.favResidenciesID.includes(rid)) {
            const updateUser = await prisma.user.update ({
                where: {email},
                data: {
                    favResidenciesID : {
                        set: user.favResidenciesID.filter((id) => id !== rid )
                    }
                }
            });
            res.send({message: "Removed from Favorites", user: updateUser})
        } else {
            const updateUser = await prisma.user.update({
                where: {email},
                data: {
                    favResidenciesID: {
                        push: rid
                    }
                }
            })
            res.send({message: "Update favorites", user: updateUser})
        }
        
    } catch (err) {
        throw new Error (err.message) 
    }
})

//Function to get all Fav

export const getAllFavorite = asyncHandler (async (req, res) => {
    const {email} = req.body

    try {
        const FavResd = await prisma.user.findUnique({
            where: {email},
            select: { favResidenciesID: true },
        })
        res.status(200).send(FavResd);
        
    } catch (error) {
        throw new Error (err.message)
    }
})