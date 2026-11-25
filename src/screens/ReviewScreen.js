import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../components/Header';
import { colors } from '../theme';

export default function ReviewScreen({
  pages,
  busy,
  pdfReady,
  fileName,
  setFileName,
  onAddMore,
  onShare,
  onDelete,
  onMove,
  onRotate,
  onReset,
}) {
  const [selected, setSelected] = useState(null);
  const [preview, setPreview] = useState(null);

  const status = busy ? 'Making PDF…' : pdfReady ? 'PDF ready' : '';

  return (
    <View style={styles.root}>
      <Header subtitle={`${pages.length} page${pages.length === 1 ? '' : 's'} scanned`} />

      <View style={styles.nameRow}>
        <Text style={styles.label}>File name</Text>
        <TextInput
          style={styles.input}
          value={fileName}
          onChangeText={setFileName}
          placeholder="e.g. 10B_Roll12_Maths"
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
        />
        <Text style={[styles.status, { color: pdfReady ? colors.success : colors.muted }]}>{status}</Text>
      </View>

      <FlatList
        data={pages}
        keyExtractor={(p) => p.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={({ item, index }) => {
          const isSel = selected === item.id;
          return (
            <TouchableOpacity
              style={[styles.cell, isSel && styles.cellSel]}
              onPress={() => setSelected(isSel ? null : item.id)}
              onLongPress={() => setPreview(item.uri)}
              activeOpacity={0.9}
            >
              <Image source={{ uri: item.uri }} style={styles.thumb} resizeMode="contain" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{index + 1}</Text>
              </View>
              {isSel ? (
                <View style={styles.tools}>
                  <Tool label="◀" onPress={() => onMove(index, -1)} disabled={index === 0} />
                  <Tool label="⟳" onPress={() => onRotate(item.id)} />
                  <Tool label="🔍" onPress={() => setPreview(item.uri)} />
                  <Tool label="🗑" onPress={() => onDelete(item.id)} danger />
                  <Tool label="▶" onPress={() => onMove(index, 1)} disabled={index === pages.length - 1} />
                </View>
              ) : null}
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={<Text style={styles.tip}>Tap a page for options • long-press to preview</Text>}
      />

      <View style={styles.bar}>
        <TouchableOpacity style={styles.secondary} onPress={onAddMore}>
          <Text style={styles.secondaryText}>+ More pages</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primary, (!pdfReady || busy) && { opacity: 0.55 }]}
          onPress={onShare}
          disabled={!pdfReady || busy}
        >
          {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Save / Share PDF</Text>}
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.newScan} onPress={onReset}>
        <Text style={styles.newScanText}>Start a new scan</Text>
      </TouchableOpacity>

      <Modal visible={!!preview} transparent animationType="fade" onRequestClose={() => setPreview(null)}>
        <TouchableOpacity style={styles.modal} activeOpacity={1} onPress={() => setPreview(null)}>
          {preview ? <Image source={{ uri: preview }} style={styles.modalImg} resizeMode="contain" /> : null}
          <Text style={styles.modalHint}>Tap anywhere to close</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

function Tool({ label, onPress, disabled, danger }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.tool, danger && { backgroundColor: colors.danger }, disabled && { opacity: 0.3 }]}
    >
      <Text style={styles.toolText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  nameRow: { paddingHorizontal: 16, paddingTop: 12 },
  label: { fontSize: 12, fontWeight: '700', color: colors.navy, marginBottom: 4 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 15,
    color: colors.text,
  },
  status: { fontSize: 12, fontWeight: '600', marginTop: 5, marginBottom: 2, minHeight: 16 },
  grid: { padding: 10 },
  cell: {
    flex: 1 / 2,
    aspectRatio: 0.72,
    margin: 6,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  cellSel: { borderColor: colors.gold },
  thumb: { flex: 1, backgroundColor: '#eef0f6' },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.navy,
    borderRadius: 11,
    minWidth: 22,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: 'center',
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  tools: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(11,32,80,0.88)',
    paddingVertical: 6,
  },
  tool: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  toolText: { color: '#fff', fontSize: 16 },
  tip: { textAlign: 'center', color: colors.muted, fontSize: 12, marginVertical: 8 },
  bar: { flexDirection: 'row', gap: 10, paddingHorizontal: 14, paddingTop: 8 },
  primary: {
    flex: 1.4,
    backgroundColor: colors.navy,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  secondary: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: colors.navy,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: { color: colors.navy, fontSize: 15, fontWeight: '800' },
  newScan: { alignItems: 'center', paddingVertical: 12, paddingBottom: 22 },
  newScanText: { color: colors.danger, fontSize: 14, fontWeight: '600' },
  modal: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', alignItems: 'center', justifyContent: 'center' },
  modalImg: { width: '96%', height: '86%' },
  modalHint: { color: '#aab', marginTop: 10, fontSize: 12 },
});
