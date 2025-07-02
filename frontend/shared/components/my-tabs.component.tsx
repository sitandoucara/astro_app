import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChartScreen from 'features/chart/chart.screen';
import CompatibilityScreen from 'features/compatibility/compatibility.screen';
import ExploreScreen from 'features/explore/explore.screen';
import HomeScreen from 'features/home/home-screen';
import ProfileScreen from 'features/profile/profile.screen';
import { Text, useWindowDimensions } from 'react-native';
import NoiseOverlay from 'shared/components/noise-overlay.component';
import { useLanguage } from 'shared/language/language.hook';
import { useThemeColors } from 'shared/theme/theme-color.hook';

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const colors = useThemeColors();
  const { t } = useLanguage();

  const tabBarPaddingBottom = isTablet ? 22 : 0;

  return (
    <NoiseOverlay intensity={1} className="flex-1">
      <Tab.Navigator
        screenOptions={({ route }) => ({
          // Keeps screens in memory for faster access
          // Immediately loads all screens
          lazy: false,
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            switch (route.name) {
              case 'Home':
                iconName = 'moon';
                break;
              case 'Explore':
                iconName = 'star';
                break;
              case 'Chart':
                iconName = 'planet';
                break;
              case 'Compatibility':
                iconName = 'heart';
                break;
              case 'Profile':
                iconName = 'person';
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
              case 'Explore':
                labelKey = 'navigation.explore';
                break;
              case 'Chart':
                labelKey = 'navigation.chart';
                break;
              case 'Compatibility':
                labelKey = 'navigation.compatibility';
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
          tabBarInactiveTintColor: colors.textColor + '50',
          tabBarStyle: {
            backgroundColor: colors.backgroundColor,
            borderTopColor: colors.textColor,
            borderTopWidth: 1,
            paddingBottom: tabBarPaddingBottom,
          },
          headerStyle: {
            backgroundColor: colors.backgroundColor,
            borderBottomColor: colors.textColor,
            borderBottomWidth: 1,
          },
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Explore" component={ExploreScreen} />
        <Tab.Screen name="Chart" component={ChartScreen} />
        <Tab.Screen name="Compatibility" component={CompatibilityScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NoiseOverlay>
  );
}
