# GroceryList

A simple and intuitive grocery list application built with React Native and Expo.

## Features

- ✅ Add grocery items to your list
- ✅ Mark items as completed by tapping them
- ✅ Delete items from the list
- ✅ View summary of total and completed items
- ✅ **Data persistence with SQLite database**
- ✅ **Automatic data backup across app sessions**
- ✅ Clean, modern UI design
- ✅ Cross-platform (iOS, Android, Web)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (optional, but recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/NathanMoes/GroceryList.git
   cd GroceryList
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

You can run the app on different platforms:

#### Web (easiest for development)
```bash
npm run web
```

#### Android
```bash
npm run android
```
*Note: Requires Android Studio and Android SDK setup*

#### iOS
```bash
npm run ios
```
*Note: Requires Xcode (macOS only)*

#### Using Expo Development Build
```bash
npm start
```
Then scan the QR code with the Expo Go app on your mobile device.

## Usage

1. **Adding Items**: Type a grocery item in the input field and tap "Add Item" or press Enter
2. **Completing Items**: Tap on any item to mark it as completed (strikethrough)
3. **Deleting Items**: Tap the red "✕" button next to any item to remove it
4. **Viewing Progress**: Check the summary at the bottom to see total and completed items

## Project Structure

```
├── App.js          # Main application component
├── app.json        # Expo configuration
├── package.json    # Dependencies and scripts
├── assets/         # Images and icons
└── README.md       # This file
```

## Technologies Used

- **React Native**: Cross-platform mobile development framework
- **Expo**: Development platform for React Native apps
- **expo-sqlite**: SQLite database for local data persistence
- **React Hooks**: For state management (useState, useEffect)
- **React Native Components**: SafeAreaView, FlatList, TextInput, TouchableOpacity

## Development Notes

This app now uses SQLite for data persistence:
- Data is automatically saved to a local SQLite database
- Data persists between app sessions and device restarts  
- Database is created automatically on first app launch
- All grocery items are stored locally on the device

Technical details:
- Uses `expo-sqlite` for database operations
- Database file: `grocery_list.db`
- Table: `grocery_items` with columns: id, name, completed, created_at
- Supports iOS, Android, and Web platforms

Future enhancements could include cloud sync and user accounts.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the app on multiple platforms
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
