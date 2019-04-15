import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  ScrollView,
} from 'react-native';

import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view';
import EventView from './EventView';
import ArueKick from './ArueKick';
import ArueLyricsView from './ArueLyricsView';
import ArueClassesView from './ArueClassesView';

export default class ArueApp extends Component {
  constructor(props) {
    super(props);
 }

  render() {
    return <ScrollableTabView
      style={{marginTop: 20, }}
      renderTabBar={() => <DefaultTabBar />}
    >
    <ScrollView tabLabel="Clases" style={styles.tabView}>
      <ArueClassesView></ArueClassesView>
    </ScrollView>
    <ScrollView tabLabel="Eventos" style={styles.tabView}>
      <EventView/>
    </ScrollView>
    <ScrollView tabLabel="Letras" style={styles.tabView}>
      <ArueLyricsView></ArueLyricsView>
    </ScrollView>
</ScrollableTabView>;

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  tabs: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#ccc',
},
});

AppRegistry.registerComponent('ArueApp', () => ArueApp);
