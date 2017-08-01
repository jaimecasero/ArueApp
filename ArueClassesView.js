import React, { Component } from 'react';
import { View, Text, StyleSheet, ListView, TouchableHighlight, Image, AsyncStorage} from 'react-native';
import ClassRow from './ClassRow';

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

var MESTRES_KEY="ARUE_MESTRES";
var MESTRES_RESOURCE_URL = "https://www.googleapis.com/drive/v2/files/0B1MWdYXZIEzock5RdzZwV09tY0E?key=AIzaSyBRnRVPiQhjpRo_PCZoPNBaOaJYZoBt5XE&alt=media";
var CLASSES_KEY="ARUE_CLASSES";
var RESOURCE_URL = "https://www.googleapis.com/drive/v2/files/0B1MWdYXZIEzoc21RQ21DZ19WM0E?key=AIzaSyBRnRVPiQhjpRo_PCZoPNBaOaJYZoBt5XE&alt=media";


export default class ArueClassesView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      urlRetrieved : false,
      classes:{},
      mestres:{}
    };
  }

  componentDidMount() {
    console.disableYellowBox = false;
    this.retrieveMestres();
  }

  retrieveMestres() {
    console.warn("retrieveMestres");
    try{
        AsyncStorage.getItem(MESTRES_KEY, this.loadMestres() );
    } catch (error) {  // Error retrieving data
        console.error("error:" + error);
        this.updateMestres();
    }
  }

  loadMestres(error,data) {
    console.warn("localMestres:" + data);
    if (data != null) {
    console.error("localMestres:" + data);
      var parsedMestres = JSON.parse(data);
      this.setState({
         mestres:parsedMestres,
      });
      this.retrieveClasses();
    } else {
        this.updateMestres();
    }
  }
  afterSet(error) {
    console.warn(error);
  }

  retrieveClasses() {
    console.warn("retrieve classes");
    try {
        AsyncStorage.getItem(MESTRES_KEY, this.loadClasses() );
    } catch (error) {  // Error retrieving data
        console.warn("error:" + error);
        this.updateMestres();
    }
  }

  loadClasses(error, data) {
    console.error("localClasses:" + data);
    if (data != null) {
        var parsedClasses = JSON.parse(data);
        const ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2,
          sectionHeaderHasChanged: (s1, s2) => s1 !== s2
        });

      this.setState({
         classes: parsedClasses,
         eventDS: ds.cloneWithRowsAndSections(parsedClasses),
         urlRetrieved : true
      });
     }
     this.updateMestres();

  }

  updateMestres() {
    this.state.eventsRetrieved = false;
    const ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      });
    fetch(MESTRES_RESOURCE_URL,
      {
        method: 'GET',
      }
    ).then((response) => {
        //console.warn("status:" + response.status + ",type:" + response.type);
        if (response.ok) {

          return response.json();
        }
      }
    ).then((responseJson) => {
      //console.warn(JSON.stringify(responseJson));
      AsyncStorage.setItem(MESTRES_KEY, JSON.stringify(responseJson), this.afterSet());
      this.setState({
         mestres:responseJson,
      });
      this.updateClasses();
    })
    .catch((error) => { console.warn(error); });
  }

  updateClasses() {
    this.state.eventsRetrieved = false;
    const ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      });
    fetch(RESOURCE_URL,
      {
        method: 'GET',
      }
    ).then((response) => {
        //console.warn("status:" + response.status + ",type:" + response.type);
        if (response.ok) {
          return response.json();
        }
      }
    ).then((responseJson) => {
      //console.warn(JSON.stringify(responseJson));
      AsyncStorage.mergeItem(CLASSES_KEY, JSON.stringify(responseJson));
      this.setState({
         classes:responseJson,
         eventDS: ds.cloneWithRowsAndSections(responseJson),
         urlRetrieved : true
      });
    })
    .catch((error) => { console.warn(error); });
  }

  renderSectionHeader(sectionData, category) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: this.state.mestres[category].picture.thumbnail}} style={styles.photo} />
        <Text style={styles.text}>
          {`${category}`}
        </Text>
      </View>
    )
  }

  render() {
    if (this.state.urlRetrieved) {
      return (
          <ListView
            dataSource={this.state.eventDS}
            renderRow={(rowData, sectionID, rowID, highlightRow) =>
                  <ClassRow class={rowData} mestre={this.state.mestres[sectionID]}/>
            }
            renderSectionHeader={this.renderSectionHeader.bind(this)}
            />
      );
    } else {
      return (
        <Text>Downloading Classes</Text>
      );
    }
  }

}
