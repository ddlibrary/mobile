import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default class FeaturedResources extends React.Component {
  render() {
    const styles = StyleSheet.create({
      container: {
        marginLeft: this.props.language != "en" ? 8 : 0,
        marginRight: this.props.language != "en" ? 0 : 8,
        height: 100,
        width: 120,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        backgroundColor: "#fafafa",
        padding: 5,
      },
      subjectText: {
        fontSize: 12,
        textAlign: "center",
      },
    });

    let icon = "file-text";

    switch (this.props.icon) {
      case "far fa-file-alt":
        icon = "file-text";
        break;
      case "fas fa-book":
        icon = "book";
        break;
      case "far fa-newspaper":
        icon = "newspaper-o";
        break;
      case "fas fa-child":
        icon = "child";
        break;
      case "fas fa-school":
        icon = "institution";
        break;
      case "fas fa-graduation-cap":
        icon = "graduation-cap";
        break;
      case "fas fa-video":
        icon = "video-camera";
        break;
      case "sw":
        icon = require("../../../assets/images/home/storyweaver.png");
        break;
      case "covid":
        icon = require("../../../assets/images/home/covid19.png");
        break;
    }

    return (
      <View style={styles.container}>
        <View style={{ flex: 2, alignItems: "center" }}>
          {((this.props.icon == "sw" || this.props.icon == "covid") && (
            <Image
              source={icon}
              style={{
                flex: 1,
                width: 50,
                height: null,
                resizeMode: "contain",
              }}
            ></Image>
          )) || (
            <FontAwesome
              name={icon}
              style={{
                flex: 1,
                color: "#FFA200",
                fontWeight: 700,
                marginTop: 10,
                fontSize: 38,
              }}
            />
          )}
        </View>

        <View style={{ flex: 1, alignItems: "center", alignContent: "center" }}>
          <Text style={styles.subjectText}>{this.props.title}</Text>
        </View>
      </View>
    );
  }
}
