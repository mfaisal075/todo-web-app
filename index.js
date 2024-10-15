import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { registerRootComponent } from 'expo';

// Web-specific code
const rootTag = document.getElementById('app-root') || document.getElementById('root');
AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag,
});

registerRootComponent(App);
