import React, { Component, useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Text,
  Platform,
  TouchableWithoutFeedback,
  Button,
  Keyboard,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from "expo-updates";

import Setting from "../constants/Setting";
export default class LoginScreen extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      device_name: "samsung", // need to get it dynamically used some modules but did not work with different devices
      error: "",
      showError: false,
      loading: false,
    };
  }

  setLoginStatus(state) {
    try {
      AsyncStorage.setItem("loginState", state);
      Updates.reloadAsync();
    } catch (error) {
      console.log(error);
    }
  }

  submitLoginForm() {
    this.setState({ showError: false, loading: true });

    let formdata = new FormData();
    formdata.append("email", this.state.email);
    formdata.append("password", this.state.password);
    formdata.append("device_name", this.state.password);

    fetch(Setting.LoginUrl, {
      method: "POST",
      body: formdata,
      headers: new Headers({
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      }),
    })
      .then((data) => data.json())
      .then((res) => {
        if (res.message) {
          this.setState({ showError: true, loading: false });
          this.setState({ error: res.message });
        } else if (res.user) {
          AsyncStorage.setItem("user", res.user);
          AsyncStorage.setItem("token", res.token);
          this.setLoginStatus("signedIn");
          console.log(res);
        }
      });
  }

  render() {
    let { t, i18n } = this.props.screenProps;

    const { navigate } = this.props.navigation;

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#333",
      },

      skipButton: {
        marginTop: 30,
        alignSelf: "flex-end",
      },

      inner: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
      },

      logoContainer: {
        alignSelf: "center",
      },

      loginText: {
        color: "#777",
        fontSize: 18,
        marginTop: 10,
        textAlign: "center",
      },

      formContainer: {
        marginTop: 60,
      },

      inputStyle: {
        backgroundColor: "#999",
        borderColor: "#aaa",
        borderWidth: 1,
        borderRadius: 35,
        height: 45,
        paddingLeft: 15,
        paddingRight: 15,
        marginBottom: 20,
      },

      btn: {
        backgroundColor: "#da7437",
        borderRadius: 35,
        paddingVertical: 15,
        marginBottom: 20,
      },

      btnPrimary: {
        borderRadius: 35,
        paddingVertical: 15,
        marginBottom: 20,
      },

      btnText: {
        textAlign: "center",
        color: "#fff",
        fontWeight: "bold",
      },
      TextSlim: {
        textAlign: "center",
        color: "#fff",
        fontWeight: "normal",
      },

      TextLarge: {
        textAlign: "center",
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
      },
      error: {
        color: "#da7437",
        fontWeight: "bold",
        marginBottom: 20,
        paddingLeft: 15,
        paddingRight: 15,
      },
    });

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => {
            this.setLoginStatus("skipped");
          }}
        >
          <Text style={{ color: "#fff", marginRight: 10, marginTop: 15 }}>
            {" "}
            {t("Skip")}{" "}
          </Text>
        </TouchableOpacity>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View style={styles.logoContainer}>
              <Image source={require("../assets/logo-ddl.png")} />
              <Text style={styles.loginText}>
                {t("Login with your DDL account")}
              </Text>
            </View>

            <View style={styles.formContainer}>
              <TextInput
                style={styles.inputStyle}
                placeholder={t("Email")}
                placeholderTextColor="#555"
                onChangeText={(text) => {
                  this.setState({ email: text });
                }}
              />
              <TextInput
                style={styles.inputStyle}
                placeholder={t("Password")}
                placeholderTextColor="#555"
                secureTextEntry={true}
                onChangeText={(text) => {
                  this.setState({ password: text });
                }}
              />
              {this.state.showError && (
                <Text style={styles.error}>{this.state.error}</Text>
              )}
              {!this.state.loading && (
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => this.submitLoginForm()}
                >
                  <Text style={styles.btnText}>{t("Sign In")}</Text>
                </TouchableOpacity>
              )}
              {!this.state.showError && this.state.loading && (
                <ActivityIndicator
                  animating={true}
                  size="small"
                  style={{ paddingBottom: 20 }}
                  color="#da7437"
                />
              )}
              <Text style={styles.TextSlim}> {t("no account")} </Text>
              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={() => {
                  navigate("Signup");
                }}
              >
                <Text style={styles.TextLarge}> {t("Register")} </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}
