import { Tabs } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Platform,
  TouchableOpacity,
  View,
  TouchableOpacityProps,
} from "react-native";
import { HapticTab } from "@/components/HapticTab";
import { Ionicons, AntDesign, MaterialIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { useAppContext } from "../Context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CreateEventBottomSheet from "@/components/CreateEventBottomSheet";

export default function TabLayout() {
  const [isSheetVisible, setSheetVisible] = useState(false);

  const { isKeyboardVisible } = useAppContext();

  const fadeAnim = useRef(new Animated.Value(1)).current; // Controls opacity

  const toggleCreateIcon = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }), // Fade out
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }), // Fade in
    ]).start();

    setSheetVisible((prev) => !prev);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            headerTitle: "",
            headerShown: false,
            tabBarShowLabel: false,
            tabBarActiveTintColor: "black",
            tabBarButton: HapticTab,
            tabBarLabelPosition: "beside-icon",
            tabBarStyle: {
              ...Platform.select({
                ios: {
                  position: "absolute",
                },
                default: {},
              }),
              ...styles.tabBar,
              display: isKeyboardVisible ? "none" : "flex",
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              tabBarIcon: ({ color }) => (
                <View style={styles.iconWrapper}>
                  <MaterialIcons size={36} color={color} name="pin-drop" />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="exploreEvents"
            options={{
              tabBarIcon: ({ color }) => (
                <View style={styles.iconWrapper}>
                  <Ionicons size={34} name="calendar-clear" color={color} />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="addEvent"
            options={{
              tabBarButton: (props) => (
                <TouchableOpacity
                  {...(props as TouchableOpacityProps)}
                  onPress={toggleCreateIcon}
                  activeOpacity={1}
                >
                  <Animated.View style={{ opacity: fadeAnim }}>
                    <AntDesign
                      size={36}
                      name={isSheetVisible ? "closecircle" : "pluscircle"}
                      color={"black"}
                    />
                  </Animated.View>
                </TouchableOpacity>
              ),
            }}
          />
        </Tabs>
        <CreateEventBottomSheet
          isVisible={isSheetVisible}
          closeSheet={toggleCreateIcon}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    height: 80,
    backgroundColor: "#F7F7F7",
  },
  iconWrapper: {
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  sheetContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
