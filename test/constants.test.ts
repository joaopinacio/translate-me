/**
 * Tests for constants.ts - Configuration and pattern constants
 */

import {
    EXTENSION_NAME,
    DART_LANGUAGE_ID,
    SCAN_COMPLETE_MESSAGE,
    TOGGLE_COMMAND_ID,
    DETECTION_ENABLED_MESSAGE,
    DETECTION_DISABLED_MESSAGE,
    IGNORE_COMMENTS,
    KNOWN_WIDGET_PATTERNS,
    TECHNICAL_PARAMETERS,
    NON_WIDGET_PATTERNS,
    CONTEXT_PATTERNS,
    TRANSLATION_PATTERNS,
    CODE_PATTERNS,
    REGEX_PATTERNS,
} from '../src/constants';

describe('Constants', () => {

    describe('Extension Constants', () => {
        it('should have correct extension name', () => {
            expect(EXTENSION_NAME).toBe('translate-me');
        });

        it('should have correct dart language ID', () => {
            expect(DART_LANGUAGE_ID).toBe('dart');
        });

        it('should have correct scan complete message', () => {
            expect(SCAN_COMPLETE_MESSAGE).toBe('Scan completed.');
        });

        it('should have correct toggle command ID', () => {
            expect(TOGGLE_COMMAND_ID).toBe('translate-me.toggle');
        });

        it('should have correct detection messages', () => {
            expect(DETECTION_ENABLED_MESSAGE).toBe('Translate Me: Detection enabled');
            expect(DETECTION_DISABLED_MESSAGE).toBe('Translate Me: Detection disabled');
        });
    });

    describe('Ignore Comments', () => {
        it('should have correct ignore comment patterns', () => {
            expect(IGNORE_COMMENTS.LINE).toBe('// translate-me-ignore');
            expect(IGNORE_COMMENTS.NEXT_LINE).toBe('// translate-me-ignore-next-line');
            expect(IGNORE_COMMENTS.ALL_FILE).toBe('// translate-me-ignore-all-file');
        });
    });

    describe('Known Widget Patterns', () => {
        it('should contain common Flutter widgets', () => {
            const widgetNames = KNOWN_WIDGET_PATTERNS.map(p => p.widget);

            expect(widgetNames).toContain('Text');
            expect(widgetNames).toContain('ElevatedButton');
            expect(widgetNames).toContain('TextField');
            expect(widgetNames).toContain('AppBar');
            expect(widgetNames).toContain('AlertDialog');
        });

        it('should have valid widget pattern structure', () => {
            KNOWN_WIDGET_PATTERNS.forEach(pattern => {
                expect(pattern).toHaveProperty('widget');
                expect(pattern).toHaveProperty('params');
                expect(typeof pattern.widget).toBe('string');
                expect(Array.isArray(pattern.params)).toBe(true);
            });
        });

        it('should include Material Design widgets', () => {
            const widgetNames = KNOWN_WIDGET_PATTERNS.map(p => p.widget);

            expect(widgetNames).toContain('Tooltip');
            expect(widgetNames).toContain('SnackBar');
            expect(widgetNames).toContain('FloatingActionButton');
            expect(widgetNames).toContain('Card');
            expect(widgetNames).toContain('Chip');
        });

        it('should include Cupertino widgets', () => {
            const widgetNames = KNOWN_WIDGET_PATTERNS.map(p => p.widget);

            expect(widgetNames).toContain('CupertinoButton');
            expect(widgetNames).toContain('CupertinoAlertDialog');
            expect(widgetNames).toContain('CupertinoTextField');
        });
    });

    describe('Technical Parameters', () => {
        it('should include widget technical parameters', () => {
            expect(TECHNICAL_PARAMETERS).toContain('tag');
            expect(TECHNICAL_PARAMETERS).toContain('key');
            expect(TECHNICAL_PARAMETERS).toContain('heroTag');
            expect(TECHNICAL_PARAMETERS).toContain('restorationId');
        });

        it('should include debug parameters', () => {
            expect(TECHNICAL_PARAMETERS).toContain('debugLabel');
            expect(TECHNICAL_PARAMETERS).toContain('semanticLabel');
        });

        it('should include theme parameters', () => {
            expect(TECHNICAL_PARAMETERS).toContain('fontFamily');
            expect(TECHNICAL_PARAMETERS).toContain('textDirection');
            expect(TECHNICAL_PARAMETERS).toContain('textAlign');
        });
    });

    describe('Non-Widget Patterns', () => {
        it('should match basic Dart types', () => {
            const basicTypes = ['String', 'int', 'double', 'bool', 'List', 'Map'];

            basicTypes.forEach(type => {
                const matches = NON_WIDGET_PATTERNS.some(pattern => pattern.test(type));
                expect(matches).toBe(true);
            });
        });

        it('should match navigation classes', () => {
            const navigationClasses = ['Navigator', 'Route', 'MaterialPageRoute'];

            navigationClasses.forEach(className => {
                const matches = NON_WIDGET_PATTERNS.some(pattern => pattern.test(className));
                expect(matches).toBe(true);
            });
        });

        it('should match test classes', () => {
            const testClasses = ['Test', 'Mock', 'Expect'];

            testClasses.forEach(className => {
                const matches = NON_WIDGET_PATTERNS.some(pattern => pattern.test(className));
                expect(matches).toBe(true);
            });
        });
    });

    describe('Context Patterns', () => {
        it('should match import statements', () => {
            const importPattern = CONTEXT_PATTERNS.find(p => p.toString().includes('import'));
            expect(importPattern).toBeDefined();
            expect(importPattern!.test('import something')).toBe(true);
        });

        it('should match class declarations', () => {
            const classPattern = CONTEXT_PATTERNS.find(p => p.toString().includes('class'));
            expect(classPattern).toBeDefined();
            expect(classPattern!.test('class MyClass')).toBe(true);
        });

        it('should have type operation patterns', () => {
            const asPattern = CONTEXT_PATTERNS.find(p => p.toString().includes('as'));
            expect(asPattern).toBeDefined();

            const isPattern = CONTEXT_PATTERNS.find(p => p.toString().includes('is'));
            expect(isPattern).toBeDefined();
        });
    });

    describe('Translation Patterns', () => {
        it('should match common translation methods', () => {
            const testCases = [
                'context.l10n.someKey',
                'AppLocalizations.of(context).title',
                'S.of(context).login',
                'text.tr()',
                'LocaleKeys.home',
                'I18n.t("key")',
            ];

            testCases.forEach(testCase => {
                const matches = TRANSLATION_PATTERNS.some(pattern => pattern.test(testCase));
                expect(matches).toBe(true);
            });
        });

        it('should not match non-translation text', () => {
            const nonTranslationCases = [
                'Hello World',
                'Button Text',
                'Enter your name',
            ];

            nonTranslationCases.forEach(testCase => {
                const matches = TRANSLATION_PATTERNS.some(pattern => pattern.test(testCase));
                expect(matches).toBe(false);
            });
        });
    });

    describe('Code Patterns', () => {
        it('should match numbers', () => {
            const numberPattern = CODE_PATTERNS.find(p => p.toString().includes('[0-9]+'));
            expect(numberPattern).toBeDefined();
            expect(numberPattern!.test('123')).toBe(true);
            expect(numberPattern!.test('0')).toBe(true);
        });

        it('should match URLs', () => {
            const urlPattern = CODE_PATTERNS.find(p => p.toString().includes('https?'));
            expect(urlPattern).toBeDefined();
            expect(urlPattern!.test('https://example.com')).toBe(true);
            expect(urlPattern!.test('http://test.com')).toBe(true);
        });

        it('should match hex colors', () => {
            const hexPattern = CODE_PATTERNS.find(p => p.toString().includes('#[0-9a-fA-F]{6}'));
            expect(hexPattern).toBeDefined();
            expect(hexPattern!.test('#ff0000')).toBe(true);
            expect(hexPattern!.test('#FFFFFF')).toBe(true);
        });

        it('should match asset paths', () => {
            const assetPattern = CODE_PATTERNS.find(p => p.toString().includes('assets'));
            expect(assetPattern).toBeDefined();
            expect(assetPattern!.test('assets/images/logo.png')).toBe(true);

            const imagePattern = CODE_PATTERNS.find(p => p.toString().includes('images'));
            expect(imagePattern).toBeDefined();
            expect(imagePattern!.test('images/icon.svg')).toBe(true);
        });

        it('should match Firebase configuration', () => {
            const firebasePattern = CODE_PATTERNS.find(p => p.toString().includes('firebase'));
            expect(firebasePattern).toBeDefined();
            expect(firebasePattern!.test('my-project.firebaseio.com')).toBe(true);
        });

        it('should match bundle IDs', () => {
            const bundlePattern = CODE_PATTERNS.find(p => p.toString().includes('com\\.'));
            expect(bundlePattern).toBeDefined();
            expect(bundlePattern!.test('com.example.app')).toBe(true);
        });
    });

    describe('Regex Patterns', () => {
        it('should have string literal pattern', () => {
            expect(REGEX_PATTERNS.STRING_LITERAL).toBeDefined();
            // Reset regex state
            REGEX_PATTERNS.STRING_LITERAL.lastIndex = 0;
            expect(REGEX_PATTERNS.STRING_LITERAL.test("'hello'")).toBe(true);
            REGEX_PATTERNS.STRING_LITERAL.lastIndex = 0;
            expect(REGEX_PATTERNS.STRING_LITERAL.test('"world"')).toBe(true);
        });

        it('should have named parameter pattern', () => {
            expect(REGEX_PATTERNS.NAMED_PARAMETER).toBeDefined();
            expect(REGEX_PATTERNS.NAMED_PARAMETER.test('child:')).toBe(true);
            expect(REGEX_PATTERNS.NAMED_PARAMETER.test('title: ')).toBe(true);
        });

        it('should have custom widget pattern', () => {
            expect(REGEX_PATTERNS.CUSTOM_WIDGET).toBeDefined();
            // Reset regex state
            REGEX_PATTERNS.CUSTOM_WIDGET.lastIndex = 0;
            expect(REGEX_PATTERNS.CUSTOM_WIDGET.test('MyWidget(')).toBe(true);
            REGEX_PATTERNS.CUSTOM_WIDGET.lastIndex = 0;
            expect(REGEX_PATTERNS.CUSTOM_WIDGET.test('const CustomButton(')).toBe(true);
        });

        it('should have interpolation patterns', () => {
            expect(REGEX_PATTERNS.VARIABLE_INTERPOLATION).toBeDefined();
            // Reset regex state
            REGEX_PATTERNS.VARIABLE_INTERPOLATION.lastIndex = 0;
            expect(REGEX_PATTERNS.VARIABLE_INTERPOLATION.test('$name')).toBe(true);
            REGEX_PATTERNS.VARIABLE_INTERPOLATION.lastIndex = 0;
            expect(REGEX_PATTERNS.VARIABLE_INTERPOLATION.test('${user.name}')).toBe(true);
        });

        it('should have asset path pattern', () => {
            expect(REGEX_PATTERNS.ASSET_PATH).toBeDefined();
            expect(REGEX_PATTERNS.ASSET_PATH.test('assets/logo.png')).toBe(true);
            expect(REGEX_PATTERNS.ASSET_PATH.test('image.jpg')).toBe(true);
        });

        it('should have formatting mask patterns', () => {
            expect(REGEX_PATTERNS.FORMATTING_MASK).toBeDefined();
            expect(REGEX_PATTERNS.FORMATTING_MASK.test('(##) ####-####')).toBe(true);
            expect(REGEX_PATTERNS.FORMATTING_MASK.test('[0-9]')).toBe(true);
        });
    });

    describe('Pattern Validation', () => {
        it('should not have duplicate widget names', () => {
            const widgetNames = KNOWN_WIDGET_PATTERNS.map(p => p.widget);
            const uniqueNames = [...new Set(widgetNames)];

            expect(widgetNames.length).toBe(uniqueNames.length);
        });

        it('should not have empty widget names', () => {
            KNOWN_WIDGET_PATTERNS.forEach(pattern => {
                expect(pattern.widget).toBeTruthy();
                expect(pattern.widget.length).toBeGreaterThan(0);
            });
        });

        it('should have valid regex patterns', () => {
            Object.values(REGEX_PATTERNS).forEach(pattern => {
                expect(pattern).toBeInstanceOf(RegExp);
            });
        });
    });
}); 