import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import Avatar from '../components/Buddy';
// import TaskList from '../components/TaskList';
// import { useTasks } from '../hooks/useTasks';

export default function BuddyOverlay() {
  const [showTaskList, setShowTaskList] = useState(false);
  const [avatarMood, setAvatarMood] = useState('happy');
  
  // const { tasks, addTask, toggleTask, deleteTask, incompleteCount } = useTasks();

  // const handleAddTask = (text) => {
  //   addTask(text);
  //   setAvatarMood('excited');
  //   setTimeout(() => setAvatarMood('happy'), 2000);
  // };

  // const handleToggleTask = (id) => {
  //   toggleTask(id);
  //   const task = tasks.find(t => t.id === id);
  //   if (!task.completed) {
  //     setAvatarMood('excited');
  //     setTimeout(() => setAvatarMood('happy'), 2000);
  //   }
  // };

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Avatar - Bottom Center */}
      <motion.div 
        // className="fixed bottom-8 right-8 pointer-events-auto" //Bottom right
        className="fixed bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
      >
        <div className="relative">
          <Avatar 
            mood={avatarMood}
            onClick={() => setShowTaskList(!showTaskList)}
            // taskCount={incompleteCount}
  
          />
        </div>
      </motion.div>

      {/* Task List Panel */}
      <AnimatePresence>
        {/* {showTaskList && (
          <TaskList
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={deleteTask}
            onClose={() => setShowTaskList(false)}
          />
        )} */}
      </AnimatePresence>
    </div>
  );
}