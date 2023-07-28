import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Settings from './components/Settings';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

function TabBar() {


    return (
        <NavigationContainer>
            <Tab.Navigator>
          {/* <Tab.Screen name="Home" component={HelloWorldScreen} /> */}
          <Tab.Screen name="Settings" component={Settings} />
         </Tab.Navigator>
        </NavigationContainer>
    )
}