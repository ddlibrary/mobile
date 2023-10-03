import React from "react";
import WebView from "react-native-webview";
import Setting from "../../../constants/Setting";
import { View } from "react-native";

export default function NewsView({ navigation }) {
  NewsView.navigationOptions = {
    title: navigation.getParam("title"),
  };
  return (
    <WebView
      source={{
        uri: Setting.baseUrl + "api/news_view/" + navigation.getParam("id"),
      }}
      scalesPageToFit={true}
      bounces={true}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      injectedJavaScript={
        'document.getElementsByClassName("header")[0].remove();'
      }
    />
  );
}
