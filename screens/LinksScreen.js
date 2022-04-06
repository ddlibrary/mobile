import React from 'react';
import { StyleSheet, ActivityIndicator, Text, View, RefreshControl } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

import Setting from '../constants/Setting';

export default class LinksScreen extends React.Component {

  state = {
    isLoading: true,
    refreshing: false,
    text: 'loading',
    data: ''
  }

  componentDidMount(){
    this.getData()
  }

  getData = async() => {
    await fetch(Setting.linksApi + this.props.screenProps.i18n.language)
    .then(data => data.json())
    .then(res => {
      console.log(res);
      this.setState({
        data: res,
        isLoading: false
      });
    })
  }

  /**
   * Go ahead and delete ExpoConfigView and replace it with your content;
   * we just wanted to give you a quick view of your config.
   */
  render() {
    const { navigate } = this.props.navigation;
    if(this.state.isLoading){
      return(
        <View style={{ flex: 1, alignItems: 'center', padding:0, paddingTop: 15 }}>
          <ActivityIndicator animating size={'small'} />
        </View>
      )
    }

    let _renderItem = ({ item }) => (
      <View>
        <TouchableOpacity style={styles.option} onPress={ () => { navigate('LinkView', item) }}>
          <View style={{ flexDirection: (this.props.screenProps.i18n.language != 'en') ? 'row-reverse' : 'row' }}>
            <View style={styles.optionIconContainer}>
              <Ionicons name="ios-link" size={22} color="#ccc" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>
                { ((item.title.length >= 50) ? item.title.substr(0, 50) + ' ... ' : item.title) } 
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );


    return(
        <FlatList
          data={this.state.data}
          keyExtractor={ (item, index) => index.toString() }
          renderItem={ _renderItem }
          refreshControl={ 
            <RefreshControl 
              refreshing={ this.state.refreshing } 
              onRefresh={ () => { this.getData() } }
            /> 
          }
        />
    )
  }
}

LinksScreen.navigationOptions = ({ screenProps: { t } }) => ({
  title: t('useful_links'),
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
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
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 15,
    marginTop: 1,
  },
});
