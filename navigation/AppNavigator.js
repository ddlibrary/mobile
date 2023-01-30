import * as React from 'react';
import { createAppContainer } from 'react-navigation';
import { withTranslation } from 'react-i18next';
import { AsyncStorage, ActivityIndicator, View } from 'react-native';

import AuthStackNavigator from './AuthStackNavigator';
import MainTabNavigator from './MainTabNavigator';

class AppNavigator extends React.Component {

  constructor()
  {
    super();
    this.getLoginState();
  }

  state = {
    loginState : 'undefined',
    isLoading : true
  }

  getLoginState = async() => {
    await AsyncStorage.getItem('loginState').then( (data) => {

      if(!data)
      {
        console.log('nothing existed');
        try {
          AsyncStorage.setItem('loginState', this.state.loginState);
          this.setState({
            isLoading: false
          });
        } catch (error) {
          console.log(error);
        }
      } else {

        this.setState({
          loginState: data,
          isLoading: false
        });
        
      }
    });
  }

  render() {

    if(this.state.isLoading){
      return(
        <View style={{ flex: 1, alignItems: 'center', padding:0, paddingTop: 15 }}>
          <ActivityIndicator animating size={'small'} />
        </View>
      )
    }
    else
    {
      console.log('state: ' + this.state.loginState);
      const AppContainer = createAppContainer((this.state.loginState == 'undefined') ? AuthStackNavigator : MainTabNavigator);
      const { t, i18n } = this.props;

      return (
        <AppContainer
          screenProps={{
            t,
            i18n
          }}
        />
      );
    }
  }
}

export default withTranslation()(AppNavigator);
