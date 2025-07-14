# Translate Me
Visual Studio Marketplace Version Visual Studio Marketplace Downloads

Automatically detects hardcoded strings in Flutter projects to facilitate internationalization (i18n).

🔗 **Links**
- Download the extension from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=joaopinacio.translate-me)
- File bugs or request features on the [GitHub repository](https://github.com/joaopinacio/translate-me)

## ⚡ Features

- 🔍 **Smart Detection**: Automatically scans .dart files for hardcoded strings in 40+ Flutter widgets
- 🎯 **Hybrid System**: Fast known widget patterns + custom widget detection
- 🚫 **Flexible Ignoring**: Three types of ignore comments for different scenarios
- ⚡ **Real-time Updates**: Automatic scanning on save with debounced performance
- 🎨 **Visual Diagnostics**: Clear yellow underlines in the editor
- 🔄 **Toggle Control**: Enable/disable detection on demand

## ⚡ Commands

Access from the Command Palette (`⇧⌘P` / `Ctrl+Shift+P`):

### `Translate Me: Scan`
Manually scans the entire workspace for hardcoded strings.
- **Note**: Only works when detection is enabled
- **Use case**: Force a complete workspace scan

### `Translate Me: Toggle Detection`
Enable or disable hardcoded string detection globally.
- **Default**: Detection is **enabled** by default
- **When ENABLED**: 
  - ✅ Automatic scanning on file save/change
  - ✅ Yellow underlines for hardcoded strings
  - ✅ Manual scan command works
  - ✅ Quick actions available

- **When DISABLED**:
  - ❌ **Removes ALL warnings/diagnostics** from editor
  - ❌ Disables automatic scanning 
  - ❌ Manual scan command ignored
  - 💡 Perfect for presentations or focus work

## 💡 Quick Actions

**Ignore Strings**: Right-click a hardcoded string (or quick fix it with `⌘.` / `Ctrl+.`) and select from three ignore options:

### Available Actions:
1. **Ignore this string (add comment on line above)** - Most common approach
   ```dart
   // translate-me-ignore-next-line
   Text('Hello World')
   ```

2. **Ignore this string (add comment at end of line)** - Inline approach
   ```dart
   Text('Hello World'), // translate-me-ignore
   ```

3. **Ignore ALL strings in this file** - File-level approach
   ```dart
   // translate-me-ignore-all-file
   
   class MyWidget extends StatelessWidget {
     // All strings from this point onwards are ignored
   }
   ```

## 🚀 Getting Started

1. **Install the extension** from the VS Code Marketplace
2. **Open a Flutter project** with `.dart` files
3. **Write Flutter code** with hardcoded strings:
   ```dart
   Text('Hello World')
   AppBar(title: Text('My App'))
   ```
4. **See yellow underlines** appear on hardcoded strings
5. **Choose your approach**:
   - Use Quick Actions (`⌘.` / `Ctrl+.`) to ignore specific strings
   - Use `Translate Me: Toggle Detection` to disable all warnings globally

## 🔧 Automatic Detection

The extension automatically scans for hardcoded strings in **40+ known Flutter widgets** plus any custom widgets:

### Supported Widgets
- **Text widgets**: `Text`, `RichText`
- **Buttons**: `ElevatedButton`, `TextButton`, `OutlinedButton`, `IconButton`, `CupertinoButton`
- **Navigation**: `AppBar`, `BottomNavigationBarItem`, `Tab`, `Drawer`, `CupertinoNavigationBar`
- **Dialogs**: `AlertDialog`, `SimpleDialog`, `SnackBar`, `CupertinoAlertDialog`
- **Forms**: `TextField`, `TextFormField`, `InputDecoration`, `DropdownButton`
- **Lists**: `ListTile`, `Card`, `Chip`, `Badge`
- **Custom widgets**: Automatically detected using intelligent pattern matching

### No Configuration Required
- Works out of the box
- No setup needed
- Automatically detects custom widgets

## ⚡ Performance

The extension uses a **two-tier hybrid detection system** for optimal performance:

- **Tier 1**: Fast patterns for 40+ known widgets (~90% faster)
- **Tier 2**: Smart custom widget detection (fallback)
- **Debounced scanning**: Prevents excessive processing
- **Toggle control**: Disable detection entirely when not needed

### Key Benefits
- ✅ **Reduced CPU usage** with optimized patterns
- ✅ **Scalable** for projects with hundreds of custom widgets  
- ✅ **Memory efficient** processing
- ✅ **Real-time updates** without lag

## 🚫 Ignore System

The extension supports three types of ignore comments:

### 1. Single Line Ignore
```dart
Text('Hello'), // translate-me-ignore
```

### 2. Next Line Ignore
```dart
// translate-me-ignore-next-line
Text('World')
```

### 3. File-Level Ignore
```dart
// translate-me-ignore-all-file
Column(
  children: [
    Text('Debug info'),
    Text('Version 1.0.0'),
  ],
)
// All strings from this point onwards are ignored automatically
```

## 📋 Workflow

1. **Write Flutter code** with hardcoded strings
2. **Yellow underlines appear** automatically
3. **Choose your approach**:
   - **Option A**: Use Quick Actions (`⌘.` / `Ctrl+.`) for specific strings
   - **Option B**: Use `Toggle Detection` to disable all warnings globally
4. **Continue coding** without distractions

### 💡 Pro Tips
- **Toggle Detection** is perfect for:
  - 🎯 Focusing on other tasks
  - 📊 Presentations or demos
  - 🚀 When ready to work on i18n later

## 🛠️ Development

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Run extension in development
F5 in VS Code

# Package extension for distribution
vsce package

# Publish extension to VS Code Marketplace
vsce publish
```

## 🤝 Contributing

1. Follow the existing modular architecture
2. Maintain Clean Code principles and SOLID design
3. Add comprehensive error handling
4. Update documentation and tests
5. Open issues and pull requests on GitHub

## ☕ Support

- **Found a bug?** [Open an issue](https://github.com/joaopinacio/translate-me/issues)
- **Have a feature request?** [Create a feature request](https://github.com/joaopinacio/translate-me/issues)
- **Want to contribute?** [Check out the contributing guide](https://github.com/joaopinacio/translate-me/blob/main/CONTRIBUTING.md)

If you find this extension helpful, consider ⭐ starring the [GitHub repository](https://github.com/joaopinacio/translate-me)!