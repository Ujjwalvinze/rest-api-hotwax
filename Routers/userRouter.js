const express = require("express");
const app = express();
const db = require("../scripts/connectDb");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const fs = require("fs");

const generateToken = require("../utils/jwt/generateToken");
const isLoggedIn = require("../userMiddlewares/isLoggedIn");
const getTokenFromHeader = require("../utils/jwt/getTokenFromHeader");
const verifyToken = require("../utils/jwt/verifyToken");

const createUserHandler = async (req, res) => {
  let {
    partyId,
    salutation,
    first_name,
    middle_name,
    last_name,
    gender,
    birthDate,
    maritalStatus,
    employment_status_enum,
    occupation,
    password,
  } = req.body;

  const salt = await bcrypt.genSalt(3);
  const hashPassword = await bcrypt.hash(password, salt);

  db.query(
    `SELECT COUNT(*) FROM party where party_id = '${partyId}';`,
    (error, rows) => {
      const val = rows[0]["COUNT(*)"];

      if (val == 0) {
        partyId = hashPassword.substring(0, 10) + Math.random(3).toString();
        db.query(`INSERT INTO party VALUES('${partyId}', 'PtyPerson');`);
        const addPersonQuery = `INSERT INTO person  VALUES('${partyId}','${salutation}','${first_name}','${middle_name}','${last_name}','${gender}','${birthDate}','${maritalStatus}','${employment_status_enum}','${occupation}','${hashPassword}')`;

        db.query(addPersonQuery, (error) => {
          if (error) {
            console.log("error in adding person", error);
            res.json("Error in creating person");
            throw error;
          }

          res.json("Person Created");
        });
      } else {
        res.json("Party ID doesn't exist");
      }
    }
  );
};

const getUserHandler = (req, res) => {
  const token = getTokenFromHeader(req);

  const userId = verifyToken(token);

  const query = `Select * from person where party_id = '${userId.partyId}'`;

  db.query(query, (error, results) => {
    if (error) {
      console.log(error);
      res.status(500);
      res.send("Error in getting person");
      throw error;
    }

    res.status(200);
    res.send(results);
  });
};

const updateUserHandler = (req, res) => {
  const { userId, newName } = req.body;

  console.log(userId);

  const query = `UPDATE person SET first_name = '${newName}' where party_id = '${userId}';`;

  db.query(query, (error, results) => {
    if (error) {
      console.log("Error", error);
      res.json("Error in updating user");
    }

    res.json({ msg: "User Updated", "Updated User": results });
  });
};

function userExists(partyId, password, res) {
  db.query(
    `SELECT * from person where party_id='${partyId}';`,
    (error, result) => {
      if (error) throw error;

      //   console.log();
      const x = result[0]?.PARTY_ID;

      if (x === undefined) return res.json("Doesn't exists");

      verifyPass(partyId, password, res);
    }
  );
}

function verifyPass(partyId, password, res) {
  db.query(
    `SELECT * from person where party_id='${partyId}';`,
    async (error, result) => {
      if (error) throw error;

      const correct = await bcrypt.compare(password, result[0].password);

      if (!correct) return res.json("Wrong password");

      const token = generateToken(partyId);

      //   const jsonToken = JSON.stringify(token);
      fs.writeFile("jwt.js", token, () => {});

      res.json({ msg: "logged in", token });
    }
  );
}

const loginUserHandler = (req, res) => {
  const { partyId, password } = req.body;

  userExists(partyId, password, res);
};

userRouter.post("/", createUserHandler);
userRouter.post("/login", loginUserHandler);
userRouter.get("/", isLoggedIn, getUserHandler);
userRouter.put("/", updateUserHandler);

module.exports = userRouter;
