import axios from "axios"
import dayjs from "dayjs"
import { toast } from "react-toastify"

export const api = axios.create ({
    baseURL: "https://real-estateserver.vercel.app/api"
})

export const getAllProperties = async () => {
    try {

        const response = await api.get("/residency/allresd", {
            timeout: 10 * 1000,
        });

        if(response.status === 400 || response.status === 500) {
            throw response.data
        }
        return response.data
        
    } catch (error) {
        toast.error("Something went wrong")
    }
}


export const getAllProperty = async ( id ) => {

    try {

        const response = await api.get(`/residency/${id}`, {
            timeout: 10 * 1000,
        });

        if(response.status === 400 || response.status === 500) {
            throw response.data
        }
        return response.data
        
    } catch (error) {
        toast.error("Something went wrong")
        throw error
    }

}


export const createUser = async(email, token) => {
    try {
        if (!token) {
            console.error("No token available");
            throw new Error("Missing authentication token");
        }

        await api.post(
            `/user/register`,
            { email },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    } catch (error) {
        console.error("Error sending token:", error);
        toast.error("Something went wrong, Please try again");
        throw error;
    }
};


export const bookVisit = async (value, propertyId, email, token) => {
    try {
        console.log("Token:", token);  
        await api.post(
            `/user/bookVisit/${propertyId}`,
            {
                email,
                id: propertyId,
                date: dayjs(value).format("DD/MM/YY")
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,  
                }
            }
        )
    } catch (error) {
        console.error("Error booking visit:", error);  
        toast.error("Something went wrong, please try again");
        throw error;
    }
}




export const removeBooking = async (id, email, token) => {
    try {

        await api.post(
        `/user/removeBooking/${id}`,
        {
            email,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )

        
    } catch (error) {
        toast.error("Something went wrong, please try again");
        throw error;
    }
}

export const toFav = async (id, email, token) => {
    try {
        await api.post(
            `/user/toFav/${id}`,
            { email },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log('Successfully updated favorite');
    } catch (e) {
        // console.error('Error adding to favorites:', e);
        throw new Error('Something went wrong, Please try again later.');
    }
};

export const getAllFav = async (email, token) => {
    if(!token) return
    
    try {
      const res = await api.post(
            `/user/allFav`,
            {
                email,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return res.data["favResidenciesID"];
        
    } catch (e) {
        // toast.error("Something went wrong while fetching Favs");
        throw e;
    }
}





export const getAllBookings = async (email, token) => {
    if(!token) return 
        
    try {
        const res = await api.post(
            `/user/allBookings`,
            {
                email,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log("res", res)
        return res.data["boookVisits"];
        
    } catch (error) {
        // toast.error("Something went wrong while fetching Bookings");
        throw error;
    }
}


export const createResidency = async (data, token) => {
    try {

        const res = await api.post(
            `/residency/create`,
            {
                data,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        
    } catch (error) {
        throw error
    }
}