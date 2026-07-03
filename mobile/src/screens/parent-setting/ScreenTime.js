import { useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, Alert, TextInput, StyleSheet, Image, KeyboardAvoidingView, Platform } from "react-native";
import { ClockFading } from 'lucide-react-native';
import CustomButton from '../../components/CustomButton'
import colors from '../../constants/colors';


const ScreenTime = ({ navigation, route }) => {
    const [customMinutes, setCustomMinutes] = useState("");
    const [selectedTime, setSelectedTime] = useState(null);
    const [saving, setSaving] = useState(false);

    const childId = route?.params?.childId;
    // const CHILD_ID = "6a15ddc0752c37728664b230";

    const PRESET_TIMES = [20, 30, 45, 60];

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
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView>
                <View style={styles.container}>
                    <Image style={styles.timer} source={require('../../assets/watch.png')} />
                    <Text style={styles.title}>Screen Time Limit</Text>

                    <Text style={styles.text}>
                        Choose how long your little explorer can play today.
                    </Text>

                    {PRESET_TIMES.map((minutes) => (
                        <TouchableOpacity
                            key={minutes}
                            style={[
                                styles.optionBox,
                                selectedTime === minutes && styles.buttonSelected,
                            ]}
                            onPress={() => handleSelectPreset(minutes)}
                        >
                            <View style={styles.flex}>
                                <ClockFading />
                                <Text style={selectedTime === minutes && styles.buttonTextSelected}>
                                    {minutes}min
                                </Text>
                            </View>
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
                    <View style={[styles.optionBox, styles.flex]}>
                        <Image style={styles.customIcon} source={require('../../assets/custom.png')} />
                        <TextInput
                            placeholder="custom"
                            placeholderTextColor='#3D332E'
                            keyboardType="numeric"
                            value={customMinutes}
                            onChangeText={handleChangeCustom}
                            style={styles.input}
                        />
                    </View>

                    <CustomButton
                        label={saving ? "Saving..." : "Save Limit"}
                        onPress={saving ? undefined : saveTime}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        padding: 20,
    },
    timer: {
        width: 60,
        height: 60,
        marginBottom: 20
    },
    title: {
        fontWeight: "bold",
        fontSize: 30,
    },
    text: {
        marginVertical: 10,
    },
    optionBox: {
        backgroundColor: colors.tertiary,
        padding: 12,
        borderRadius: 20,
        marginVertical: 10,
        width: '100%',
        height: 50,
        alignItems: "center",
    },
    flex: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 15,
        width: '100%'
    },
    selectedTime: {
        fontSize: 18
    },
    buttonSelected: {
        backgroundColor: colors.neutralStone,
    },
    buttonTextSelected: {
        color: "#FFFFFF",
        fontWeight: "600",
    },
    input: {
        flex: 1,
        borderWidth: 0,
        outlineStyle: 'none'
    },
    customIcon: {
        width: 25,
        height: 25
    },
    saveButtonText: {
        color: colors.neutralMist
    }
});

export default ScreenTime;