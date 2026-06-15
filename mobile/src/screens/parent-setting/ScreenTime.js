import { useState } from "react";
import {
    ScrollView, View, Text, TouchableOpacity, Alert, TextInput, StyleSheet } from "react-native";

const ScreenTime = ({ navigation, route }) => {
    const [customMinutes, setCustomMinutes] = useState("");
    const [selectedTime, setSelectedTime] = useState(null);

    const childId = route?.params?.childId; 
    // const CHILD_ID = "6a15ddc0752c37728664b230";

    const saveTime = async (minutes) => {
        try {
            await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/api/child/${childId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        timeLimit: minutes,
                    }),
                }
            );

            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "Failed to update time");
        }
    };

    const handleCustom = async () => {
        const minutes = Number(customMinutes);

        if (!minutes || minutes <= 0) {
            Alert.alert("Error", "Invalid time");
            return;
        }

        await saveTime(minutes);
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.title}>Screen Time Limit</Text>

                <Text style={styles.text}>
                    Choose how long your little explorer can play today.
                </Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        setSelectedTime(15);
                        saveTime(15);
                    }}
                >
                    <Text>15m</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        setSelectedTime(30);
                        saveTime(30);
                    }}
                >
                    <Text>30m</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        setSelectedTime(60);
                        saveTime(60);
                    }}
                >
                    <Text>60m</Text>
                </TouchableOpacity>

                {selectedTime && (
                    <Text>Selected: {selectedTime} minutes</Text>
                )}

                {/* custom input */}
                <TextInput
                    placeholder="Enter minutes (e.g. 45)"
                    keyboardType="numeric"
                    value={customMinutes}
                    onChangeText={setCustomMinutes}
                    style={styles.input}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleCustom}
                >
                    <Text>Save Limit</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontWeight: "bold",
        fontSize: 30,
    },
    text: {
        marginVertical: 10,
    },
    button: {
        backgroundColor: "#E8E8E8",
        padding: 12,
        borderRadius: 20,
        marginVertical: 5,
        width: 120,
        alignItems: "center",
    },
    input: {
        borderWidth: 1,
        padding: 10,
        width: 200,
        marginVertical: 10,
        borderRadius: 10,
    },
});

export default ScreenTime;