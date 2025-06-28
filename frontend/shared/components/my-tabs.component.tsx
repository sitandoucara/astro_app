import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChartScreen from 'features/chart/chart.screen';
import CompatibilityScreen from 'features/compatibility/compatibility.screen';
import ExploreScreen from 'features/explore/explore.screen';
import HomeScreen from 'features/home/home-screen';
import ProfileScreen from 'features/profile/profile.screen';
import { View, Text } from 'react-native';
import { useThemeColors } from 'shared/theme/theme-color.hook';
import { useLanguage } from 'shared/language/language.hook';

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  const colors = useThemeColors();
  const { t } = useLanguage();

  return (
    <View className="flex-1" style={{ backgroundColor: colors.backgroundColor }}>
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
                iconName = focused ? 'star' : 'star-outline';
                break;
              case 'Profile':
                iconName = focused ? 'person' : 'person-outline';
                break;
              default:
                iconName = 'help-circle';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarLabel: ({ focused, color }) => {
            let labelKey = '';
            switch (route.name) {
              case 'Home':
                labelKey = 'navigation.home';
                break;
              case 'Chart':
                labelKey = 'navigation.chart';
                break;
              case 'Compatibility':
                labelKey = 'navigation.compatibility';
                break;
              case 'Explore':
                labelKey = 'navigation.explore';
                break;
              case 'Profile':
                labelKey = 'navigation.profile';
                break;
              default:
                labelKey = 'navigation.home';
            }

            return (
              <Text
                className="text-aref text-xs"
                style={{ color, fontWeight: focused ? 'bold' : 'normal' }}>
                {t(labelKey)}
              </Text>
            );
          },
          tabBarActiveTintColor: colors.textColor,
          tabBarInactiveTintColor: colors.textColor + '80',
          tabBarStyle: {
            backgroundColor: colors.backgroundColor,
            borderTopColor: colors.textColor,
            borderTopWidth: 1,
          },
          headerStyle: {
            backgroundColor: colors.backgroundColor,
            borderBottomColor: colors.textColor,
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
