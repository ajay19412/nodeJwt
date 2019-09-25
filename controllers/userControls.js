const jwt = require("jsonwebtoken");
// import * as jwt from "jsonwebtoken";

const config = require("../util/keys");
const User = require("../models/userModal");

exports.loginPage = (req, res) => {
  res.render("login");
};

exports.register = (req, res) => {
  let { userName, password } = req.body;
  const newUser = new User({
    name: userName,
    password: password
  });

  newUser
    .save()
    .then(result => {
      console.log("user created");
    })
    .catch(err => {
      console.log("err");
    });
};

exports.loginUser = (req, res) => {
  const { userName, password } = req.body;
  const phoneNumber = "9874563215";
  // console.log(req.body);

  if (userName !== "user" || password !== "password") {
    return res.status(400).json({ success: false, msg: "Invalid details" });
  }

  const token = jwt.sign({ name: userName }, config.secret, {
    expiresIn: config.tokenLife
  });
  const refreshToken = jwt.sign({ name: userName }, config.refreshTokenSecret, {
    expiresIn: config.refreshTokenLife
  });

  return User.findOne({ name: userName })
    .then(data => {
      // console.log(data);
      data.token = token;
      data.refreshToken = refreshToken;
      return data.save();
    })
    .then(user => {
      console.log("login success and 2 tokens assign");
      res.status(200).json({
        token: token,
        refreshToken: refreshToken,
        user: {
          name: userName,
          phoneNumber: phoneNumber
        }
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    const user = {
      email: "test"
    };
    const token = jwt.sign(user, config.secret, {
      expiresIn: config.tokenLife
    });

    res.status(200).json({
      token: token,
      user: user
    });
  } else {
    res.status(404).json({ msg: "Invalid Request", status: 0 });
  }
};

exports.refreshToken2 = refreshToken => {
  if (refreshToken) {
    const user = {
      email: "test"
    };
    const token = jwt.sign(user, config.secret, {
      expiresIn: config.tokenLife
    });

    User.findOne({ refreshToken: refreshToken })
      .then(data => {
        data.token = token;
        return data.save();
      })
      .then(result => {
        console.log("new token updated" + " new token is " + result.token);
      })
      .catch(err => {
        console.log(err);
      });

    return { token: token, user: user };
  }

  // (req, res) => {
  //   console.log(req);
  //   if (refreshToken) {
  //     const user = {
  //       email: "test"
  //     };
  //     const token = jwt.sign(user, config.secret, {
  //       expiresIn: config.tokenLife
  //     });

  //     User.findOne({ refreshToken: refreshToken })
  //       .then(data => {
  //         data.token = token;
  //         return data.save();
  //       })
  //       .then(result => {
  //         console.log("new token updated" + " new token is " + result.token);
  //       })
  //       .catch(err => {
  //         console.log(err);
  //       });

  //     return { token: token, user: user };
  //   } else {
  //     res.status(404).json({ msg: "Invalid Request", status: 0 });
  //   }
  // };
};

exports.getUser = (req, res) => {
  const userName = "user";
  console.log(req.user);
  res.json({ success: true, data: userName });
};
