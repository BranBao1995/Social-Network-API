const { connect, connection } = require("mongoose");

connect("mongodb://localhost/socialNetwork_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;
