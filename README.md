# se101

This is our final SE 101 course project in Software Engineering at the University of Waterloo.

At the center of all purchases and verification on campus is Waterloo’s own NFC (near-field communication) compatible object called the WatCard. We thus decided to use the Watcard (campus identification card) to create a university-wide bike sharing system. 

The primary hardware that was utilized was an Arduino UNO, a PN532 module, and a ESP32 WI-FI board, which allowed us to scan an NFC or RFID tag and connect to the internet. These components were used to read the user ID (UID) of Watcards and once a valid UID was recognized, the Waterloo students were able to use the bike. With this system, we also track who last took out the bike for the purposes of stolen/missing bikes. Since our bike lock system operates within the university, we created a portal that allows the admin to check the availability of the bicycle and its current user.

On the Arduino UNO board, along with the PN532 module and the ESP32 WI-FI board, we used several other components such as a 180 degree rotating servo motor, an RGB LED, a buzzer, and a 9V battery as the power source. Here is a simple schematic of the configuration: 

![schematic.jpg](https://github.com/jasonmilad/se101/blob/main/schematic.jpg?raw=true)

There is also a Node.js server, and a React.js front-end portal which allows admins to view information of all registered locks. The server connects to a MongoDB NoSQL database to keep track of the student, admin, and bike lock information. The ESP32 WI-FI board connects to the server through HTTP POST and GET requests through a standard WPA WI-FI connection. Here is a flow chart describing the structure of our project

![schematic.jpg](https://github.com/jasonmilad/se101/blob/main/project_structure.png?raw=true)
