import asyncHandler from 'express-async-handler';
import { prisma } from '../config/prismaConfig.js';


export const createResidency = asyncHandler(async (req, res) => {
    const { title, description, price, address, country, city, facilities, image, userEmail } = req.body.data;

    // Log the request data for debugging
    console.log("Request Data:", req.body.data);

    if (!title || !price || !address || !userEmail) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const residency = await prisma.residency.create({
            data: {
                title,
                description,
                price,
                address,
                country,
                city,
                facilities,
                image,
                owner: {
                    connect: {
                        email: userEmail
                    }
                }
            }
        });

        res.status(201).json({
            message: "Residency created successfully",
            residency
        });

    } catch (err) {
        console.error("Error:", err);  // Log the error for better debugging

        if (err.code === "P2002") {
            return res.status(409).json({ message: "A residency with this address already exists" });
        }

        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});


// Function get all the document Residencies 

export const getAllResidencies = asyncHandler(async (req, res) => {
    const residencies = await prisma.residency.findMany({
        orderBy: 
        {
            createdAt: "desc",
        },
    });
    res.send(residencies);  
});

//  Function to get a specifitic document/Residency 

export const getResidency = asyncHandler(async (req, res) => {
    const {id} = req.params;

    try{

        const residency = await prisma.residency.findUnique({
            where: {id}
        });
        res.send(residency)
    } catch (err) {
        throw new Error (err.message);
    }
})