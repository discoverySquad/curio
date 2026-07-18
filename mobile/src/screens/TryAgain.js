import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';
import CustomButton from '../components/CustomButton.js';
import { typography } from '../constants/fonts.js';

const TryAgain = ({ navigation, route }) => {

    const childId = route?.params?.childId;
    const categoryName = route?.params?.categoryName;
    const taskName = route?.params?.taskName;
    const activityId = route?.params?.activityId;
    const activityDescription = route?.params?.activityDescription;

const failSound = useAudioPlayer(require('../assets/sounds/fail.mp3'));

useEffect(() => {
    setAudioModeAsync({
        playsInSilentMode: true,
    }).catch((error) => {
        console.log('Audio mode error:', error);
    });
}, []);

useFocusEffect(
    useCallback(() => {
        failSound.seekTo(0);
        failSound.play();

        return undefined;
    }, [failSound]),
);

    const avator = [
        'https://curio4985-bucket.s3.us-east-1.amazonaws.com/Mascot_Wrong_Answer_1.png',
        'https://curio4985-bucket.s3.us-east-1.amazonaws.com/Mascot_Wrong_Answer_2.png',
        'https://curio4985-bucket.s3.us-east-1.amazonaws.com/Mascot_Wrong_Answer_3.png',
    ];
    const randomAvatar = avator[Math.floor(Math.random() * avator.length)];

    const tryAgain = () => {
        navigation.navigate('ScanCamera', {
            childId,
            categoryName,
            taskName,
            activityId,
            activityTitle: taskName,
            activityDescription,
        });
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={[styles.h2, typography.h2]}>Not quite what we are looking for...</Text>

            <View style={styles.imgContainer}>
                <Image style={styles.avator} source={{ uri: randomAvatar }} />
            </View>

            <View style={styles.tipBox}>
                <Image style={styles.infoIcon} source={require('../assets/Background_icon.png')} />
                <Text style={[styles.tipText, typography.section]}>Need a hand? Ask an adult to help you find a matching pattern!</Text>
            </View>

            <View style={styles.buttonSection}>
                <CustomButton label="Try Again" onPress={tryAgain} />
            </View>

            {/* <Pressable style={styles.tryAgainBtn} onPress={() => navigation?.navigate('')}>
            <Text style={styles.tryAgainBtnText}>Try Again</Text>
        </Pressable> */}

            <Pressable style={[styles.changeActivityBtn]} onPress={() => navigation?.navigate('SelectCategory')}>
                <Text style={[styles.changeActivityBtnText, typography.h3]}>Change Activity</Text>
            </Pressable>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: "center",
        fontFamily: '',
    },
    content: {
        alignItems: 'center',
        marginHorizontal: 42,
    },

    h2: {
        //   fontSize: 28,
        textAlign: 'center',
        marginTop: 24,
        //   color:"#574239"
    },
    imgContainer: {
        // height:318,
        // width:318,
        justifyContent: 'center',
        // backgroundColor:"#a6a5a5",
        marginTop: 40,
        marginBottom: 40,
    },
    avator: {
        width: 318,
        height: 318,
        resizeMode: 'contain',
    },
    tipBox: {
        flex: 1,
        flexDirection: 'row',
        gap: 24,
        backgroundColor: '#F0BA7A',
        width: 358,
        height: 144,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 32,
        paddingHorizontal: 20,
        marginBottom: 94,
    },
    infoIcon: {
        width: 80,
        height: 80,
    },
    tipText: {
        fontSize: 16,
        textAlign: 'left',
        color: '#000000',
        width: 206,
        lineHeight: 24,
    },
    buttonSection: {
        width: 318,
    },
    // tryAgainBtn: {
    //     borderRadius: 32,
    //   backgroundColor: '#111111',
    //   paddingVertical: 14,
    //   paddingHorizontal: 24,
    //   width: 318,
    //   alignItems: 'center',
    //   marginBottom: 12,
    // },
    // tryAgainBtnText: {
    //   color: '#FFFFFF',
    //   fontSize: 16,
    //   fontWeight: '600',
    // },
    changeActivityBtn: {
        marginTop: 35,
        width: '100%',
        height: 67,
        paddingVertical: 17,
        borderRadius: 32,
        borderWidth: 2,
        borderColor: '#F0BA7A',
        backgroundColor: '#F9FBF7',
        alignItems: 'center',
        marginBottom: 60,
    },
    changeActivityBtnText: {
        color: '#3D332E',
    },
});

export default TryAgain;
