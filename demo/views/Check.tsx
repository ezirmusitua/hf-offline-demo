import React, { useState } from "react";
import { View, Button } from "react-native";
import { Input } from "../components/Input";
import { Now } from "../components/Now";
import { ChecekIn } from "../components/CheckIn";
import { ECIES, TestCertPem, TestKeyPem } from "../services/ecies";
import { APIs } from "../services/api";

ECIES.init(TestCertPem, TestKeyPem);

async function uploadCheckInfo({ name, time, checkPoint }) {
  console.log(checkPoint);
  const cipher = ECIES.encrypt();
  const data = {
    name,
    time,
    checkPoint: cipher
  };

  await APIs.upload(data);
}

export default function Check() {
  const [time, setTime] = useState(new Date().toString());
  const [name, setName] = useState("jferroal");
  const [checkPoint, setCheckPoint] = useState("UNKNOWN");
  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: "#eaeaea",
          padding: 20,
          alignContent: "flex-start"
        }
      ]}
    >
      <Input label="Name" init={name} onInputUpdate={setName}></Input>
      <Now onTimeUpdate={setTime}></Now>
      <ChecekIn init={checkPoint} onCheckPointUpdate={setCheckPoint}></ChecekIn>
      <Button
        title="上传"
        onPress={async () => {
          await uploadCheckInfo({ name, time, checkPoint });
          setName("jferroal");
          setCheckPoint("UNKNOWN");
        }}
      ></Button>
    </View>
  );
}
