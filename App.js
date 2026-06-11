import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Animated,
  Easing,
  Platform,
} from 'react-native';

/**
 * HQ — Personal Command Center
 * Single-file Expo Snack build.
 * Dark "intelligence agency" theme: deep black backgrounds,
 * neon green / cyan text and borders.
 *
 * Navigation is handled with simple state (no external nav libs)
 * so it drops straight into Snack with zero extra dependencies.
 */

// ---- Theme tokens -----------------------------------------------------------
const COLORS = {
  bg: '#000000',
  panel: '#0A0F0D',
  panelAlt: '#070B0A',
  green: '#00FF9C',
  cyan: '#00E5FF',
  dim: '#1C2A26',
  textDim: '#5B6F68',
  danger: '#FF4757',
  amber: '#FFB300',
};

// ---- Small reusable bits ----------------------------------------------------
const Blink = ({ color = COLORS.green, size = 8 }) => {
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.15, duration: 700, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 700, easing: Easing.linear, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity,
        shadowColor: color,
        shadowOpacity: 0.9,
        shadowRadius: 6,
      }}
    />
  );
};

const Header = ({ clock }) => (
  <View style={styles.header}>
    <View style={styles.headerLeft}>
      <Blink />
      <Text style={styles.headerTitle}>HQ</Text>
      <Text style={styles.headerSub}>// COMMAND CENTER</Text>
    </View>
    <Text style={styles.headerClock}>{clock}</Text>
  </View>
);

const SectionCard = ({ code, title, subtitle, accent = COLORS.green, stat, onPress }) => (
  <TouchableOpacity activeOpacity={0.75} onPress={onPress} style={[styles.card, { borderColor: accent }]}>
    <View style={styles.cardTopRow}>
      <Text style={[styles.cardCode, { color: accent }]}>{code}</Text>
      <Blink color={accent} size={7} />
    </View>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardSub}>{subtitle}</Text>
    <View style={styles.cardFooter}>
      <Text style={[styles.cardStat, { color: accent }]}>{stat}</Text>
      <Text style={[styles.cardArrow, { color: accent }]}>›</Text>
    </View>
  </TouchableOpacity>
);

// ---- Screens ----------------------------------------------------------------
const SECTIONS = [
  { id: 'ops', code: 'OP-01', title: 'OPERATIONS', subtitle: 'Active missions & task queue', accent: COLORS.green, stat: '3 ACTIVE' },
  { id: 'fin', code: 'FN-02', title: 'FINANCE', subtitle: 'Capital, burn rate & ledgers', accent: COLORS.cyan, stat: 'SECURE' },
  { id: 'vault', code: 'VT-03', title: 'THE VAULT', subtitle: 'Encrypted assets & credentials', accent: COLORS.amber, stat: 'LOCKED' },
  { id: 'sys', code: 'SY-04', title: 'SYSTEM STATUS', subtitle: 'Diagnostics & uptime telemetry', accent: COLORS.green, stat: 'ONLINE' },
];

const Dashboard = ({ clock, onOpen }) => (
  <ScrollView contentContainerStyle={styles.screenPad} showsVerticalScrollIndicator={false}>
    <Header clock={clock} />

    <View style={styles.bannerRow}>
      <Text style={styles.bannerLabel}>OPERATOR STATUS</Text>
      <Text style={styles.bannerValue}>● CLEARED · LEVEL 5</Text>
    </View>

    <Text style={styles.sectionLabel}>— SELECT MODULE —</Text>

    <View style={styles.grid}>
      {SECTIONS.map((s) => (
        <View key={s.id} style={styles.gridItem}>
          <SectionCard {...s} onPress={() => onOpen(s)} />
        </View>
      ))}
    </View>

    <View style={styles.feed}>
      <Text style={styles.feedHeader}>// LIVE FEED</Text>
      {[
        '0613Z  Secure tunnel established',
        '0611Z  Finance ledger synced',
        '0559Z  Vault integrity check PASS',
        '0544Z  New directive queued · OP-01',
      ].map((line, i) => (
        <Text key={i} style={styles.feedLine}>
          <Text style={{ color: COLORS.green }}>{'> '}</Text>
          {line}
        </Text>
      ))}
    </View>
  </ScrollView>
);

const DetailScreen = ({ section, onBack }) => (
  <ScrollView contentContainerStyle={styles.screenPad} showsVerticalScrollIndicator={false}>
    <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
      <Text style={styles.backText}>‹ BACK TO HQ</Text>
    </TouchableOpacity>

    <View style={[styles.detailHero, { borderColor: section.accent }]}>
      <Text style={[styles.detailCode, { color: section.accent }]}>{section.code}</Text>
      <Text style={styles.detailTitle}>{section.title}</Text>
      <Text style={styles.detailSub}>{section.subtitle}</Text>
      <View style={[styles.detailStatPill, { borderColor: section.accent }]}>
        <Blink color={section.accent} size={7} />
        <Text style={[styles.detailStatText, { color: section.accent }]}>{section.stat}</Text>
      </View>
    </View>

    <Text style={styles.placeholderNote}>
      [ MODULE PLACEHOLDER ]{'\n\n'}This panel is reserved for the {section.title} subsystem.
      Wire your data sources, widgets, and controls here.
    </Text>
  </ScrollView>
);

// ---- Bottom Tab Bar ---------------------------------------------------------
const TABS = [
  { id: 'home', label: 'HQ', glyph: '◈' },
  { id: 'ops', label: 'OPS', glyph: '◎' },
  { id: 'fin', label: 'FIN', glyph: '$' },
  { id: 'sys', label: 'SYS', glyph: '⚙' },
];

const TabBar = ({ active, onChange }) => (
  <View style={styles.tabBar}>
    {TABS.map((t) => {
      const on = active === t.id;
      return (
        <TouchableOpacity key={t.id} style={styles.tab} activeOpacity={0.7} onPress={() => onChange(t.id)}>
          <Text style={[styles.tabGlyph, on && styles.tabGlyphOn]}>{t.glyph}</Text>
          <Text style={[styles.tabLabel, on && styles.tabLabelOn]}>{t.label}</Text>
          {on && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
      );
    })}
  </View>
);

// ---- Root -------------------------------------------------------------------
export default function App() {
  const [tab, setTab] = useState('home');
  const [detail, setDetail] = useState(null);
  const [clock, setClock] = useState('--:--:--');

  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      const p = (n) => String(n).padStart(2, '0');
      setClock(`${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}Z`);
    };
    fmt();
    const id = setInterval(fmt, 1000);
    return () => clearInterval(id);
  }, []);

  const openSection = (s) => setDetail(s);

  // Tab routing: tapping a non-home tab opens its module directly.
  const handleTab = (id) => {
    setTab(id);
    if (id === 'home') {
      setDetail(null);
    } else {
      const found = SECTIONS.find((s) => s.id === id) || SECTIONS.find((s) => s.id === 'vault');
      setDetail(found);
    }
  };

  let body;
  if (detail) {
    body = <DetailScreen section={detail} onBack={() => { setDetail(null); setTab('home'); }} />;
  } else {
    body = <Dashboard clock={clock} onOpen={openSection} />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <View style={styles.scanline} pointerEvents="none" />
      {body}
      <TabBar active={detail ? tab : 'home'} onChange={handleTab} />
    </SafeAreaView>
  );
}

// ---- Styles -----------------------------------------------------------------
const mono = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' });

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scanline: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 2,
    backgroundColor: COLORS.green,
    opacity: 0.06,
  },
  screenPad: { padding: 18, paddingBottom: 40 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: {
    color: COLORS.green,
    fontFamily: mono,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 4,
    marginLeft: 10,
  },
  headerSub: { color: COLORS.textDim, fontFamily: mono, fontSize: 11, marginLeft: 8, letterSpacing: 1 },
  headerClock: { color: COLORS.cyan, fontFamily: mono, fontSize: 13, letterSpacing: 1 },

  bannerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.dim,
    backgroundColor: COLORS.panelAlt,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginBottom: 22,
  },
  bannerLabel: { color: COLORS.textDim, fontFamily: mono, fontSize: 11, letterSpacing: 1 },
  bannerValue: { color: COLORS.green, fontFamily: mono, fontSize: 12, letterSpacing: 1 },

  sectionLabel: {
    color: COLORS.textDim,
    fontFamily: mono,
    fontSize: 11,
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: 14,
  },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48.5%', marginBottom: 14 },

  card: {
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    minHeight: 150,
    justifyContent: 'space-between',
  },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardCode: { fontFamily: mono, fontSize: 11, letterSpacing: 1 },
  cardTitle: { color: '#E8FFF6', fontFamily: mono, fontSize: 16, fontWeight: '700', letterSpacing: 1, marginTop: 14 },
  cardSub: { color: COLORS.textDim, fontFamily: mono, fontSize: 11, marginTop: 6, lineHeight: 16 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 },
  cardStat: { fontFamily: mono, fontSize: 11, letterSpacing: 1 },
  cardArrow: { fontSize: 22, lineHeight: 22, fontWeight: '700' },

  feed: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.dim,
    paddingTop: 16,
  },
  feedHeader: { color: COLORS.cyan, fontFamily: mono, fontSize: 11, letterSpacing: 2, marginBottom: 10 },
  feedLine: { color: COLORS.textDim, fontFamily: mono, fontSize: 12, lineHeight: 22 },

  backBtn: { marginBottom: 18 },
  backText: { color: COLORS.cyan, fontFamily: mono, fontSize: 13, letterSpacing: 1 },

  detailHero: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
    backgroundColor: COLORS.panel,
  },
  detailCode: { fontFamily: mono, fontSize: 12, letterSpacing: 2 },
  detailTitle: { color: '#E8FFF6', fontFamily: mono, fontSize: 26, fontWeight: '800', letterSpacing: 2, marginTop: 8 },
  detailSub: { color: COLORS.textDim, fontFamily: mono, fontSize: 13, marginTop: 8 },
  detailStatPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 18,
  },
  detailStatText: { fontFamily: mono, fontSize: 12, letterSpacing: 1, marginLeft: 8 },

  placeholderNote: {
    color: COLORS.textDim,
    fontFamily: mono,
    fontSize: 13,
    lineHeight: 22,
    marginTop: 24,
    borderWidth: 1,
    borderColor: COLORS.dim,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 18,
  },

  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.dim,
    backgroundColor: COLORS.panelAlt,
    paddingVertical: 8,
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 6 },
  tabGlyph: { color: COLORS.textDim, fontSize: 18, marginBottom: 3 },
  tabGlyphOn: { color: COLORS.green },
  tabLabel: { color: COLORS.textDim, fontFamily: mono, fontSize: 10, letterSpacing: 1 },
  tabLabelOn: { color: COLORS.green },
  tabUnderline: { width: 18, height: 2, backgroundColor: COLORS.green, marginTop: 4, borderRadius: 1 },
});
