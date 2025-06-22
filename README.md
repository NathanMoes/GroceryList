# GroceryList

A simple and intuitive grocery list application built with React Native and Expo.

## Features

- ✅ Add grocery items to your list
- ✅ Mark items as completed by tapping them
- ✅ Delete items from the list
- ✅ View summary of total and completed items
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
- **React Hooks**: For state management (useState)
- **React Native Components**: SafeAreaView, FlatList, TextInput, TouchableOpacity

## Development Notes

This is a frontend-only implementation focused on UI and user interaction. The app currently:
- Stores data in memory (resets when app restarts)
- Does not persist data to a database
- Does not require authentication
- Does not sync across devices

Future enhancements could include data persistence, cloud sync, and user accounts.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the app on multiple platforms
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
