import { validateSchema,roomSchema } from "../utils/validation";
import { Router } from "express";
import { createRoom, deleteRoom, getAllRooms } from "../controllers/room.controller";
import { verifyToken } from "../middleware/auth.middleware";


const router = Router()

router.route('/').post(verifyToken,validateSchema(roomSchema), createRoom)
router.route('/').get(verifyToken,getAllRooms)
router.route('/:id').delete(verifyToken, deleteRoom)

export default router