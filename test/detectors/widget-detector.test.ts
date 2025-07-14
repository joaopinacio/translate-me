import {
    findKnownWidgetMatches,
    findCustomWidgetMatches
} from '../../src/detectors/widget-detector';

describe('Widget Detector', () => {

    describe('findKnownWidgetMatches', () => {
        it('should exist and be callable', () => {
            expect(typeof findKnownWidgetMatches).toBe('function');
        });

        it('should handle empty content', () => {
            const content = '';
            const pattern = { widget: 'Text', params: ['text'] };
            const result = findKnownWidgetMatches(content, pattern);
            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(0);
        });

        it('should find Text widget matches', () => {
            const content = `Text('Hello World')`;
            const pattern = { widget: 'Text', params: ['text'] };
            const result = findKnownWidgetMatches(content, pattern);
            expect(Array.isArray(result)).toBe(true);
        });
    });

    describe('findCustomWidgetMatches', () => {
        it('should exist and be callable', () => {
            expect(typeof findCustomWidgetMatches).toBe('function');
        });

        it('should handle empty content', () => {
            const content = '';
            const knownWidgets = [{ widget: 'Text', params: ['text'] }];
            const result = findCustomWidgetMatches(content, knownWidgets);
            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(0);
        });

        it('should find custom widget matches', () => {
            const content = `CustomWidget('Hello World')`;
            const knownWidgets = [{ widget: 'Text', params: ['text'] }];
            const result = findCustomWidgetMatches(content, knownWidgets);
            expect(Array.isArray(result)).toBe(true);
        });
    });
}); 