import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Button, TouchableHighlight, Linking, Modal } from 'react-native';

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

export default class EventRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
       modalVisible: false,
    };
  }



  setModalVisible(visible) {
   this.setState({modalVisible: visible});
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
            {`${this.props.Name}`}
          </Text>
          <TouchableHighlight onPress={() => {
            Linking.openURL('mailto:' + this.props.email + '?subject=class info'); }
          }>
            <Image source={require('./mail_android.png')}
              style={styles.classIcon}
              accessibilityLabel={this.props.email}
              />
          </TouchableHighlight>
          <TouchableHighlight onPress={() => {
            Linking.openURL('geo:37.484847,-122.148386'); }
          }>
            <Image source={require('./maps_android.png')}
                  style={styles.classIcon}
                  accessibilityLabel={this.props.location.street} />
          </TouchableHighlight>
        </View>

        <Text style={styles.text}>
          {`${this.props.eventSchedule[0].dateStart}`}
        </Text>

        <Image source={{ uri: this.props.picture.large}} style={{width: 300, height: 400}} />

        </View>
   </Modal>

  <TouchableHighlight onPress={() => {
    this.setModalVisible(true); }
  }>
    <Image source={{ uri: this.props.picture.thumbnail}} style={styles.photo} />
  </TouchableHighlight>

  <Text style={styles.text}>
    {`${this.props.Name}`}
  </Text>

  <TouchableHighlight onPress={() => {
    Linking.openURL('mailto:' + this.props.email + '?subject=class info'); }
  }>
  <View style={styles.container}>
    <Image source={require('./mail_android.png')}
      style={styles.classIcon}
      accessibilityLabel={this.props.email}
      />
    </View>
  </TouchableHighlight>

  <TouchableHighlight onPress={() => {
    Linking.openURL('geo:37.484847,-122.148386'); }
  }>
    <Image source={require('./maps_android.png')}
          style={styles.classIcon}
          accessibilityLabel={this.props.location.street} />
  </TouchableHighlight>

  </View>);
  }

}
