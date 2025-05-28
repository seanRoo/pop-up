import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Image, StyleSheet, Text, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AppProvider from "./Context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <StatusBar backgroundColor="#7B1FA2" />
      <AppProvider>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              header: () => (
                <SafeAreaView style={styles.headerContainer}>
                  <View style={styles.iconWrapper}>
                    <Image
                      style={styles.avatar}
                      source={{
                        uri: "https://randomuser.me/api/portraits/men/5.jpg",
                      }}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 20,
                      paddingTop: 8,
                    }}
                  >
                    PopUp
                  </Text>
                  <View style={styles.iconWrapper}>
                    <FontAwesome size={32} name="bell" color={"black"} />
                  </View>
                </SafeAreaView>
              ),
            }}
          />
        </Stack>
      </AppProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 95,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 14,
    paddingBottom: 12,
  },
  iconWrapper: {
    height: 50,
    width: 50,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 15,
    marginLeft: -10,
  },
});
