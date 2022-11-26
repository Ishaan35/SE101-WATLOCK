const { MongoClient } = require("mongodb");
//make a .env file and put a bike_lock_database_password variable there. do not disclose it in the code
const database_connection = `mongodb+srv://merge_conflict_admin:${process.env.bike_lock_database_password}@bike-lock-cluster.26i8x6r.mongodb.net/?retryWrites=true&w=majority`;


const mongo_connect = async () => {
  let mongo_client = new MongoClient(database_connection);
  await mongo_client.connect();
  return mongo_client;
};


module.exports = {
    mongo_connect
}




