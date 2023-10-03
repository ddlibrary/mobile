import React from "react";
import WebView from "react-native-webview";
import {
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
  RefreshControl,
} from "react-native";
import Setting from "../../../constants/Setting";
import i18nManager from "react-native-web/dist/exports/I18nManager";

export default class PageView extends React.Component {
  state = {
    pageLoading: true,
    refreshing: false,
    text: "loading",
    data: "",
  };

  pages = [
    { lang: "en", page: "4137" },
    { lang: "fa", page: "4133" },
    { lang: "ps", page: "4134" },
  ];

  getPageDetails = async () => {
    await fetch(
      Setting.pageApi + this.pages.find((e) => e.lang == "en").page
    ).then((res) => {
      this.setState({
        pageDataSource: res,
        pageLoading: false,
      });
    });
  };

  render() {
    let { t, i18n } = this.props.screenProps;
    const { navigate } = this.props.navigation;
    this.getPageDetails();
    if (this.state.pageLoading) {
      return (
        <View
          style={{ flex: 1, alignItems: "center", padding: 0, paddingTop: 15 }}
        >
          <ActivityIndicator animating size={"small"} />
        </View>
      );
    }

    return (
      <WebView
        source={{
          uri:
            Setting.pageApi +
            this.pages.find((e) => e.lang == i18n.language).page,
        }}
        scalesPageToFit={true}
        bounces={true}
        //scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        injectedJavaScript={
          'document.getElementsByClassName("header")[0].remove();'
        }
      />
    );
  }
}
PageView.navigationOptions = {
  title: "COVID-19",
};
