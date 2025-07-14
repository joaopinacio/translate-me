import {
    extractBalancedParentheses,
    getLineAndColumn
} from '../../src/utils/position';

describe('Position Utility Functions', () => {

    describe('extractBalancedParentheses', () => {
        it('should extract simple parentheses content', () => {
            const result = extractBalancedParentheses('Text("Hello World")', 4);
            expect(result).toBe('"Hello World"');
        });

        it('should handle nested parentheses', () => {
            const result = extractBalancedParentheses('Widget(child: Container(child: Text("Hello")))', 6);
            expect(result).toBe('child: Container(child: Text("Hello"))');
        });

        it('should handle Dart interpolation with braces', () => {
            const result = extractBalancedParentheses('Text("Hello ${name}")', 4);
            expect(result).toBe('"Hello ${name}"');
        });

        it('should handle complex interpolation with nested braces', () => {
            const result = extractBalancedParentheses('Text("Count: ${items.length}")', 4);
            expect(result).toBe('"Count: ${items.length}"');
        });

        it('should handle interpolation with ternary operators', () => {
            const result = extractBalancedParentheses('Text("${isEnabled ? \'Yes\' : \'No\'}")', 4);
            expect(result).toBe('"${isEnabled ? \'Yes\' : \'No\'}"');
        });

        it('should handle empty content', () => {
            const result = extractBalancedParentheses('Text()', 4);
            expect(result).toBe('');
        });

        it('should handle unbalanced parentheses', () => {
            const result = extractBalancedParentheses('Text("Hello', 4);
            expect(result).toBe(null);
        });

        it('should handle multiple nested levels', () => {
            const code = 'Container(child: Column(children: [Text("Item 1"), Text("Item 2")]))';
            const result = extractBalancedParentheses(code, 9);
            expect(result).toBe('child: Column(children: [Text("Item 1"), Text("Item 2")])');
        });
    });

    describe('getLineAndColumn', () => {
        it('should calculate line and column for single line', () => {
            const content = 'Text("Hello World")';
            const result = getLineAndColumn(content, 5);
            expect(result).toEqual({
                line: 0,
                column: 5
            });
        });

        it('should calculate line and column for multiline content', () => {
            const content = 'Widget(\n  child: Text("Hello"),\n  width: 100\n)';
            const result = getLineAndColumn(content, 20);
            expect(result).toEqual({
                line: 1,
                column: 12
            });
        });

        it('should handle position at start of line', () => {
            const content = 'Line 1\nLine 2\nLine 3';
            const result = getLineAndColumn(content, 7);
            expect(result).toEqual({
                line: 1,
                column: 0
            });
        });

        it('should handle position at end of content', () => {
            const content = 'Short text';
            const result = getLineAndColumn(content, 10);
            expect(result).toEqual({
                line: 0,
                column: 10
            });
        });

        it('should handle empty content', () => {
            const content = '';
            const result = getLineAndColumn(content, 0);
            expect(result).toEqual({
                line: 0,
                column: 0
            });
        });

        it('should handle Windows line endings', () => {
            const content = 'Line 1\r\nLine 2\r\nLine 3';
            const result = getLineAndColumn(content, 8);
            expect(result).toEqual({
                line: 1,
                column: 0
            });
        });

        it('should handle mixed line endings', () => {
            const content = 'Line 1\nLine 2\r\nLine 3';
            const result = getLineAndColumn(content, 15);
            expect(result).toEqual({
                line: 2,
                column: 0
            });
        });
    });
}); 