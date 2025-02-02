import { registerRootComponent } from 'expo';
import React from 'react';
import App from "./app";
import Toast from 'react-native-toast-message';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately

const Main = () => {
  return (
    <>
      <App />
      <Toast />
    </>
  );
};

registerRootComponent(Main);
