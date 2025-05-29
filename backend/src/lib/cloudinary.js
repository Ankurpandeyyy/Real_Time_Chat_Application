import {v2 as cloudinary} from "cloudinary"

import {config} from "dotenv"

config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,   // my clodinary account name
    api_key: process.env.CLOUDINARY_API_KEY,          // my API key for identification
    api_secret: process.env.CLOUDINARY_API_SECRET     // private API secret use to sign request 
});

export default cloudinary;