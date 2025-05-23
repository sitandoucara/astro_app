import { useLayoutEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ChartScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          style={{
            fontFamily: 'ArefRuqaa_400Regular',
            fontSize: 20,
            color: '#32221E',
            marginLeft: 20,
          }}>
          Here is your chart
        </Text>
      ),
      headerTitleAlign: 'left',
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Chart page</Text>
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
    fontWeight: 'bold',
    fontFamily: 'ArefRuqaa_400Regular',
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
