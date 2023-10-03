import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default class Subjects extends React.Component {
  render() {
    const styles = StyleSheet.create({
      container: {
        marginLeft: this.props.language != "en" ? 8 : 0,
        marginRight: this.props.language != "en" ? 0 : 8,
        height: 100,
        width: 118,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        backgroundColor: "#fafafa",
        padding: 5,
        paddingBottom: 20,
      },
      subjectText: {
        fontSize: this.props.language != "en" ? 10 : 9.5,
        textAlign: "center",
      },
    });

    let icon = require("../../../assets/images/home/social-sciences-icon.png");

    switch (this.props.icon) {
      case "mathematics-icon.png":
        icon = require("../../../assets/images/home/mathematics-icon.png");
        break;
      case "social-sciences-icon.png":
        icon = require("../../../assets/images/home/social-sciences-icon.png");
        break;
      case "life-sciences-icon.png":
        icon = require("../../../assets/images/home/life-sciences-icon.png");
        break;
      case "language-arts-icon.png":
        icon = require("../../../assets/images/home/language-arts-icon.png");
        break;
      case "applied-sciences-icon-2.png":
        icon = require("../../../assets/images/home/applied-sciences-icon-2.png");
        break;
      case "arts-and-humanities-icon.png":
        icon = require("../../../assets/images/home/arts-and-humanities-icon.png");
        break;
      case "business-and-communication-icon.png":
        icon = require("../../../assets/images/home/business-and-communication-icon.png");
        break;
      case "career-and-technical-education-icon.png":
        icon = require("../../../assets/images/home/career-and-technical-education-icon.png");
        break;
    }

    return (
      <View style={styles.container}>
        <View style={{ flex: 2, alignItems: "center" }}>
          <Image
            source={icon}
            style={{ flex: 1, width: 50, height: null, resizeMode: "contain" }}
          ></Image>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.subjectText}>{this.props.subjectTitle}</Text>
        </View>
      </View>
    );
  }
}
