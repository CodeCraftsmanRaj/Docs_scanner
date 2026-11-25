import React from 'react';
import { Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import { colors, SCHOOL_NAME, SHORT_NAME } from '../theme';

export default function Header({ subtitle }) {
  return (
    <View style={styles.header}>
      <View style={styles.crest}>
        <Text style={styles.crestText}>S</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.short}>{SHORT_NAME}</Text>
        <Text style={styles.school} numberOfLines={1}>
          {SCHOOL_NAME}
        </Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const topPad = (Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 54) + 10;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.navy,
    paddingTop: topPad,
    paddingBottom: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 4,
    borderBottomColor: colors.gold,
  },
  crest: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.navyDark,
    borderWidth: 3,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crestText: { color: colors.gold, fontSize: 26, fontWeight: '900' },
  short: { color: colors.gold, fontSize: 24, fontWeight: '800', letterSpacing: 4 },
  school: { color: '#cfd8f0', fontSize: 11.5, marginTop: 1 },
  subtitle: { color: '#fff', fontSize: 14, fontWeight: '600', marginTop: 4 },
});
