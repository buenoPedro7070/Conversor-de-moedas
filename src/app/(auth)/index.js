import React, { useState, useEffect, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuth, useUser } from "@clerk/clerk-expo";
import { View, ScrollView, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert, Animated, Keyboard } from "react-native";
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';


export default function Home() {
  const { user } = useUser();
  const { signOut } = useAuth();

  const [currencies, setCurrencies] = useState([
    { code: 'BRL', name: 'Real'},
    { code: 'USD', name: 'Dólar'},
    { code: 'EUR', name: 'Euro'},
  ]);
  const [searchText, setSearchText] = useState('');
  const [filteredCurrencies, setFilteredCurrencies] = useState(currencies);
  const [amounts, setAmounts] = useState({ BRL: '' });
  const [rates, setRates] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchExchangeRates = async () => {
    try {
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/BRL');
      setRates(response.data.rates);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      Alert.alert('Erro', 'Erro ao obter as cotações.');
    }
  };

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const handleAmountChange = (currency, value) => {
    const numericValue = value.replace(/[^\d.-]/g, '');
    setAmounts((prevAmounts) => {
      const newAmounts = { ...prevAmounts, [currency]: numericValue };

      Object.keys(rates).forEach((curr) => {
        if (curr !== currency) {
          newAmounts[curr] = ((parseFloat(numericValue) || 0) * rates[curr] / rates[currency]).toFixed(2);
        }
      });

      return newAmounts;
    });
  };


  const handleSearch = (text) => {
    setSearchText(text);
    if (text === '') {
      setFilteredCurrencies(currencies);
    } else {
      const filtered = currencies.filter(currency =>
        currency.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCurrencies(filtered);
    }
  };

  const moveCurrencyUp = (index) => {
    if (index > 0) {
      const newCurrencies = [...currencies];
      // Troca de posição das moedas
      const temp = newCurrencies[index];
      newCurrencies[index] = newCurrencies[index - 1];
      newCurrencies[index - 1] = temp;
      setCurrencies(newCurrencies);
      setFilteredCurrencies(newCurrencies);
    }
  };
  
  const moveCurrencyDown = (index) => {
    if (index < currencies.length - 1) {
      const newCurrencies = [...currencies];
      // Troca de posição das moedas
      const temp = newCurrencies[index];
      newCurrencies[index] = newCurrencies[index + 1];
      newCurrencies[index + 1] = temp;
      setCurrencies(newCurrencies);
      setFilteredCurrencies(newCurrencies);
    }
  };
  
  

  const CurrencyInput = ({ currency, value, index }) => (
    <View style={styles.currencyInput}>
      <Image source={{ uri: currency.flag }} style={styles.flag} />
      <Text style={styles.currencyName}>{currency.name}</Text>
      <TextInput
        style={styles.input}
        value={value}
        keyboardType="numeric"
        placeholderTextColor="#aaa"
        textAlign="right"
        onChangeText={(text) => {
          Keyboard.show();
          setAmounts((prevAmounts) => ({
            ...prevAmounts,
            [currency.code]: text,
          }));
        }}
        onEndEditing={(event) => {
          handleAmountChange(currency.code, event.nativeEvent.text);
        }}
      />
    </View>
  );

  const renderCurrencyTable = () => {
    const tableData = filteredCurrencies.filter(currency => currency.code);
    return (
      <View style={styles.tableContainer}>
        {tableData.map(currency => (
          <View key={currency.code} style={styles.tableRow}>
            <Text style={styles.tableCell}>
              {currency.name}
            </Text>
            <Text style={styles.tableCell2}>
              {rates[currency.code]
                ? `R$ ${(1 / rates[currency.code]).toFixed(2)}`
                : 'Carregando...'}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image source={{ uri: user?.imageUrl }} style={styles.userImage} />
          <Text style={styles.userName}>{user?.fullName}</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={() => signOut()}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>


        <View style={styles.spaceBetweenHeaderAndInputs}></View>

        <Text style={{ fontSize: 21, fontWeight: '700', paddingBottom: 20, color: 'white', textAlign: 'center' }}>
          CONVERSOR DE MOEDAS
        </Text>

        <View>
          {filteredCurrencies.map((currency, index) => (
            <CurrencyInput
              key={currency.code} 
              currency={currency}
              value={amounts[currency.code]} 
              index={index}
            />
          ))}
        </View>

        {renderCurrencyTable()}
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#23395B',
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#D81E5B',
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  currencyInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    display: 'none'
  },

  currencyName: {
    color: '#fff',
    fontSize: 16,
    marginLeft: '14%',
    position: 'absolute',
    zIndex: 1,
  },
  input: {
    backgroundColor: '#B9E3C6',
    color: '#fff',
    width: '73%',
    padding: 12,
    paddingRight: 18,
    borderRadius: 8,
    borderColor: '#444',
    borderWidth: 1,
    textAlign: 'right',
  },
  searchInput: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 12,
    paddingLeft: 16,
    borderRadius: 8,
    borderColor: '#444',
    borderWidth: 1,
    width: '99%',
  },
  searchIconContainer: {
    position: 'absolute',
    left: '90%',

  },
  buttonContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginLeft: 10,
  },
  moveButton: {
    backgroundColor: '#ff5722',
    padding: 10,
    borderRadius: 6,
    marginHorizontal: 6,
  },
  spaceBetweenHeaderAndInputs: {
    height: 1,
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: 'gray',
  },
  tableContainer: {
    marginTop: 10,
    marginBottom: '20%',
    backgroundColor: '#333',
    borderRadius: 8,
    borderColor: '#444',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  tableCell: {
    color: '#59C9A5',
    fontSize: 16,
    flex: 1,
    textAlign: 'left',
  },
  tableCell2: {
    color: '#B9E3C6',
    fontSize: 16,
    flex: 1,
    textAlign: 'right',
  },
});
