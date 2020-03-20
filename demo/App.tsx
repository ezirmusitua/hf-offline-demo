import React, { useState } from "react";
import { Dimensions } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import Check from "./views/Check";
import Records from "./views/Records";

const initialLayout = { width: Dimensions.get("window").width };

export default function App() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "home", title: "Home Page" },
    { key: "records", title: "Records" }
  ]);

  const renderScene = SceneMap({
    home: Check,
    records: Records
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      style={{ flex: 1 }}
    ></TabView>
  );
}
