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
  }
});

export default class EventClassRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
       modalVisible: false,
    };
  }


render() {
  return (
  <View style={styles.container}>


  <Text style={styles.text}>
    {`${this.props.title}`}
  </Text>

  </View>
  );
  }

}
