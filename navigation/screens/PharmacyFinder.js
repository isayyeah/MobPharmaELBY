import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';

const PharmacyFinder = () => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedGarde, setSelectedGarde] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
 

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      error => {
        console.log(error);
      }
    );
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8080/api/cities')
      .then(response => {
        setCities(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (selectedCity) {
      axios.get(`http://localhost:8080/api/zones/city/${selectedCity}`)
        .then(response => {
          setZones(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedCity && selectedZone && selectedGarde) {
      axios.get(`http://localhost:8080/api/pharmacies/zone/${selectedZone}/garde/${selectedGarde}`)
        .then(response => {
          setPharmacies(response.data);
          setMapCenter({ latitude: response.data[0].altitude, longitude: response.data[0].longitude });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [selectedCity, selectedZone, selectedGarde]);

  const handleCityChange = value => {
    setSelectedCity(value);
    setSelectedZone(null);
    setSelectedGarde(null);
    setPharmacies([]);
    setMapCenter(null);
  };

  const handleZoneChange = value => {
    setSelectedZone(value);
    setSelectedGarde(null);
    setPharmacies([]);
    setMapCenter(null);
  };

  const handleGardeChange = value => {
    setSelectedGarde(value);
    setPharmacies([]);
    setMapCenter(null);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <View>
      <Text>Ville:</Text>
      <Picker selectedValue={selectedCity} onValueChange={handleCityChange}>
        <Picker.Item label="-- Sélectionner une ville --" value="" />
        {cities.map(city => (
          <Picker.Item key={city.id} label={city.name} value={city.id} />
        ))}
      </Picker>

      {selectedCity && (
        <>
          <Text>Zone:</Text>
          <Picker selectedValue={selectedZone} onValueChange={handleZoneChange}>
            <Picker.Item label="-- Sélectionner une zone --" value="" />
            {zones.map(zone => (
              <Picker.Item key={zone.id} label={zone.name} value={zone.id} />
            ))}
          </Picker>

          {selectedZone && (
            <>
              <Text>Type de garde:</Text>
              <Picker selectedValue={selectedGarde} onValueChange={handleGardeChange}>
                <Picker.Item label="-- Sélectionner le type de garde --" value="" />
                <Picker.Item label="Jour" value="1" />
                <Picker.Item label="Nuit" value="2" />
              </Picker>

              {selectedGarde && (
                <>
                  <Text>Liste des pharmacies de garde</Text>
                  {pharmacies.length > 0 ? (
                    <View>
                      {pharmacies.map(pharmacy => (
                        <TouchableOpacity key={pharmacy.id} onPress={openModal}>
                          <Text>{pharmacy.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    <Text>Aucune pharmacie trouvée.</Text>
                  )}

                  
                </>
              )}
            </>
          )}
        </>
      )}

    </View>
  );
};

export default PharmacyFinder;
