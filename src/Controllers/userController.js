const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const Validator = require("../Validation/validation.js");

const register = async (req, res) => {
  try {
    const data = req.body;
    let { name, email, password, confirm_password } = data;

    const checkData = [name, email, password, confirm_password];
    for (let i = 0; i < checkData.length; i++) {
      if (!checkData[i])
        return res.status(400).send({
          status: false,
          message: `${checkData[i]} is mandatory field !`,
        });
    }

    if (password !== confirm_password)
      return res.status(400).send({
        status: false,
        message: `Password should be match with Confirm Password`,
      });

    if (!Validator.isValidName(name))
      return res
        .status(400)
        .send({ status: false, message: `This Name: '${name}' is not valid!` });

    if (!Validator.isValidEmail(email))
      return res.status(400).send({
        status: false,
        message: `This EmailID: '${email}' is not valid!`,
      });

    if (!Validator.isValidpassword(password)) {
      return res.status(400).send({
        status: false,
        message:
          "To make strong Password Should be use 8 to 15 Characters which including letters, atleast one special character and at least one Number.",
      });
    }

    const uniqueCheck = await userModel.findOne({ email: email });
    if (uniqueCheck) {
      if (uniqueCheck.email == email) {
        return res.render("errorPage", {
          message: `This EmailID: '${email}' is already used!`,
        });
        // return res.status(400).send({ status: false, message: `This EmailID: '${email}' is already used!` })
      }
    }

    const saltRound = 10;
    data.password = await bcrypt.hash(password, saltRound);

    const savedData = await userModel.create({
      name,
      email,
      password: data.password,
    });

    return res.render("errorPage", {
      message: `${name}: your data successfully created!`,
    });

    // return res.status(201).send({ status: true, message: `${name}: your data successfully created!`, data: savedData })
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const logInUser = async (req, res) => {
  try {
    const data = req.body;
    const { email, password } = data;

    if (!email || !password)
      return res.status(400).send({
        status: false,
        message: `All fields are mandatory (e.g. email and password) !`,
      });

    if (!Validator.isValidEmail(email))
      return res.status(400).send({
        status: false,
        message: `This EmailID: '${email}' is not valid!`,
      });

    if (!Validator.isValidpassword(password)) {
      return res.status(400).send({
        status: false,
        message:
          "To make strong Password Should be use 8 to 15 Characters which including letters, atleast one special character and at least one Number.",
      });
    }

    const userData = await userModel.findOne({ email: email });
    if (!userData) {
      return res.render("errorPage", {
        message: "Invalid Login Credentials! You need to register first.",
      });

      // return res.status(401).send({ status: false, message: "Invalid Login Credentials! You need to register first." })
    }

    const checkPassword = await bcrypt.compare(password, userData.password);

    if (checkPassword) {
      const obj = { userId: userData["_id"] };

      await userModel.findByIdAndUpdate(userData["_id"], { login: true });
      req.session.userId = userData["_id"].toString();

      return res.render("Logout", { data: "" });

      // return res.status(200).send({ status: true, message: 'User login successfull', data: obj })
    } else {
      return res.render("errorPage", { message: "Wrong Password !" });

      // return res.status(401).send({ status: false, message: 'Wrong Password' })
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId)
      return res.render("errorPage", {
        message: "Unauthorized User. You have to Login first!",
      });

    await userModel.findByIdAndUpdate(userId, { login: false });
    req.session.destroy();
    return res.render("Login");

  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { register, logInUser, logoutUser };
