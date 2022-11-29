#include <Wire.h>
#include <PN532_I2C.h>
#include <PN532.h>
#include <NfcAdapter.h>
#include <Servo.h>
#include <ArduinoJson.h>


PN532_I2C pn532_i2c(Wire);
NfcAdapter nfc = NfcAdapter(pn532_i2c);
String tagId = "None";
byte nuidPICC[4];

const int red_light_pin = 9;
const int green_light_pin = 10;
const int buzzer = 11; //buzzer to arduino pin 9
//int blue_light_pin = 5;

Servo myservo;  // create servo object to control a servo
// twelve servo objects can be created on most boards

int pos = 180;  // variable to store the servo position
int nfcRead = 0;


//WIFI CONFIGURATION
char *lock_id = "rehfh83fh3189rbdfgc3y6tr4ytvhxfbrtuy";
String user_id = "";
bool available = true;

String currentColor = "red";

void setup(void) {
  Serial.begin(115200);
  Serial.println("System initialized");
  nfc.begin();
  myservo.attach(3);  // attaches the servo on pin 3 to the servo object
  myservo.write(0);

  pinMode(red_light_pin, OUTPUT);
  pinMode(green_light_pin, OUTPUT);
  pinMode(buzzer, OUTPUT); 
  // pinMode(blue_light_pin, OUTPUT);
  RGB_color("red");

}

void loop() {
  if (nfcRead == 0)
    readNFC();
}
//UID 04 7C 35 EA B4 55 80
//UID 04 31 93 EA CE 76 80
//UID 04 54 23 32 8D 6F 80

void readNFC() {
  if (nfc.tagPresent()) {

    nfcRead = 1;
    NfcTag tag = nfc.read();

    tagId = tag.getUidString();
    if (tagId.substring(0, 3) == "04 ") {
      if(available){
        RGB_color("green");
        currentColor = "green";
        myservo.write(180);
        available = false;
        user_id = tagId;

        //make json for renting bike and send it to the wifi chip
        DynamicJsonBuffer jBuffer;
        JsonObject& jsonObj = jBuffer.createObject();

        jsonObj["lock_id"] = lock_id;
        jsonObj["user_id"] = tagId;
        jsonObj["isJson"] = "isJson"; //just to verify that this is json data through str.substring later on
        jsonObj["action"] = "rent bike";

        jsonObj.prettyPrintTo(Serial);

        delay(5000);
        
      }
      else if(user_id.equals(tagId)){
        //we are returning the bike. 
        delay(1000);
        RGB_color("red");
        currentColor = "red";
        myservo.write(0);
        available = true;

        DynamicJsonBuffer jBuffer;
        JsonObject& jsonObj = jBuffer.createObject();

        jsonObj["lock_id"] = lock_id;
        jsonObj["user_id"] = tagId;
        jsonObj["isJson"] = "isJson"; //just to verify that this is json data through str.substring later on
        jsonObj["action"] = "return bike";

        jsonObj.prettyPrintTo(Serial);
        delay(5000);
      }
      else if(!available && !user_id.equals(tagId)){
        accessDenied();
      }
      
      

    } else {
      accessDenied();
    }
    nfcRead = 0;
  }
}

void RGB_color(String color) {
  if(color.equals("red")){
    analogWrite(red_light_pin, 0);
    analogWrite(green_light_pin, 255);
  }
  else if(color.equals("green")){
    analogWrite(red_light_pin, 255);
    analogWrite(green_light_pin, 0);
  }
  else{
    analogWrite(red_light_pin, 0);
    analogWrite(green_light_pin, 0);
  }
  //analogWrite(blue_light_pin, blue_light_value);
}

void accessDenied(){
  tone(buzzer, 500); //Hz
  for(int i = 0; i < 8; i++){
    if(i%2 == 1){
      RGB_color("red");
    }
    else{
      RGB_color("none");
    }
    delay(250);
  }
  noTone(buzzer);
  RGB_color(currentColor);
}
