import * as SQLite from 'expo-sqlite';

// Database configuration
const DB_NAME = 'grocery_list.db';

// Open/create database
let db = null;

// Initialize database connection and schema
export const initializeDatabase = async () => {
  try {
    // Open database connection
    db = await SQLite.openDatabaseAsync(DB_NAME);
    
    // Create grocery_items table if it doesn't exist
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS grocery_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Get all grocery items
export const getAllItems = async () => {
  try {
    if (!db) {
      await initializeDatabase();
    }
    
    const result = await db.getAllAsync('SELECT * FROM grocery_items ORDER BY created_at DESC');
    return result.map(item => ({
      id: item.id.toString(),
      name: item.name,
      completed: Boolean(item.completed)
    }));
  } catch (error) {
    console.error('Error getting all items:', error);
    return [];
  }
};

// Add a new grocery item
export const addItem = async (name) => {
  try {
    if (!db) {
      await initializeDatabase();
    }
    
    const result = await db.runAsync(
      'INSERT INTO grocery_items (name, completed) VALUES (?, ?)',
      [name.trim(), 0]
    );
    
    return {
      id: result.lastInsertRowId.toString(),
      name: name.trim(),
      completed: false
    };
  } catch (error) {
    console.error('Error adding item:', error);
    throw error;
  }
};

// Toggle item completion status
export const toggleItemCompletion = async (id) => {
  try {
    if (!db) {
      await initializeDatabase();
    }
    
    await db.runAsync(
      'UPDATE grocery_items SET completed = NOT completed WHERE id = ?',
      [parseInt(id)]
    );
    
    // Get updated item to return current state
    const result = await db.getFirstAsync('SELECT * FROM grocery_items WHERE id = ?', [parseInt(id)]);
    if (result) {
      return {
        id: result.id.toString(),
        name: result.name,
        completed: Boolean(result.completed)
      };
    }
    return null;
  } catch (error) {
    console.error('Error toggling item completion:', error);
    throw error;
  }
};

// Delete a grocery item
export const deleteItem = async (id) => {
  try {
    if (!db) {
      await initializeDatabase();
    }
    
    await db.runAsync('DELETE FROM grocery_items WHERE id = ?', [parseInt(id)]);
    return true;
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};

// Clear all items (useful for testing)
export const clearAllItems = async () => {
  try {
    if (!db) {
      await initializeDatabase();
    }
    
    await db.runAsync('DELETE FROM grocery_items');
    return true;
  } catch (error) {
    console.error('Error clearing all items:', error);
    throw error;
  }
};