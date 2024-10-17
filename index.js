import { AppRegistry } from 'react-native';
import App from './App';
import appJson from './app.json'; // Import app.json as a default
import { registerRootComponent } from 'expo';

// Use the name property from the default export of appJson
const appName = appJson.name;

AppRegistry.registerComponent(appName, () => App);

AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: document.getElementById('app-root'),
});

registerRootComponent(App);
