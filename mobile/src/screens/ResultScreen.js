import { View, Text, StyleSheet, Button } from 'react-native';

export default function ResultScreen({ route, navigation }) {
    const result = route.params?.result;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>You scanned:</Text>
            <Text style={styles.object}>{result?.objectName}</Text>

            <Text style={styles.subtitle}>Fun facts will show here after facts are connected.</Text>

            <Button title="Scan Another Object" onPress={() => navigation.navigate('Scan')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'center' },
    title: { fontSize: 22 },
    object: { fontSize: 34, fontWeight: 'bold', marginVertical: 16 },
    subtitle: { fontSize: 16, marginBottom: 24 },
});
