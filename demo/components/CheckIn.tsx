import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import Scanner from "./Scanner";

export function ChecekIn(props) {
  const [checkPoint, setCheckPoint] = useState(props.init);
  const [scanning, setScanning] = useState(false);
  return (
    <View style={[{ flex: 1 }]}>
      <Text>打卡点</Text>
      <View
        style={[
          {
            flexDirection: "row",
            justifyContent: "space-between",
            height: 48
          }
        ]}
      >
        <Text>{checkPoint}</Text>
        <Button
          title="打卡"
          onPress={() => {
            setScanning(true);
          }}
        ></Button>
      </View>
      {scanning && (
        <Scanner
          onScanned={data => {
            setCheckPoint(data);
            props.onCheckPointUpdate(data);
            setScanning(false);
          }}
        ></Scanner>
      )}
    </View>
  );
}
