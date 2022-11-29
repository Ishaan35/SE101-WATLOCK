#include <Wire.h>
#include <PN532_I2C.h>
#include <PN532.h>
#include <NfcAdapter.h>
#include <Servo.h>


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
  RGB_color(0, 255, 0);

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
    tag.print();

    tagId = tag.getUidString();
    if (tagId.substring(0, 3) == "04 ") {
      Serial.println("Match");
      RGB_color(255, 0, 0);
      for (pos = 0; pos <= 180; pos += 1) {  // goes from 0 degrees to 180 degrees
        // in steps of 1 degree
        myservo.write(pos);  // tell servo to go to position in variable 'pos'
      }

      delay(5000);
      RGB_color(0, 255, 0);
      myservo.write(0);

    } else {
      Serial.println("No Match");
      tone(buzzer, 500); //Hz
      for(int i = 0; i < 8; i++){
        if(i%2 == 1){
          RGB_color(0, 255, 0);
        }
        else{
          RGB_color(0, 0, 0);
        }
        delay(250);
      }
      noTone(buzzer);
      RGB_color(0,255,0);
    }
    nfcRead = 0;
  }
  else{
    RGB_color(0, 255, 0);
  }
}

void RGB_color(int red_light_value, int green_light_value, int blue_light_value) {
  analogWrite(red_light_pin, red_light_value);
  analogWrite(green_light_pin, green_light_value);
  //analogWrite(blue_light_pin, blue_light_value);
}
