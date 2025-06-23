import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
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
import { initializeDatabase, getAllItems, addItem as dbAddItem, toggleItemCompletion, deleteItem as dbDeleteItem, updateItem as dbUpdateItem } from './database';

export default function App() {
  const [groceryItem, setGroceryItem] = useState('');
  const [groceryQuantity, setGroceryQuantity] = useState('1');
  const [groceryNotes, setGroceryNotes] = useState('');
  const [groceryList, setGroceryList] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  // Initialize database and load items on app start
  useEffect(() => {
    const initApp = async () => {
      try {
        // Initialize database schema
        await initializeDatabase();
        
        // Load existing items from database
        const items = await getAllItems();
        setGroceryList(items);
      } catch (error) {
        console.error('Error initializing app:', error);
        Alert.alert('Database Error', 'Failed to initialize database');
      }
    };
    
    initApp();
  }, []);

  const addItem = async () => {
    if (groceryItem.trim() === '') {
      Alert.alert('Error', 'Please enter a grocery item');
      return;
    }
    
    const quantity = parseInt(groceryQuantity) || 1;
    if (quantity < 1) {
      Alert.alert('Error', 'Quantity must be at least 1');
      return;
    }
    
    try {
      const newItem = await dbAddItem(groceryItem, quantity, groceryNotes);
      setGroceryList(prevList => [newItem, ...prevList]);
      setGroceryItem('');
      setGroceryQuantity('1');
      setGroceryNotes('');
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error', 'Failed to add item');
    }
  };

  const toggleItem = async (id) => {
    try {
      const updatedItem = await toggleItemCompletion(id);
      if (updatedItem) {
        setGroceryList(prevList => 
          prevList.map(item => 
            item.id === id ? updatedItem : item
          )
        );
      }
    } catch (error) {
      console.error('Error toggling item:', error);
      Alert.alert('Error', 'Failed to update item');
    }
  };

  const deleteItem = async (id) => {
    try {
      await dbDeleteItem(id);
      setGroceryList(prevList => prevList.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
      Alert.alert('Error', 'Failed to delete item');
    }
  };

  const startEditItem = (item) => {
    setEditingItem({
      id: item.id,
      quantity: item.quantity.toString(),
      notes: item.notes
    });
  };

  const saveEditItem = async () => {
    if (!editingItem) return;
    
    const quantity = parseInt(editingItem.quantity) || 1;
    if (quantity < 1) {
      Alert.alert('Error', 'Quantity must be at least 1');
      return;
    }
    
    try {
      const updatedItem = await dbUpdateItem(editingItem.id, quantity, editingItem.notes);
      if (updatedItem) {
        setGroceryList(prevList => 
          prevList.map(item => 
            item.id === editingItem.id ? updatedItem : item
          )
        );
      }
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
      Alert.alert('Error', 'Failed to update item');
    }
  };

  const cancelEditItem = () => {
    setEditingItem(null);
  };

  const renderItem = ({ item }) => {
    const isEditing = editingItem && editingItem.id === item.id;
    
    if (isEditing) {
      return (
        <View style={styles.editingItem}>
          <View style={styles.editingContent}>
            <Text style={styles.editingItemName}>{item.name}</Text>
            <View style={styles.editingRow}>
              <Text style={styles.editingLabel}>Quantity:</Text>
              <TextInput
                style={styles.editingInput}
                value={editingItem.quantity}
                onChangeText={(text) => setEditingItem({...editingItem, quantity: text})}
                keyboardType="numeric"
                placeholder="1"
              />
            </View>
            <View style={styles.editingRow}>
              <Text style={styles.editingLabel}>Notes:</Text>
              <TextInput
                style={[styles.editingInput, styles.editingNotesInput]}
                value={editingItem.notes}
                onChangeText={(text) => setEditingItem({...editingItem, notes: text})}
                placeholder="Optional notes..."
                multiline
              />
            </View>
          </View>
          <View style={styles.editingActions}>
            <TouchableOpacity style={styles.saveButton} onPress={saveEditItem}>
              <Text style={styles.saveButtonText}>✓</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={cancelEditItem}>
              <Text style={styles.cancelButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.listItem}>
        <TouchableOpacity
          style={[styles.itemContent, item.completed && styles.completedItem]}
          onPress={() => toggleItem(item.id)}
        >
          <View style={styles.itemHeader}>
            <Text style={[styles.itemName, item.completed && styles.completedText]}>
              {item.name}
            </Text>
            <Text style={[styles.itemQuantity, item.completed && styles.completedText]}>
              Qty: {item.quantity}
            </Text>
          </View>
          {item.notes ? (
            <Text style={[styles.itemNotes, item.completed && styles.completedText]}>
              {item.notes}
            </Text>
          ) : null}
        </TouchableOpacity>
        <View style={styles.itemActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => startEditItem(item)}
          >
            <Text style={styles.editButtonText}>✎</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteItem(item.id)}
          >
            <Text style={styles.deleteButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.textInput, styles.nameInput]}
            placeholder="Enter grocery item..."
            value={groceryItem}
            onChangeText={setGroceryItem}
            returnKeyType="next"
          />
          <TextInput
            style={[styles.textInput, styles.quantityInput]}
            placeholder="Qty"
            value={groceryQuantity}
            onChangeText={setGroceryQuantity}
            keyboardType="numeric"
            returnKeyType="next"
          />
        </View>
        <TextInput
          style={[styles.textInput, styles.notesInput]}
          placeholder="Notes (optional)..."
          value={groceryNotes}
          onChangeText={setGroceryNotes}
          returnKeyType="done"
          onSubmitEditing={addItem}
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
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  textInput: {
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  nameInput: {
    flex: 1,
    marginRight: 10,
  },
  quantityInput: {
    width: 80,
  },
  notesInput: {
    marginBottom: 15,
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
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
    flex: 1,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
    marginLeft: 10,
  },
  itemNotes: {
    fontSize: 14,
    color: '#95a5a6',
    fontStyle: 'italic',
  },
  itemActions: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  completedItem: {
    opacity: 0.6,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#95a5a6',
  },
  editButton: {
    backgroundColor: '#f39c12',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
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
  editingItem: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginVertical: 3,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#3498db',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  editingContent: {
    marginBottom: 15,
  },
  editingItemName: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
    marginBottom: 10,
  },
  editingRow: {
    marginBottom: 10,
  },
  editingLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
    marginBottom: 5,
  },
  editingInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  editingNotesInput: {
    height: 60,
    textAlignVertical: 'top',
  },
  editingActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  saveButton: {
    backgroundColor: '#27ae60',
    width: 35,
    height: 35,
    borderRadius: 17.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
    width: 35,
    height: 35,
    borderRadius: 17.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
