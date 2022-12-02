import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Dimensions} from 'react-native';
import {Appbar, useTheme, Button, TextInput } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';



const Stack = createNativeStackNavigator();


function Header() {
  <Appbar.Header>
      <Appbar.Content title="WATLOCK for students" />
    </Appbar.Header>
}

function Form({navigation}) {

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
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
  console.log(response_);

 if(response_ && response_.email){
    setLoggedIn(true);
    setEmail(response_.email);
    setPwd(response_.password);
    navigation.navigate('Home');
}
setError(true);
}


return(<View style={{marginTop:80, flex:1, justifyContent: 'space-between'}}>
  <Image
        style={styles.image}
        source={{
          uri: 'https://uwaterloo.ca/brand/sites/ca.brand/files/styles/body-500px-wide/public/uploads/images/university-of-waterloo-vertical-logo.png?itok=9KCQdLsy',
        }}
      />
  <TextInput style = {styles.input} error={error} mode = 'flat' label="Email" type = "email" required placeholder="someone@example.com"  value={email} onChangeText={(e)=>setEmail(e)}/>
  <TextInput style = {styles.input} error={error} mode = 'flat' label = "Password" secureTextEntry={true} required placeholder="password" onChangeText={(e)=>
    setPwd(e) }/>

<Button  mode="contained" onPress={sendData}>
Login</Button>

</View>);


}

function Home() {
  const [locks, setLocks] = useState([]);
  const [gotData, setgotData] = useState(false);


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

    //}
    

    //setLocks(response);
}
useEffect(() => {if(locks.length < 1){
  getData();}
});

  return (
    <View style = {styles.container}>
 
    <View style = {{border: 5, borderColor: 'grey'}}>
      <Text>Available locks near you: </Text>
      {console.log(locks)}
      {locks.map((lock)=>{if(lock.available) {return(<Text key={lock.lock_id}>{lock.name}</Text>)}})}
    </View>

    </View>
  );

}

export default function App() {

  const theme = useTheme();


  return (<PaperProvider>
    <NavigationContainer>
    <Stack.Navigator>
    <Stack.Screen name="Form" component={Form}/>
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
    margin: 10,
    borderWidth:'medium',
    borderRadius: '10',
    padding: 5,
  },
  image: {
    width: 100,
    height: 50,
  }, 
});
