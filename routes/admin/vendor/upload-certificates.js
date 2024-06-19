const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const authMiddlewareAdmin = require('../../../middleware/authMiddlewareAdmin');
const users = require('../../../models/users');

const multerInstance = multer();

// Vendor's Business Certificates upload route
router.put('/', authMiddlewareAdmin, async(req, res) => {
    try{
        const businessEmail = req.headers.businessemail;
        const userType = 'Vendor';

        // Check if all reqd fields are present
        if (!businessEmail)
            return res.status(400).json({message: 'Required field (*) cannot be left blank'});
        
        // Check if vendor exists
        const existingUser = await users.findOne({email: businessEmail, userType: 'Vendor'});
        if (!existingUser)
            return res.status(404).json({message: 'No vendor with this business email exists'});

        // Accept the certificates as multipart/form-data save them as PDFs in the assets/business-certificates folder
        const storage = multer.diskStorage({
            destination: function(req, file, cb){
                cb(null, 'assets/business-certificates');
            },
            filename: function(req, file, cb){
                const extension = path.extname(file.originalname);
                cb(null, `${existingUser._id}-${file.fieldname}${extension}`);
            }
        });

        const upload = multer({
            storage,
            fileFilter: function(req, file, cb){
                if (file.mimetype !== 'application/pdf')
                    return cb(new Error('Only PDFs are allowed'));
                cb(null, true);
            }
        }).fields([
            {name: 'incorporationCertificate', maxCount: 1},
            {name: 'gst', maxCount: 1},
            {name: 'pan', maxCount: 1}
        ]);

        // Call multer as a middleware
        upload(req, res, async function(err) {
            if (err instanceof multer.MulterError)
                return res.status(500).json(err);
            else if (err)
                return res.status(500).json(err);

            // Check if the certificates are present as multipart/form-data
            if (!req.files)
                return res.status(400).json({message: 'Certificates not uploaded'});

            // Whichever files are present, create an object storing the file paths
            const filePaths = {};
            if (req.files.incorporationCertificate)
                filePaths.incorporationCertificate = `${existingUser._id}-incorporationCertificate.pdf`;
            if (req.files.gst)
                filePaths.gst = `${existingUser._id}-gst.pdf`;
            if (req.files.pan)
                filePaths.pan = `${existingUser._id}-pan.pdf`;            

            // Save the file paths in the db
            await users.updateOne(
                {email: businessEmail, userType}, 
                {$set: filePaths}
            );

            // Respond to the client w/ appropriate message
            res.status(200).json({message: 'Business certificates uploaded successfully'});
        });

    } catch(err){
        res.status(500).json({message: err.message});
    }
});

module.exports = router;