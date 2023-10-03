import React, { Component } from "react";
import { View, Button, StyleSheet, Text, RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

export default class SettingsScreen extends Component {
  state = {
    data: [
      { title: "English", lang: "en" },
      { title: "فارسی", lang: "fa" },
      { title: "پشتو", lang: "ps" },
    ],
  };

  render() {
    let { t, i18n } = this.props.screenProps;
    async function changeLang(lang = "en") {
      try {
        await AsyncStorage.setItem("lang", lang);
        i18n.changeLanguage(lang);
      } catch (error) {
        console.log(error);
      }
    }

    let renderItem = ({ item }) => (
      <View>
        <TouchableOpacity
          style={styles.option}
          onPress={() => {
            changeLang(item.lang);
          }}
        >
          <View
            style={{
              flexDirection:
                this.props.screenProps.i18n.language != "en"
                  ? "row-reverse"
                  : "row",
            }}
          >
            <View style={styles.optionIconContainer}>
              <Ionicons name="ios-globe" size={22} color="#ccc" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>
                {item.title.length >= 50
                  ? item.title.substr(0, 50) + " ... "
                  : item.title}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );

    return (
      <FlatList
        data={this.state.data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    );
  }
}

SettingsScreen.navigationOptions = ({ screenProps: { t } }) => ({
  title: t("choose_language"),
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
  },
  optionsTitleText: {
    fontSize: 16,
    marginLeft: 15,
    marginTop: 9,
    marginBottom: 12,
  },
  optionIconContainer: {
    marginRight: 9,
    marginLeft: 9,
  },
  option: {
    backgroundColor: "#fdfdfd",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
  },
  optionText: {
    fontSize: 15,
    marginTop: 1,
  },
});
