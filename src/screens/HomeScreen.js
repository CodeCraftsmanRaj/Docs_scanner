import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import { colors } from '../theme';

const STEPS = [
  ['1', 'Point at the paper', 'Edges are found automatically and the page is captured for you.'],
  ['2', 'Scan page by page', 'Keep going — flip the sheet and scan the next page.'],
  ['3', 'PDF is made for you', 'Review, reorder or delete pages, then save or share the PDF.'],
];

export default function HomeScreen({ onScan, hasError }) {
  return (
    <View style={styles.root}>
      <Header subtitle="Paper Checking Scanner" />
      <ScrollView contentContainerStyle={styles.body}>
        <TouchableOpacity style={styles.scanCard} onPress={onScan} activeOpacity={0.85}>
          <Text style={styles.scanIcon}>⎙</Text>
          <Text style={styles.scanTitle}>Scan papers</Text>
          <Text style={styles.scanSub}>Tap to open the scanner</Text>
        </TouchableOpacity>

        {hasError ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>
              The scanner could not open. Make sure camera permission is allowed and Google Play
              services (Android) are up to date, then try again.
            </Text>
          </View>
        ) : null}

        <Text style={styles.how}>How it works</Text>
        {STEPS.map(([n, t, d]) => (
          <View key={n} style={styles.step}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>{n}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>{t}</Text>
              <Text style={styles.stepDesc}>{d}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  body: { padding: 18 },
  scanCard: {
    backgroundColor: colors.navy,
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 38,
    borderWidth: 2,
    borderColor: colors.gold,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  scanIcon: { fontSize: 54, color: colors.gold },
  scanTitle: { color: '#fff', fontSize: 24, fontWeight: '800', marginTop: 8 },
  scanSub: { color: '#cfd8f0', fontSize: 14, marginTop: 4 },
  errorBox: { backgroundColor: '#fdecea', borderRadius: 12, padding: 14, marginTop: 16 },
  errorText: { color: colors.danger, fontSize: 13.5, lineHeight: 19 },
  how: { fontSize: 16, fontWeight: '700', color: colors.navy, marginTop: 28, marginBottom: 10 },
  step: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.line,
  },
  stepNum: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: { color: colors.navyDark, fontWeight: '800', fontSize: 16 },
  stepTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  stepDesc: { fontSize: 13, color: colors.muted, marginTop: 2, lineHeight: 18 },
});
