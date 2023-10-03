import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Share,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import HTML from "react-native-render-html";

import Setting from "../../../constants/Setting";
import { FontAwesome } from "@expo/vector-icons";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import RenderPDF from "./RenderPDF";

export default class ResourceDetail extends Component {
  state = {
    isLoading: true,
    data: "",
  };

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    await fetch(Setting.resourceApi + this.props.navigation.getParam("id"))
      .then((data) => data.json())
      .then((res) => {
        this.setState({
          data: res,
          isLoading: false,
        });
      });
  };

  render() {
    let { t, i18n } = this.props.screenProps;

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 15,
        backgroundColor: "#fff",
        writingDirection: i18n.language != "en" ? "rtl" : "ltr",
      },
      coverPhoto: {
        height: 250,
        width: Dimensions.get("window").width,
        resizeMode: "cover",
      },
      hr: {
        borderBottomColor: "#eee",
        borderBottomWidth: 1,
        marginTop: 5,
        marginBottom: 5,
      },
      title: {
        fontSize: 22,
        marginTop: 10,
        writingDirection: i18n.language != "en" ? "rtl" : "ltr",
      },
      text: {
        marginTop: 10,
        color: "grey",
        fontSize: i18n.language != "en" ? 11 : 13,
        textAlign: i18n.language != "en" ? "right" : "left",
      },
      textWhite: {
        marginTop: 10,
        textAlign: "justify",
        color: "white",
        fontSize: i18n.language != "en" ? 11 : 13,
        writingDirection: i18n.language != "en" ? "rtl" : "ltr",
      },
      user: {
        borderWidth: 0,
        alignSelf: i18n.language != "en" ? "flex-end" : "flex-start",
        marginHorizontal: 0,
        flexDirection: "row",
        margin: 3,
        textAlignVertical: "center",
      },
      userContainer: {
        backgroundColor: "#eee",
        padding: 20,
        marginBottom: 20,
        borderRadius: 15,
        marginTop: 10,
      },
      userTxt: {},
      icons: {
        borderWidth: 0,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        width: 60,
        height: 40,
        backgroundColor: "#eee",
        borderRadius: 50,
        flexDirection: "row",
        margin: 3,
      },
      iconsContainer: {
        marginTop: 10,
        marginRight: 10,
        flexDirection: "row",
        justifyContent: "flex-end",
      },
      iconBtn: {
        flex: 1,
        marginHorizontal: 0,
        alignSelf: "center",
      },
      iconTxt: {
        marginLeft: 10,
      },
      commentInput: {
        backgroundColor: "#eee",
        padding: 10,
        borderRadius: 16,
        marginTop: 10,
        fontSize: 16,
        paddingLeft: 12,
        paddingRight: 12,
        writingDirection: i18n.language != "en" ? "rtl" : "ltr",
      },
    });

    if (this.state.isLoading) {
      return (
        <View
          style={{ flex: 1, alignItems: "center", padding: 0, paddingTop: 15 }}
        >
          <ActivityIndicator animating size={"small"} />
        </View>
      );
    }

    let img = this.props.navigation.getParam("img");

    let authors = this.state.data.authors.map((author, key) => {
      return (
        <TouchableOpacity key={key}>
          <Text style={styles.text}> {author.name} </Text>
        </TouchableOpacity>
      );
    });

    let levels = this.state.data.levels.map((level, key) => {
      return (
        <TouchableOpacity key={key}>
          <Text style={styles.text}> {level.name} </Text>
        </TouchableOpacity>
      );
    });

    let subjects = this.state.data.subjects.map((subject, key) => {
      return (
        <TouchableOpacity key={key}>
          <Text style={styles.text}> {subject.name} </Text>
        </TouchableOpacity>
      );
    });

    let types = this.state.data.LearningResourceTypes.map((type, key) => {
      return (
        <TouchableOpacity key={key}>
          <Text style={styles.text}> {type.name} </Text>
        </TouchableOpacity>
      );
    });

    let publishers = this.state.data.publishers.map((publisher, key) => {
      return (
        <TouchableOpacity key={key}>
          <Text style={styles.text}> {publisher.name} </Text>
        </TouchableOpacity>
      );
    });

    let translations = this.state.data.translations.map((translation, key) => {
      return (
        <TouchableOpacity key={key}>
          <Text style={styles.text}> {t(translation.language)} </Text>
        </TouchableOpacity>
      );
    });

    let licenses = this.state.data.CreativeCommons.map((license, key) => {
      return (
        <TouchableOpacity
          key={key}
          onPress={() => {
            this.props.navigation.navigate("Resources", attachment);
          }}
        >
          <Text style={styles.text}> {license.name} </Text>
        </TouchableOpacity>
      );
    });

    let attachments = this.state.data.attachments.map((attachment, key) => {
      let fileType = "book";

      if (attachment.file_mime == "application/pdf") fileType = "file-pdf-o";
      else if (attachment.file_mime == "application/msword")
        fileType = "file-word-o";
      else if (attachment.file_mime == "audio/mpeg") fileType = "file-audio-o";

      return (
        <TouchableOpacity
          key={key}
          style={{ marginTop: 5 }}
          onPress={() => {
            this.props.navigation.navigate({
              routeName: "RenderPDF",
              key: this.props.navigation.getParam("title"),
              params: {
                data: attachment,
                title: this.props.navigation.getParam("title"),
              },
            });
            RenderPDF.navigationOptions = {
              title: this.props.navigation.getParam("title"),
            };
          }}
        >
          <FontAwesome.Button
            name={fileType}
            backgroundColor="#9C6C1F"
            size={20}
          >
            <Text style={styles.textWhite}> {attachment.file_name}</Text>
          </FontAwesome.Button>
        </TouchableOpacity>
      );
    });

    let comments = (
      <View>
        <Text style={styles.text}> {t("No Comment")} </Text>
      </View>
    );

    if (this.state.data.comments.length > 0) {
      comments = this.state.data.comments.map((comment, key) => {
        return (
          <View key={key} style={styles.userContainer}>
            <View style={[styles.user]}>
              <Ionicons name="md-person" size={22} color="#777" />
              <Text style={[styles.iconTxt, { color: "#777" }]}>
                {comment.username}
              </Text>
            </View>
            <Text style={styles.text}> {comment.comment} </Text>
          </View>
        );
      });
    }

    return (
      <ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              <View style={styles.shadow}>
                <Image style={styles.coverPhoto} source={{ uri: img }} />
              </View>

              <View style={styles.iconsContainer}>
                <TouchableOpacity style={styles.iconBtn}>
                  <View style={[styles.icons, { width: 80 }]}>
                    <Ionicons name="ios-eye" size={26} color="#FFA800" />
                    <Text style={styles.iconTxt}>{this.state.data.views}</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.container}>
                <Text style={styles.title}>
                  {this.props.navigation.getParam("title")}
                </Text>

                <HTML
                  html={this.props.navigation.getParam("abstract")}
                  ignoredTags={["img"]}
                  ignoredStyles={["font", "font-family", "font-size"]}
                  imagesMaxWidth={Dimensions.get("window").width}
                  containerStyle={"margin:50px"}
                  tagsStyles={{ span: styles.text, p: styles.text }}
                />
              </View>

              <View style={styles.hr} />

              <View style={styles.container}>
                <Text style={styles.title}>{t("Author")}</Text>
                {authors}
              </View>

              <View style={styles.hr} />

              <View style={styles.container}>
                <Text style={styles.title}>{t("Resource Level")}</Text>
                {levels}
              </View>

              <View style={styles.hr} />

              <View style={styles.container}>
                <Text style={styles.title}>{t("Subject Area")}</Text>
                {subjects}
              </View>

              <View style={styles.hr} />

              <View style={styles.container}>
                <Text style={styles.title}>{t("Learning Resource Type")}</Text>
                {types}
              </View>

              <View style={styles.hr} />

              <View style={styles.container}>
                <Text style={styles.title}>{t("Publisher")}</Text>
                {publishers}
              </View>

              <View style={styles.hr} />

              <View style={styles.container}>
                <Text style={styles.title}>{t("Languages Available")}</Text>
                {translations}
              </View>

              <View style={styles.hr} />

              <View style={styles.container}>
                <Text style={styles.title}>{t("License")}</Text>
                {licenses}
              </View>

              <View style={styles.hr} />

              <View style={styles.container}>
                <Text style={styles.title}>{t("Attachments")}</Text>
                {attachments}
              </View>

              <View style={styles.hr} />

              <View style={styles.container}>
                <Text style={styles.title}>{t("Comments")}</Text>
                {comments}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}
