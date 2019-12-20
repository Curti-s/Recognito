import React from 'react';
import { Dimensions, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { RNCamera } from 'react-native-camera';

import CaptureButton from './CaptureButton';


const styles = StyleSheet.create({
  preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
  },
  loadingIndicator: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
  }
});

export default class Camera extends React.Component {
  constructor(props) {
    super(props);
    state = {
      identifiedAs: '',
      loading: false,
    }
  }

  takePicture = async () => {
    if(camera) {

      // pause the camera preview
      this.camera.pausePreview();
      
      // update camera state to indicate loading
      this.setState(({previousState, props}) => ({ loading: true}));
      
      // set the options of the camera
      const options = { base64: true};
      
      // get the base64 version of the image
      const data = await this.camera.takePcitureAsync(options);

      // take the base64 representation of the image and pass it to Clarifai Api
      this.identifyImage(data.base64);
    }
  }

  identifyImage = (imageData) => {
    // init Clarifai API
    const Clarifai = require('clarifai');
    
    const app = new Clarifai.App({ apiKey: '931175fa132b4d858e16270e9fe6a45d' });

    // Identify the image
    app.models.predict(Clarifai.GENERAL_MODEL, { base64: imageData })
          .then(response => this.displayAnswer(response.outputs[0].data.concepts[0].name))
          .catch(err => alert(err));
  }

  displayAnswer = (identifiedImage) => {
    // dismiss the activity indicator
    this.setState(prevState => ({ identifiedAs:identifiedImage, loading:false }));

    // show alert with the answer on
    Alert.alert(this.state.identifiedAs, '', { cancelable:false });

    // resume preview
    this.camera.resumePreview();
  }

  render() {
    return (
      <RNCamera ref={ref => {this.camera = ref;}} styles={styles.preview}>
        <ActivityIndicator size="large" style={styles.loadingIndicator} color="#fff" animating={this.state.loading}/>
        <CaptureButton buttonDisabled={this.state.loading} onClick={this.takePicture} />
      </RNCamera>
    );
  }
}