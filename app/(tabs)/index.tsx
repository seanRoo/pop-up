import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import MapView, { MapMarker, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import events from "./events.json";
import { Event } from "@/types/types";
import { getDistance } from "geolib";
import { filterEvents, getTodaysEvents } from "@/utils/utils";
import { useAppContext } from "../Context";

export default function DiscoverScreen() {
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  const mapRef = useRef<MapView | null>(null);
  const listRef = useRef<FlatList | null>(null);
  const markerRefs = useRef<Record<string, MapMarker | null>>({});

  const { isKeyboardVisible } = useAppContext();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);
    })();
  }, []);

  const eventsData = useMemo(() => {
    if (location) {
      const eventsWithDistance = getTodaysEvents(events).map((event) => ({
        ...event,
        distance: getDistance(
          {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          { latitude: event.latitude, longitude: event.longitude }
        ),
      }));

      return filterEvents(
        eventsWithDistance.sort((a, b) => a.distance - b.distance),
        inputValue
      );
    }
    return [];
  }, [location, inputValue]);

  const jumpToMarker = ({ latitude, longitude, id }: Event) => {
    if (mapRef.current) {
      markerRefs.current[id]?.showCallout();
      mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );

      const eventIndex = eventsData.findIndex((event) => event.id === id);
      if (listRef.current && eventIndex !== -1) {
        listRef.current.scrollToIndex({ index: eventIndex, animated: true });
      }
    }
  };

  const renderEventItem: ListRenderItem<Event> = ({ item }) => (
    <TouchableOpacity onPress={() => jumpToMarker(item)}>
      <View style={styles.eventItem}>
        <View style={styles.icon}>
          <Ionicons name="location" size={28} color="#7B1FA2" />
          <Text style={{ fontSize: 12 }}>
            {item?.distance ? `${(item.distance / 1000).toFixed(1)} km` : ""}
          </Text>
        </View>
        <View>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <Text style={styles.eventSubtitle}>{item.subtitle}</Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Hosted by: </Text>
            {item.hostedBy}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const mapHeight =
    Dimensions.get("window").height * (isKeyboardVisible ? 0.05 : 0.45);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ ...styles.map, height: mapHeight }}
        region={{
          latitude: location?.latitude || 37.7749,
          longitude: location?.longitude || -122.4194,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="You are here"
            pinColor="green"
          />
        )}
        {eventsData.map((event) => (
          <Marker
            ref={(ref) => (markerRefs.current[event.id] = ref)}
            onPress={() => jumpToMarker(event)}
            key={event.id}
            coordinate={{
              latitude: event.latitude,
              longitude: event.longitude,
            }}
            title={event.title}
            pinColor="#7B1FA2"
          />
        ))}
      </MapView>
      <TouchableOpacity style={styles.floatingButton}>
        <FontAwesome5 color="black" size={28} name="list-alt" />
      </TouchableOpacity>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="black" />
        <TextInput
          placeholder="Explore Nearby Events"
          style={styles.searchInput}
          value={inputValue}
          onChangeText={setInputValue}
        />
      </View>
      <View style={styles.container}>
        <FlatList
          ref={listRef}
          data={eventsData}
          keyExtractor={(item) => item.id}
          renderItem={renderEventItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={() => <Text>No Items</Text>}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7" },
  map: {
    width: "100%",
    // height: Dimensions.get("window").height * 0.45, // Takes up 50% of the screen
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: -10, // Overlaps map slightly
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  list: {
    paddingHorizontal: 20,
    backgroundColor: "#F7F7F7",
  },
  eventItem: {
    flexDirection: "row",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  icon: {
    marginRight: 30,
    alignSelf: "flex-start",
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  eventSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  floatingButton: {
    position: "absolute",
    top: 15, // Distance from bottom
    right: 5,
    padding: 10,
    backgroundColor: "white",
    elevation: 5, // Shadow effect for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderRadius: 50,
  },
});
