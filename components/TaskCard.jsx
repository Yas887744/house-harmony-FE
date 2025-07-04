// data - title, room, description, number of points (desirability level), due date / no of days to complete, status,
// link - take a photo and upload to task - only visible on complete?
// status can be changed if assigned to user
// as status is updated to complete points for assigned user are updated on profile, homepage, leaderboard
// to do - add axios functionality for status patch in onStatusChange function
// add user feedback on status change haptics, scale, task moves to correct list

import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import PhotoHandler from '../components/PhotoHandler';
import TaskStatusBar from '../components/TaskStatusBar';
import colors from '../styles/colors';
import typography from '../styles/typography';
import { assignPoints, getRoomIcons, getRoomNames } from '../utils';

import { useTasks } from '../app/contexts/TasksContext';
import { useUser } from '../app/contexts/UserContext';

function TaskCard({ task }) {
  const { claimTask, updateTaskStatusContext } = useTasks();
  const { user } = useUser();
  const [showPhotoHandler, setShowPhotoHandler] = useState(false);

  const onPressHandler = () => {
    const newStatusId = task.status.description === 'unclaimed' ? 'claimed' : 'completed';
    updateTaskStatusContext(task.id, newStatusId);
  };

  const onComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); // not sure this is working, phone being difficult!
    console.log(`${task.id} : done`);
    // make a button to be visible oncomplete to upload a photo
  };

  function onClaim() {
    return claimTask(task.id, user.id);
  }

  const onTakePhoto = () => {
    setShowPhotoHandler(true);
  };

  const onPhotoTaken = (taskId, imageUri) => {
    console.log(`Photo taken for task ${taskId}:`, imageUri);
    // Here you would typically upload the photo to your backend
    // and then mark the task as complete
    onComplete();
    setShowPhotoHandler(false);
  };

  const onClosePhotoHandler = () => {
    setShowPhotoHandler(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.taskHeader}>
        {getRoomIcons(task.rooms.room_name)}
        <Text style={[styles.taskHeaderText, typography.heading]}>
          {getRoomNames(task.rooms.room_name)}
        </Text>
      </View>
      <View>
        <View style={styles.topCard}>
          <View style={styles.topLeftCard}>
            <Text style={{ marginTop: 16, fontWeight: 'bold', paddingHorizontal: 16 }}>
              {task.task_name}
            </Text>
            <Text style={{ paddingHorizontal: 16 }}>{task.description}</Text>
          </View>
          <View style={styles.topRightCard}>
            <Text style={styles.points}>{assignPoints(task.task_name)}</Text>
            <Text>points</Text>
            <Text style={styles.assignedTo}>
              {task.users.user_name ? `Assigned to: ${user.user_name}` : 'Unassigned'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomCard}>
        <Text>{task.task_specific_date ? task.task_specific_date : task.due_date}</Text>

        <TaskStatusBar
          status={task.status.description}
          claimedByUser={user.id}
          onPress={onPressHandler}
          onTakePhoto={onTakePhoto}
          task={task}
        />
      </View>

      <Modal visible={showPhotoHandler} animationType="slide" presentationStyle="pageSheet">
        <PhotoHandler taskId={task.id} onPhotoTaken={onPhotoTaken} onClose={onClosePhotoHandler} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#65CCB8',
    borderRadius: 8,
    marginVertical: 10,
    width: '90%',
    alignSelf: 'center',
    overflow: 'hidden',
    flexDirection: 'column',
  },
  taskHeaderText: {
    marginLeft: 6,
  },
  taskHeader: {
    backgroundColor: '#F2F2F2',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  topCard: {
    // flex: 1,
    paddingRight: 12,
  },
  topRightCard: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  topLeftCard: {
    flex: 1,
  },
  bottomCard: {
    flexDirection: 'row',
    marginTop: 'auto',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
    paddingRight: 20,
  },
  points: {
    fontSize: 30,
    // paddingBottom: 8,
    paddingLeft: 8,
    color: colors.primary,
  },
  pointsText: {
    paddingBottom: 10,
  },
  assignedTo: {
    paddingVertical: 15,
  },
});

export default TaskCard;
