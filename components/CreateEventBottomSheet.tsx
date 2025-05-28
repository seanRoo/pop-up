import React, { useCallback, useMemo, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

type CreateEventBottomSheetProps = {
  isVisible: boolean;
  closeSheet: () => void;
};

export default function CreateEventBottomSheet({
  isVisible,
  closeSheet,
}: CreateEventBottomSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["60%"], []);

  const handleSheetClose = useCallback(() => {
    bottomSheetRef.current?.close();
    closeSheet();
  }, [closeSheet]);

  if (!isVisible) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={0}
      enablePanDownToClose={true}
      onClose={handleSheetClose}
      backgroundStyle={styles.bottomSheetBackground}
      handleComponent={null}
      bottomInset={80}
    >
      <BottomSheetView style={styles.container}>
        <Text style={styles.title}>Create Event</Text>

        <TouchableOpacity
          style={styles.option}
          onPress={() => console.log("Create Public Event")}
        >
          <Ionicons name="megaphone-outline" size={28} color="#D88C00" />
          <View style={styles.textContainer}>
            <Text style={styles.optionTitle}>Public Event</Text>
            <Text style={styles.optionSubtitle}>Open for anyone to join</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => console.log("Create Private Event")}
        >
          <Ionicons name="lock-closed-outline" size={28} color="#D13438" />
          <View style={styles.textContainer}>
            <Text style={styles.optionTitle}>Private Event</Text>
            <Text style={styles.optionSubtitle}>
              Only invited people can join
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => console.log("Create Nearby Event")}
        >
          <MaterialCommunityIcons
            name="map-marker-radius-outline"
            size={28}
            color="#00A86B"
          />
          <View style={styles.textContainer}>
            <Text style={styles.optionTitle}>Nearby Event</Text>
            <Text style={styles.optionSubtitle}>
              Discoverable by users nearby
            </Text>
          </View>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  bottomSheetBackground: {
    backgroundColor: "#F5F5F5", // ✅ Light gray, warm neutral
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  handleIndicator: {
    backgroundColor: "#999", // Slightly darker gray for subtle contrast
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222", // ✅ Darker for contrast
    textAlign: "center",
    marginBottom: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: "#DDD",
  },
  textContainer: { marginLeft: 15 },
  optionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  optionSubtitle: {
    fontSize: 14,
    color: "#555",
  },
});
