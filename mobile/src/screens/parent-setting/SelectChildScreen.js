import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';

export default function SelectChildScreen({ navigation }) {
    const [children, setChildren] = useState([]);

    useEffect(() => {
        loadChildren();
    }, []);

    const loadChildren = async () => {
        // API call later
    };

    const handleSelectChild = (child) => {
        navigation.navigate('Scan', {
            childId: child._id,
            childName: child.name,
        });
    };

    return (
        <View>
            <Text>Select Child</Text>

            <FlatList
                data={children}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleSelectChild(item)}>
                        <Text>{item.name}</Text>
                        <Text>Age: {item.age}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}
