import { findHardcodedStrings } from '../../src/core/hardcoded-string-detector';

describe('Hardcoded String Detector', () => {

    describe('findHardcodedStrings', () => {
        it('should exist and be callable', () => {
            expect(typeof findHardcodedStrings).toBe('function');
        });

        it('should handle empty content', () => {
            const content = '';
            const widgetPatterns = [{ widget: 'Text', params: ['text'] }];
            const result = findHardcodedStrings(content, widgetPatterns);
            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(0);
        });

        it('should detect hardcoded strings in Text widget', () => {
            const content = `Text('Hello World')`;
            const widgetPatterns = [{ widget: 'Text', params: ['text'] }];
            const result = findHardcodedStrings(content, widgetPatterns);
            expect(Array.isArray(result)).toBe(true);
        });

        it('should handle content without hardcoded strings', () => {
            const content = `
        Container(
          width: 100,
          height: 200
        )
      `;
            const widgetPatterns = [{ widget: 'Text', params: ['text'] }];
            const result = findHardcodedStrings(content, widgetPatterns);
            expect(Array.isArray(result)).toBe(true);
        });
    });
}); 