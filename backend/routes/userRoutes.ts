import { Router, Request, Response } from "express";
import { login, register} from "../controllers/userController";

// Directly defining the AuthRequestBody interface in the same file
interface AuthRequestBody {
  email: string;
  password: string;
}

const router = Router();

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 */
router.post("/register", (req: Request<{}, {}, AuthRequestBody>, res: Response) => {
  register(req, res);
});

/**
 * @route   POST /api/users/login
 * @desc    Login user and return JWT
 */
router.post("/login", (req: Request<{}, {}, AuthRequestBody>, res: Response) => {
  login(req, res);
});

/**
 * @route   POST /api/users/logout
 * @desc    Logout user (for completeness, even if it’s client-side)
 */
// router.post("/logout", logout);

export default router;
