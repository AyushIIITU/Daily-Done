const express = require("express");
const UserController = require("../Controller/User.controller");
const { jwtAuthMiddleware } = require("../../Utils/jwt");
const router = express.Router();

// const { generateToken, jwtAuthMiddleware } = require("../jwt");
// const userDetail = require("../models/User");

router.post("/", UserController.registerUser);
// POST Method to add a new user
// router.post("/", async (req, res) => {
//   try {
//     const data = req.body;
//     const newuser = new userDetail(data);
//     const response = await newuser.save();
//     console.log("New user saved");
//     res.status(200).json(response);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// router.get("/", );

router.post("/login",UserController.loginUser );

router.get("/profile", UserController.getUser);

router.get("/visit/:id", jwtAuthMiddleware, UserController.visitUser);

router.get("/fetchGithub",UserController.fetchYears);

router.post("/fetchGithubYear",UserController.fetchDataForYear);



module.exports = router;
