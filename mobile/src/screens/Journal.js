import React, { useEffect, useState } from 'react';
import { useSelectedChild } from '../context/SelectedChildContext';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import colors from '../constants/colors';
import { Lock } from 'lucide-react-native';

// const CHILD_ID = "6a28f66e68e34f4224b78383";
const LEVEL_TITLES = ['Tiny Explorer', 'Curious Explorer', 'Junior Explore', 'Adventure Ranger', 'Master Explore'];


const JournalScreen = ({ route }) => {
    const navigation = useNavigation();

    const [child, setChild] = useState(null);
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const { selectedChild } = useSelectedChild();


    // useEffect(() => {
    //     if(childId)
    //     fetchData();
    // }, [childId]);
    useEffect(() => {
        const load = async () => {
            try {
                const id = selectedChild?._id;

                if (!id) {
                    setLoading(false);
                    return;
                }

                setChild(selectedChild);

                const res = await fetch(
                    `${process.env.EXPO_PUBLIC_API_URL}/api/gamification/${id}`
                );

                const data = await res.json();

                setChild(data);
                setBadges(data.badges || []);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [selectedChild]);


    // const fetchData = async (id) => {
    //     try {
    //         const response = await fetch(
    //             `${process.env.EXPO_PUBLIC_API_URL}/api/gamification/${id}`
    //         );
    //         const data = await response.json();
    //         setChild(data);
    //         setBadges(data.badges || []);
    //     } catch (error) {
    //         console.log('failed to catch data:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    if (loading) return <ActivityIndicator style={{ flex: 1 }} />;


    if (!child) {
        return (
            <View style={styles.emptyState}>
                <Text style={styles.summaryCount}>Journal unavailable</Text>
                <Text style={styles.summarySubtitle}>Please try again later.</Text>
            </View>
        );
    }


    const earnedCount = child.earnedBadges?.length ?? 0;
    const levelTitle = LEVEL_TITLES[child.currentLevel - 1] ?? 'Tiny Explorer';
    const progress = badges.length > 0 ? earnedCount / badges.length : 0;
    const getBadgeIconUrl = (badgeName) => {
        const fileName = badgeName.replace(/ /g, '_');
        return `https://curio4985-bucket.s3.us-east-1.amazonaws.com/${fileName}.png`;
    };


    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>


            {/* avatar, name */}
            <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        {(() => {
                            const avatar = child.avatar;
                            const avatars = [
                                "https://curio4985-bucket.s3.us-east-1.amazonaws.com/Fox.png",
                                "https://curio4985-bucket.s3.us-east-1.amazonaws.com/Eagle.png",
                                "https://curio4985-bucket.s3.us-east-1.amazonaws.com/Beaver.png",
                                "https://curio4985-bucket.s3.us-east-1.amazonaws.com/Moose.png",
                                "https://curio4985-bucket.s3.us-east-1.amazonaws.com/Wolf.png",
                                "https://curio4985-bucket.s3.us-east-1.amazonaws.com/Bear.png"
                            ];


                            if (typeof avatar === 'string' && avatar.startsWith('http')) {
                                return <Image source={{ uri: avatar }} style={styles.avatarImage} />;
                            }


                            const idx = parseInt(avatar, 10);
                            if (!isNaN(idx) && avatars[idx]) {
                                return <Image source={{ uri: avatars[idx] }} style={styles.avatarImage} />;
                            }


                            // return <Text style={styles.avatarEmoji}>🧒</Text>;
                        })()}
                    </View>
                    <Pressable onPress={() => navigation.navigate('AvatarChange', { childId: child?._id || selectedChild?._id })}>
                        <Image style={styles.pen} source={require('../assets/editButton.png')} />
                    </Pressable>
                </View>
                <Text style={styles.name}>{child.name}</Text>
            </View>


            {/* level, badge */}
            <View style={styles.levelRow}>
                <Text style={styles.levelText}>Level {child.currentLevel}</Text>
                <Text style={styles.titleText}>{levelTitle}</Text>
            </View>


            {/* progress */}
            <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
            </View>


            {/* summary */}
            <View style={styles.summaryCard}>
                <Image style={styles.summaryIcon} source={{ uri: 'https://curio4985-bucket.s3.us-east-1.amazonaws.com/Achievements_Unlocked.png' }} />
                <Text style={styles.summaryCount}>{earnedCount} achievements unlocked!</Text>
                <Text style={styles.summarySubtitle}>You're doing great, Explorer!</Text>
            </View>


            {/* all badges */}
            {badges.map((badge) => (
                <View key={badge.badgeId} style={[styles.badgeCard, !badge.earned && styles.badgeCardLocked]}>


                    <View style={[styles.badgeIcon, !badge.earned && styles.badgeIconLocked]}>
                        <Image
                            source={{ uri: getBadgeIconUrl(badge.name) }}
                            style={styles.badgeIconImage}
                        />
                    </View>


                    <View style={styles.badgeInfo}>
                        <View style={styles.titleRow}>
                            <Text style={styles.badgeName}>{badge.name}</Text>
                            {!badge.earned && <Lock size={18} />}
                        </View>
                        <Text style={[styles.badgeDesc, !badge.earned && styles.textLocked]}>
                            {badge.description}
                        </Text>
                        {!badge.earned && (
                            <Text style={styles.keepGoing}>Keep exploring!</Text>
                        )}
                    </View>


                    {/* <View style={styles.badgeRight}>
                        {badge.earned
                            ? null
                            : <Lock size={18}></Lock>
                        }
                    </View> */}
                </View>
            ))}


        </ScrollView>
    );
};


const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff'
    },
    content: {
        padding: 20,
        gap: 14,
        alignItems: 'center'
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    profileSection: {
        alignItems: 'center',
        gap: 8
    },
    avatarContainer: {
        position: 'relative',
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#D9D9D9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 50
    },
    avatarEmoji: {
        fontSize: 36
    },
    pen: {
        position: 'absolute',
        right: -14,
        bottom: -14,
        width: 28,
        height: 28,
        zIndex: 10,
    },
    name: {
        fontSize: 40,
        fontWeight: '700'
    },
    levelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    levelText: {
        fontSize: 16,
        fontWeight: '400',
        color: colors.neutralInk
    },
    titleText: {
        fontSize: 16,
        fontWeight: 400,
        color: colors.neutralInk
    },
    progressBarBg: {
        width: '100%',
        height: 18,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.neutralClay,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 15,
        backgroundColor: colors.secondary
    },
    summaryCard: {
        width: '100%',
        backgroundColor: colors.tertiary,
        borderRadius: 16,
        height: 170,
        padding: 20,
        alignItems: 'center',
        gap: 4,
    },
    summaryIcon: {
        width: 80,
        height: 85
    },
    summaryCount: {
        fontSize: 24,
        fontWeight: '700'
    },
    summarySubtitle: {
        fontSize: 16,
        fontWeight: 400,
        color: colors.neutralInk
    },
    badgeCard: {
        width: '100%',
        backgroundColor: colors.tertiary,
        borderRadius: 16,
        height: 150,
        padding: 30,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        position: 'relative',
        alignItems: 'center',
    },
    badgeCardLocked: {
        backgroundColor: '#F2F4F0',
        opacity: 0.5
    },
    badgeEmoji: {
        fontSize: 24
    },
    badgeInfo: {
        flex: 1,
        gap: 2
    },
    badgeIcon: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeIconLocked: {
        opacity: 0.2,
    },
    badgeIconImage: {
        width: 70,
        height: 80,
        resizeMode: 'contain',
    },
    titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
},
    badgeName: {
        fontSize: 24,
        fontWeight: '700'
    },
    badgeDesc: {
        fontSize: 16,
        color: colors.neutralInk
    },
    keepGoing: {
        fontSize: 12,
        color: '#000000',
    },
    textLocked: {
        color: '#999'
    },
});


export default JournalScreen;



