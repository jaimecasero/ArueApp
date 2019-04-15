import React, { Component } from 'react';
import { View, Text, StyleSheet, ListView, Image, TouchableHighlight,Linking, AsyncStorage} from 'react-native';
import EventRow from './EventRow';
import eventsData from './EventsData.js'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
  },
  photo: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  classIcon: {
    width: 30,
    height: 30,
    backgroundColor: 'transparent',
  },
  sectionHeader: {
    flexDirection: 'row',
    backgroundColor: 'orange',
    color: 'white',
  },
  sectionHeaderText: {
    fontSize: 18,
    color: 'white',
  }
});

var EVENTS_KEY = "ARUE_EVENTS";
var EVENTS_FILE_URL = "https://www.googleapis.com/drive/v2/files/0B1MWdYXZIEzoQTl5ZEJGVGxicmM?key=AIzaSyBRnRVPiQhjpRo_PCZoPNBaOaJYZoBt5XE&alt=media";


export default class EventView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      eventsRetrieved : false,
    };
  }

  componentDidMount() {
    this.loadEvents(eventsData);
  }

  retrieveEvents() {
    console.warn("retrieveEvents");
    try{
        loadEvents(eventsData);
    } catch (error) {  // Error retrieving data
        console.warn("error:", error);
        this.updateEvents();
    }
  }

  loadEvents(data) {
    console.warn("loadEvents:", data);
    if (data != null) {
        const ds = new ListView.DataSource(
          {
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2
          }
        );
      this.setState({
         eventDS: ds.cloneWithRowsAndSections(data),
         eventsRetrieved : true
      });
    } else {
        this.updateEvents();
    }
  }

    renderSectionHeader(sectionData, category) {
        console.warn("sectionData:", sectionData);
      return (
          <View style={styles.sectionHeader}>
              <Image source={{ uri: 'https://scontent.fmad3-6.fna.fbcdn.net/v/t1.0-9/49343107_1769689163134943_1967002245979439104_n.jpg?_nc_cat=110&_nc_ht=scontent.fmad3-6.fna&oh=c1e032499b0ebfedc0b5a156462bf8a2&oe=5D452B70'}} style={styles.photo} />
              <Text style={styles.sectionHeaderText}>
                {category}
              </Text>

              <TouchableHighlight onPress={() => {
                Linking.openURL('mailto:aruemadrid@gmail.com?subject=evento info'); }
              }>
                <Image source={require('./mail_android.png')}
                  style={styles.classIcon}
                  accessibilityLabel="send mail"
                  />
              </TouchableHighlight>

              <TouchableHighlight onPress={() => {
                Linking.openURL('tel:0034660830441'); }
              }>
                <Image source={require('./android-call-icon-11.jpg')}
                  style={styles.classIcon}
                  accessibilityLabel='Call owner'
                  />
              </TouchableHighlight>

          </View>
      );
    }

  updateEvents() {
    this.state.eventsRetrieved = false;
    const ds = new ListView.DataSource(
      {
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      }
    );


   fetch(EVENTS_FILE_URL,
      {
        method: 'GET',
      }
    ).then((response) => {
        console.warn("status:" + response.status + ",type:" + response.type);
        if (response.ok) {
          return response.json();
        }
      }
    ).then((responseJson) => {
      console.warn("response", responseJson);
      AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(responseJson));
      this.setState({
         eventDS: ds.cloneWithRowsAndSections(responseJson),
         eventsRetrieved : true
      });
    })
    .catch((error) => { console.warn(error); });
  }

  render() {
    if (this.state.eventsRetrieved) {
      return (

          <ListView
            dataSource={this.state.eventDS}
            renderRow={(data) => <EventRow {...data} />}
            renderSectionHeader={this.renderSectionHeader}
            />
      );
    } else {
      return (
        <Text>Downloading events</Text>
      );
    }
  }

}
