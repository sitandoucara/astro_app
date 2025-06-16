import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';

import ChartScreen from 'features/chart/ChartScreen';
import CompatibilityScreen from 'features/compatibility/CompatibilityScreen';
import HomeScreen from 'features/home/HomeScreen';
import ExploreScreen from 'features/learn/ExploreScreen';
import ProfileScreen from 'features/profile/ProfileScreen';

import { useAppSelector } from 'shared/hooks';

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const backgroundColor = isDarkMode ? '#F2EAE0' : '#281109';
  const borderColor = isDarkMode ? '#32221E' : '#F2EAE0';
  const textColor = isDarkMode ? '#32221E' : '#F2EAE0';

  return (
    <View className="flex-1" style={{ backgroundColor }}>
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
              case 'Explore':
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
          tabBarActiveTintColor: textColor,
          tabBarInactiveTintColor: textColor + '80',
          tabBarStyle: {
            backgroundColor,
            borderTopColor: borderColor,
            borderTopWidth: 1,
          },
          headerStyle: {
            backgroundColor,
            borderBottomColor: borderColor,
            borderBottomWidth: 1,
            height: 120,
          },
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Chart" component={ChartScreen} />
        <Tab.Screen name="Compatibility" component={CompatibilityScreen} />
        <Tab.Screen name="Explore" component={ExploreScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </View>
  );
}
