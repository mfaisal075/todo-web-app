import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';

const DeleteConfirmModal = ({isVisible, onConfirm, onCancel}: any) => {
  const {width} = useWindowDimensions();
  const [reason, setReason] = useState(''); // State to store reason input

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onCancel}
      backdropOpacity={0.5}>
      <View style={[styles.modalContainer, {width: width * 0.4, alignSelf: 'center'}]}>
        <Text style={styles.modalTitle}>Delete Task</Text>
        <Text style={styles.modalMessage}>
          Are you sure you want to delete this task? Please provide a reason:
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter reason for deletion"
          value={reason}
          onChangeText={setReason} // Update state when text input changes
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onConfirm(reason)} style={styles.deleteButton}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteConfirmModal;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
  textInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: '100%',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
