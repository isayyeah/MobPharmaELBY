import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, TextInput, Button } from 'react-native';
import axios from 'axios';

export default function App() {
  const [pharmacies, setPharmacies] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pharmaciesPerPage = 4;

  useEffect(() => {
    // Fetch all pharmacies when the component mounts
    fetchPharmacies();
  }, []);

  const fetchPharmacies = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/pharmacies/all');
      setPharmacies(response.data);
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const indexOfLastPharmacy = currentPage * pharmaciesPerPage;
  const indexOfFirstPharmacy = indexOfLastPharmacy - pharmaciesPerPage;

  const filteredPharmacies = pharmacies.filter(
    (pharmacy) =>
      pharmacy.name.toLowerCase().includes(search.toLowerCase()) ||
      pharmacy.address.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedPharmacies = filteredPharmacies.slice(indexOfFirstPharmacy, indexOfLastPharmacy);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Pharmacy List</Text>
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by name or address"
        value={search}
        onChangeText={handleSearch}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {paginatedPharmacies.map((pharmacy) => (
          <View key={pharmacy.id} style={styles.card}>
            <Image source={{ uri: pharmacy.photo }} style={styles.image} />
            <Text style={styles.cardTitle}>{pharmacy.name}</Text>
            <Text>{pharmacy.address}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        <Button title="Previous" onPress={handlePrevPage} disabled={currentPage === 1} />
        <Text style={styles.pageNumber}>{currentPage}</Text>
        <Button
          title="Next"
          onPress={handleNextPage}
          disabled={indexOfLastPharmacy >= filteredPharmacies.length}
        />
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
  searchBar: {
    height: 40,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
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
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  pageNumber: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
