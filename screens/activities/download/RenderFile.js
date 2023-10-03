import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import WebView from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";

import Setting from "../../../constants/Setting";
import PdfReader from "../../../src";
import * as IntentLauncher from "expo-intent-launcher";
import { t } from "i18next";

export default class RenderFile extends Component {
  render() {
    const res = this.props.navigation.getParam("data");

    if (res.file_mime == "application/pdf") {
      return (
        <PdfReader
          source={{
            uri: res.uri,
          }}
          customStyle={{
            readerContainerZoomContainer: {
              borderRadius: 30,
              backgroundColor: "black",
            },
            readerContainerZoomContainerButton: {
              borderRadius: 30,
            },
          }}
        />
      );
    }
    if (
      res.file_mime ==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      res.file_mime == "application/msword"
    ) {
      return (
        <View style={{ paddingTop: 20 }}>
          <Text style={styles.TextSlim}> {t("Can not open")} </Text>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => {
              if (Platform.OS === "ios") {
                Sharing.shareAsync(res.uri, {
                  mimeType: res.mimeType,
                  UTI: res.mimeType,
                });
              } else {
                IntentLauncher.startActivityAsync(
                  "android.intent.action.VIEW",
                  {
                    data: res.uri,
                    flags: 1,
                  }
                );
              }
            }}
          >
            <Ionicons
              name="open"
              color={"#da7437"}
              size={22}
              style={{ textAlign: "center" }}
            ></Ionicons>
            <Text style={styles.TextLarge}>{t("Open with")}</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <WebView
          source={{
            html: '<h1 style="padding-top: 60px" align="center">file not available!</h1>',
          }}
          scalesPageToFit={true}
          bounces={true}
          scrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          injectedJavaScript={
            'document.getElementsByClassName("header")[0].remove();'
          }
        />
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
    writingDirection: Setting.language != "en" ? "rtl" : "ltr",
  },
  btnPrimary: {
    borderRadius: 35,
    paddingVertical: 15,
    marginBottom: 20,
  },

  TextSlim: {
    textAlign: "center",
    fontWeight: "normal",
  },

  TextLarge: {
    textAlign: "center",
    color: "#da7437",
    fontWeight: "bold",
    fontSize: 22,
  },
});
