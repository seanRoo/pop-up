import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ListRenderItem,
} from "react-native";
import events from "./events.json";
import { Event } from "@/types/types";

const groupEventsByDate = (events: Event[]) => {
  return events.reduce((acc: Record<string, Event[]>, event) => {
    if (!acc[event.date]) {
      acc[event.date] = [];
    }
    acc[event.date].push(event);
    return acc;
  }, {});
};

export default function LiveUpdatesScreen() {
  const groupedEvents = groupEventsByDate(events);
  const groupedArray = Object.keys(groupedEvents).map((date) => ({
    date,
    events: groupedEvents[date],
  }));

  const renderGroupedEvent: ListRenderItem<{
    date: string;
    events: Event[];
  }> = ({ item }) => (
    <View style={styles.eventContainer}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{item.date}</Text>
        {item.events[0].month ? (
          <Text style={styles.monthText}>{item.events[0].month}</Text>
        ) : null}
      </View>
      <View style={styles.eventList}>
        {item.events.map((event, index) => (
          <TouchableOpacity
            key={index}
            style={styles.eventDetails}
            activeOpacity={0.5}
          >
            <View key={index} style={styles.eventDetails}>
              <View style={styles.timeAttendeesContainer}>
                <Text style={styles.eventTime}>{event.time}</Text>
                <View style={styles.attendees}>
                  {event.attendees.map((avatar, i) => (
                    <Image
                      key={i}
                      source={{ uri: avatar }}
                      style={styles.avatar}
                    />
                  ))}
                </View>
              </View>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <View style={styles.tagsContainer}>
                {event.tags.map((tag, i) => (
                  <View key={i} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Upcoming Events</Text>
      </View>
      <FlatList
        data={groupedArray}
        keyExtractor={(item) => item.date}
        renderItem={renderGroupedEvent}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 20,
          paddingLeft: 10,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", paddingLeft: 10 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: { fontSize: 24, fontWeight: "bold" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  eventList: { paddingHorizontal: 15, flex: 1, gap: 14 },
  eventContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    flex: 1,
  },

  dateContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  dateText: { fontSize: 18, fontWeight: "bold" },
  monthText: { fontSize: 12, color: "#555" },

  eventDetails: {
    flex: 1,
    marginBottom: 10,
  },
  timeAttendeesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  eventTime: { fontSize: 14, color: "#666", flexShrink: 1 },
  attendees: { flexDirection: "row" },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: -10,
    borderWidth: 1,
    borderColor: "white",
  },
  eventTitle: { fontSize: 20, fontWeight: "bold" },
  tagsContainer: { flexDirection: "row", marginTop: 5 },
  tag: {
    backgroundColor: "#c49d5e",
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginRight: 5,
  },
  tagText: { fontSize: 12, color: "white" },
});
