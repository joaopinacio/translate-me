import {
    isOnlySymbols,
    isTranslationCall,
    isUriParseString,
    isTechnicalParameter,
    isVariableInterpolation,
    isAssetPath,
    isJsonKeyOrDebugging,
    isFormattingMaskOrRegex,
    isTechnicalConfiguration,
    isMainlyInterpolation,
    shouldFilterString
} from '../../src/utils/filters';

describe('Filters Utility Functions', () => {

    describe('isOnlySymbols', () => {
        it('should exist and be callable', () => {
            expect(typeof isOnlySymbols).toBe('function');
        });

        it('should return boolean for symbol strings', () => {
            expect(typeof isOnlySymbols('***')).toBe('boolean');
            expect(typeof isOnlySymbols('  • ')).toBe('boolean');
        });

        it('should return boolean for text content', () => {
            expect(typeof isOnlySymbols('Hello World')).toBe('boolean');
        });
    });

    describe('isTranslationCall', () => {
        it('should exist and be callable', () => {
            expect(typeof isTranslationCall).toBe('function');
        });

        it('should return boolean for various inputs', () => {
            expect(typeof isTranslationCall('message.tr()')).toBe('boolean');
            expect(typeof isTranslationCall('Hello World')).toBe('boolean');
        });
    });

    describe('isUriParseString', () => {
        it('should exist and be callable', () => {
            expect(typeof isUriParseString).toBe('function');
        });

        it('should return boolean for Uri.parse patterns', () => {
            const code = `Uri.parse('https://example.com')`;
            expect(typeof isUriParseString(code, 9)).toBe('boolean');
        });
    });

    describe('isTechnicalParameter', () => {
        it('should exist and be callable', () => {
            expect(typeof isTechnicalParameter).toBe('function');
        });

        it('should return boolean for technical parameters', () => {
            const code = `Hero(tag: 'button-hero')`;
            expect(typeof isTechnicalParameter(code, 10)).toBe('boolean');
        });
    });

    describe('isVariableInterpolation', () => {
        it('should exist and be callable', () => {
            expect(typeof isVariableInterpolation).toBe('function');
        });

        it('should return boolean for interpolated strings', () => {
            expect(typeof isVariableInterpolation('Hello ${name}')).toBe('boolean');
        });
    });

    describe('isAssetPath', () => {
        it('should exist and be callable', () => {
            expect(typeof isAssetPath).toBe('function');
        });

        it('should return boolean for asset paths', () => {
            expect(typeof isAssetPath('assets/images/logo.png')).toBe('boolean');
        });
    });

    describe('isJsonKeyOrDebugging', () => {
        it('should exist and be callable', () => {
            expect(typeof isJsonKeyOrDebugging).toBe('function');
        });

        it('should return boolean for JSON keys', () => {
            expect(typeof isJsonKeyOrDebugging('user_id')).toBe('boolean');
        });
    });

    describe('isFormattingMaskOrRegex', () => {
        it('should exist and be callable', () => {
            expect(typeof isFormattingMaskOrRegex).toBe('function');
        });

        it('should return boolean for formatting masks', () => {
            expect(typeof isFormattingMaskOrRegex('dd/MM/yyyy')).toBe('boolean');
        });
    });

    describe('isTechnicalConfiguration', () => {
        it('should exist and be callable', () => {
            expect(typeof isTechnicalConfiguration).toBe('function');
        });

        it('should return boolean for technical configurations', () => {
            expect(typeof isTechnicalConfiguration('com.example.app')).toBe('boolean');
            expect(typeof isTechnicalConfiguration('https://api.example.com')).toBe('boolean');
        });
    });

    describe('isMainlyInterpolation', () => {
        it('should exist and be callable', () => {
            expect(typeof isMainlyInterpolation).toBe('function');
        });

        it('should return boolean for interpolated strings', () => {
            expect(typeof isMainlyInterpolation('${name}')).toBe('boolean');
        });
    });

    describe('shouldFilterString', () => {
        it('should exist and be callable', () => {
            expect(typeof shouldFilterString).toBe('function');
        });

        it('should return boolean for various string types', () => {
            expect(typeof shouldFilterString('***')).toBe('boolean');
            expect(typeof shouldFilterString('Hello World')).toBe('boolean');
        });
    });
}); 