// this sample code provided by www.programmingboss.com
#define RXp2 16
#define TXp2 17

#include <ArduinoJson.h>
#include <WiFi.h>
#include <HTTPClient.h>

const int jsonCapacity = 800;

const char* ssid = "DESKTOP-DBGA25K";
const char* password = "ishaansLaptop123";
const char* url = "https://bike-lock-server.onrender.com/rent_bike";



void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  Serial2.begin(9600, SERIAL_8N1, RXp2, TXp2);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while(WiFi.status() != WL_CONNECTED){
    Serial.print(".");
    delay(500);
  }

  Serial.println("Connected to WiFi");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
  
  
}
void loop() {
  
  String str = Serial2.readString();
  if(str.indexOf("isJson") >= 0){
    //get action
    DynamicJsonBuffer jb(jsonCapacity);
    JsonObject& obj = jb.parseObject(str);
    if (obj.success()) {
        String action = obj["action"];

        Serial.print(action);
        if(action.equals("rent bike")){
          //make a json post request to the rent bike route on server
        }
        else if(action.equals("return bike")){
          //make a json request to the return bike route on server
        }
        else{
          //error
        }
      }
  }
      
}
