import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Button,ListView, TouchableHighlight, Linking, Modal } from 'react-native';


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
    console.warn("rowProps:", props);
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

  <Text style={styles.text}>
   {`${this.props.date}`} {`${this.props.time}`} {`${this.props.title}`}
  </Text>


  <TouchableHighlight onPress={() => {
    Linking.openURL('geo:0,0?q=' + this.props.location); }
  }>
    <Image source={require('./maps_android.png')}
          style={styles.classIcon}
          accessibilityLabel={this.props.location} />
  </TouchableHighlight>

  </View>);
  }

}
