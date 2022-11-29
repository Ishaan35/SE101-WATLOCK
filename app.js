let express = require("express");
let cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");

let app = express();
app.use(cors());
app.use(express.json());

const database_connection = `mongodb+srv://merge_conflict_admin:${process.env.bike_lock_database_password}@bike-lock-cluster.26i8x6r.mongodb.net/?retryWrites=true&w=majority`;

let mongo_client = new MongoClient(database_connection);
mongo_client.connect();

app.get("/lock_id_availability/:id", async (req, res) => {
  if (!mongo_client) {
    await mongo_client.connect();
    console.log("Re-Connecting............");
  }
  if (mongo_client) {
    try {
      res.send("hi");
    } catch (e) {
      res.send({
        error: e.message,
      });
    }
  } else {
    res.send("error");
  }
});

app.post("/rent_bike", async (req, res) => {
  if (!mongo_client) {
    await mongo_client.connect();
    console.log("Re-Connecting............");
  }
  if (mongo_client) {
    try {
      let lock_id = req.body.lock_id;
      let user_id = req.body.user_id;

      //query parameters. Which lock are we trying to check if there is a bike available? And what information do we set if it is available?
      let query = { lock_id: lock_id };
      let new_values = {
        $set: {
          available: false,
          date_rented: Date.now(),
          user_id_using: user_id,
        },
      };
 
      //the database has two collections we are interested. the database with the statuses of all the locks (in our demo we have only one), and the list of all the registered students allowed to check out a bike
      const db = mongo_client.db("Bike-Lock-Database");
      const collection_locks = db.collection("locks_status");
      const collection_users = db.collection("users_info");


      //first we check if a valid waterloo student is trying to check out a bike. if not, res.send an error and the arduino will not unlock
      let user_lookup = await collection_users.findOne({ uid: user_id }); //first we make a request to see if this is a valid user. if not, immediately stop
      //if valid user found with the given id
      if(user_lookup && user_lookup.uid == user_id && user_lookup.first_name && user_lookup.last_name){
        
        //We can find the lock with the given lock_id. if it is available, then we can update its info so the bike is rented by this user
        let lockStatus = await collection_locks.findOne(query);
        if (
          lockStatus.available &&
          lockStatus.user_id_using == "" &&
          lockStatus.date_rented == -1
        ) {
          let result = await collection_locks.updateOne(query, new_values);
          res.json(result); //will not contain an error. if it does not contain an error, the arduino will unlock the bike
        } else {
          res.json({ error: "Bike already in use" });
        }
      }
      else{
        res.json({error:"Not a Waterloo Student"});
      }
      
    } catch (e) {
      res.json({
        error: e.message,
      });
    }
  } else {
    res.json({
      error: "server error",
    });
  }
});

app.post("/return_bike", async (req, res) =>{
  if (!mongo_client) {
    await mongo_client.connect();
    console.log("Re-Connecting............");
  }
  if (mongo_client) {
    try {
      let lock_id = req.body.lock_id;
      let user_id = req.body.user_id;

      let query = { lock_id: lock_id };
      let new_values = {
        $set: {
          available: true,
          date_rented: -1,
          user_id_using: "",
        },
      };

      const db = mongo_client.db("Bike-Lock-Database");
      const collection = db.collection("locks_status");

      let lockStatus = await collection.findOne(query);

      //if bike was not available and you were the one who checked it out, then safely return. otherwise do not register it as a return
      if (
        !lockStatus.available &&
        lockStatus.user_id_using == user_id &&
        lockStatus.date_rented != -1
      ) {
        let result = await collection.updateOne(query, new_values);
        res.json(result);
      } else {
        res.json({ error: "Incorrect user!" });
      }
    } catch (e) {
      res.json({
        error: e.message,
      });
    }
  } else {
    res.json({
      error: "server error",
    });
  }
})

app.post('/login', async(req, res) =>{
  res.json({
    message:"success"
  })
})


app.post("/test", async(req, res) =>{
  console.log(req.body);
  res.json(req.body);
})

//"npm start"
const PORT = 3000;
app.listen(process.env.PORT || PORT, () => {});
