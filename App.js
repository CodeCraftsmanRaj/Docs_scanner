import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CameraView } from 'expo-camera';
import HomeScreen from './src/screens/HomeScreen';
import ReviewScreen from './src/screens/ReviewScreen';
import { buildPdf, rotatePage, sharePdf } from './src/utils/pdf';

class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error('App crash:', error, info?.componentStack);
  }
  render() {
    if (this.state.error) {
      return (
        <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 60, backgroundColor: '#fff' }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#b00020', marginBottom: 12 }}>
            App crashed
          </Text>
          <Text selectable style={{ fontSize: 14, color: '#111', marginBottom: 12 }}>
            {String(this.state.error?.message || this.state.error)}
          </Text>
          <Text selectable style={{ fontSize: 12, color: '#444' }}>
            {String(this.state.error?.stack || '')}
          </Text>
        </ScrollView>
      );
    }
    return this.props.children;
  }
}

const pad = (n) => String(n).padStart(2, '0');
function defaultName() {
  const d = new Date();
  return `SHAIS_${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
}

let counter = 0;
const newId = () => `p${Date.now()}_${counter++}`;

export default function App() {
  const [pages, setPages] = useState([]); // { id, uri }
  const [pdfUri, setPdfUri] = useState(null);
  const [busy, setBusy] = useState(false);
  const [scanError, setScanError] = useState(false);
  const [fileName, setFileName] = useState(defaultName());
  const scanning = useRef(false);
  const started = useRef(false);

  // Opens the native scanner (ML Kit on Android, VisionKit on iOS):
  // live edge detection, auto-capture, crop + straighten, multi-page.
  const scan = useCallback(async () => {
    if (scanning.current) return;
    scanning.current = true;
    setScanError(false);
    try {
      if (typeof CameraView.scanDocumentAsync !== 'function') {
        throw new Error(
          'Document scanning is not available in this runtime. Use a development build (see README) or an Expo Go version that supports it.'
        );
      }
      if (CameraView.isDocumentScannerAvailable === false) {
        throw new Error(
          'Document scanning is not available on this device/runtime. Make sure Google Play services (Android) are up to date, or use a development build.'
        );
      }
      const result = await CameraView.scanDocumentAsync({ quality: 1 });
      if (result?.pages?.length) {
        setPages((prev) => [...prev, ...result.pages.map((uri) => ({ id: newId(), uri }))]);
      }
    } catch (e) {
      setScanError(true);
      Alert.alert('Scanner error', String(e?.message || e));
    } finally {
      scanning.current = false;
    }
  }, []);

  // Open the scanner automatically when the app starts — no button press needed.
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const t = setTimeout(() => {
      scan().catch(() => {});
    }, 600);
    return () => clearTimeout(t);
  }, [scan]);

  // Whenever the pages change, (re)build the PDF automatically.
  useEffect(() => {
    if (pages.length === 0) {
      setPdfUri(null);
      return;
    }
    let cancelled = false;
    setPdfUri(null);
    setBusy(true);
    const t = setTimeout(async () => {
      try {
        const uri = await buildPdf(pages.map((p) => p.uri));
        if (!cancelled) setPdfUri(uri);
      } catch (e) {
        if (!cancelled) Alert.alert('Could not create PDF', String(e?.message || e));
      } finally {
        if (!cancelled) setBusy(false);
      }
    }, 500);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [pages]);

  const onShare = async () => {
    if (!pdfUri) return;
    try {
      await sharePdf(pdfUri, fileName);
    } catch (e) {
      Alert.alert('Could not share', String(e?.message || e));
    }
  };

  const onDelete = (id) => {
    Alert.alert('Delete this page?', 'It will be removed from the PDF.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setPages((p) => p.filter((x) => x.id !== id)) },
    ]);
  };

  const onMove = (index, dir) => {
    setPages((p) => {
      const j = index + dir;
      if (j < 0 || j >= p.length) return p;
      const copy = [...p];
      [copy[index], copy[j]] = [copy[j], copy[index]];
      return copy;
    });
  };

  const onRotate = async (id) => {
    const page = pages.find((p) => p.id === id);
    if (!page) return;
    try {
      const uri = await rotatePage(page.uri, 90);
      setPages((p) => p.map((x) => (x.id === id ? { ...x, uri } : x)));
    } catch (e) {
      Alert.alert('Could not rotate', String(e?.message || e));
    }
  };

  const onReset = () => {
    Alert.alert('Start a new scan?', 'This clears all current pages.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear & scan',
        style: 'destructive',
        onPress: () => {
          setPages([]);
          setPdfUri(null);
          setFileName(defaultName());
          scan();
        },
      },
    ]);
  };

  return (
    <ErrorBoundary>
      <StatusBar style="light" />
      {pages.length === 0 ? (
        <HomeScreen onScan={scan} hasError={scanError} />
      ) : (
        <ReviewScreen
          pages={pages}
          busy={busy}
          pdfReady={!!pdfUri}
          fileName={fileName}
          setFileName={setFileName}
          onAddMore={scan}
          onShare={onShare}
          onDelete={onDelete}
          onMove={onMove}
          onRotate={onRotate}
          onReset={onReset}
        />
      )}
    </ErrorBoundary>
  );
}
