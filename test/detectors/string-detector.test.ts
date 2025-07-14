import {
    findStringsInWidget,
    filterIgnoredMatches,
    removeDuplicateMatches
} from '../../src/detectors/string-detector';

describe('String Detector', () => {

    describe('findStringsInWidget', () => {
        it('should exist and be callable', () => {
            expect(typeof findStringsInWidget).toBe('function');
        });
    });

    describe('filterIgnoredMatches', () => {
        it('should exist and be callable', () => {
            expect(typeof filterIgnoredMatches).toBe('function');
        });

        it('should handle empty matches array', () => {
            const result = filterIgnoredMatches([], []);
            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(0);
        });
    });

    describe('removeDuplicateMatches', () => {
        it('should exist and be callable', () => {
            expect(typeof removeDuplicateMatches).toBe('function');
        });

        it('should handle empty array', () => {
            const result = removeDuplicateMatches([]);
            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(0);
        });
    });
}); 