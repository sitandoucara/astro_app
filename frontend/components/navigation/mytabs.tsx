import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

import Chart from './chart';
import Compatibility from './compatibility';
import Home from './home';
import Learn from './learn';
import Profile from './profile';

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  return (
    <View style={{ flex: 1, backgroundColor: '#F2EAE0' }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            switch (route.name) {
              case 'Home':
                iconName = focused ? 'moon' : 'moon-outline';
                break;
              case 'Chart':
                iconName = focused ? 'planet' : 'planet-outline';
                break;
              case 'Compatibility':
                iconName = focused ? 'heart' : 'heart-outline';
                break;
              case 'Learn':
                iconName = focused ? 'book' : 'book-outline';
                break;
              case 'Profile':
                iconName = focused ? 'person' : 'person-outline';
                break;
              default:
                iconName = 'help-circle';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#32221E',
          tabBarInactiveTintColor: 'rgba(50, 34, 30, 0.5)',
          tabBarStyle: {
            backgroundColor: '#F2EAE0',
            borderTopColor: '#32221E',
            borderTopWidth: 1,
          },
          headerStyle: {
            backgroundColor: '#F2EAE0',
            borderBottomColor: '#32221E',
            borderBottomWidth: 1,
          },
          headerTitleAlign: 'left',
          headerTitle: () => {
            switch (route.name) {
              case 'Home':
                return (
                  <Text
                    style={{
                      fontFamily: 'ArefRuqaa_400Regular',
                      fontSize: 20,
                      color: '#32221E',
                      marginLeft: 20,
                    }}>
                    Hi !
                  </Text>
                );
              case 'Chart':
                return (
                  <Text
                    style={{
                      fontFamily: 'ArefRuqaa_400Regular',
                      fontSize: 20,
                      color: '#32221E',
                      marginLeft: 20,
                    }}>
                    Here is your chart
                  </Text>
                );
              case 'Compatibility':
                return (
                  <Text
                    style={{
                      fontFamily: 'ArefRuqaa_400Regular',
                      fontSize: 20,
                      color: '#32221E',
                      marginLeft: 20,
                    }}>
                    Check your compatibility
                  </Text>
                );
              case 'Learn':
                return (
                  <Text
                    style={{
                      fontFamily: 'ArefRuqaa_400Regular',
                      fontSize: 20,
                      color: '#32221E',
                      marginLeft: 20,
                    }}>
                    You can learn
                  </Text>
                );
              case 'Profile':
                return (
                  <Text
                    style={{
                      fontFamily: 'ArefRuqaa_400Regular',
                      fontSize: 20,
                      color: '#32221E',
                      marginLeft: 20,
                    }}>
                    Your profile
                  </Text>
                );
              default:
                return null;
            }
          },
        })}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Chart" component={Chart} />
        <Tab.Screen name="Compatibility" component={Compatibility} />
        <Tab.Screen name="Learn" component={Learn} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    </View>
  );
}
