import React from 'react';
import Navigator from './src/components/Navigator';
import {TaskProvider} from './src/components/TaskCotext';
const App = () => {
  return (
    <TaskProvider>
      <Navigator />
    </TaskProvider>
  );
};

export default App;
