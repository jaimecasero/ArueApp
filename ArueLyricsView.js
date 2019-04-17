import React, { Component } from 'react';
import { View, Text, StyleSheet, ListView, TouchableHighlight, AsyncStorage} from 'react-native';
import LyricRow from './LyricRow';
import lyricsData from './LyricsData.js';

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

var LYRICS_KEY = "ARUE_EVENTS";
var RESOURCE_URL = "https://www.googleapis.com/drive/v2/files/0B1MWdYXZIEzoRUo1MVJhd0o5VmM?key=AIzaSyBRnRVPiQhjpRo_PCZoPNBaOaJYZoBt5XE&alt=media";


export default class ArueLyricsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      urlRetrieved : false,
    };
  }

  componentDidMount() {
    this.loadLyrics(lyricsData);
  }

  retrieveLyrics() {
    console.warn("retrieveLyrics");
    try{
        AsyncStorage.getItem(LYRICS_KEY, this.loadLyrics() );
    } catch (error) {  // Error retrieving data
        console.warn("error:" + error);
        this.updateLyrics();
    }
  }

  loadLyrics(data) {
    console.warn("loadLyrics:", data);
    if (data != null) {
        const ds = new ListView.DataSource(
          {
            rowHasChanged: (r1, r2) => r1 !== r2
          }
        );
      this.setState({
         lyricsDS: ds.cloneWithRows(data),
         urlRetrieved : true
      });
    } else {
      this.updateLyrics();
    }
  }

  updateLyrics() {
    this.state.eventsRetrieved = false;
    const ds = new ListView.DataSource(
      {
        rowHasChanged: (r1, r2) => r1 !== r2
      }
    );
    fetch(RESOURCE_URL,
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
      AsyncStorage.mergeItem(LYRICS_KEY, JSON.stringify(responseJson));
      this.setState({
         lyricsDS: ds.cloneWithRows(responseJson),
         urlRetrieved : true
      });
    })
    .catch((error) => { console.warn(error); });
  }

  render() {
    if (this.state.urlRetrieved) {
      return (
          <ListView
            dataSource={this.state.lyricsDS}
            renderRow={(data) => <LyricRow {...data} />}
            />
      );
    } else {
      return (
        <Text>Downloading Lyrics</Text>
      );
    }
  }

}
