const express = require("express");
const app = express();
const db = require("../scripts/connectDb");
const userRouter = express.Router();

const createUserHandler = (req, res) => {
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
  } = req.body;

  db.query(
    `SELECT COUNT(*) FROM party where party_id = '${partyId}';`,
    (error, rows) => {
      const val = rows[0]["COUNT(*)"];

      if (val == 0) {
        partyId = partyId.toString() + Math.random(100).toString();
        db.query(`INSERT INTO party VALUES('${partyId}', 'PtyPerson');`);
        const addPersonQuery = `INSERT INTO person  VALUES('${partyId}','${salutation}','${first_name}','${middle_name}','${last_name}','${gender}','${birthDate}','${maritalStatus}','${employment_status_enum}','${occupation}')`;

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
  const { userId } = req.query;

  const query = `Select * from person where party_id = '${userId}'`;

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

userRouter.post("/", createUserHandler);
userRouter.get("/", getUserHandler);
userRouter.put("/", updateUserHandler);

module.exports = userRouter;
