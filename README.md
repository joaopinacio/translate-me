# Translate-Me VS Code Extension

A VS Code extension that detects hardcoded strings in Flutter projects to facilitate internationalization (i18n).

## Features

- 🔍 Scans .dart files for hardcoded strings in widgets
- 🎯 Detects both known Flutter widgets and custom widgets
- 🚫 Ignore functionality with comments
- ⚡ Automatic scanning on save and real-time updates
- 📝 Manual scan command
- 🎨 Visual diagnostics in the editor
- ⚡ **Quick Actions** to easily ignore strings
- 🔄 **Toggle Detection** - Enable/disable detection on demand

## Quick Actions

When a hardcoded string is detected, click on the lightbulb 💡 or use `Ctrl+.` (or `Cmd+.` on Mac) to see available actions:

### Available Actions:
1. **Ignore this string (add comment on line above)** - Most common
   ```dart
   // translate-me-ignore-next-line
   Text('Hello World')
   ```

2. **Ignore this string (add comment at end of line)**
   ```dart
   Text('Hello World'), // translate-me-ignore
   ```

3. **Ignore ALL strings in this file** - Ignores entire file from that point
   ```dart
   // translate-me-ignore-all-file
   
   // Your entire file content
   class MyWidget extends StatelessWidget {
     // ... all strings ignored from this point onwards
   }
   ```

## Architecture

The project follows Clean Code principles and SOLID design patterns:

```
src/
├── constants.ts              # Configuration and constants
├── types.ts                  # TypeScript interfaces
├── extension.ts              # Main extension entry point
├── core/
│   └── hardcoded-string-detector.ts  # Main detection orchestrator
├── detectors/
│   ├── string-detector.ts    # String detection logic
│   └── widget-detector.ts    # Widget-specific detection
├── parsers/
│   └── comment-parser.ts     # Comment parsing utilities
├── providers/
│   └── code-actions-provider.ts  # VS Code Quick Actions
├── services/
│   └── workspace-scanner.ts  # Workspace scanning service
└── utils/
    ├── filters.ts            # String filtering utilities
    └── position.ts           # Position calculation utilities
```

## Usage

### Automatic Detection

The extension automatically scans for hardcoded strings in **40+ known Flutter widgets** plus any custom widgets:

**📱 Material & Cupertino Widgets:**
- Text widgets: `Text`, `RichText`
- Buttons: `ElevatedButton`, `TextButton`, `OutlinedButton`, `IconButton`, `CupertinoButton`
- Navigation: `AppBar`, `BottomNavigationBarItem`, `Tab`, `Drawer`, `CupertinoNavigationBar`
- Dialogs: `AlertDialog`, `SimpleDialog`, `SnackBar`, `CupertinoAlertDialog`
- Forms: `TextField`, `TextFormField`, `InputDecoration`, `DropdownButton`
- Lists: `ListTile`, `Card`, `Chip`, `Badge`
- And many more...

**🎯 Custom Widgets:**
- Automatically detects any custom widget with hardcoded strings
- Uses intelligent pattern matching
- No configuration needed

### ⚡ Performance Optimization - Hybrid Detection System

The extension uses a **two-tier detection system** for optimal performance:

**🚀 Tier 1: Known Widget Patterns (Fast)**
- Pre-compiled regex patterns for 40+ common widgets
- Direct parameter mapping (e.g., `Text(data)`, `AppBar(title)`)
- **~90% faster** than generic pattern matching
- O(1) lookup time for widget identification

**🔍 Tier 2: Custom Widget Detection (Fallback)**
- Activated only when Tier 1 doesn't find matches
- Uses PascalCase pattern matching for custom widgets
- Balanced parentheses parsing for complex nested structures
- Intelligent filtering to avoid false positives

**📊 Technical Benefits:**
- **Reduced CPU usage**: Known widgets processed with optimized patterns
- **Faster scanning**: Most common widgets detected immediately
- **Scalable**: Handles projects with hundreds of custom widgets
- **Memory efficient**: Avoids unnecessary regex compilation
- **Toggle Control**: Disable detection entirely for maximum performance when not needed

**🎯 Smart Fallback Strategy:**
```
Known Widget Found? → Use fast pattern → Done ✅
Not Found? → Scan for custom widgets → Apply filters → Done ✅
```

This hybrid approach ensures both **speed** and **comprehensive coverage** without sacrificing accuracy.

### Manual Ignore Options

You can also manually add ignore comments:

```dart
// Ignore specific line
Text('Hello'), // translate-me-ignore

// Ignore next line
// translate-me-ignore-next-line
Text('World'),

// Ignore from this point to end of file
// translate-me-ignore-all-file
Column(
  children: [
    Text('Debug info'),
    Text('Version 1.0.0'),
  ],
)
// All strings from this point onwards are ignored automatically
```

## Ignore System

The extension supports three types of ignore comments:

### 1. Single Line Ignore
- `// translate-me-ignore` - Ignores the hardcoded string on the same line

### 2. Next Line Ignore  
- `// translate-me-ignore-next-line` - Ignores the hardcoded string on the next line

### 3. File-Level Ignore
- `// translate-me-ignore-all-file` - Ignores ALL strings from this point to the end of the file
- **Note**: No end comment is needed! The ignore automatically applies to the rest of the file.

## Workflow

1. **Write your Flutter code normally**
2. **Yellow underlines appear** on hardcoded strings
3. **Choose one of the following options**:
   - **Option A**: Click the lightbulb 💡 or press `Ctrl+.` / `Cmd+.` to ignore specific strings
   - **Option B**: Use `Translate Me: Toggle Detection` to disable all warnings temporarily
4. **If using Option A**: Choose an ignore option that fits your needs
5. **String is automatically ignored** - no more warnings!

### When to Use Toggle Detection:
- **Disable**: When focusing on other tasks and don't want to see warnings
- **Enable**: When ready to work on internationalization
- **Temporary**: Perfect for presentations or demos without distractions

## Code Quality

This project follows:

- **Clean Code**: Meaningful names, small functions, single responsibility
- **SOLID Principles**: Proper separation of concerns and dependency management
- **Modular Architecture**: Each module has a specific responsibility
- **Error Handling**: Comprehensive error handling throughout
- **Performance**: Optimized for large codebases with debounced scanning

## Commands

### Manual Scan
- **Command**: `Translate Me: Scan`
- **Description**: Manually scans the entire workspace for hardcoded strings
- **Note**: Only works when detection is enabled

### Toggle Detection
- **Command**: `Translate Me: Toggle Detection`
- **Description**: Enable or disable hardcoded string detection
- **Default**: Detection is **enabled** by default

#### Toggle Behavior:
- **When ENABLED**: 
  - Performs automatic scanning on file save/change
  - Shows yellow underlines for hardcoded strings
  - Manual scan command works
  - Displays message: "Translate Me: Detection enabled"

- **When DISABLED**:
  - **Removes ALL warnings/diagnostics** from the editor
  - Disables automatic scanning 
  - Manual scan command is ignored
  - Displays message: "Translate Me: Detection disabled"

#### How to Use:
1. Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type "Translate Me: Toggle Detection"
3. Press Enter to toggle

## Development

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Run extension
F5 in VS Code
```

## Contributing

1. Follow the existing code structure
2. Maintain Clean Code principles
3. Add appropriate error handling
4. Update documentation as needed 