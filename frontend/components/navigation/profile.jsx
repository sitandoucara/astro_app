import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Profile() {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Profile page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2EAE0',
  },
  welcomeText: {
    color: '#7B635A',
    fontFamily: 'ArefRuqaa_400Regular',
    fontWeight: 'bold',
    fontSize: 42,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#B84A8E',
    borderRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: 200,
    alignItems: 'center',
    marginVertical: 10,
    overflow: 'hidden',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
