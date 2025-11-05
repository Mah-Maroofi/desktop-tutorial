import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { useAuth } from './src/hooks/useAuth';
import { AuthLoadingScreen } from './src/screens/AuthLoadingScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { EventsListScreen } from './src/screens/EventsListScreen';
import { CreateDugnadScreen } from './src/screens/CreateDugnadScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { EventDetailScreen } from './src/screens/EventDetailScreen';
import type { RootStackParamList, TabParamList } from './src/screens/types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<TabParamList>();

function AppTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#0E4C92',
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Create') {
            iconName = 'add-circle-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >
      <Tabs.Screen name="Home" component={EventsListScreen} options={{ title: 'Dugnader' }} />
      <Tabs.Screen name="Create" component={CreateDugnadScreen} options={{ title: 'Opprett' }} />
      <Tabs.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
    </Tabs.Navigator>
  );
}

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return <AuthLoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="AppTabs" component={AppTabs} />
          <Stack.Screen name="EventDetail" component={EventDetailScreen} options={{ headerShown: true, title: 'Dugnad' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
