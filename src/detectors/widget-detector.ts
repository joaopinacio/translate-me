/**
 * Widget detection strategies for known and custom widgets
 */

import { StringMatch, WidgetPattern } from '../types';
import { extractBalancedParentheses } from '../utils/position';
import { isNotAWidget, looksLikeWidget, isTranslationCall } from '../utils/filters';
import {
    findStringsInWidget,
    determineParameter,
    determineGenericParameter
} from './string-detector';

/**
 * Finds string matches in known widget patterns
 */
export function findKnownWidgetMatches(content: string, pattern: WidgetPattern): StringMatch[] {
    const matches: StringMatch[] = [];
    const widgetRegex = new RegExp(`(?:const\\s+)?\\b${pattern.widget}\\s*\\(`, 'g');

    let widgetMatch: RegExpExecArray | null;
    while ((widgetMatch = widgetRegex.exec(content)) !== null) {
        const widgetStart = widgetMatch.index;
        const openParenIndex = widgetMatch.index + widgetMatch[0].length - 1;

        const widgetContent = extractBalancedParentheses(content, openParenIndex);
        if (!widgetContent) continue;

        const stringMatches = findStringsInWidget(widgetContent, openParenIndex + 1, content);

        for (const stringMatch of stringMatches) {
            if (!isTranslationCall(stringMatch.content)) {
                matches.push({
                    ...stringMatch,
                    widget: pattern.widget,
                    parameter: determineParameter(widgetContent, stringMatch.content, pattern.params)
                });
            }
        }
    }

    return matches;
}

/**
 * Finds string matches in custom (unknown) widgets
 */
export function findCustomWidgetMatches(content: string, knownWidgets: WidgetPattern[]): StringMatch[] {
    const matches: StringMatch[] = [];
    const knownWidgetNames = new Set(knownWidgets.map(w => w.widget));

    const customWidgetRegex = /(?:const\s+)?\b([A-Z][a-zA-Z0-9_]*)\s*\(/g;

    let match: RegExpExecArray | null;
    while ((match = customWidgetRegex.exec(content)) !== null) {
        const widgetName = match[1];

        // Skip if it's a known widget (already processed)
        if (knownWidgetNames.has(widgetName)) continue;

        // Filter out classes/types that are not widgets
        if (isNotAWidget(widgetName, content, match.index)) continue;

        const widgetStart = match.index;
        const openParenIndex = match.index + match[0].length - 1;

        const widgetContent = extractBalancedParentheses(content, openParenIndex);
        if (!widgetContent) continue;

        // Check if it really looks like a widget (has named parameters)
        if (!looksLikeWidget(widgetContent)) continue;

        const stringMatches = findStringsInWidget(widgetContent, openParenIndex + 1, content);

        for (const stringMatch of stringMatches) {
            if (!isTranslationCall(stringMatch.content)) {
                matches.push({
                    ...stringMatch,
                    widget: widgetName,
                    parameter: determineGenericParameter(widgetContent, stringMatch.content)
                });
            }
        }
    }

    return matches;
} 