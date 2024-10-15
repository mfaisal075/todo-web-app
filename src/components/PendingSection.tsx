import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  TextInput,
  Button,
  Alert,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FIRESTORE_DB} from '../../FirebaseConfig';
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import {Task} from './TaskIterface';
import DeleteCofirmModal from './DeleteCofirmModal';
import {useTaskContext} from './TaskCotext';

const PendingSection = () => {
  const {tasks, deleteTask, fetchTasks} = useTaskContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [task, setTask] = useState(''); // Task input
  const [description, setDescription] = useState(''); // Task description
  const [dueDate, setDueDate] = useState(new Date()); // Task due date
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null); // Task ID for editing
  const [editModalVisible, setEditModalVisible] = useState(false); // Edit modal visibility
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  const openModal = (task: Task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedTask(null);
    setModalVisible(false);
  };

  const openEditModal = (task: Task) => {
    setTask(task.taskName); // Populate task name
    setDescription(task.taskDescription); // Populate description
    setDueDate(new Date(task.dueDate)); // Populate due date
    setCurrentTaskId(task.id); // Set the task ID
    setEditModalVisible(true); // Open the modal
  };

  const closeEditModal = () => {
    setTask(''); // Clear inputs
    setDescription('');
    setDueDate(new Date());
    setEditModalVisible(false); // Close the modal
  };

  // Open Delete Confirmation Modal
  const openDeleteModal = (task: Task) => {
    setSelectedTask(task); // Set the selected task for deletion
    setDeleteModalVisible(true); // Open delete confirmation modal
  };

  //Function to update task
  const updateTask = async () => {
    if (!currentTaskId) return;

    if (task.trim() === '') {
      Alert.alert('Task cannot be empty');
      return;
    }

    try {
      const formattedDueDate = dueDate.toISOString().split('T')[0];

      const taskRef = doc(FIRESTORE_DB, 'tasks', currentTaskId);
      await updateDoc(taskRef, {
        taskName: task, // Updated task name
        taskDescription: description, // Updated description
        dueDate: formattedDueDate, // Updated due date
      });
      console.log('Task updated successfully');

      setTask(''); // Clear inputs
      setDescription('');
      setDueDate(new Date());
      closeEditModal(); // Close the modal
      fetchTasks(); // Refresh task list
    } catch (error: any) {
      console.error('Error updating task:', error.message);
      Alert.alert('Error updating task:', error.message);
    }
  };

  const handleDeleteTask = async (taskId: string, reason: string) => {
    if (!taskId) {
      Alert.alert('Error: Task ID is missing');
      return;
    }

    // Call deleteTask from the context with the taskId and reason
    await deleteTask(taskId, reason);

    // Close the delete modal and clear the selected task
    setDeleteModalVisible(false);
    setSelectedTask(null);
    fetchTasks();
  };

  const allTasks =
    tasks &&
    tasks.filter(task => task.status === 'To Do' || task.status === 'Doing');

  return (
    <View style={styles.mainSection}>
      <Text style={styles.mainSecHeading}>New Tasks</Text>

      <View style={styles.secContainer}>
        <View style={styles.tableContainer}>
          {/* Table Headings */}
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeading}>Task Name</Text>
            <Text style={styles.tableHeading}>Created At</Text>
            <Text style={styles.tableHeading}>Due Date</Text>
            <Text style={styles.tableHeading}>Status</Text>
            <Text style={styles.tableHeading}>Actions</Text>
          </View>

          {/* Table Rows */}
          {allTasks.length > 0 ? (
            allTasks.map(task => (
              <View style={styles.tableRow} key={task.id}>
                <Text style={styles.tableCell}>{task.taskName}</Text>
                <Text
                  style={[styles.tableCell, {position: 'relative', right: 25}]}>
                  {new Date(task.createdAt).toLocaleDateString()}
                </Text>
                <Text
                  style={[styles.tableCell, {position: 'relative', right: 60}]}>
                  {new Date(task.dueDate).toLocaleDateString()}
                </Text>
                <Text
                  style={[styles.tableCell, {position: 'relative', right: 85}]}>
                  {task.status}
                </Text>
                <View
                  style={[
                    styles.actionButtons,
                    {position: 'relative', right: 115},
                  ]}>
                  {/* Add actions here, e.g., Edit or Delete buttons */}
                  <TouchableOpacity onPress={() => openModal(task)}>
                    <Image
                      source={require('../assets/eye.png')}
                      style={{width: 20, height: 20, marginRight: 10}}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => openEditModal(task)}>
                    <Image
                      source={require('../assets/edit.png')}
                      style={{width: 20, height: 20, marginRight: 10}}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => openDeleteModal(task)}>
                    <Image
                      source={require('../assets/bin.png')}
                      style={{width: 20, height: 20}}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyMessageContainer}>
              <Text style={styles.emptyMessageText}>No tasks available</Text>
            </View>
          )}
        </View>
      </View>

      {/* Modal for Editing task details */}

      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide">
        <View style={styles.editModalContainer}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={closeEditModal}
              style={styles.editCloseButton}>
              <Image
                source={require('../assets/cross-mark.png')}
                style={{width: 25, height: 25, tintColor: 'black'}}
              />
            </TouchableOpacity>
            <Text style={styles.editModalTitle}>Edit Task</Text>

            <TextInput
              style={styles.modalTextInput}
              placeholder="Enter Task"
              value={task}
              onChangeText={text => setTask(text)}
            />
            <TextInput
              style={styles.modalTextInput}
              placeholder="Description"
              value={description}
              onChangeText={text => setDescription(text)}
            />
            <Text>Enter Due Date:</Text>
            <input
              style={styles.modalTextInput}
              type="date"
              value={dueDate.toISOString().substr(0, 10)}
              onChange={e => setDueDate(new Date(e.target.value))}
            />

            <View style={styles.modalButtonContainer}>
              <Button title={'Update Task'} onPress={updateTask} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for viewing task details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {selectedTask && (
              <>
                <Text style={styles.modalTitle}>{selectedTask.taskName}</Text>
                <ScrollView>
                  <Text style={styles.modalText}>
                    <Text style={styles.modalLabel}>Description: </Text>
                    {selectedTask.taskDescription}
                  </Text>
                  <Text style={styles.modalText}>
                    <Text style={styles.modalLabel}>Status: </Text>
                    {selectedTask.status}
                  </Text>
                  <Text style={styles.modalText}>
                    <Text style={styles.modalLabel}>Created At: </Text>
                    {new Date(selectedTask.createdAt).toLocaleString()}
                  </Text>
                  <Text style={styles.modalText}>
                    <Text style={styles.modalLabel}>Due Date: </Text>
                    {new Date(selectedTask.dueDate).toLocaleDateString()}
                  </Text>
                </ScrollView>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteCofirmModal
        isVisible={isDeleteModalVisible}
        onConfirm={(reason: any) => {
          if (selectedTask?.id) {
            handleDeleteTask(selectedTask.id, reason);
          }
        }}
        onCancel={() => setDeleteModalVisible(false)}
      />
    </View>
  );
};

export default PendingSection;

const styles = StyleSheet.create({
  // Main Section
  mainSection: {
    width: '75%',
    marginVertical: 30,
    marginHorizontal: 10,
  },
  mainSecHeading: {
    fontSize: 28,
    fontWeight: '600',
    color: '#93867F',
  },
  secContainer: {
    width: '100%',
    height: 500,
    marginTop: 5,
    backgroundColor: '#D6D7D5',
    borderRadius: 10,
  },

  // Container for the entire table
  tableContainer: {
    width: '100%',
    backgroundColor: '#D6D7D5',
    borderRadius: 10,
  },
  // Header row styling
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#474A45',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  // Headings style
  tableHeading: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#5CC8FF',
    flex: 1, // Adjust width equally
    textAlign: 'left', // Align to the left
    paddingHorizontal: 10,
  },
  // Common row styling for rows
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  // Cell styling for data
  tableCell: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1, // Ensure equal width for columns
    textAlign: 'left', // Align to the left for uniformity
    paddingHorizontal: 15,
  },
  // Container for actions (Edit/Delete buttons)
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  // Modal Styles
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '40%',
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#5CC8FF',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalLabel: {
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#474A45',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#5CC8FF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Edit Modal styles
  editModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: 600,
    height: 400,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    position: 'relative',
  },
  editCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  editModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalTextInput: {
    height: 40,
    borderColor: '#474A45',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  modalButtonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '94%',
    justifyContent: 'center',
  },
  emptyMessageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20, // Adjust the spacing if needed
  },
  emptyMessageText: {
    fontSize: 18,
    color: '#474A45',
  },
});
