import React, {Component } from 'react';
import { View, Text, StyleSheet, Image, Button, TouchableHighlight, Modal,TextInput,Picker, ListView  } from 'react-native';
import  {
  DeviceEventEmitter // will emit events that you can listen to
} from 'react-native';

import { SensorManager } from 'NativeModules'
import kicksData from './kicksData';

var KICK_SCORES_FILE_URL = "https://www.googleapis.com/drive/v2/files/0B1MWdYXZIEzoNElpREt3b2M1cHM?key=AIzaSyBRnRVPiQhjpRo_PCZoPNBaOaJYZoBt5XE&alt=media";
var KICK_SCORES_FILE_UPLOAD_URL="https://www.googleapis.com/upload/drive/v2/files/0B1MWdYXZIEzoNElpREt3b2M1cHM?key=AIzaSyBRnRVPiQhjpRo_PCZoPNBaOaJYZoBt5XE&uploadType=media";

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
  slider: {
    height: 30,
    marginLeft: 7,
  }
});

const onButtonPress = () => { Alert.alert('Button has been pressed!'); };

export default class ArueKick extends Component {
  constructor(props){
    super(props);
    const ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      });
    this.state = {
      kickScoresRetrieved : false,
      kickScores : {},
      kicksDS: ds.cloneWithRowsAndSections({}),
      buttonTitle: "Kick hard",
      started : false,
      modalVisible: false,
      kicker : "typeYourName",
      kickType : "Armada",
      kickScore : 0,
      kickData : {
        "accelerometer" : {
          "x" : [],
          "y" : [],
          "z" : []
        },
        "gyroscope" : {
          "x" : [],
          "y" : [],
          "z" : []
        }
      }
    }

    DeviceEventEmitter.addListener('Accelerometer', this.handleAccelerometer);
    DeviceEventEmitter.addListener('PHYSICAL_BUTTON', this.handleKeyEvent);
    DeviceEventEmitter.addListener('Gyroscope', this.handleGyroscope);

  }

  componentDidMount() {
    this.updateKickScores();
  }



  handleAccelerometer = (data) => {
    this.state.kickData.accelerometer.x.push(data.x);
    this.state.kickData.accelerometer.y.push(data.y);
    this.state.kickData.accelerometer.z.push(data.z);
  }

  handleKeyEvent = (data) => {
  console.warn("key:");
    console.warn("key:" + data.keyCode);
  }

  handleGyroscope = (data) => {
    this.state.kickData.gyroscope.x.push(data.x);
    this.state.kickData.gyroscope.y.push(data.y);
    this.state.kickData.gyroscope.z.push(data.z);
  }

  setModalVisible(visible) {
   this.setState({modalVisible: visible});
  }

  resetKickData() {
    this.setState({
      kickType : "Armada",
      kickScore : 0,
       kickData : {
         "accelerometer" : {
           "x" : [],
           "y" : [],
           "z" : []
         },
         "gyroscope" : {
           "x" : [],
           "y" : [],
           "z" : []
         }
       }
    });
  }

  updateKickScores() {
    this.state.kickScoresRetrieved = false;
    const ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      });

    fetch(KICK_SCORES_FILE_URL,
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
      this.setState({
         kickScores : responseJson,
         kicksDS: ds.cloneWithRowsAndSections(responseJson),
         kickScoresRetrieved : true
      });
    })
    .catch((error) => { console.warn(error); });
  }

  saveKickData() {

    const ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      });

    var savedKick = {
      "kicker" : this.state.kicker,
      "kickScore" : this.state.kickScore,
      "kickData" : this.state.kickData,
      "kickTS" : new Date().toDateString()
    }
    var newKickScores = this.state.kickScores;
    console.warn("kicktpye" + this.state.kickType);
    newKickScores[this.state.kickType].push(savedKick);
    newKickScores[this.state.kickType].sort(this.kickScoresCompare);

    //update state so screen is updated
    this.setState({
      modalVisible : false,
      kickScores : newKickScores,
      kicksDS : ds.cloneWithRowsAndSections(newKickScores)
    });

    //update scores in the cloud
    fetch(KICK_SCORES_FILE_UPLOAD_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state.kickScores)
    }).then((response) => {
        console.warn("status:" + response.status + ",type:" + response.type);
      }
    )
  }


  calculateScore() {
    var kickScore = 0;
    for (i = 0; i < this.state.kickData.accelerometer.x.length; i++) {
      var currentScore = Math.sqrt(this.state.kickData.accelerometer.x[i] * this.state.kickData.accelerometer.x[i] + this.state.kickData.accelerometer.y[i] * this.state.kickData.accelerometer.y[i] + this.state.kickData.accelerometer.z[i] * this.state.kickData.accelerometer.z[i]);
      if (currentScore > kickScore)
      {
          kickScore = currentScore;
      }
    }
    this.state.kickScore = kickScore;
  }

  kickButtonPressed() {
    if (this.state.started) {
      this.setState({
         buttonTitle: "Kick hard",
         started : false
      });
      this.calculateScore();
      SensorManager.stopAccelerometer();
      //SensorManager.stopGyroscope();
      this.setModalVisible(true);
    } else {
      this.setState({
         buttonTitle: "Stop Kick",
         started: true,
      });
      this.resetKickData();
      SensorManager.startAccelerometer(100);
      //SensorManager.startGyroscope(1000);

    }
  }

 _renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
   return (
     <View
      key={`${sectionID}-${rowID}`}
      style={{ height: adjacentRowHighlighted ? 4 : 1, backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC', }}
      />
    );
 }

 kickScoresCompare(scoreA, scoreB) {
   //in reverse order, higher score first
   return scoreB.kickScore - scoreA.kickScore;
 }

 volumeChange(value) {
   console.warn("volume changed");
   this.kickButtonPressed();
 }

 renderSectionHeader(sectionData, category) {
   return (
     <Text style={{fontWeight: "700"}}>{category}</Text>
   )
 }

  render() {
    if (this.state.kickScoresRetrieved) {
      return (
        <View>

          <Modal animationType={"slide"} transparent={false} visible={this.state.modalVisible} onRequestClose={() => {alert("Modal has been closed.")}}>
            <View style={{marginTop: 22}}>
                <Text>Your score is:{`${this.state.kickScore}`}</Text>
                <TextInput
                        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                        onChangeText={(text) => this.setState({kicker : text})}
                        value={this.state.kicker}
                      />
               <Picker selectedValue={this.state.kickType} onValueChange={(type) => this.setState({kickType: type})}>
                 <Picker.Item label="Armada" value="Armada" />
                 <Picker.Item label="MeiaLuaCompasso" value="MeiaLuaCompasso" />
                 <Picker.Item label="Martelo" value="Martelo" />
                 <Picker.Item label="MarteloRodado" value="MarteloRodado" />
                 <Picker.Item label="Queixada" value="Queixada" />
               </Picker>
               <Button onPress={this.saveKickData.bind(this)} title="Save Kick" color="#841584" accessibilityLabel="Send kick data to server" />
            </View>
          </Modal>
          <TextInput placeholder="Enter text to see events" 
           onKeyPress={(event) => { console.warn('onKeyPress key: ' + event.nativeEvent.key); }}  />
           <Button onPress={this.kickButtonPressed.bind(this)} title={this.state.buttonTitle} color="#841584" accessibilityLabel="kick as hard as possible" />

          <ListView
            dataSource={this.state.kicksDS}
            renderRow={(data) =>
              <Text>{`${data.kicker} ${data.kickScore}`}</Text>
            }
            renderSectionHeader={this.renderSectionHeader}
            />
        </View>

      );
    } else {
      return (
        <Text>Downloading scores</Text>
      );
    }
  }
}
