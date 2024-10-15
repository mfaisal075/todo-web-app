import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  Alert,
  Button,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import {
  addDoc,
  getDocs,
  collection,
  updateDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import NewSection from '../components/NewSection';
import PendingSection from '../components/PendingSection';
import CompletedSection from '../components/CompletedSection';
import {Task} from '../components/TaskIterface';
import {FIRESTORE_DB} from '../../FirebaseConfig';
import DeleteSection from '../components/DeleteSection';
import {TaskProvider} from '../components/TaskCotext';
import {useTaskContext} from '../components/TaskCotext';

const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [task, setTask] = useState(''); // Task input
  const {tasks, fetchTasks} = useTaskContext();
  const [description, setDescription] = useState(''); // Task description
  const [dueDate, setDueDate] = useState(new Date()); // Task due date
  const [isEditing, setIsEditing] = useState(false); // To track if we are editing
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [selectedButton, setSelectedButton] = useState<string>('All');
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const {
    allTasksCount,
    newTasksCount,
    pendingTasksCount,
    completedTasksCount,
    deletedTasksCount,
  } = useTaskContext();

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const addTask = async () => {
    if (task.trim() === '') {
      Alert.alert('Task cannot be empty');
      return;
    }
    try {
      const formattedDueDate = dueDate.toISOString().split('T')[0];

      await addDoc(collection(FIRESTORE_DB, 'tasks'), {
        taskName: task, // Correct field name
        taskDescription: description,
        dueDate: formattedDueDate,
        status: 'To Do',
        createdAt: new Date().toISOString().split('T')[0],
      });
      console.log('Task added successfully');
      setTask(''); // Clear input
      setDescription(''); // Clear input
      setDueDate(new Date()); // Reset due date
      closeModal(); // Close modal after adding task
      fetchTasks(); // Refresh task list
    } catch (error: any) {
      console.error('Error adding task: ', error.message); // Log error message
      Alert.alert('Error adding task:', error.message);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const taskRef = doc(FIRESTORE_DB, 'tasks', taskId);
      await deleteDoc(taskRef);

      if (Platform.OS === 'web') {
        window.alert('Task deleted successfully');
      } else {
        Alert.alert('Success', 'Task deleted successfully');
      }

      fetchTasks();
    } catch (error: any) {
      console.error('Error deleting task: ', error.message);
      Alert.alert('Error deleting task:', error.message);
    }
  };

  //Function to update task status to 'Doing'
  const updateTaskStatus = async (taskId: string) => {
    try {
      const taskRef = doc(FIRESTORE_DB, 'tasks', taskId);
      await updateDoc(taskRef, {
        status: 'Doing',
      });
      console.log('Task status updated to Doing');
      fetchTasks();
    } catch (error: any) {
      console.error('Error updating task status: ', error.message);
      Alert.alert('Error updating task status:', error.message);
    }
  };

  //Function to update task status to 'Done'
  const updateTaskStatusDone = async (taskId: string) => {
    try {
      const taskRef = doc(FIRESTORE_DB, 'tasks', taskId);
      await updateDoc(taskRef, {
        status: 'Done',
      });
      console.log('Task status updated to Done');
      fetchTasks();
    } catch (error: any) {
      console.error('Error updating task status: ', error.message);
      Alert.alert('Error updating task status:', error.message);
    }
  };

  //Function to update task status to 'To Do'
  const updateTaskStatusToDo = async (taskId: string) => {
    try {
      const taskRef = doc(FIRESTORE_DB, 'tasks', taskId);
      await updateDoc(taskRef, {
        status: 'To Do',
      });
      console.log('Task status updated to To Do');
      fetchTasks();
    } catch (error: any) {
      console.error('Error updating task status: ', error.message);
      Alert.alert('Error updating task status:', error.message);
    }
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
      closeModal(); // Close the modal
      fetchTasks(); // Refresh task list
    } catch (error: any) {
      console.error('Error updating task:', error.message);
      Alert.alert('Error updating task:', error.message);
    }
  };

  const openEditModal = (task: Task) => {
    setTask(task.taskName); // Populate task name
    setDescription(task.taskDescription); // Populate description
    setDueDate(new Date(task.dueDate)); // Populate due date
    setCurrentTaskId(task.id); // Set the task ID
    setIsEditing(true); // Enable edit mode
    setModalVisible(true); // Open the modal
  };

  const closeEditModal = () => {
    setTask(''); // Clear inputs
    setDescription('');
    setDueDate(new Date());
    setIsEditing(false); // Disable edit mode
    setModalVisible(false); // Close the modal
  };

  // Function to handle button selection
  const handleButtonPress = (buttonName: string) => {
    setSelectedButton(buttonName);
  };

  const openViewModal = (task: Task) => {
    setSelectedTask(task);
    setViewModalVisible(true);
  };

  const closeViewModal = () => {
    setSelectedTask(null);
    setViewModalVisible(false);
  };

  const todoTasks = tasks && tasks.filter(task => task.status === 'To Do');
  const doingTasks = tasks && tasks.filter(task => task.status === 'Doing');
  const doneTasks = tasks && tasks.filter(task => task.status === 'Done');

  return (
    <View>
      {Platform.OS === 'web' ? (
        <View>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={styles.sideBar}>
              <Text style={styles.sideBarHeading}>Menu</Text>
              <View style={styles.sideBarButtonsSection}>
                <TouchableOpacity
                  style={styles.sideBarButtons}
                  onPress={() => {
                    handleButtonPress('All');
                    openModal();
                  }}>
                  <Text style={styles.sideBarButtonsText}>Add Task</Text>
                </TouchableOpacity>

                {/* Add a divider */}
                <View
                  style={{
                    height: 5,
                    backgroundColor: 'white',
                    marginTop: 5,
                    borderRadius: 10,
                  }}></View>

                <View style={{marginVertical: 20}}>
                  {/* All Tasks Button */}
                  <TouchableOpacity
                    style={[
                      styles.sideBarButtons,
                      selectedButton === 'All' && styles.selectedButton,
                    ]}
                    onPress={() => handleButtonPress('All')}>
                    <Text style={styles.sideBarButtonsText}>All Tasks</Text>
                    <View style={styles.notificationBadge}>
                      <Text style={styles.badgeText}>{allTasksCount}</Text>
                    </View>
                  </TouchableOpacity>

                  {/* New Tasks Button */}
                  <TouchableOpacity
                    style={[
                      styles.sideBarButtons,
                      selectedButton === 'New' && styles.selectedButton,
                    ]}
                    onPress={() => handleButtonPress('New')}>
                    <Text style={styles.sideBarButtonsText}>New Tasks</Text>
                    <View style={styles.notificationBadge}>
                      <Text style={styles.badgeText}>{newTasksCount}</Text>
                    </View>
                  </TouchableOpacity>

                  {/* Pending Tasks Button */}
                  <TouchableOpacity
                    style={[
                      styles.sideBarButtons,
                      selectedButton === 'Pending' && styles.selectedButton,
                    ]}
                    onPress={() => handleButtonPress('Pending')}>
                    <Text style={styles.sideBarButtonsText}>Pending Tasks</Text>
                    <View style={styles.notificationBadge}>
                      <Text style={styles.badgeText}>{pendingTasksCount}</Text>
                    </View>
                  </TouchableOpacity>

                  {/* Completed Tasks Button */}
                  <TouchableOpacity
                    style={[
                      styles.sideBarButtons,
                      selectedButton === 'Completed' && styles.selectedButton,
                    ]}
                    onPress={() => handleButtonPress('Completed')}>
                    <Text style={styles.sideBarButtonsText}>
                      Completed Tasks
                    </Text>
                    <View style={styles.notificationBadge}>
                      <Text style={styles.badgeText}>
                        {completedTasksCount}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* Deleted Tasks Button */}
                  <TouchableOpacity
                    style={[
                      styles.sideBarButtons,
                      selectedButton === 'Deleted' && styles.selectedButton,
                    ]}
                    onPress={() => handleButtonPress('Deleted')}>
                    <Text style={styles.sideBarButtonsText}>Deleted Tasks</Text>
                    <View style={styles.notificationBadge}>
                      <Text style={styles.badgeText}>{deletedTasksCount}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.signOutSec}>
                <TouchableOpacity
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../assets/sign-out.png')}
                    style={{width: 30, height: 30, tintColor: '#fff'}}
                  />
                  <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>
              </View>
            </View>

            {selectedButton === 'All' && (
              <View style={styles.mainSection}>
                <Text style={styles.mainSecHeading}>Todos</Text>

                <View style={styles.secContainer}>
                  <View style={styles.taskSec}>
                    <View style={styles.taskSecHeadingContainer}>
                      <Text style={styles.taskSecHeading}>To do</Text>
                    </View>
                    <ScrollView
                      style={styles.taskListContainer}
                      showsVerticalScrollIndicator={false}>
                      {todoTasks.length > 0 ? (
                        todoTasks.map((task: Task) => (
                          <TouchableOpacity onPress={() => openViewModal(task)}>
                            <View key={task.id} style={styles.taskContainer}>
                              <View style={styles.taskInfo}>
                                <Text style={styles.taskName}>
                                  {task.taskName}
                                </Text>
                                <Text style={styles.dueDate}>
                                  <Text style={styles.dueDateLabel}>
                                    Due Date:{' '}
                                  </Text>
                                  {task.dueDate}
                                </Text>
                              </View>
                              <View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                  }}>
                                  <Image
                                    source={require('../assets/left-arrow.png')}
                                    style={{
                                      width: 25,
                                      height: 25,
                                      tintColor: '#5CC8FF',
                                    }}
                                  />
                                  <TouchableOpacity
                                    onPress={() => updateTaskStatus(task.id)}>
                                    <Image
                                      source={require('../assets/right-arrow.png')}
                                      style={{width: 25, height: 25}}
                                    />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>
                        ))
                      ) : (
                        <View style={styles.emptyMessageContainer}>
                          <Text style={styles.emptyMessageText}>
                            No tasks available
                          </Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>

                  <View style={styles.taskSec}>
                    <View style={styles.taskSecHeadingContainer}>
                      <Text style={styles.taskSecHeading}>Doing</Text>
                    </View>
                    <ScrollView
                      style={styles.taskListContainer}
                      showsVerticalScrollIndicator={false}>
                      {doingTasks.length > 0 ? (
                        doingTasks.map((task: Task) => (
                          <TouchableOpacity onPress={() => openViewModal(task)}>
                            <View key={task.id} style={styles.taskContainer}>
                              <View style={styles.taskInfo}>
                                <Text style={styles.taskName}>
                                  {task.taskName}
                                </Text>
                                <Text style={styles.dueDate}>
                                  <Text style={styles.dueDateLabel}>
                                    Due Date:{' '}
                                  </Text>
                                  {task.dueDate}
                                </Text>
                              </View>
                              <View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                  }}>
                                  <TouchableOpacity
                                    onPress={() =>
                                      updateTaskStatusToDo(task.id)
                                    }>
                                    <Image
                                      source={require('../assets/left-arrow.png')}
                                      style={{
                                        width: 25,
                                        height: 25,
                                      }}
                                    />
                                  </TouchableOpacity>
                                  <View style={{width: 20}} />
                                  <TouchableOpacity
                                    onPress={() =>
                                      updateTaskStatusDone(task.id)
                                    }>
                                    <Image
                                      source={require('../assets/right-arrow.png')}
                                      style={{width: 25, height: 25}}
                                    />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>
                        ))
                      ) : (
                        <View style={styles.emptyMessageContainer}>
                          <Text style={styles.emptyMessageText}>
                            No tasks available
                          </Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>
                  <View style={styles.taskSec}>
                    <View style={styles.taskSecHeadingContainer}>
                      <Text style={styles.taskSecHeading}>Done</Text>
                    </View>
                    <ScrollView
                      style={styles.taskListContainer}
                      showsVerticalScrollIndicator={false}>
                      {doneTasks.length > 0 ? (
                        doneTasks.map((task: Task) => (
                          <TouchableOpacity onPress={() => openViewModal(task)}>
                            <View key={task.id} style={styles.taskContainer}>
                              <View style={styles.taskInfo}>
                                <Text style={styles.taskName}>
                                  {task.taskName}
                                </Text>
                                <Text style={styles.dueDate}>
                                  <Text style={styles.dueDateLabel}>
                                    Task Completed
                                  </Text>
                                </Text>
                              </View>
                              <View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                  }}>
                                  <Image
                                    source={require('../assets/left-arrow.png')}
                                    style={{
                                      width: 25,
                                      height: 25,
                                      tintColor: '#5CC8FF',
                                    }}
                                  />
                                  <Image
                                    source={require('../assets/check.png')}
                                    style={{width: 25, height: 25}}
                                  />
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>
                        ))
                      ) : (
                        <View style={styles.emptyMessageContainer}>
                          <Text style={styles.emptyMessageText}>
                            No tasks available
                          </Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>
                </View>
              </View>
            )}
            {selectedButton === 'New' && <NewSection />}
            {selectedButton === 'Pending' && <PendingSection />}
            {selectedButton === 'Completed' && <CompletedSection />}
            {selectedButton === 'Deleted' && <DeleteSection />}

            {/* Add Modal Section */}

            <Modal
              visible={modalVisible}
              transparent={true}
              animationType="slide">
              <View style={styles.modalContainer}>
                <View style={styles.modalView}>
                  <TouchableOpacity
                    onPress={closeModal}
                    style={styles.closeButton}>
                    <Image
                      source={require('../assets/cross-mark.png')}
                      style={{width: 25, height: 25, tintColor: 'black'}}
                    />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Add New Task</Text>
                  <TextInput
                    style={styles.modalTextInput}
                    placeholder="Enter Task"
                    value={task} // Bind the input to state
                    onChangeText={text => setTask(text)} // Update state on change
                  />
                  <TextInput
                    style={styles.modalTextInput}
                    placeholder="Description"
                    value={description} // Bind the input to state
                    onChangeText={text => setDescription(text)} // Update state on change
                  />
                  <Text>Enter Due Date:</Text>
                  <input
                    style={styles.modalTextInput}
                    type="date"
                    value={dueDate.toISOString().substr(0, 10)} // Format to 'YYYY-MM-DD'
                    onChange={e => setDueDate(new Date(e.target.value))}
                  />
                  <View style={styles.modalButtonContainer}>
                    <Button
                      title="Add Task"
                      onPress={() => {
                        addTask();
                      }}
                    />
                  </View>
                </View>
              </View>
            </Modal>

            {/* Edit Modal Section */}

            <Modal
              visible={modalVisible}
              transparent={true}
              animationType="slide">
              <View style={styles.modalContainer}>
                <View style={styles.modalView}>
                  <TouchableOpacity
                    onPress={closeEditModal}
                    style={styles.closeButton}>
                    <Image
                      source={require('../assets/cross-mark.png')}
                      style={{width: 25, height: 25, tintColor: 'black'}}
                    />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>
                    {isEditing ? 'Edit Task' : 'Add New Task'}
                  </Text>

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
                    <Button
                      title={isEditing ? 'Update Task' : 'Add Task'}
                      onPress={isEditing ? updateTask : addTask}
                    />
                  </View>
                </View>
              </View>
            </Modal>

            {/* Modal for viewing task details */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={viewModalVisible}
              onRequestClose={closeViewModal}>
              <View style={styles.modalBackground}>
                <View style={styles.viewModalContainer}>
                  {selectedTask && (
                    <>
                      <Text style={styles.viewModalTitle}>
                        {selectedTask.taskName}
                      </Text>
                      <ScrollView>
                        <Text style={styles.modalText}>
                          <Text style={styles.viewModalLabel}>
                            Description:{' '}
                          </Text>
                          {selectedTask.taskDescription}
                        </Text>
                        <Text style={styles.modalText}>
                          <Text style={styles.viewModalLabel}>Status: </Text>
                          {selectedTask.status}
                        </Text>
                        <Text style={styles.modalText}>
                          <Text style={styles.viewModalLabel}>
                            Created At:{' '}
                          </Text>
                          {new Date(selectedTask.createdAt).toLocaleString()}
                        </Text>
                        <Text style={styles.modalText}>
                          <Text style={styles.viewModalLabel}>Due Date: </Text>
                          {new Date(selectedTask.dueDate).toLocaleDateString()}
                        </Text>
                      </ScrollView>
                      <TouchableOpacity
                        style={styles.viewCloseButton}
                        onPress={closeViewModal}>
                        <Text style={styles.closeButtonText}>Close</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            </Modal>
          </View>
        </View>
      ) : (
        <Text>Hello Android</Text>
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  // SideBar styles
  sideBar: {
    width: '20%',
    height: 550,
    backgroundColor: '#474A45',
    marginVertical: 20,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  sideBarHeading: {
    color: '#5CC8FF',
    fontSize: 24,
    fontWeight: '600',
    marginVertical: 10,
    marginHorizontal: 10,
  },
  sideBarButtonsSection: {
    marginVertical: 5,
    marginHorizontal: 20,
  },
  sideBarButtons: {
    backgroundColor: '#848881',
    padding: 10,
    marginVertical: 8,
    borderRadius: 10,
  },
  sideBarButtonsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signOutSec: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  selectedButton: {
    backgroundColor: '#5CC8FF', // Color for selected button
  },

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
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  taskSec: {
    width: '30%',
    height: 500,
    backgroundColor: '#D6D7D5',
    borderRadius: 10,
    marginTop: 5,
  },
  taskSecHeadingContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#93867F',
    borderBottomWidth: 2,
  },
  taskSecHeading: {
    fontSize: 24,
    fontWeight: '600',
    color: '#474A45',
  },

  // Modal styles
  modalContainer: {
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
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  modalTitle: {
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

  // Task styles
  taskContainer: {
    padding: 15,
    borderRadius: 10,
    borderBottomColor: '#474A45',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between', // Space between task info and delete button
    alignItems: 'center', // Align items vertically centered
    marginVertical: 5, // Space between tasks
    backgroundColor: '#5CC8FF',
  },
  deleteButton: {
    marginLeft: 10, // Optional: add space between task info and delete button
  },
  taskInfo: {
    flex: 1, // Allow the task info to take remaining space
  },
  taskName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  dueDate: {
    fontSize: 10,
    fontWeight: '600',
    color: '#474A45',
  },
  dueDateLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#474A45',
  },

  taskListContainer: {
    padding: 10,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },

  // Notification badge styles
  notificationBadge: {
    position: 'absolute',
    right: 10,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // View Modal Styles
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewModalContainer: {
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
  viewModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#5CC8FF',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  viewModalLabel: {
    fontWeight: 'bold',
  },
  viewCloseButton: {
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
