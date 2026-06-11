import { View, Text, Button, StyleSheet } from 'react-native';

const DUMMY_CHILD_ID = '6a28f66e68e34f4224b78383';

export default function ParentDashboardScreen({ navigation, route }) {
    const user = route.params?.user;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Parent Dashboard</Text>
            <Text style={styles.subtitle}>Welcome {user?.fullName || user?.name || 'Parent'}</Text>

            <Button title="Create Child Profile" onPress={() => navigation.navigate('CreateChild')} />

            <Button title="Select Child Profile" onPress={() => navigation.navigate('SelectChild')} />

            <Button
                title="Start Scanning"
                onPress={() =>
                    navigation.navigate('Scan', {
                        childId: DUMMY_CHILD_ID,
                    })
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
    subtitle: { fontSize: 18, marginBottom: 24 },
});
