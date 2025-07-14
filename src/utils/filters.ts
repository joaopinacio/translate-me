/**
 * Filter utilities for string validation and classification
 */

import {
    CODE_PATTERNS,
    TRANSLATION_PATTERNS,
    NON_WIDGET_PATTERNS,
    CONTEXT_PATTERNS,
    REGEX_PATTERNS
} from '../constants';

/**
 * Determines if a string should be filtered (not translatable)
 */
export function shouldFilterString(stringContent: string): boolean {
    const trimmed = stringContent.trim();

    // Filter empty strings or strings with only whitespace
    if (trimmed.length === 0) return true;

    // Priority filter: URLs should always be filtered (technical configuration)
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return true;

    // Additional URL patterns
    if (trimmed.startsWith('www.') || trimmed.startsWith('ftp://') || trimmed.startsWith('mailto:')) return true;

    // Domain-like patterns (contains dots and looks like a domain)
    if (trimmed.includes('.') && /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(trimmed)) return true;

    // Filter strings that only contain symbols/punctuation (like &, *, etc.)
    if (isOnlySymbols(trimmed)) return true;

    // Filter strings that are variable interpolations
    if (isVariableInterpolation(trimmed)) return true;

    // Filter strings that are date/time formats
    if (isDateTimeFormat(trimmed)) return true;

    // Filter strings that are mainly interpolations with minimal static text
    if (isMainlyInterpolation(trimmed)) return true;

    // Filter strings that are asset/image paths
    if (isAssetPath(trimmed)) return true;

    // Filter strings that are JSON keys or debugging/logging strings
    if (isJsonKeyOrDebugging(trimmed)) return true;

    // Filter strings that are formatting masks or regex patterns
    if (isFormattingMaskOrRegex(trimmed)) return true;

    // Filter strings that are technical configuration (Firebase IDs, URLs, bundle IDs, etc.)
    if (isTechnicalConfiguration(trimmed)) return true;

    // Filter strings that are likely code
    if (isCodeString(trimmed)) return true;

    return false;
}

/**
 * Determines if a string contains only symbols/punctuation
 */
export function isOnlySymbols(stringContent: string): boolean {
    // Check if string contains only symbols, punctuation, or special characters
    const symbolOnlyPattern = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]+$/;
    return symbolOnlyPattern.test(stringContent);
}

/**
 * Determines if a string is a formatting mask or regex pattern
 */
export function isFormattingMaskOrRegex(stringContent: string): boolean {
    // Patterns for formatting masks and regex
    const formattingPatterns = [
        // Formatting masks (like phone, CPF, etc.)
        /^[\(\)\s\#\-\.]+$/, // (##) #####-#### - only formatting characters and #
        /^[\#\-\.\/\s]+$/, // ###.###.###-## - only # and separators
        /^\([#\s\-]+\)\s*[#\s\-]+$/, // (##) ##### #### - phone patterns
        /^[#\s\-\.\/\(\)]+$/, // General mask patterns with # as placeholders

        // Regex patterns
        /^\[[^\]]*\]$/, // [0-9], [a-zA-Z], etc. - character classes
        /^\[[0-9\-]+\]$/, // [0-9], [0-5], etc. - number ranges
        /^\[[a-zA-Z\-]+\]$/, // [a-zA-Z], [A-Z], etc. - letter ranges
        /^\[[a-zA-Z0-9\-\s]+\]$/, // [a-zA-Z0-9], etc. - alphanumeric ranges
        /^\[[^\]]*\\[dDwWsS][^\]]*\]$/, // Character classes with escape sequences

        // Common formatting patterns
        /^[X#9A\*]+$/, // XXXXX, #####, 99999, AAAAA, ***** - placeholder patterns
        /^[X#9A\*\-\.\s\(\)\/]+$/, // Complex formatting with placeholders

        // Currency and number formatting
        /^[\#\,\.0]+$/, // ###,###.00 - number formatting
        /^[R\$\#\,\.0\s]+$/, // R$ ###,##0.00 - currency formatting

        // Date/time mask patterns  
        /^[dDmMyYhHsS\/\-\.\s:]+$/, // dd/MM/yyyy, HH:mm:ss masks
    ];

    return formattingPatterns.some(pattern => pattern.test(stringContent));
}

/**
 * Determines if a string is a JSON key or debugging/logging string
 */
export function isJsonKeyOrDebugging(stringContent: string): boolean {
    // Patterns for JSON keys and debugging strings
    const jsonDebuggingPatterns = [
        /^[a-z_]+(?:_[a-z_]+)*$/, // snake_case (JSON keys): selected_answers_list, text_evidence
        /^[A-Z][a-zA-Z0-9]*\.[a-zA-Z_][a-zA-Z0-9_]*$/, // Class.property: AnswerResponseModel.selectedAnswersList
        /^[A-Z][a-zA-Z0-9]*\.[a-zA-Z_][a-zA-Z0-9_]*\.[a-zA-Z_][a-zA-Z0-9_]*$/, // Class.property.subproperty
        /^[a-zA-Z_][a-zA-Z0-9_]*\.[a-zA-Z_][a-zA-Z0-9_]*$/, // property.subproperty (general)
        /^[a-z]+[A-Z][a-zA-Z]*$/, // camelCase single words that look like properties
        /^[A-Z][a-zA-Z0-9]*Model\.[a-zA-Z_][a-zA-Z0-9_]*$/, // Specific to Model classes
        /^[A-Z][a-zA-Z0-9]*Response\.[a-zA-Z_][a-zA-Z0-9_]*$/, // Specific to Response classes
        /^[A-Z][a-zA-Z0-9]*Request\.[a-zA-Z_][a-zA-Z0-9_]*$/, // Specific to Request classes
        /^[A-Z][a-zA-Z0-9]*Entity\.[a-zA-Z_][a-zA-Z0-9_]*$/, // Specific to Entity classes
        /^[A-Z][a-zA-Z0-9]*Controller\.[a-zA-Z_][a-zA-Z0-9_]*$/, // Specific to Controller classes
    ];

    // Additional check for context-specific patterns
    const contextSpecificPatterns = [
        /^text$/, // Common JSON key
        /^name$/, // Common parameter
        /^id$/, // Common identifier
        /^type$/, // Common type field
        /^value$/, // Common value field
        /^data$/, // Common data field
        /^status$/, // Common status field
        /^message$/, // Common message field (but this might need translation in some contexts)
        /^error$/, // Common error field
        /^result$/, // Common result field
        /^response$/, // Common response field
        /^request$/, // Common request field
    ];

    return jsonDebuggingPatterns.some(pattern => pattern.test(stringContent)) ||
        contextSpecificPatterns.some(pattern => pattern.test(stringContent));
}

/**
 * Determines if a string is an asset/image path
 */
export function isAssetPath(stringContent: string): boolean {
    // Common asset/image path patterns
    const assetPathPatterns = [
        /^assets\//, // starts with assets/
        /^images\//, // starts with images/
        /^img\//, // starts with img/
        /^icons\//, // starts with icons/
        /^fonts\//, // starts with fonts/
        /^lib\/assets\//, // lib/assets/
        /^packages\/[^\/]+\/assets\//, // packages/package_name/assets/
        /\.(png|jpg|jpeg|gif|svg|webp|bmp|ico|tiff|tif)$/i, // ends with image extensions
        /\.(ttf|otf|woff|woff2)$/i, // font files
        /\.(json|yaml|yml|txt|md)$/i, // config/data files in assets
        /^[a-zA-Z0-9_\-\/]+\.(png|jpg|jpeg|gif|svg|webp|bmp|ico|tiff|tif)$/i, // any path ending with image
    ];

    return assetPathPatterns.some(pattern => pattern.test(stringContent));
}

/**
 * Determines if a string is a date/time format pattern
 */
export function isDateTimeFormat(stringContent: string): boolean {
    // Common date/time format patterns used in DateFormat (intl package)
    const dateTimePatterns = [
        /^[dMy\/\-\s:HmsS]+$/, // dd/MM/yyyy, HH:mm:ss, etc.
        /^[dMy]+[\/\-\.][dMy]+[\/\-\.][dMy]+$/, // dd/MM/yyyy, dd-MM-yyyy, etc.
        /^[Hms]+:[Hms]+(?::[Hms]+)?$/, // HH:mm, HH:mm:ss, etc.
        /^[dMy\/\-\s]+[Hms:]+$/, // dd/MM/yyyy HH:mm
        /^[dMy\/\-\.:Hms\s]+$/, // General date/time format
        /^E+,?\s*[dMy\/\-\s:Hms]+$/, // EEEE, dd/MM/yyyy
        /^[dMy\/\-\s:Hms]+\s*[aAzZ]+$/, // dd/MM/yyyy HH:mm a
    ];

    return dateTimePatterns.some(pattern => pattern.test(stringContent));
}

/**
 * Determines if a string is mainly composed of variable interpolations
 */
export function isMainlyInterpolation(stringContent: string): boolean {
    // Check for strings that are mainly interpolations with minimal static text
    const interpolationPatterns = [
        /^[+\-*/=\s]*\$\{[^}]+\}[+\-*/=\s]*$/, // + ${variable}
        /^[+\-*/=\s]*\$\{[^}]+\}(?:[+\-*/=\s]*\$\{[^}]+\})*[+\-*/=\s]*$/, // Multiple interpolations
        /^[+\-*/=\s]*\$[a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)*[+\-*/=\s]*$/, // + $variable.property
        /^[+\-*/=\s]*\$[a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)*(?:[+\-*/=\s]*\$[a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)*)*[+\-*/=\s]*$/, // Multiple variables
    ];

    // Advanced patterns for complex interpolations with ternary operators and conditions
    const complexInterpolationPatterns = [
        /^\$\{[^}]*\?[^}]*:[^}]*\}/, // ${condition ? value : value} - ternary operators
        /\$\{[^}]*\?[^}]*:[^}]*\}/, // Contains ternary operators anywhere
        /^\$\{[^}]*\([^}]*\)[^}]*\}/, // ${function()} - function calls in interpolation
    ];

    // Check for complex interpolation patterns first
    if (complexInterpolationPatterns.some(pattern => pattern.test(stringContent))) {
        // For complex interpolations, be more strict about what constitutes "static text"
        const withoutInterpolations = stringContent.replace(/\$\{[^}]+\}/g, '').replace(/\$[a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)*/g, '');
        const staticTextLength = withoutInterpolations.replace(/[+\-*/=\s'"]/g, '').length;

        // If there's very little meaningful static text after removing interpolations and operators
        if (staticTextLength <= 2) {
            return true;
        }
    }

    // Count interpolations and measure static text
    const interpolationMatches = stringContent.match(/\$\{[^}]+\}|\$[a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)*/g) || [];
    const interpolationCount = interpolationMatches.length;

    // Remove all interpolations to see what static text remains
    let staticText = stringContent;
    interpolationMatches.forEach(match => {
        staticText = staticText.replace(match, '');
    });

    // Remove operators, quotes, and whitespace to see meaningful static text
    const meaningfulStaticText = staticText.replace(/[+\-*/=\s'"]/g, '').trim();

    // If there are interpolations and very little meaningful static text, filter it
    if (interpolationCount > 0) {
        // More lenient for complex interpolations
        if (complexInterpolationPatterns.some(pattern => pattern.test(stringContent))) {
            return meaningfulStaticText.length <= 2;
        }
        // Standard check for simple interpolations
        return meaningfulStaticText.length <= 3;
    }

    return interpolationPatterns.some(pattern => pattern.test(stringContent));
}

/**
 * Determines if a string is a variable interpolation
 */
export function isVariableInterpolation(stringContent: string): boolean {
    // Check for variable interpolations like '$businessUnitCode $businessUnitType'
    const variableInterpolationPatterns = [
        /^\$[a-zA-Z_][a-zA-Z0-9_]*(?:\s+\$[a-zA-Z_][a-zA-Z0-9_]*)*$/, // Only variables with $
        /^\$[a-zA-Z_][a-zA-Z0-9_]*(?:\s+\$[a-zA-Z_][a-zA-Z0-9_]*)+$/, // Multiple variables
        /^\$\{[^}]+\}(?:\s+\$\{[^}]+\})*$/, // Variables with braces ${var}
    ];

    return variableInterpolationPatterns.some(pattern => pattern.test(stringContent));
}

/**
 * Determines if a string is technical configuration (Firebase IDs, URLs, bundle IDs, etc.)
 */
export function isTechnicalConfiguration(stringContent: string): boolean {
    // Technical configuration patterns
    const technicalPatterns = [
        // Firebase App IDs (format: number:number:platform:hash)
        /^\d+:\d+:[a-z]+:[a-f0-9]+$/,

        // Firebase Project IDs (kebab-case with numbers)
        /^[a-z0-9]+(-[a-z0-9]+)*-[a-f0-9]+$/,

        // Firebase Storage Buckets (.appspot.com)
        /^[a-z0-9]([a-z0-9\-]*[a-z0-9])?\.appspot\.com$/,

        // Firebase Client IDs (long alphanumeric with dashes and .apps.googleusercontent.com)
        /^\d+-[a-z0-9]+\.apps\.googleusercontent\.com$/,

        // Bundle IDs (com.company.app format)
        /^com\.[a-z0-9]+(\.[a-z0-9]+)+$/,

        // Generic long alphanumeric IDs (likely technical)
        /^[a-zA-Z0-9]{20,}$/,

        // URLs and domains
        /^https?:\/\//, // URLs starting with http:// or https://
        /^[a-z0-9]([a-z0-9\-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9\-]*[a-z0-9])?)*\.[a-z]{2,}$/, // Domain names

        // API Keys and tokens (long alphanumeric strings)
        /^[A-Za-z0-9_\-]{25,}$/,

        // Version strings (semantic versioning)
        /^\d+\.\d+\.\d+(-[a-zA-Z0-9\-]+)?$/,

        // Database/resource URLs
        /^[a-z0-9\-]+\.(firebaseio|firestore|googleapis)\.com$/,

        // Environment variable references (though these should be handled by interpolation)
        /^[A-Z_][A-Z0-9_]*$/,

        // Hex colors and hashes
        /^#[a-fA-F0-9]{3,8}$/,
        /^[a-fA-F0-9]{32,}$/,

        // File paths with extensions (but not user-visible paths)
        /^[a-zA-Z0-9_\-\/]+\.[a-zA-Z0-9]{1,4}$/,
    ];

    return technicalPatterns.some(pattern => pattern.test(stringContent));
}

/**
 * Determines if a string is likely code rather than user text
 */
export function isCodeString(stringContent: string): boolean {
    const trimmed = stringContent.trim();

    // Already filtered empty strings in shouldFilterString
    if (trimmed.length === 0) return false;

    // If contains spaces or text punctuation, probably user text (but check for special cases)
    if (REGEX_PATTERNS.WHITESPACE.test(trimmed) || REGEX_PATTERNS.TEXT_PUNCTUATION.test(trimmed)) {
        // But still filter if it's variable interpolation
        if (isVariableInterpolation(trimmed)) return true;
        return false;
    }

    // Allow proper nouns or simple words (like 'Savana')
    if (REGEX_PATTERNS.PROPER_NOUN.test(trimmed)) {
        return false;
    }

    return CODE_PATTERNS.some(pattern => pattern.test(trimmed));
}

/**
 * Checks if a string is part of a translation call
 */
export function isTranslationCall(stringContent: string): boolean {
    return TRANSLATION_PATTERNS.some(pattern => pattern.test(stringContent));
}

/**
 * Determines if a string is used as a variable or function call
 */
export function isVariableOrFunction(widgetContent: string, stringIndex: number, stringContent: string): boolean {
    const beforeString = widgetContent.substring(0, stringIndex).trim();
    const afterString = widgetContent.substring(stringIndex + stringContent.length + 2).trim();

    // If there's a dot before the string, probably a property
    if (beforeString.endsWith('.')) return true;

    // If there are parentheses after the string, probably a function
    if (afterString.startsWith('(')) return true;

    return false;
}

/**
 * Checks if a class name is likely not a widget
 */
export function isNotAWidget(className: string, content: string, matchIndex: number): boolean {
    if (NON_WIDGET_PATTERNS.some(pattern => pattern.test(className))) {
        return true;
    }

    // Check if it's in a context that indicates it's not a widget
    const beforeMatch = content.substring(Math.max(0, matchIndex - 50), matchIndex).trim();
    return CONTEXT_PATTERNS.some(pattern => pattern.test(beforeMatch));
}

/**
 * Determines if widget content looks like a real widget (has named parameters)
 */
export function looksLikeWidget(widgetContent: string): boolean {
    // Check if it has named parameters (indicative of widgets)
    if (!REGEX_PATTERNS.NAMED_PARAMETER.test(widgetContent)) return false;

    // Check if it's not just a common function/method
    const commonFunctionPatterns = [
        /^\s*\d+\s*$/, // numbers only
        /^\s*true\s*$|^\s*false\s*$/, // booleans only
        /^\s*null\s*$/, // null only
        /^\s*[a-zA-Z_][a-zA-Z0-9_]*\s*$/, // single variable only
    ];

    return !commonFunctionPatterns.some(pattern => pattern.test(widgetContent.trim()));
} 