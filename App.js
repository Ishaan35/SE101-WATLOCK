import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, KeyboardAvoidingView, ScrollView, FlatList} from 'react-native';
import {Appbar, useTheme, Button, TextInput } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';



const Stack = createNativeStackNavigator();

function Form({navigation}) {

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState(false);

async function sendData() {
  let url = 'https://bike-lock-server.onrender.com/login';
  let data= {email: email, password: pwd};
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache', 
    headers: {
      Accept: "application/json",
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  });
  const response_ = await response.json();

 if(response_ && response_.email){
    setEmail(response_.email);
    setPwd(response_.password);
    navigation.navigate('Home');
}
setError(true);
}


return(<ScrollView style={{backgroundColor: '#FFF176', height : '100%'}} >
  <Text style = {{textAlign:'center', marginTop: 100, fontSize:30, fontFamily: 'Courier New'}}>WATLOCK for students</Text>
  <KeyboardAvoidingView behavior={'height'} style={{marginTop:80, marginBottom:80, flex:1, justifyContent: 'center', alignItems: 'center'}}>
    
  <Image
        style={styles.image}
        source={{
          uri: 'https://uwaterloo.ca/brand/sites/ca.brand/files/styles/body-500px-wide/public/uploads/images/university-of-waterloo-vertical-logo.png?itok=9KCQdLsy',
        }}
      />
  <TextInput style = {styles.input} error={error} mode = 'flat' label="Email" type = "email" required placeholder="someone@example.com"  value={email} onChangeText={(e)=>setEmail(e)}/>
  <TextInput style = {styles.input} error={error} mode = 'flat' label = "Password" secureTextEntry={true} required placeholder="Password" onChangeText={(e)=>
    setPwd(e) }/>

<Button  mode="contained" onPress={sendData}>
Login</Button>
</KeyboardAvoidingView>
</ScrollView>);


}

function Home() {
  const [locks, setLocks] = useState([]);
  const [gotData, setgotData] = useState(false);
  const [location, setLocation] = useState(0);


  const getData = async () =>{
    if(!gotData){
   // if(loggedIn){

        let url =
          "https://bike-lock-server.onrender.com/lock_id_availability";
        let response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        response = await response.json();    
        setgotData(true);
        setLocks([response]);
      }
}

function success (position) {
  setLocation(position.coords)
}

//all credit goes to the following link, i copied their code for the haversine formula: http://www.movable-type.co.uk/scripts/latlong.html
function getDistance(lat1, lat2, lon1, lon2) {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180; // φ, λ in radians
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;
  
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  const d = R * c;
  return d;

}

useEffect(() => {if(locks.length < 1){
  getData();}
});

  return (
    <View style = {styles.container}>
 
    <View style = {{border: 5, borderColor: 'grey'}}>
      <Text style = {{textAlign:'center', marginTop: 100, fontSize:30, fontFamily: 'Courier New'}}>Available locks near you: </Text>
      <FlatList
        data={locks}
        renderItem={(lock) => {if(locks.length>=1) {if (!lock.item.availability) {
          navigator.geolocation.getCurrentPosition(success);
          return (<Text>{lock.item.name}: {Math.round(getDistance(location.latitude, lock.item.lat, location.longitude, lock.item.long))}m away</Text>)
        }}}}
      />


    </View>

    </View>
  );

}

export default function App() {

  return (<PaperProvider>
    <NavigationContainer >
    <Stack.Navigator >
    <Stack.Screen name="Sign in" component={Form}/>
    <Stack.Screen name="Home" component={Home}/>
      </Stack.Navigator>
    </NavigationContainer>
    </PaperProvider>
  );
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEDD02',
    alignItems: 'center',
    justifyContent: 'center',
  }, input:{
    height: 50,
    width: 200,
    margin: 20,
    borderWidth:'medium',
    borderRadius: '10',
    padding: 5,
  },
  image: {
    width: 100,
    height: 50,
  }, 
  card: {

  }
});
