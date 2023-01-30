import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  ActivityIndicator,
  Modal,
  Button,
  Linking,
  AsyncStorage
} from 'react-native';
import { Subjects } from './activities/home';
import { FeaturedResources } from './activities/home';
import { Card } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import YoutubePlayer from 'react-native-youtube-iframe';

import Setting from '../constants/Setting';
import {Updates} from "expo";
import NewsView from "./activities/news/NewsView";
import PageView from "./activities/page/PageView";

const {height, width} = Dimensions.get('window');

export default class HomeScreen extends Component {

  constructor(props) {
    super(props)
    
    this.state = {
      categoriesLoading: true,
      featuredResourcesLoading: true,
      categoriesDataSource: '',
      featuredResourcesDataSource: '',
      modalVisibility: false,
    }
  }



  async componentDidMount(){
    this.didFocusSubscription = this.props.navigation.addListener('didFocus', this.didFocusAction);
  }

  componentWillUmount () {
    this.didFocusSubscription.remove();
  }

  didFocusAction = () => {
    this.getCategories();
    this.getFeaturedResources();
  }

  getCategories = async() => {
    await fetch(Setting.resourceCategories + this.props.screenProps.i18n.language)
    .then(data => data.json())
    .then(res => {
      this.setState({
        categoriesDataSource: res,
        categoriesLoading: false
      });
    })
  }

  getFeaturedResources = async() => {
    await fetch(Setting.featuredResources + this.props.screenProps.i18n.language)
    .then(data => data.json())
    .then(res => {
      this.setState({
        featuredResourcesDataSource: res,
        featuredResourcesLoading: false
      });
    })
  }

  render(){
    let { t, i18n} = this.props.screenProps;
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#fff',
      }, 
      title: {
        fontSize: 20, 
        fontWeight: '700',
        writingDirection: (i18n.language != 'en') ? 'rtl' : 'ltr',
      }, 
      subTitle: {
        fontWeight: '400', 
        fontSize: 12,
        writingDirection: (i18n.language != 'en') ? 'rtl' : 'ltr',
      }, 
      scrollView: {
        flexDirection: (i18n.language != 'en') ? 'row-reverse' : 'row',
      },
      modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(000, 000, 000, 1)',
        alignContent: 'center',
        padding: 0,
        paddingTop: 0,
        paddingBottom: 200,
        height:20,
        justifyContent: 'center'
      }
    });

    const { navigate } = this.props.navigation;
    if(!this.state.categoriesLoading && !this.state.featuredResourcesLoading)
    {
      let categories = this.state.categoriesDataSource.map( (category, key) => {
        return( 
          <TouchableOpacity  key={key} onPress={ () => {
            navigate('Resources', { type: 'subject_area', catId: category.subject_area, title: category.name, language: i18n.language }) } }>
            <Subjects icon={ category.file_name } subjectTitle={  category.name } />
          </TouchableOpacity>
        )
      });

      let featuredResources = this.state.featuredResourcesDataSource.map( (category, key) => {
        let type = (category.subject_id) ? 'subject_area' : 'type';
        let catId = (category.subject_id) ? category.subject_id : category.type_id;

        if(category.type_id == 2045 || category.type_id == 837 || category.type_id == 3831)
        return( 
          <TouchableOpacity key={key} onPress={ () => { navigate('Resources', { type: type, catId: catId, title: category.name }) } }>
            <FeaturedResources title={category.name} icon={category.icon} />
          </TouchableOpacity>
        )
      });

      return(
        <ScrollView  style={ styles.container }>
    
          <ScrollView scrollEventThrottle={16}>
    
            <View style={{ flex:1, marginTop: 0}}>
              <Text style={ styles.title }>{ t("Explore our subjects") }</Text>
            </View>
    
            <View style={{ flexDirection: (i18n.language != 'en') ? 'row-reverse' : 'row', marginTop: 10, flexWrap: 'wrap' }} showsHorizontalScrollIndicator={false}>
              { categories }
            </View>

            <View style={{ flex:1, marginTop: 10}}>
              <Text style={ styles.title }>{ t("Featured Resource Collections") }</Text>
            </View>
    
            <View style={{ height: 130, marginTop: 10 }}>
              <ScrollView horizontal={true} style={ styles.scrollView } showsHorizontalScrollIndicator={false}>
                { featuredResources }

                <TouchableOpacity onPress={ () => { Linking.openURL(Setting.swUrl); } }>
                  <FeaturedResources title={ t("StoryWeaver") } icon={"sw"} />
                </TouchableOpacity>

                <TouchableOpacity onPress={ () => { navigate('PageView');
                  PageView.navigationOptions = {
                  title: t("COVID19"),
                };
                }}>
                  <FeaturedResources title={ t("COVID19") } icon={"covid"} />
                </TouchableOpacity>

              </ScrollView>
            </View>

            <View style={{ flex:1 }}>
              <Text style={ styles.title }>{ t("Darakht-e Danesh Online Library") }</Text>
              <Text style={ styles.subTitle}>{ t('Watch a video to learn more about our work in Afghanistan') }</Text>
            </View>
        
            <TouchableOpacity style={ {marginBottom: 10} } onPress={ () => { this.setState({ modalVisibility: true }) } }>
              <Card style={{ width: width-40, height:200, marginLeft:5, borderRadius: 5, marginTop: 10, marginBottom: 20, backgroundColor: '#fff',shadowOpacity: 0.5 }}>
                <Image source={require('../assets/images/home/learn_more.png')} style={{ flex:1 ,height:null, width:null, resizeMode: 'cover', borderRadius: 5 }} ></Image>
              </Card>
            </TouchableOpacity>

            <Modal visible={ this.state.modalVisibility } animationType="slide" style={{  }}>
              <View style={ styles.modalContainer } >
                <View style={{
                  marginTop: 10,
                  marginRight: 10,
                  alignSelf: 'flex-end',
                  padding: 10
                }}>
                  <Button color={'black'} title="Close" onPress={ () => { this.setState({ modalVisibility: false }) } }>
                  </Button>
                </View>
                <View style={{paddingTop:200}} pointerEvents="none">
                  <YoutubePlayer
                      title={ 'Darakht-e-Danesh Library' }
                      ref={ null }
                      height={300}
                      width={400}
                      videoId={"bF5dpED9W64"}
                      play={true}
                      onChangeState={event => console.log(event)}
                      onReady={() => console.log("ready")}
                      onError={e => console.log(e)}
                      onPlaybackQualityChange={q => console.log(q)}
                      volume={50}
                      playbackRate={1}
                      initialPlayerParams={{
                        controls: 0,
                        cc_lang_pref: "us",
                        showClosedCaptions: true
                      }}
                  />
                </View>

              </View>
            </Modal>
    
          </ScrollView>
        </ScrollView>
      )
    } else{
      return(
        <ActivityIndicator style={{ marginTop: 20 }} animating size={'small'} />
      )
    }

  }
  
}

HomeScreen.navigationOptions =  ({ screenProps: { t } }) => ({
  title: t("Darakht-e Danesh Online Library"),
});