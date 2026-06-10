import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    ActivityIndicator, Image,
} from 'react-native';

const CHILD_ID = "6a28f66e68e34f4224b78383";
const LEVEL_TITLES = ['Tiny Explorer', 'Curious Explorer', 'Junior Explore', 'Adventure Ranger', 'Master Explore'];

const JournalScreen = () => {
    const [child, setChild] = useState(null);
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/api/gamification/${CHILD_ID}`
            );
            const data = await response.json();
            setChild(data);
            setBadges(data.badges);
        } catch (error) {
            console.log('failed to catch data:', error);
        } finally {
            setLoading(false);
        }
    };

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
    const levelTitle = LEVEL_TITLES[child.currentLevel] ?? 'Tiny Explorer';
    const progress = badges.length > 0 ? earnedCount / badges.length : 0;

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>

            {/* avatar, name */}
            <View style={styles.profileSection}>
                <View style={styles.avatar}>
                    {child.avatar
                        ? <Image source={{ uri: child.avatar }} style={styles.avatarImage} />
                        : <Text style={styles.avatarEmoji}>🧒</Text>
                    }
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
                <Text style={styles.summaryCount}>{earnedCount} achievements unlocked</Text>
                <Text style={styles.summarySubtitle}>You're doing great, Explorer!</Text>
            </View>

            {/* all badges */}
            {badges.map((badge) => (
                <View key={badge.badgeId} style={[styles.badgeCard, !badge.earned && styles.badgeCardLocked]}>

                    <View style={[styles.badgeIcon, !badge.earned && styles.badgeIconLocked]}>
                    </View>

                    <View style={styles.badgeInfo}>
                        <Text style={[styles.badgeName, !badge.earned && styles.textLocked]}>
                            {badge.name}
                        </Text>
                        <Text style={[styles.badgeDesc, !badge.earned && styles.textLocked]}>
                            {badge.description}
                        </Text>
                        {!badge.earned && (
                            <Text style={styles.keepGoing}>Keep exploring!</Text>
                        )}
                    </View>
                    
                    <View style={styles.badgeRight}>
                        {badge.earned
                            ? <View style={styles.tag}><Text style={styles.tagText}>Unlocked</Text></View>
                            : <Text style={styles.lockIcon}>🔒</Text>
                        }
                    </View>
                </View>
            ))}

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#fff' },
    content: { padding: 20, gap: 14, alignItems: 'center' },
    emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },

    profileSection: { alignItems: 'center', gap: 8 },
    avatar: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: '#D9D9D9',
        justifyContent: 'center', alignItems: 'center',
    },
    avatarImage: { width: 80, height: 80, borderRadius: 40 },
    avatarEmoji: { fontSize: 36 },
    name: { fontSize: 22, fontWeight: '700' },

    levelRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    levelText: { fontSize: 13, fontWeight: '600', color: '#333' },
    titleText: { fontSize: 13, color: '#666' },
    progressBarBg: { width: '100%', height: 8, borderRadius: 4, backgroundColor: '#E0E0E0' },
    progressBarFill: { height: 8, borderRadius: 4, backgroundColor: '#333' },

    summaryCard: {
        width: '100%', backgroundColor: '#EFEFEF',
        borderRadius: 16, padding: 20, alignItems: 'center', gap: 4,
    },
    summaryCount: { fontSize: 16, fontWeight: '700' },
    summarySubtitle: { fontSize: 13, color: '#666' },

    badgeCard: {
        width: '100%', backgroundColor: '#EFEFEF',
        borderRadius: 16, padding: 16,
        flexDirection: 'row', alignItems: 'center', gap: 14,
    },
    badgeCardLocked: { opacity: 0.5 },
    badgeEmoji: { fontSize: 24 },
    badgeInfo: { flex: 1, gap: 2 },
    badgeName: { fontSize: 16, fontWeight: '700' },
    badgeDesc: { fontSize: 12, color: '#555' },
    keepGoing: { fontSize: 11, color: '#888', fontStyle: 'italic' },
    textLocked: { color: '#999' },

    badgeRight: { alignItems: 'center' },
    tag: {
        backgroundColor: '#333', borderRadius: 8,
        paddingHorizontal: 8, paddingVertical: 4,
    },
    tagText: { color: '#fff', fontSize: 11, fontWeight: '600' },
});

export default JournalScreen;
