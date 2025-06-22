import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
} from 'react-native';

export default function App() {
  const [groceryItem, setGroceryItem] = useState('');
  const [groceryList, setGroceryList] = useState([]);

  const addItem = () => {
    if (groceryItem.trim() === '') {
      Alert.alert('Error', 'Please enter a grocery item');
      return;
    }
    
    const newItem = {
      id: Date.now().toString(),
      name: groceryItem.trim(),
      completed: false,
    };
    
    setGroceryList([...groceryList, newItem]);
    setGroceryItem('');
  };

  const toggleItem = (id) => {
    setGroceryList(groceryList.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteItem = (id) => {
    setGroceryList(groceryList.filter(item => item.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <TouchableOpacity
        style={[styles.itemText, item.completed && styles.completedItem]}
        onPress={() => toggleItem(item.id)}
      >
        <Text style={[styles.itemName, item.completed && styles.completedText]}>
          {item.name}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteItem(item.id)}
      >
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🛒 Grocery List</Text>
        <Text style={styles.subtitle}>
          {groceryList.length === 0 
            ? 'Add your first item below' 
            : `${groceryList.filter(item => !item.completed).length} items remaining`
          }
        </Text>
      </View>

      {/* Add Item Section */}
      <View style={styles.inputSection}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter grocery item..."
          value={groceryItem}
          onChangeText={setGroceryItem}
          onSubmitEditing={addItem}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addButton} onPress={addItem}>
          <Text style={styles.addButtonText}>Add Item</Text>
        </TouchableOpacity>
      </View>

      {/* Grocery List */}
      <View style={styles.listSection}>
        {groceryList.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Your grocery list is empty</Text>
            <Text style={styles.emptyStateSubtext}>Add items above to get started!</Text>
          </View>
        ) : (
          <FlatList
            data={groceryList}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            style={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Summary */}
      {groceryList.length > 0 && (
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            Total: {groceryList.length} items • 
            Completed: {groceryList.filter(item => item.completed).length}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 25,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  inputSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  textInput: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  list: {
    flex: 1,
  },
  listItem: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginVertical: 3,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemText: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    color: '#2c3e50',
  },
  completedItem: {
    opacity: 0.6,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#95a5a6',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#7f8c8d',
    fontWeight: '500',
    marginBottom: 5,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#bdc3c7',
  },
  summary: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
});
