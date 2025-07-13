/**
 * Main orchestrator for hardcoded string detection
 */

import { StringMatch, WidgetPattern } from '../types';
import { parseIgnoreComments, removeCommentsButKeepIgnores } from '../parsers/comment-parser';
import { findKnownWidgetMatches, findCustomWidgetMatches } from '../detectors/widget-detector';
import { filterIgnoredMatches, removeDuplicateMatches } from '../detectors/string-detector';

/**
 * Main function to find hardcoded strings in content
 */
export function findHardcodedStrings(content: string, widgetPatterns: WidgetPattern[]): StringMatch[] {
    const matches: StringMatch[] = [];

    // Remove comments while preserving ignore comments
    const cleanContent = removeCommentsButKeepIgnores(content);

    // Parse ignore comments
    const ignoreRules = parseIgnoreComments(content);

    // 1. Detect known widgets (faster and more precise)
    for (const pattern of widgetPatterns) {
        const knownMatches = findKnownWidgetMatches(cleanContent, pattern);
        matches.push(...knownMatches);
    }

    // 2. Detect custom widgets
    const customMatches = findCustomWidgetMatches(cleanContent, widgetPatterns);
    matches.push(...customMatches);

    // 3. Remove duplicates based on position
    const uniqueMatches = removeDuplicateMatches(matches);

    // 4. Filter matches that should be ignored
    const filteredMatches = filterIgnoredMatches(uniqueMatches, ignoreRules);

    return filteredMatches;
} 