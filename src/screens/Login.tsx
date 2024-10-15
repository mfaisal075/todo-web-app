import {View, Text, TextInput, TouchableOpacity, Button} from 'react-native';
import React from 'react';

const Login = ({navigation}: any) => {
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          width: '40%',
          alignItems: 'center',
        }}>
        <Text>Login</Text>
        <TextInput placeholder="Username" />
        <TextInput placeholder="Password" />
        <Button
          title="Login"
          onPress={() => {
            navigation.navigate('Home');
          }}
        />
      </View>
    </View>
  );
};

export default Login;
