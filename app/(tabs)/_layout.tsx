import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import TabBar from '@components/TabBar';

const TABS = [ {key:'profile', title:'Perfil',tabBarLabel:'Perfil', headerShown: false}, 
               {key:'reward', title:'Recompensas', tabBarLabel:'Premio', headerShown: false}, 
               {key:'index', title:'Piensa Rapido', tabBarLabel:'Jugar', headerShown: true}, 
               {key:'progress', title:'Progreso', tabBarLabel:'Progreso', headerShown: true}, 
               {key:'setting', title:'Configuración', tabBarLabel:'Opciones', headerShown: true} ];

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.key}
          name={`${tab.key}`}
          options={{
            tabBarLabel: `${tab.tabBarLabel}`,
            tabBarShowLabel: true,
            title: `${tab.title}`,
            headerShown: true,
            headerTitleStyle:styles.headerTitle,
            headerTitleAlign: 'center',
          }}
        />
      ))}
    </Tabs>
  );
}
const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20,
    color: '#723FEB',
    justifyContent: 'center',
  },
});
