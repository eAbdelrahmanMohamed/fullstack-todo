import { Router, Request, Response } from "express";
import { login, register} from "../controllers/userController";

interface AuthRequestBody {
  email: string;
  password: string;
}

const router = Router();


router.post("/register", (req: Request<{}, {}, AuthRequestBody>, res: Response) => {
  register(req, res);
});

router.post("/login", (req: Request<{}, {}, AuthRequestBody>, res: Response) => {
  login(req, res);
});

/**
 * @route   POST /api/users/logout
 * @desc    Logout user (for completeness, even if it’s client-side)
 */
// router.post("/logout", logout);

export default router;
