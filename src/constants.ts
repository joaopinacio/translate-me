/**
 * Constants and configuration for the translate-me extension
 */

import { WidgetPattern } from './types';

export const EXTENSION_NAME = 'translate-me';
export const DART_LANGUAGE_ID = 'dart';
export const SCAN_COMPLETE_MESSAGE = 'Scan por strings fixas completo.';

// Ignore comment patterns
export const IGNORE_COMMENTS = {
    LINE: '// translate-me-ignore',
    NEXT_LINE: '// translate-me-ignore-next-line',
    ALL_FILE: '// translate-me-ignore-all-file',
} as const;

// Widget patterns for known Flutter widgets
export const KNOWN_WIDGET_PATTERNS: WidgetPattern[] = [
    { widget: 'Text', params: ['', 'data'] },
    { widget: 'Tooltip', params: ['message'] },
    { widget: 'SnackBar', params: ['content'] },
    { widget: 'AppBar', params: ['title'] },
    { widget: 'ElevatedButton', params: ['child'] },
    { widget: 'TextButton', params: ['child'] },
    { widget: 'OutlinedButton', params: ['child'] },
    { widget: 'FloatingActionButton', params: ['tooltip', 'child'] },
    { widget: 'AlertDialog', params: ['title', 'content'] },
    { widget: 'ListTile', params: ['title', 'subtitle', 'leading', 'trailing'] },
    { widget: 'BottomNavigationBarItem', params: ['label', 'tooltip'] },
    { widget: 'Tab', params: ['text', 'child'] },
    { widget: 'Card', params: ['child'] },
    { widget: 'Chip', params: ['label'] },
    { widget: 'InputDecoration', params: ['labelText', 'hintText', 'helperText', 'errorText'] },
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
];

// Regular expressions
export const REGEX_PATTERNS = {
    STRING_LITERAL: /(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g,
    NAMED_PARAMETER: /\b[a-zA-Z_][a-zA-Z0-9_]*\s*:/,
    CUSTOM_WIDGET: /(?:const\s+)?\b([A-Z][a-zA-Z0-9_]*)\s*\(/g,
    COMMENT_SINGLE_LINE: /\/\/(?!.*translate-me-ignore).*$/gm,
    COMMENT_MULTI_LINE: /\/\*(?![\s\S]*translate-me-ignore)[\s\S]*?\*\//g,
    PROPER_NOUN: /^[A-Z][a-z]+$/,
    TEXT_PUNCTUATION: /[.!?,:;]/,
    WHITESPACE: /\s/,
} as const; 