import { registerUser,loginUser,logoutUser } from "../controllers/auth.controller";
import { registerSchema,loginSchema } from "../utils/validation";
import { Router } from "express";
import { validateSchema } from "../utils/validation";
import { verifyToken } from "../middleware/auth.middleware";


const router = Router()

router.route('/register').post(validateSchema(registerSchema), registerUser)
router.route('/login').post(validateSchema(loginSchema), loginUser)
router.route('/logout').post(verifyToken,logoutUser)

export default router