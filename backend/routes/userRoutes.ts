import { Router, Request, Response } from "express";
import { login, register} from "../controllers/userController";

// Directly defining the AuthRequestBody interface in the same file
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


// router.post("/logout", logout);

export default router;
