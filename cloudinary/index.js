const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name: process.env.a,
    api_key: process.env.b,
    api_secret: process.env.c
});

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:'daa_notes',
        allowedFormats:['jpeg' , 'pdf','png','mp4']
    }
});


module.exports = {
    cloudinary,
    storage
}