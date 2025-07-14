/**
 * Constants and configuration for the translate-me extension
 */

import { WidgetPattern } from './types';

export const EXTENSION_NAME = 'translate-me';
export const DART_LANGUAGE_ID = 'dart';
export const SCAN_COMPLETE_MESSAGE = 'Scan completed.';

// Toggle command constants
export const TOGGLE_COMMAND_ID = 'translate-me.toggle';
export const DETECTION_ENABLED_MESSAGE = 'Translate Me: Detection enabled';
export const DETECTION_DISABLED_MESSAGE = 'Translate Me: Detection disabled';

// Ignore comment patterns
export const IGNORE_COMMENTS = {
    LINE: '// translate-me-ignore',
    NEXT_LINE: '// translate-me-ignore-next-line',
    ALL_FILE: '// translate-me-ignore-all-file',
} as const;

// Widget patterns for known Flutter widgets
export const KNOWN_WIDGET_PATTERNS: WidgetPattern[] = [
    // Text widgets
    { widget: 'Text', params: ['', 'data'] },
    { widget: 'RichText', params: ['text'] },

    // UI Components
    { widget: 'Tooltip', params: ['message'] },
    { widget: 'SnackBar', params: ['content'] },
    { widget: 'AppBar', params: ['title'] },
    { widget: 'Hero', params: ['child'] }, // tag parameter should be filtered

    // Buttons
    { widget: 'ElevatedButton', params: ['child'] },
    { widget: 'TextButton', params: ['child'] },
    { widget: 'OutlinedButton', params: ['child'] },
    { widget: 'IconButton', params: ['tooltip'] },
    { widget: 'FloatingActionButton', params: ['tooltip', 'child'] },

    // Dialogs and overlays
    { widget: 'AlertDialog', params: ['title', 'content'] },
    { widget: 'SimpleDialog', params: ['title'] },
    { widget: 'BottomSheet', params: [''] },

    // Navigation
    { widget: 'ListTile', params: ['title', 'subtitle', 'leading', 'trailing'] },
    { widget: 'BottomNavigationBarItem', params: ['label', 'tooltip'] },
    { widget: 'Tab', params: ['text', 'child'] },
    { widget: 'TabBar', params: [''] },
    { widget: 'Drawer', params: ['child'] },

    // Cards and containers
    { widget: 'Card', params: ['child'] },
    { widget: 'Chip', params: ['label'] },
    { widget: 'Badge', params: ['label'] },

    // Form inputs
    { widget: 'TextField', params: [''] },
    { widget: 'TextFormField', params: [''] },
    { widget: 'InputDecoration', params: ['labelText', 'hintText', 'helperText', 'errorText'] },
    { widget: 'DropdownButton', params: ['hint'] },
    { widget: 'DropdownMenuItem', params: ['child'] },

    // Progress indicators
    { widget: 'LinearProgressIndicator', params: [''] },
    { widget: 'CircularProgressIndicator', params: [''] },

    // Cupertino widgets (iOS style)
    { widget: 'CupertinoButton', params: ['child'] },
    { widget: 'CupertinoAlertDialog', params: ['title', 'content'] },
    { widget: 'CupertinoActionSheet', params: ['title', 'message'] },
    { widget: 'CupertinoNavigationBar', params: ['middle'] },
    { widget: 'CupertinoTextField', params: ['placeholder'] },

    // Stepper and expansion
    { widget: 'Stepper', params: [''] },
    { widget: 'ExpansionTile', params: ['title'] },
    { widget: 'ExpansionPanel', params: ['headerBuilder'] },

    // Menu and popup
    { widget: 'PopupMenuButton', params: ['tooltip'] },
    { widget: 'PopupMenuItem', params: ['child'] },

    // Data display
    { widget: 'DataTable', params: [''] },
    { widget: 'DataColumn', params: ['label'] },
    { widget: 'DataCell', params: [''] },
];

// Technical parameters that should not be translated (identifiers, keys, etc.)
export const TECHNICAL_PARAMETERS = [
    'tag', // Hero widget tag
    'key', // Widget key
    'heroTag', // FloatingActionButton heroTag
    'restorationId', // Restoration ID
    'semanticLabel', // For accessibility but often technical
    'debugLabel', // Debug labels
    'name', // Named route or identifier
    'routeName', // Route names
    'actionKey', // Action identifiers
    'valueKey', // Value keys
    'groupValue', // Radio button group values
    'buttonTextTheme', // Theme identifiers
    'materialTapTargetSize', // Size identifiers
    'visualDensity', // Density identifiers
    'clipBehavior', // Clip behavior identifiers
    'overflow', // Overflow behavior identifiers
    'textDirection', // Direction identifiers
    'textAlign', // Alignment identifiers
    'textBaseline', // Baseline identifiers
    'fontFamily', // Font family names
    'package', // Package identifiers
    'semanticsLabel', // Screen reader labels (often technical)
];

// Patterns for classes that are not widgets
export const NON_WIDGET_PATTERNS = [
    // Basic types and common classes
    /^(String|int|double|bool|List|Map|Set|Future|Stream|Duration|DateTime|Color|Size|Offset|Rect)$/,
    // Navigation and utility classes
    /^(Navigator|Route|PageRoute|MaterialPageRoute|CupertinoPageRoute|GoRouter)$/,
    // State and provider classes
    /^(Provider|Consumer|Selector|ChangeNotifier|ValueNotifier|StateNotifier)$/,
    // Animation classes
    /^(Animation|AnimationController|Tween|Curve|Curves)$/,
    // HTTP and serialization classes
    /^(Http|Dio|Response|Request|Json|Serializable)$/,
    // Database classes
    /^(Database|Hive|SqlFlite|Firebase|Firestore)$/,
    // Test classes
    /^(Test|Mock|Fake|Stub|When|Verify|Expect)$/,
    // Dart core utility classes
    /^(Uri|UriData|Directory|File|Platform|Process|Socket|HttpClient|Timer|Completer|Stream|Sink|IOSink)$/,
];

// Context patterns that indicate not a widget
export const CONTEXT_PATTERNS = [
    /import\s+.*$/, // import statements
    /class\s+.*$/, // class declarations
    /extends\s+.*$/, // extends clauses
    /implements\s+.*$/, // implements clauses
    /typedef\s+.*$/, // typedef statements
    /enum\s+.*$/, // enum declarations
    /mixin\s+.*$/, // mixin declarations
    /\.\s*$/, // method calls (SomeClass.method())
    /new\s+$/, // new keyword
    /as\s+$/, // type casting
    /is\s+$/, // type checking
];

// Translation patterns to ignore
export const TRANSLATION_PATTERNS = [
    /context\.l10n\./,
    /AppLocalizations\.of\(context\)/,
    /Localizations\.of\(context\)/,
    /S\.of\(context\)/,
    /\.tr\(\)/,
    /\.tr\s*$/,
    /intl\./,
    /\.i18n/,
    /LocaleKeys\./,
    /I18n\./,
    /translations\./,
    /locale\./,
];

// Code patterns to filter out
export const CODE_PATTERNS = [
    /^[0-9]+$/, // Numbers only
    /^[0-9a-fA-F]{8,}$/, // Long hashes/IDs
    /^[\/\\]/, // Paths
    /^https?:\/\//, // URLs
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Emails
    /^#[0-9a-fA-F]{6}$/, // Hex colors
    /^[A-Z_][A-Z0-9_]*$/, // Uppercase constants
    /^\$[a-zA-Z_]/, // Interpolated variables
    /^[{}[\]()<>]$/, // Single symbols
    /^[a-z]+\.[a-z]+/, // Object properties (e.g., app.title)
    /^[a-zA-Z_][a-zA-Z0-9_]*$/, // Simple identifiers with underscores
    /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]+$/, // Only symbols/punctuation
    /^\s*$/, // Empty or whitespace only
    /^\$[a-zA-Z_][a-zA-Z0-9_]*(?:\s+\$[a-zA-Z_][a-zA-Z0-9_]*)+$/, // Multiple variables
    /^\$\{[^}]+\}(?:\s+\$\{[^}]+\})*$/, // Variables with braces
    /^[dMy\/\-\s:HmsS]+$/, // Date/time formats (dd/MM/yyyy, HH:mm:ss)
    /^[+\-*/=\s]*\$\{[^}]+\}[+\-*/=\s]*$/, // Mainly interpolations (+ ${var})
    /^[+\-*/=\s]*\$[a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)*[+\-*/=\s]*$/, // + $var.prop
    /^assets\//, // Asset paths
    /^images\//, // Image paths
    /^img\//, // Image paths (short)
    /^icons\//, // Icon paths
    /^fonts\//, // Font paths
    /\.(png|jpg|jpeg|gif|svg|webp|bmp|ico|tiff|tif)$/i, // Image files
    /\.(ttf|otf|woff|woff2)$/i, // Font files
    /^[a-zA-Z0-9_\-\/]+\.(png|jpg|jpeg|gif|svg|webp|bmp|ico|tiff|tif)$/i, // Any image path
    /^[a-z_]+(?:_[a-z_]+)*$/, // snake_case JSON keys (selected_answers_list, text_evidence)
    /^[A-Z][a-zA-Z0-9]*\.[a-zA-Z_][a-zA-Z0-9_]*$/, // Class.property debugging (AnswerResponseModel.selectedAnswersList)
    /^[A-Z][a-zA-Z0-9]*Model\.[a-zA-Z_][a-zA-Z0-9_]*$/, // Model class debugging
    /^[A-Z][a-zA-Z0-9]*Response\.[a-zA-Z_][a-zA-Z0-9_]*$/, // Response class debugging
    /^[A-Z][a-zA-Z0-9]*Request\.[a-zA-Z_][a-zA-Z0-9_]*$/, // Request class debugging
    /^(text|name|id|type|value|data|status|error|result|response|request)$/, // Common JSON keys
    /\$\{[^}]*\?[^}]*:[^}]*\}/, // Interpolations with ternary operators ${condition ? value : value}
    /^\$\{[^}]*\([^}]*\)[^}]*\}/, // Interpolations with function calls ${function()}
    /^[\(\)\s\#\-\.]+$/, // Formatting masks like (##) #####-####
    /^[\#\-\.\/\s]+$/, // Masks like ###.###.###-##
    /^[#\s\-\.\/\(\)]+$/, // General mask patterns with # as placeholders
    /^\[[^\]]*\]$/, // Regex character classes [0-9], [a-zA-Z], etc.
    /^\[[0-9\-]+\]$/, // Number range patterns [0-9], [0-5], etc.
    /^\[[a-zA-Z\-]+\]$/, // Letter range patterns [a-zA-Z], [A-Z], etc.
    /^[X#9A\*]+$/, // Placeholder patterns XXXXX, #####, 99999, AAAAA
    /^[X#9A\*\-\.\s\(\)\/]+$/, // Complex formatting with placeholders
    /^[\#\,\.0]+$/, // Number formatting ###,###.00
    /^[R\$\#\,\.0\s]+$/, // Currency formatting R$ ###,##0.00

    // Technical configuration patterns
    /^\d+:\d+:[a-z]+:[a-f0-9]+$/, // Firebase App IDs
    /^[a-z0-9]+(-[a-z0-9]+)*-[a-f0-9]+$/, // Firebase Project IDs
    /^[a-z0-9]([a-z0-9\-]*[a-z0-9])?\.appspot\.com$/, // Firebase Storage Buckets
    /^\d+-[a-z0-9]+\.apps\.googleusercontent\.com$/, // Firebase Client IDs
    /^com\.[a-z0-9]+(\.[a-z0-9]+)+$/, // Bundle IDs
    /^[a-zA-Z0-9]{20,}$/, // Generic long alphanumeric IDs
    /^https?:\/\//, // URLs starting with http:// or https://
    /^[a-z0-9]([a-z0-9\-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9\-]*[a-z0-9])?)*\.[a-z]{2,}$/, // Domain names
    /^[A-Za-z0-9_\-]{25,}$/, // API Keys and tokens
    /^\d+\.\d+\.\d+(-[a-zA-Z0-9\-]+)?$/, // Version strings
    /^[a-z0-9\-]+\.(firebaseio|firestore|googleapis)\.com$/, // Database/resource URLs
    /^[A-Z_][A-Z0-9_]*$/, // Environment variable references
    /^#[a-fA-F0-9]{3,8}$/, // Hex colors
    /^[a-fA-F0-9]{32,}$/, // Long hex hashes
    /^[a-zA-Z0-9_\-\/]+\.[a-zA-Z0-9]{1,4}$/, // File paths with extensions
];

// Regular expressions
export const REGEX_PATTERNS = {
    STRING_LITERAL: /(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g,
    NAMED_PARAMETER: /\b[a-zA-Z_][a-zA-Z0-9_]*\s*:/,
    CUSTOM_WIDGET: /(?:const\s+)?\b([A-Z][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)?)\s*\(/g,
    COMMENT_SINGLE_LINE: /\/\/(?!.*translate-me-ignore).*$/gm,
    COMMENT_MULTI_LINE: /\/\*(?![\s\S]*translate-me-ignore)[\s\S]*?\*\//g,
    PROPER_NOUN: /^[A-Z][a-z]+$/,
    TEXT_PUNCTUATION: /[.!?,:;]/,
    WHITESPACE: /\s/,
    VARIABLE_INTERPOLATION: /\$[a-zA-Z_][a-zA-Z0-9_]*|\$\{[^}]+\}/g,
    SYMBOL_ONLY: /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]+$/,
    DATE_TIME_FORMAT: /^[dMy\/\-\.:Hms\s]+$/,
    MAINLY_INTERPOLATION: /^[+\-*/=\s]*\$\{[^}]+\}[+\-*/=\s]*$/,
    ASSET_PATH: /^(assets|images|img|icons|fonts)\/|.*\.(png|jpg|jpeg|gif|svg|webp|bmp|ico|tiff|tif|ttf|otf|woff|woff2)$/i,
    JSON_KEY_OR_DEBUG: /^[a-z_]+(?:_[a-z_]+)*$|^[A-Z][a-zA-Z0-9]*\.[a-zA-Z_][a-zA-Z0-9_]*$/,
    TERNARY_INTERPOLATION: /\$\{[^}]*\?[^}]*:[^}]*\}/, // Ternary operators in interpolations
    FUNCTION_INTERPOLATION: /\$\{[^}]*\([^}]*\)[^}]*\}/, // Function calls in interpolations
    FORMATTING_MASK: /^[\(\)\s\#\-\.]+$|^\[[^\]]*\]$/, // Formatting masks and regex patterns
    REGEX_PATTERN: /^\[[0-9a-zA-Z\-\s\\dDwWsS]*\]$/, // Character classes and regex patterns
} as const; 