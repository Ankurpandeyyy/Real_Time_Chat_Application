import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";



export const signup =async (req, res) => {
    const {fullName ,email,password } = req.body ;
    try{
       
        if(!fullName || !email || !password)
            return res.status(400).json({message : "All Fields are Required"})
        if(password.length <6)
            return res.status(400).json({message: "Password must be atleast 6 characters"});

        const user = await User.findOne({email});

        if(user)
            return res.status(400).json({message: "User already exist"});
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);  // encrypting password
        
        //Creating New User
        const newUser = new User({
            fullName,
            email,
            password:hashedPassword
        });

        if(newUser){
          //generating AWT token here
            generateToken(newUser._id,res)
            await newUser.save();

            res.status(200).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        }else{
            res.status(400).json({message : "Invalid user data"})
        }
    }catch(error){
        console.log("Error in signup controller",error.message);
        res.status(500).json({message : "Internal server Error"});
    }
}


export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });    // immediately expire the cookie by setting maxage(time) = 0 and with a empty value ""
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic); // upload on cloudinary's cloud
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url }, //secure_url is return by cloudinary
      { new: true } //by setting new=true now findOneAndUpdate() will return new updated value if not setting true to it ,,will return previous value
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);  // user is attached via auth middleware
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};