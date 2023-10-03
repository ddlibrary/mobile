import React, { Component } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  RefreshControl,
} from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import RenderFile from "./activities/download/RenderFile";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default class DownloadsScreen extends Component {
  state = {
    isLoading: true,
    refreshing: false,
    data: "",
  };

  componentDidMount() {
    this.didFocusSubscription = this.props.navigation.addListener(
      "didFocus",
      this.didFocusAction
    );
    this.getData();
  }

  componentWillUnmount() {
    this.didFocusSubscription.remove();
  }

  didFocusAction = () => {
    this.setState({
      isLoading: true,
      data: "",
    });
    this.getData();
  };

  getData = async () => {
    await AsyncStorage.getItem("resources").then((data) => {
      if (data) {
        this.setState({
          data: JSON.parse(data).reverse(),
          isLoading: false,
        });
      } else {
        this.setState({
          isLoading: "noData",
        });
      }
    });
  };

  render() {
    let { t, i18n } = this.props.screenProps;

    if (this.state.isLoading == true) {
      return (
        <View
          style={{ flex: 1, alignItems: "center", padding: 0, paddingTop: 15 }}
        >
          <ActivityIndicator animating size={"small"} />
        </View>
      );
    } else if (this.state.isLoading == "noData") {
      return (
        <View
          style={{ flex: 1, alignItems: "center", padding: 0, paddingTop: 15 }}
        >
          <Text>{t("Nothing Downloaded Yet!")}</Text>
        </View>
      );
    } else {
      let getIcon = (file_mime = "book") => {
        let fileType = "book";

        if (file_mime == "application/pdf") fileType = "file-pdf-o";
        else if (file_mime == "application/msword") fileType = "file-word-o";
        else if (file_mime == "audio/mpeg") fileType = "file-audio-o";

        return fileType;
      };

      renderResources = ({ item }) => (
        <View>
          <TouchableOpacity
            style={styles.option}
            onPress={() => {
              this.props.navigation.navigate("RenderFile", {
                data: item,
                title: item.title,
              });
              RenderFile.navigationOptions = {
                title: item.title,
              };
            }}
          >
            <View
              style={{
                flexDirection: i18n.language != "en" ? "row-reverse" : "row",
              }}
            >
              <View style={styles.optionIconContainer}>
                <FontAwesome
                  size={22}
                  color="#ccc"
                  name={getIcon(item.file_mime)}
                />
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
          renderItem={renderResources}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this.getData();
              }}
            />
          }
        />
      );
    }
  }
}

DownloadsScreen.navigationOptions = ({ screenProps: { t } }) => ({
  title: t("downloaded_resources"),
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
