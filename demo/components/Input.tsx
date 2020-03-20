import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";

export function Input(props) {
  const [inputVal, setInputVal] = useState(props.init || "");
  return (
    <View style={[{ flex: 1 }]}>
      <Text>{props.label}</Text>
      <TextInput
        placeholder="Type something here"
        onChangeText={text => {
          props.updateInputVal(text);
          setInputVal(text);
        }}
        value={inputVal}
      ></TextInput>
    </View>
  );
}
