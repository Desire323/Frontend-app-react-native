import React from 'react';
import { Modal, Text, View, StyleSheet, TouchableOpacity } from 'react-native';

const CustomAlert = ({ visible, title, message, onClose }) => {
  return (
    <Modal
      style
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <TouchableOpacity
            style={{ ...styles.openButton }}
            onPress={onClose}
          >
            <Text style={styles.textStyle}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    minWidth: 250,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#89CFF0",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    textAlign: "center",
    fontFamily: 'press-start',
    fontSize: 13,
    margin: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontFamily: 'press-start',
    fontSize: 15,
    lineHeight: 30,
  },
  modalMessage: {
    marginBottom: 15,
    textAlign: "center",
    fontFamily: 'Verdana',
    fontSize: 15,
  }
});

export default CustomAlert;
