import React, { Component } from 'react';
import { View, Text, StyleSheet, ListView, TouchableHighlight, AsyncStorage} from 'react-native';
import EventRow from './EventRow';

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
    this.retrieveEvents();
  }

  retrieveEvents() {
    console.warn("retrieveEvents");
    try{
        AsyncStorage.getItem(EVENTS_KEY, this.loadEvents() );
    } catch (error) {  // Error retrieving data
        console.warn("error:" + error);
        this.updateEvents();
    }
  }

  loadEvents(data) {
    console.warn("loadEvents:" + data);
    if (data != null) {
        const ds = new ListView.DataSource(
          {
            rowHasChanged: (r1, r2) => r1 !== r2
          }
        );
      this.setState({
         eventDS: ds.cloneWithRows(responseJson),
         eventsRetrieved : true
      });
      this.updateEvents();
    } else {
        this.updateEvents();
    }
  }

  updateEvents() {
    this.state.eventsRetrieved = false;
    const ds = new ListView.DataSource(
      {
        rowHasChanged: (r1, r2) => r1 !== r2
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
      console.warn(JSON.stringify(responseJson));
      AsyncStorage.mergeItem(EVENTS_KEY, JSON.stringify(responseJson));
      this.setState({
         eventDS: ds.cloneWithRows(responseJson),
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
            />
      );
    } else {
      return (
        <Text>Downloading events</Text>
      );
    }
  }

}
