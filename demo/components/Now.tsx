import React, { useState } from "react";
import { Text, View } from "react-native";

export function Now(props) {
  const [time, setTime] = useState(new Date().toString());
  setInterval(() => {
    const now = new Date().toString();
    setTime(now);
    props.onTimeUpdate(now);
  }, 1000);
  return <Text style={{ flex: 1 }}>{time}</Text>;
}
