import { parseIgnoreComments } from '../../src/parsers/comment-parser';

describe('Comment Parser', () => {

    describe('parseIgnoreComments', () => {
        it('should exist and be callable', () => {
            expect(typeof parseIgnoreComments).toBe('function');
        });

        it('should handle empty content', () => {
            const content = '';
            const result = parseIgnoreComments(content);
            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(0);
        });

        it('should find ignore line comments', () => {
            const content = `
        // translate-me-ignore
        Text('Hello World')
      `;
            const result = parseIgnoreComments(content);
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
        });

        it('should find ignore next line comments', () => {
            const content = `
        // translate-me-ignore-next-line
        Text('Hello World')
      `;
            const result = parseIgnoreComments(content);
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
        });

        it('should find ignore all file comments', () => {
            const content = `
        // translate-me-ignore-all-file
        Text('Hello World')
        Text('Another string')
      `;
            const result = parseIgnoreComments(content);
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
        });

        it('should handle content without ignore comments', () => {
            const content = `
        Text('Hello World')
        // Just a regular comment
        Text('Another string')
      `;
            const result = parseIgnoreComments(content);
            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(0);
        });

        it('should handle multiple ignore comments', () => {
            const content = `
        // translate-me-ignore
        Text('Hello World')
        // translate-me-ignore-next-line
        Text('Another string')
      `;
            const result = parseIgnoreComments(content);
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
        });

        it('should handle mixed comment types', () => {
            const content = `
        // translate-me-ignore
        Text('Hello World')
        // Regular comment
        // translate-me-ignore-next-line
        Text('Another string')
      `;
            const result = parseIgnoreComments(content);
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
        });
    });
}); 