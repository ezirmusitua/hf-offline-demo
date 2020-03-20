import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  Dimensions,
  ShadowPropTypesIOS
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

// const ScreenWidth = Dimensions.get("screen").width;

const opacity = "rgba(0, 0, 0, .6)";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  layerTop: {
    flex: 1,
    backgroundColor: opacity
  },
  layerCenter: {
    flex: 1,
    flexDirection: "row"
  },
  layerLeft: {
    flex: 1,
    backgroundColor: opacity
  },
  focused: {
    flex: 10
  },
  layerRight: {
    flex: 1,
    backgroundColor: opacity
  },
  layerBottom: {
    flex: 1,
    backgroundColor: opacity
  }
});

export default function Scanner(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    props.onScanned(data);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <BarCodeScanner
      onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      style={[StyleSheet.absoluteFill, styles.container]}
    >
      <View style={styles.layerTop}></View>
      <View style={styles.layerCenter}>
        <View style={styles.layerLeft}></View>
        <View style={styles.focused}></View>
        <View style={styles.layerRight}></View>
      </View>
      <View style={styles.layerBottom}></View>
    </BarCodeScanner>
  );
}
