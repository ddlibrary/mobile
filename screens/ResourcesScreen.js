import React from "react";
import {
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
  Image,
  RefreshControl,
  Share,
} from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { SearchBar } from "react-native-elements";

import Setting from "../constants/Setting";
import { Ionicons } from "@expo/vector-icons";
import ResourceDetail from "./activities/resources/ResourceDetailScreen";

export default class ResourcesScreen extends React.Component {
  state = {
    isLoading: true,
    refreshing: false,
    text: "loading",
    offset: 0,
    searchQuery: "",
    data: "",
  };

  componentDidMount() {
    this.didFocusSubscription = this.props.navigation.addListener(
      "didFocus",
      this.didFocusAction
    );
  }

  componentWillUnmount() {
    this.didFocusSubscription.remove();
  }

  didFocusAction = () => {
    // do things here when the screen focuses
    if (this.props.navigation.getParam("type")) {
      this.setState({
        isLoading: true,
        data: "",
        offset: 0,
        searchQuery: "",
      });
    }
    this.getData();
  };

  getData = async () => {
    let url =
      Setting.resourcesApi +
      this.props.screenProps.i18n.language +
      "/" +
      this.state.offset +
      "?search=" +
      this.state.searchQuery +
      "&" +
      this.props.navigation.getParam("type") +
      "=" +
      this.props.navigation.getParam("catId");
    console.log("filter string: " + url);
    await fetch(url)
      .then((data) => data.json())
      .then((res) => {
        this.setState({
          data: [...this.state.data, ...res],
          isLoading: false,
        });
      });
  };

  searchFilterFunction = (text) => {
    this.setState(
      {
        searchQuery: text,
        offset: 0,
        data: "",
      },
      () => {
        this.getData();
      }
    );
    return <ActivityIndicator animating size={"small"} />;
  };

  refreshData = () => {
    this.state.data = "";
    this.state.offset = 0;
    this.state.searchQuery = "";

    if (!this.state.data) this.getData();
  };

  renderFooter = () => {
    return <ActivityIndicator animating size={"small"} />;
  };

  renderHeader = () => {
    return (
      <View>
        <View>
          <Text style={{ textAlign: "center", fontSize: 16, padding: 5 }}>
            {this.props.navigation.getParam("title")}
          </Text>
        </View>
        <View>
          <SearchBar
            placeholder={this.props.screenProps.t(
              "SEARCH OUR GROWING LIBRARY!"
            )}
            lightTheme
            onChangeText={(text) => this.searchFilterFunction(text)}
            containerStyle={{
              backgroundColor: "white",
              borderBottomColor: "#fff",
              borderTopColor: "#fff",
              padding: 5,
            }}
            inputContainerStyle={{ backgroundColor: "#eee" }}
            autoCorrect={false}
            value={this.state.searchQuery}
          />
        </View>
      </View>
    );
  };

  handleLoadMore = () => {
    this.setState(
      {
        offset: parseInt(this.state.offset) + 32,
      },
      () => {
        this.getData();
      }
    );
  };

  render() {
    const { navigate } = this.props.navigation;
    if (this.state.isLoading) {
      return (
        <View
          style={{ flex: 1, alignItems: "center", padding: 0, paddingTop: 15 }}
        >
          <ActivityIndicator animating size={"small"} />
        </View>
      );
    }

    let _renderItem = ({ item }) => (
      <View
        style={{
          flex: 3,
          width: 200,
          height: 180,
          backgroundColor: "#eee",
          padding: 10,
          margin: 5,
          alignItems: "center",
          borderWidth: 0.5,
          borderColor: "#eee",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigate("ResourceDetail", item);
            ResourceDetail.navigationOptions = {
              title: item.title,
              headerRight: (
                <Ionicons
                  name="ios-share"
                  size={24}
                  style={{ marginRight: 20 }}
                  onPress={async () => {
                    try {
                      const result = await Share.share({
                        message:
                          Setting.mainUrl +
                          this.props.screenProps.i18n.language +
                          "/resource/" +
                          item.id,
                      });
                      if (result.action === Share.sharedAction) {
                        if (result.activityType) {
                          // shared with activity type of result.activityType
                        } else {
                          // shared
                        }
                      } else if (result.action === Share.dismissedAction) {
                        // dismissed
                      }
                    } catch (error) {
                      alert(error.message);
                    }
                  }}
                />
              ),
            };
          }}
        >
          <Image
            style={{ height: 100, width: 100, resizeMode: "stretch" }}
            source={{ uri: item.img }}
          />

          <Text
            style={{
              marginTop: 10,
              textAlign: "center",
              fontSize: this.props.screenProps.i18n.language != "en" ? 13 : 12,
              writingDirection:
                this.props.screenProps.i18n.language != "en" ? "rtl" : "ltr",
            }}
          >
            {item.title.length >= 40
              ? item.title.substr(0, 35) + " ... "
              : item.title}
          </Text>
        </TouchableOpacity>
      </View>
    );

    return (
      <FlatList
        style={styles.container}
        data={this.state.data}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        onEndReached={this.handleLoadMore}
        onEndReachedThreshold={200}
        ListHeaderComponent={this.renderHeader}
        renderItem={_renderItem}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={() => {
              this.refreshData();
            }}
          />
        }
      />
    );
  }
}

ResourcesScreen.navigationOptions = ({ screenProps: { t } }) => ({
  title: t("library"),
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
  },
});
