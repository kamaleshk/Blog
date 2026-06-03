const experss = require("express");
const router = experss.Router();
const userController = require("../controllers/userController")

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.post("/", userController.createUser);

module.exports = router;