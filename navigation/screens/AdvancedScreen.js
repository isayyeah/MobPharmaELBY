import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Picker, FlatList, Image } from 'react-native';
import axios from 'axios';

export default function AdvancedScreen({ navigation }) {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedGarde, setSelectedGarde] = useState('');
  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      fetchZones();
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedZone && selectedGarde) {
      fetchPharmacies();
    }
  }, [selectedZone, selectedGarde]);

  const fetchCities = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/cities');
      setCities(response.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchZones = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/zones/city/${selectedCity}`);
      setZones(response.data);
    } catch (error) {
      console.error('Error fetching zones:', error);
    }
  };

  const fetchPharmacies = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/pharmacies/zone/${selectedZone}/garde/${selectedGarde}`
      );
      setPharmacies(response.data);
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
    }
  };

  const handleGardeChange = (itemValue) => {
    setSelectedGarde(itemValue);
  };

  const renderPharmacyCard = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.photo }} style={styles.pharmacyImage} />
      <Text style={styles.pharmacyTitle}>{item.title}</Text>
      <Text>{item.address}</Text>
      {/* Additional pharmacy details */}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Advanced Search</Text>
      </View>
      <View style={styles.pickerContainer}>
        <Text>City:</Text>
        <Picker
          selectedValue={selectedCity}
          onValueChange={(itemValue) => setSelectedCity(itemValue)}
          style={{ height: 50, width: 200 }}
        >
          <Picker.Item label="-- Select City --" value="" />
          {cities.map((city) => (
            <Picker.Item key={city.id} label={city.name} value={city.id} />
          ))}
        </Picker>
      </View>
      {selectedCity && (
        <View style={styles.pickerContainer}>
          <Text>Zone:</Text>
          <Picker
            selectedValue={selectedZone}
            onValueChange={(itemValue) => setSelectedZone(itemValue)}
            style={{ height: 50, width: 200 }}
          >
            <Picker.Item label="-- Select Zone --" value="" />
            {zones.map((zone) => (
              <Picker.Item key={zone.id} label={zone.name} value={zone.id} />
            ))}
          </Picker>
        </View>
      )}
      {selectedCity && selectedZone && (
        <View style={styles.pickerContainer}>
          <Text>Type de garde:</Text>
          <Picker selectedValue={selectedGarde} onValueChange={handleGardeChange}>
            <Picker.Item label="-- Select Garde Type --" value="" />
            <Picker.Item label="Jour" value="1" />
            <Picker.Item label="Nuit" value="2" />
          </Picker>
        </View>
      )}
      {selectedCity && selectedZone && selectedGarde && (
        <FlatList
          data={pharmacies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPharmacyCard}
        />
      )}
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
  pickerContainer: {
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    marginBottom: 20,
    padding: 20,
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  pharmacyImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  pharmacyTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
});
