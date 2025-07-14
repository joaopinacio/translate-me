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

    // Updated regex to detect both direct constructors and static methods
    // Matches: WidgetName( and WidgetName.methodName(
    const customWidgetRegex = /(?:const\s+)?\b([A-Z][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)?)\s*\(/g;

    let match: RegExpExecArray | null;
    while ((match = customWidgetRegex.exec(content)) !== null) {
        const widgetName = match[1]; // This can now be "WidgetName" or "WidgetName.methodName"

        // Extract the base widget name for known widget check
        const baseWidgetName = widgetName.split('.')[0];

        // Skip if it's a known widget (already processed)
        if (knownWidgetNames.has(baseWidgetName)) continue;

        // Filter out classes/types that are not widgets
        if (isNotAWidget(baseWidgetName, content, match.index)) continue;

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
                    widget: widgetName, // Use the full name (e.g., "VitrineModal.primaryWithOneCta")
                    parameter: determineGenericParameter(widgetContent, stringMatch.content)
                });
            }
        }
    }

    return matches;
} 