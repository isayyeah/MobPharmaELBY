
import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
export default function AdvancedScreen({ navigation }) {
    const [selectedValue, setSelectedValue] = useState('');
  
    return (
        <SafeAreaView style={styles.container}>
             <View style={styles.header}>
        <Text style={styles.headerText}>Setting List</Text>
      </View>
     
        
    
      </SafeAreaView>
    );
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header: {
      backgroundColor: '#f2f2f2',
      alignItems: 'center',
      paddingVertical: 10,
    },
    headerText: {
      fontSize: 20,
      fontWeight: 'bold',
    },
  

   
  
  });
  