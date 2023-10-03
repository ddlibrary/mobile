import React from "react";
import WebView from "react-native-webview";
import Setting from "../../../constants/Setting";

export default function LinkView({ navigation }) {
  LinkView.navigationOptions = {
    title: navigation.getParam("title"),
  };
  let forbiddenLinks = ["fa/impact", "en/impact", "ps/impact"];
  console.log(
    Setting.baseUrl +
      (!forbiddenLinks.includes(navigation.getParam("path")) ? "" : "") +
      navigation.getParam("path").split("/").pop()
  );
  return (
    <WebView
      source={{
        uri:
          Setting.baseUrl +
          (!forbiddenLinks.includes(navigation.getParam("path"))
            ? "api/page_view/" + navigation.getParam("path").split("/").pop()
            : navigation.getParam("path")),
      }}
      scalesPageToFit={true}
      bounces={true}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      injectedJavaScript={
        "document.getElementsByClassName(\"header\")[0].remove();document.getElementsByTagName('footer')[0].remove();"
      }
    />
  );
}
