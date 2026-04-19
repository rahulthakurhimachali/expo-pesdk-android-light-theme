import { useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { PESDK } from "react-native-photoeditorsdk";

const FEATURES = ["Filters", "Transform", "Crop", "Adjust", "Sticker", "Text"];

export default function Index() {
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [pressing, setPressing] = useState(false);

  async function openEditor() {
    try {
      const result = await PESDK.openEditor(
        require("../../assets/images/splash-icon.png")
      );
      if (result) {
        setEditedImage(result.image);
      }
    } catch (e) {
      console.error("PESDK error:", e);
    }
  }

  const isAndroid = Platform.OS === "android";

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>PESDK</Text>
        </View>
        <Text style={styles.title}>Photo Editor SDK</Text>
        <Text style={styles.subtitle}>
          Light theme · Android example
        </Text>
      </View>

      {/* Image Card */}
      <View style={styles.card}>
        {editedImage ? (
          <>
            <Image source={{ uri: editedImage }} style={styles.resultImage} />
            <View style={styles.cardFooter}>
              <View style={styles.dot} />
              <Text style={styles.cardFooterText}>Edited result</Text>
            </View>
          </>
        ) : (
          <View style={styles.placeholder}>
            <View style={styles.placeholderIcon}>
              <View style={styles.iconCircle} />
              <View style={styles.iconRect} />
            </View>
            <Text style={styles.placeholderTitle}>No image yet</Text>
            <Text style={styles.placeholderSub}>
              Open the editor to get started
            </Text>
          </View>
        )}
      </View>

      {/* Feature chips */}
      <View style={styles.chipRow}>
        {FEATURES.map((f) => (
          <View key={f} style={styles.chip}>
            <Text style={styles.chipText}>{f}</Text>
          </View>
        ))}
      </View>

      {/* CTA Button */}
      <Pressable
        style={[
          styles.button,
          !isAndroid && styles.buttonDisabled,
          pressing && isAndroid && styles.buttonPressed,
        ]}
        onPress={openEditor}
        onPressIn={() => setPressing(true)}
        onPressOut={() => setPressing(false)}
        disabled={!isAndroid}
      >
        <View style={styles.buttonInner}>
          <View style={styles.buttonIcon}>
            <View style={styles.lensOuter}>
              <View style={styles.lensInner} />
            </View>
          </View>
          <Text style={styles.buttonText}>
            {editedImage ? "Edit Again" : "Open Photo Editor"}
          </Text>
        </View>
      </Pressable>

      {!isAndroid && (
        <Text style={styles.platformNote}>
          Android only - not supported on {Platform.OS}
        </Text>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by Expo &amp; PESDK</Text>
      </View>
    </ScrollView>
  );
}

const BRAND = "#208AEF";
const BRAND_LIGHT = "#E6F4FE";

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#F5F9FF",
  },
  container: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 40,
    gap: 24,
  },

  // Header
  header: {
    alignItems: "center",
    gap: 6,
  },
  badge: {
    backgroundColor: BRAND,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0D1B2A",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7A90",
    fontWeight: "500",
  },

  // Card
  card: {
    width: "100%",
    borderRadius: 20,
    backgroundColor: "#fff",
    overflow: "hidden",
    shadowColor: "#208AEF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  resultImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F4F8",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#34C759",
  },
  cardFooterText: {
    fontSize: 13,
    color: "#6B7A90",
    fontWeight: "500",
  },
  placeholder: {
    height: 260,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: BRAND_LIGHT,
  },
  placeholderIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    shadowColor: BRAND,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  iconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 3,
    borderColor: BRAND,
    position: "absolute",
    top: 14,
    left: 14,
  },
  iconRect: {
    width: 36,
    height: 28,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: BRAND,
  },
  placeholderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0D1B2A",
  },
  placeholderSub: {
    fontSize: 13,
    color: "#6B7A90",
  },

  // Chips
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  chip: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D6E8FC",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  chipText: {
    fontSize: 13,
    color: BRAND,
    fontWeight: "600",
  },

  // Button
  button: {
    width: "100%",
    backgroundColor: BRAND,
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: BRAND,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: "#B0C4D8",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  buttonIcon: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  lensOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2.5,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  lensInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  platformNote: {
    fontSize: 13,
    color: "#9BAAB8",
    textAlign: "center",
    marginTop: -8,
  },

  // Footer
  footer: {
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    opacity: 0.5,
  },
  footerText: {
    fontSize: 12,
    color: "#6B7A90",
  },
});
