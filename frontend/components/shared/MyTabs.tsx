import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';

import ChartScreen from '../../features/chart/chartScreen';
import CompatibilityScreen from '../../features/compatibility/CompatibilityScreen';
import HomeScreen from '../../features/home/HomeScreen';
import LearnScreen from '../../features/learn/LearnScreen';
import ProfileScreen from '../../features/profile/ProfileScreen';

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
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Chart" component={ChartScreen} />
        <Tab.Screen name="Compatibility" component={CompatibilityScreen} />
        <Tab.Screen name="Learn" component={LearnScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </View>
  );
}
