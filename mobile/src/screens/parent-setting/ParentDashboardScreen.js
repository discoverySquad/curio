import { View, Text, Button, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useState } from 'react';

import CustomButton from '../../components/CustomButton.js'
import colors from '../../constants/colors.js'


const DUMMY_CHILD_ID = '6a28f66e68e34f4224b78383';

export default function ParentDashboardScreen({ navigation, route }) {

    // const parentId = "6a15ddc0752c37728664b230";
    const parentId = route?.params?.parentId;

    const user = route.params?.user;
    const [password, setPassword] = useState('');

    const handlePress = async () => {
        console.log("Start Activity!")
    }

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Parent Dashboard</Text>
            <Text style={styles.subtitle}>Welcome {user?.fullName || user?.name || 'Parent'}</Text>

            <Button title='Settings - Parent Account' onPress={() => navigation.navigate('SettingParentScreen')} />
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
        backgroundColor: colors.neutralMist,
    },
    mainText: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subText: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
    },
    input: {
        height: 56,
        borderColor: '#ccc',
        borderWidth: 1,
        backgroundColor: '#fff',
        borderRadius: 32,
        padding: 8,
        marginVertical: 4,
        marginHorizontal: 0,
    },
    forgetPassword: {
        marginBottom: 16,
    }
});
