import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();


function Form() {

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

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
}


return(<View style={styles.container}>
  <Text> WATLOCK for students</Text>

  <Image
        style={styles.image}
        source={{
          uri: 'https://uwaterloo.ca/brand/sites/ca.brand/files/styles/body-500px-wide/public/uploads/images/university-of-waterloo-vertical-logo.png?itok=9KCQdLsy',
        }}
      />
  <TextInput type = "email" style = {styles.input} required placeholder="someone@example.com"  value={email} onChangeText={(e)=>setEmail(e)}/>
  <TextInput secureTextEntry={true} style = {styles.input} required placeholder="password" onChangeText={(e)=>
    setPwd(e) }/>

 <Button  title="Login" color = '#9c64a6' style = {styles.input} onPress = {sendData}/>
</View>);


}

function Home() {

  return (
    <View style = {styles.container}>
 <Text>Im cool</Text>
    </View>
  );

}

export default function App() {
  return (
    <View style={styles.container}>
    <NavigationContainer>
    <Stack.Navigator>

<Stack.Screen name="Form" component={Form}/>
<Stack.Screen name="Home" component={Home}  title = {`Welcome, {email}`}
/>
      {/* <StatusBar style="auto" /> */}
      </Stack.Navigator>

    </NavigationContainer>
    </View>

  );
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    marginBottom: 50,
  }, input:{
    height: 50,
    margin: 10,
    borderWidth:'thick',
    borderRadius:30,
    padding: 15,
  },
  image: {
    width: 200,
    height: 200,
  },
});
