import { View, Text, Button, StyleSheet, ScrollView, TextInput, Alert, Image } from 'react-native';
import { useState } from 'react';

import CustomButton from '../../components/CustomButton.js'
import colors from '../../constants/colors.js'


// const DUMMY_CHILD_ID = '6a28f66e68e34f4224b78383';

export default function ParentDashboardScreen({ navigation, route, user }) {

    // const parentId = "6a15ddc0752c37728664b230";
    const parentId = user?.id || user?._id;
    const [password, setPassword] = useState('');
    // const user = route.params?.user;
    

    const handlePress = async () => {
        if(!password){
            Alert.alert("Error", "Please enter your password");
            return;
        }

        try{
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: user?.email,
                    password: password,
                }),
            });

            const data = await response.json();
            if(response.ok){
                navigation.navigate("SettingParentScreen", {parentId, user: data.user});
            }else{
                Alert.alert("Incorrect Passwrod", data.message || "Please try again");
            }
        }catch(error){
            console.error("Password valification error: ", error);
            Alert.alert("Error", "Something went wrong please try again")
        }
    }

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
            

            {/* <Button title='Settings - Parent Account' onPress={() => navigation.navigate('SettingParentScreen')} /> */}
            {/* <Button
                title="Create Child Profile"
                onPress={() =>
                    navigation.navigate('CreateChild', {
                        // parentId: user?.id,
                        parentId: "6a15ddc0752c37728664b230", //temp
                    })
                }
            /> */}

            {/* <Button title="Select Child Profile" onPress={() => navigation.navigate('SelectChild')} /> */}
            {/* <Button title="Edit Parent Account" onPress={() => navigation.navigate('EditParentAccount')} /> */}

            {/* <Button
                title="Start Scanning"
                onPress={() =>
                    navigation.navigate('Scan', {
                        childId: DUMMY_CHILD_ID,
                    })
                }
            /> */}

            <View style={styles.mainTable}>
                <Image style={styles.lock} source={require('../../assets/lock.png')} />
                <Text style={styles.mainText}>Parent Account</Text>
                <Text style={styles.subText}>Enter your password to manage your settings</Text>

                <TextInput style={styles.input} placeholder="Enter Password" value={password} onChangeText={setPassword} secureTextEntry />
                <Text style={styles.forgetPassword}>Forget password?</Text>

                <CustomButton label="Unlock Settings" onPress={handlePress} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    content: {
        padding: 24,
        alignItems: 'center'
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 24
    },
    mainTable: {
        padding: 24,
        borderRadius: 32,
        width: "90%",
        height: 500,
        backgroundColor: colors.tertiary,
    },
    mainText: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: colors.neutral,
    },
    subText: {
        fontSize: 18,
        marginBottom: 48,
        textAlign: 'center',
        color: colors.neutral,
    },
    lock: {
        alignSelf: 'center',
        width: 60,
        height: 60,
        marginBottom: 20,
        resizeMode: 'contain',
    },
    input: {
        height: 56,
        borderColor: '#ccc',
        borderWidth: 1,
        backgroundColor: '#fff',
        borderRadius: 32,
        padding: 16,
        marginVertical: 4,
        marginHorizontal: 0,
        color: colors.neutralInk,
    },
    forgetPassword: {
        marginBottom: 24,
        marginTop: 8,
        textAlign: "right",

    }
});
