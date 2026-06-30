import { useState } from "react";
import {
    ScrollView, View, Text, TouchableOpacity, Alert, TextInput, StyleSheet
} from "react-native";
import CustomButton from '../../components/CustomButton'
import colors from '../../constants/colors';


const ScreenTime = ({ navigation, route }) => {
    const [customMinutes, setCustomMinutes] = useState("");
    const [selectedTime, setSelectedTime] = useState(null);
    const [saving, setSaving] = useState(false);

    const childId = route?.params?.childId;
    // const CHILD_ID = "6a15ddc0752c37728664b230";

    const PRESET_TIMES = [20, 30, 60];

    const handleSelectPreset = (minutes) => {
        setSelectedTime(minutes);
        setCustomMinutes("");
    };

    const handleChangeCustom = (text) => {
        setCustomMinutes(text);
        setSelectedTime(null);
    };

    const saveTime = async () => {
        const minutes = customMinutes ? Number(customMinutes) : selectedTime;

        if (!minutes || minutes <= 0) {
            Alert.alert("Error", "Please select or enter a valid time");
            return;
        }

        if (!childId) {
            Alert.alert("Error", "Child profile is missing");
            return;
        }

        try {
            setSaving(true);

            const res = await fetch(
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

            if (!res.ok) {
                throw new Error("Request failed");
            }

            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "Failed to update time");
        } finally {
            setSaving(false);
        }
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.title}>Screen Time Limit</Text>

                <Text style={styles.text}>
                    Choose how long your little explorer can play today.
                </Text>

                {PRESET_TIMES.map((minutes) => (
                    <TouchableOpacity
                        key={minutes}
                        style={[
                            styles.button,
                            selectedTime === minutes && styles.buttonSelected,
                        ]}
                        onPress={() => handleSelectPreset(minutes)}
                    >
                        <Text style={selectedTime === minutes && styles.buttonTextSelected}>
                            {minutes}m
                        </Text>
                    </TouchableOpacity>
                ))}

                {/* <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        setSelectedTime(20);
                        saveTime(20);
                    }}
                >
                    <Text>20m</Text>
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
                )} */}

                {/* custom input */}
                <TextInput
                    placeholder="Enter minutes (e.g. 45)"
                    keyboardType="numeric"
                    value={customMinutes}
                    onChangeText={handleChangeCustom}
                    style={styles.input}
                />

                <CustomButton
                    label={saving ? "Saving..." : "SAVE"}
                    onPress={saving ? undefined : saveTime}
                />
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
    buttonSelected: {
        backgroundColor: "#4D4D4D",
    },
    buttonTextSelected: {
        color: "#FFFFFF",
        fontWeight: "700",
    },
    input: {
        borderWidth: 1,
        padding: 10,
        width: 200,
        marginVertical: 10,
        borderRadius: 10,
    },
    saveButtonText: {
        color: colors.neutralMist
    }
});

export default ScreenTime;