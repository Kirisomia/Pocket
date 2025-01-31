const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

var pool = mysql.createPool({
  connectionLimit: 10,
  host: "127.0.0.1",
  //port: '3000',
  user: "root",
  password: "0129",
  database: "pocket",
});

/*
connection.connect((err) => {
  if (err) {
    console.error("Error", err);
    return;
  }
  console.log("Connected.");
  connection.query("SELECT * FROM user", (err, results) => {
    console.log(results.affectedRows);
  });
});
*/

// Called for GET request to http://localhost:3000/hello
app.get("/", function (req, res) {
  res.send("<h1>Hello, Express!</h1>");
});

// Called for POST request to http://localhost:3000/goodbye
app.post("/", function (req, res) {
  res.send("<h1>Goodbye, Express!</h1>");
});

app.get("/users/:id/:name", (req, res) => {
  const { id, name } = req.params;
  const query = "SELECT * FROM user WHERE user_id = ?";

  pool.query(query, [id], function (error, results, fields) {
    if (error) throw error;
    res.json(results);
  });
});

app.get("/adduser/:name/:dob/:bal", (req, res) => {
  const { name, dob, bal } = req.params;
  const query = "SELECT addUser(?, ?, ?) as usr";

  pool.query(query, [name, dob, bal], function (error, results, fields) {
    if (error) throw error;
    res.json(results);
  });
});

app.post("/adduser", (req, res) => {
  const user = req.body;
  const query = "SELECT addUser(?, ?, ?) as usr";

  pool.query(
    query,
    [user.name, user.dob, user.bal],
    function (error, results, fields) {
      if (error) throw error;
      res.json(results);
    }
  );
});

app.post("/updateuser", (req, res) => {
  const user = req.body;
  const query = "SELECT updateUser(?, ?, ?, ?) as usr";

  pool.query(
    query,
    [user.id, user.name, user.dob, user.bal],
    function (error, results, fields) {
      if (error) throw error;
      res.json(results);
    }
  );
});

app.post("/deleteuser", (req, res) => {
  const user = req.body;
  const query = "SELECT deleteUser(?) as usr";

  pool.query(
    query,
    [user.id],
    function (error, results, fields) {
      if (error) throw error;
      res.json(results);
    }
  );
});

app.get(
  "/addtransaction/:id/:value/:date/:category/:notes/:fromto/:isreceived",
  (req, res) => {
    const { id, value, date, category, notes, fromTo, isReceived } = req.params;
    const query = "SELECT addTransaction(?, ?, ?, ?, ?, ?, ?) as trn";

    pool.query(
      query,
      [id, value, date, category, notes, fromTo, isReceived],
      function (error, results, fields) {
        if (error) throw error;
        res.json(results);
      }
    );
  }
);

app.post("/addtransaction", (req, res) => {
  const { id, value, date, category, notes, fromTo, isReceived } = req.body;
  const query = "SELECT addTransaction(?, ?, ?, ?, ?, ?, ?) as trn";

  pool.query(
    query,
    [id, value, date, category, notes, fromTo, isReceived],
    function (error, results, fields) {
      if (error) throw error;
      res.json(results);
    }
  );
});

app.post("/updatetransaction", (req, res) => {
  const trns = req.body;
  const query = "SELECT updateTransaction(?, ?, ?, ?, ?, ?, ?, ?) as trn";

  pool.query(
    query,
    [trns.id, trns.userid, trns.value, trns.date, trns.category, trns.notes, trns.fromTo, trns.isReceived],
    function (error, results, fields) {
      if (error) throw error;
      res.json(results);
    }
  );
});

app.post("/deletetransaction", (req, res) => {
  const trns = req.body;
  const query = "SELECT deleteTransaction(?) as trn";
  pool.query(
    query,
    [trns.id],
    function (error, results, fields) {
      if (error) throw error;
      res.json(results);
    }
  );
});

app.get("/getusers", (req, res) => {
  const query = "call getUsers()";
  pool.query(query, function (error, results, fields) {
    if (error) throw error;
    res.json(results[0]);
  });
});

app.get("/gettransactions/:userid", (req, res) => {
  const { userid } = req.params;
  const query = "call getTransactions(?)";
  pool.query(query, [userid], function (error, results, fields) {
    if (error) throw error;
    res.json(results[0]);
  });
});

app.listen(3300, function () {
  console.log("Listening on port 3300...");
});
