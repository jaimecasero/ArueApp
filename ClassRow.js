import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Button, TouchableHighlight, Linking } from 'react-native';

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

export default class ClassRow extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          {`${this.props.class.name} ${this.props.class.days} ${this.props.class.startTime}`}
        </Text>
        <TouchableHighlight onPress={() => {
            Linking.openURL('mailto:' + this.props.mestre.email + '?subject=Info de clases:' + this.props.class.name).catch(err => console.error('Configura una cuenta de correo', err)); }
          }>
          <View style={styles.container}>
            <Image source={require('./mail_android.png')}
              style={styles.classIcon}
              accessibilityLabel={"Send email to mestre"}
              />
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => {
            Linking.openURL('geo:0,0?q=' + this.props.class.location); }
          }>
            <Image source={require('./maps_android.png')}
                  style={styles.classIcon}
                  accessibilityLabel={"Open maps with class location"} />
          </TouchableHighlight>
      </View>
    );
  }
};
