// import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

import { StyleSheet, Text, View, Button, TextInput } from 'react-native';


const TestScreen = () => {

  const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  // test get request
  const testGet = async() => {

    try{

      const parentResponse = await fetch(`${BASE_URL}/api/parent/6a15e296dd882ca29e6355ae`);
      const parentData = await parentResponse.json();
      console.log("parent:", parentData);

      const childResponse = await fetch(`${BASE_URL}/api/child/${parentData.childId[0]}`);
      const childData = await childResponse.json();
      console.log("child:", childData);

      console.log("status:", parentResponse.status);
      console.log("response:", data);

    }catch(error){
      console.log(error)
    }

  }

  // test post request
  const testParentPost = async() => {
    try{
      console.log("BASE_URL:", BASE_URL);
      const parentResponse = await fetch(`${BASE_URL}/api/parent`,{
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

    const data = await parentResponse.json();

    console.log("status:", parentResponse.status);
    console.log("response:", data);


    }catch(error){
      console.log("POST error", error);
    }
  }

  return (
    <View style={styles.container}>
      <Text>API test</Text>
      <Button
        title="Test Get"
        onPress={testGet}
      />

      <TextInput 
      style={styles.input}
      placeholder='name'
      value={name}
      onChangeText={setName}
      />

      <TextInput 
      style={styles.input}
      placeholder='email'
      value={email}
      onChangeText={setEmail}
      />

      <TextInput 
      style={styles.input}
      placeholder='password'
      value={password}
      onChangeText={setPassword}
      />

      <Button title="Create Parent" onPress={testParentPost} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 200,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  }
});

export default TestScreen;