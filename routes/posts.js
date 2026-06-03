const experss = require("express");
const router = experss.Router();
const postController = require("../controllers/postController");
const { protect, restrictTo } = require("../middleware/auth");
const { validatePost } = require("../middleware/validation");
const { cacheMiddleware, clearCache } = require("../middleware/cache");

router.get("/", cacheMiddleware(300), postController.getAllPosts);
router.get("/:id", cacheMiddleware(300), postController.getPost);

router.post("/", protect, validatePost, postController.createPost);

router.put("/:id", protect, async (req, res, next)=>{
    await clearCache(`cache:/api/posts*`),
    next()
}, validatePost, postController.updatePost);

router.delete("/:id", protect, async (req, res, next)=>{
    await clearCache(`cache:/api/posts*`),
    next()
}, postController.deletePost);

router.post("/:id/like", protect, async (req, res, next) =>{
    await clearCache(`cache:/api/posts*`),
    next()
}, postController.toggleLike);

router.delete("/:id/admin", protect, restrictTo("admin"), postController.deletePost);

module.exports = router;