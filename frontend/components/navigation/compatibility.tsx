import { StyleSheet, Text, View } from 'react-native';

export default function Compatibility() {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Compatibility page</Text>
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
    backgroundColor: '#c47b5a',
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
