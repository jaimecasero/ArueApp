import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight,  Modal, ListView, Image,Linking } from 'react-native';

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
  verse: {
    marginLeft: 12,
    fontSize: 16,
    color: 'blue',
  },
  link: {
    marginLeft: 12,
    fontSize: 16,
    color: 'blue',
  },
  chorus: {
    marginLeft: 12,
    fontSize: 16,
    color: 'orange',
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
  modalHeader: {
    flexDirection: 'row',
    backgroundColor: 'orange',
    color: 'white',
  },
  modalHeaderText: {
    fontSize: 18,
    color: 'white',
  }
});


export default class LyricRow extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource(
      {
        rowHasChanged: (r1, r2) => r1 !== r2
      }
    );
    this.state = {
       lyricDS: ds.cloneWithRows(props.verses),
       modalVisible: false,
    };
  }

  setModalVisible(visible) {
   this.setState({modalVisible: visible});
  }

  renderLyricRow(data) {
    if (data.chorus) {
      return (
        <View style={{flexDirection: 'row'}}>
          <Image source={require('./Applause-48.png')}
            style={styles.classIcon}
            accessibilityLabel="click to go back"
            />
          <Text style={styles.chorus}>{`${data.text}`}</Text>
        </View>
      );
    } else {
      return (
        <View style={{flexDirection: 'row'}}>
          <Image source={require('./berimbau.png')}
            style={styles.classIcon}
            accessibilityLabel="click to go back"
            />
          <Text style={styles.verse}>{`${data.text}`}</Text>
        </View>
      );
    }
  }

render() {
  return (
  <View style={styles.container}>
  <Modal animationType={"slide"} transparent={false} visible={this.state.modalVisible} onRequestClose={() => {alert("Modal has been closed.")}}>
    <View>
      <View style={styles.modalHeader}>
        <TouchableHighlight onPress={() => {
        this.setModalVisible(!this.state.modalVisible); }
        }>
          <Image source={require('./back_orange.png')}
            style={styles.classIcon}
            accessibilityLabel="click to go back"
            />
        </TouchableHighlight>
        <Text style={styles.modalHeaderText}>
          {`${this.props.Name}-${this.props.Toque}`}
        </Text>
        </View>
      <ListView
        dataSource={this.state.lyricDS}
        renderRow={(data) => {
            return this.renderLyricRow(data);
        }
        }
        />

      </View>
 </Modal>
  <TouchableHighlight onPress={() => {
   this.setModalVisible(true); }
  }>
    <View style={styles.container}>
      <Image source={require('./Lyrics.png')}
          style={styles.classIcon}
          accessibilityLabel="Open song screen"/>
        <Text style={styles.text}>
          {`${this.props.Name}`}
        </Text>
    </View>
  </TouchableHighlight>



  <TouchableHighlight onPress={() => {
    Linking.openURL(this.props.YoutubeLink); }
  }>
    <Image source={require('./YouTube-icon.png')}
          style={styles.classIcon}
          accessibilityLabel="Link to Youtube song"/>
  </TouchableHighlight>
  </View>);
  }

}
