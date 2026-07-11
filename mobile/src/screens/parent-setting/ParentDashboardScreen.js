import { View, Text, Button, StyleSheet, ScrollView, TextInput, Alert, Image, Pressable } from 'react-native';
import { useState, useLayoutEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

import CustomButton from '../../components/CustomButton.js'
import colors from '../../constants/colors.js';
import {fonts} from '../../constants/fonts.js'


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
            

            <View style={styles.mainTable}>
                <Image style={styles.lock} source={require('../../assets/lock.png')} />
                <Text style={styles.mainText}>Parent Account</Text>
                <Text style={styles.subText}>Enter your password to manage your settings</Text>

                <TextInput style={styles.input} placeholder="Password" placeholderTextColor={colors.neutralInk} value={password} onChangeText={setPassword} secureTextEntry />
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
        // height: 500,
        backgroundColor: colors.tertiary,
    },
    mainText: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 32,
        textAlign: 'center',
        color: colors.neutral,
        fontFamily: fonts.heading,
    },
    subText: {
        fontSize: 18,
        marginBottom: 48,
        textAlign: 'center',
        color: colors.neutral,
        paddingHorizontal: 4,
        fontWeight: 500,
    },
    lock: {
        alignSelf: 'center',
        width: 83,
        height: 83,
        marginTop: 10,
        marginBottom: 32,
        resizeMode: 'contain',
    },
    input: {
        height: 60,
        borderColor: '#ccc',
        borderWidth: 1,
        backgroundColor: '#fff',
        borderRadius: 32,
        padding: 24,
        marginVertical: 4,
        marginHorizontal: 0,
        color: colors.neutralInk,
    },
    forgetPassword: {
        marginBottom: 24,
        marginTop: 8,
        textAlign: "right",
        fontWeight: 700,
        fontSize: 14,
        fontFamily: fonts.heading,
    }
});
