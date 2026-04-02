import asyncHandler from "../utils/AsyncHandler";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import type { Request, Response } from "../types/index";
import { User } from "../models/User";

const generateAccessAndRefreshToken = async (userId: string) => {
    try {
        const user = await User.findById(userId)

        if(!user){
            throw new ApiError(404, "User not found")
        }

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return ({accessToken, refreshToken})

    } catch (error: any) {
        throw new ApiError(500, error?.message || "Internal server error")
    }
}

export const registerUser = asyncHandler(async (req: Request,res: Response)=>{

    const {username,email, password} = req.body

    const userExist = await User.findOne({
        $or: [{username},{email}]
    })

    if(userExist){
        throw new ApiError(400, "User already exist")
    }

    const user = await User.create({
        username,
        email,
        password
    })

const UserData = await User.findById(user._id).select("-password")

    if(!UserData){
        throw new ApiError(404, "User not found")
    }

    return res.status(201).json(new ApiResponse(201, "User registered successfully", UserData))

})


export const loginUser = asyncHandler(async (req: Request,res: Response)=>{

    const {email,password} = req.body

    const user = await User.findOne({email})

    if(!user){
        throw new ApiError(404, "User not found")
    }

    if (!user.password) {
    throw new ApiError(400, "Please login with Google")
    }

    const comparePassword = await user.comparePassword(password)

    if(!comparePassword){
        throw new ApiError(400, "Invalid credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id.toString())

    const logginUser = await User.findById(user._id).select("-password -refreshToken")

    const option = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }

    return res
            .status(200)
            .cookie("accessToken", accessToken, option)
            .cookie("refreshToken", refreshToken, option)
            .json(new ApiResponse(200, "User logged in successfully", logginUser))
})

export const logoutUser = asyncHandler(async (req: Request,res: Response)=>{
    await User.findByIdAndUpdate(
        req.user!._id,
        {$unset: {refreshToken: 1}},
        {new: true}
    )

    const option = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }

    return res 
            .status(200)
            .clearCookie("accessToken", option)
            .clearCookie("refreshToken", option)
            .json(new ApiResponse(200,"User logged out successfully"))
})
