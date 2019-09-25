const router = express.Router();
const userController = require("../controllers/userControls");
const checkToken = require("../middleware/auth");

router.post("/register", userController.register);

router.get("/login", userController.loginPage);

router.post("/login", userController.loginUser);

router.get("/user", checkToken.auth, userController.getUser);

router.post("/refreshToken", userController.refreshToken);

module.exports = router;
