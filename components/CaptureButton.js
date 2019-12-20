import React from 'react';
import { StyleSheet, Button, TouchableHighlight } from 'react-native';

const styles = StyleSheet.create({
  captureButton: {
      marginBottom:30,
      width:160,
      borderRadius:10,
      backgroundColor: "white",
  }
});

const CaptureButton = props => {
  return (
    <TouchableHighlight style={styles.captureButton} disabled={this.props.buttonDisabled}>
      <Button onPress={props.onClick} disabled={props.buttonDisabled} title="Capture" accessibilityLabel="Learn more about this button"/>
    </TouchableHighlight>
  )
}

export default CaptureButton;