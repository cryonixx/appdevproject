import { EventBus } from "@/constants/eventsBus";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// ✅ 1. Define the props here
interface AudioNotesHeaderProps {
  hideSettings?: boolean;
}

// ✅ 2. Pass in the prop and give it a default value of false
export default function AudioNotesHeader({
  hideSettings = false,
}: AudioNotesHeaderProps) {
  const theme = useColorScheme() ?? "light";
  const themeColors = Colors[theme];

  const handleSettingsPress = () => {
    EventBus.emitOpenSettings();
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: themeColors.background,
          borderBottomColor: themeColors.bordercolorSelected,
        },
      ]}
    >
      {/* 1. Static Title (Replaces the moving Tab Bar) */}
      <Text style={[styles.staticTitle, { color: themeColors.tint }]}>
        Audio Notes
      </Text>

      {/* ✅ 3. Conditionally render the button! */}
      {!hideSettings && (
        <TouchableOpacity
          onPress={handleSettingsPress}
          activeOpacity={0.7}
          style={styles.settingsButton}
        >
          <Image
            key={theme}
            source={require("@/assets/images/settings_icon.png")}
            style={{
              width: 40,
              height: 40,
              resizeMode: "contain",
              tintColor: themeColors.tint,
            }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 115, // Fixed height for the header
    justifyContent: "flex-end", // Aligns content to bottom (like a real header)
    paddingBottom: 10,
    paddingLeft: 20,
    borderBottomWidth: 3,
    elevation: 0,
  },
  staticTitle: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 5, // Small tweaks to match your previous layout
  },
  settingsButton: {
    position: "absolute",
    right: 20,
    bottom: 21,
    zIndex: 100,
    elevation: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
