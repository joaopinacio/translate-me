
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import globby from 'globby';

let diagnosticCollection: vscode.DiagnosticCollection;

export async function activate(context: vscode.ExtensionContext) {
  diagnosticCollection = vscode.languages.createDiagnosticCollection('translate-me');
  context.subscriptions.push(diagnosticCollection);

  await scanWorkspaceForHardcodedStrings();

  vscode.workspace.onDidSaveTextDocument((document) => {
    if (document.languageId === 'dart') {
      scanWorkspaceForHardcodedStrings();
    }
  });

  context.subscriptions.push(
    vscode.commands.registerCommand('translate-me.scan', () => {
      scanWorkspaceForHardcodedStrings();
      vscode.window.showInformationMessage('Scan por strings fixas completo.');
    })
  );
}

export function deactivate() {
  diagnosticCollection.clear();
  diagnosticCollection.dispose();
}

interface StringMatch {
  content: string;
  startLine: number;
  startCol: number;
  endLine: number;
  endCol: number;
  widget: string;
  parameter: string;
}

async function scanWorkspaceForHardcodedStrings() {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) return;

  const rootPath = workspaceFolders[0].uri.fsPath;
  const dartFiles = await globby(['**/*.dart'], {
    cwd: rootPath,
    gitignore: true,
    absolute: true,
  });

  diagnosticCollection.clear();

  const widgetPatterns = [
    // Widget constructors com parâmetros comuns que podem conter texto
    { widget: 'Text', params: ['', 'data'] },
    { widget: 'Tooltip', params: ['message'] },
    { widget: 'SnackBar', params: ['content'] },
    { widget: 'AppBar', params: ['title'] },
    { widget: 'ElevatedButton', params: ['child'] },
    { widget: 'TextButton', params: ['child'] },
    { widget: 'OutlinedButton', params: ['child'] },
    { widget: 'FloatingActionButton', params: ['tooltip', 'child'] },
    { widget: 'AlertDialog', params: ['title', 'content'] },
    { widget: 'ListTile', params: ['title', 'subtitle', 'leading', 'trailing'] },
    { widget: 'BottomNavigationBarItem', params: ['label', 'tooltip'] },
    { widget: 'Tab', params: ['text', 'child'] },
    { widget: 'Card', params: ['child'] },
    { widget: 'Chip', params: ['label'] },
    { widget: 'InputDecoration', params: ['labelText', 'hintText', 'helperText', 'errorText'] },
  ];

  for (const file of dartFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const diagnostics: vscode.Diagnostic[] = [];

    const matches = findHardcodedStrings(content, widgetPatterns);

    for (const match of matches) {
      const range = new vscode.Range(
        new vscode.Position(match.startLine, match.startCol),
        new vscode.Position(match.endLine, match.endCol)
      );

      diagnostics.push({
        severity: vscode.DiagnosticSeverity.Warning,
        message: `String fixa detectada em ${match.widget}${match.parameter ? `(${match.parameter})` : ''}. Considere usar uma tradução.`,
        range,
        source: 'translate-me',
      });
    }

    if (diagnostics.length > 0) {
      diagnosticCollection.set(vscode.Uri.file(file), diagnostics);
    }
  }
}

function findHardcodedStrings(content: string, widgetPatterns: Array<{ widget: string, params: string[] }>): StringMatch[] {
  const matches: StringMatch[] = [];

  // Remove comentários para evitar falsos positivos
  const cleanContent = removeComments(content);

  // 1. Detectar widgets específicos conhecidos (mais rápido e preciso)
  for (const pattern of widgetPatterns) {
    const widgetMatches = findWidgetStringMatches(cleanContent, pattern.widget, pattern.params);
    matches.push(...widgetMatches);
  }

  // 2. Detectar widgets customizados genéricos
  const customWidgetMatches = findCustomWidgetStringMatches(cleanContent, widgetPatterns);
  matches.push(...customWidgetMatches);

  // Remover duplicatas baseadas na posição
  const uniqueMatches = removeDuplicateMatches(matches);

  return uniqueMatches;
}

function findCustomWidgetStringMatches(content: string, knownWidgets: Array<{ widget: string, params: string[] }>): StringMatch[] {
  const matches: StringMatch[] = [];

  // Lista de widgets conhecidos para evitar duplicatas
  const knownWidgetNames = new Set(knownWidgets.map(w => w.widget));

  // Regex para encontrar possíveis widgets customizados (incluindo const)
  const customWidgetRegex = /(?:const\s+)?\b([A-Z][a-zA-Z0-9_]*)\s*\(/g;

  let match: RegExpExecArray | null;
  while ((match = customWidgetRegex.exec(content)) !== null) {
    const widgetName = match[1];

    // Pular se é um widget conhecido (já processado)
    if (knownWidgetNames.has(widgetName)) continue;

    // Filtrar classes/tipos que não são widgets
    if (isNotAWidget(widgetName, content, match.index)) continue;

    const widgetStart = match.index;
    const openParenIndex = match.index + match[0].length - 1;

    // Encontrar o fechamento do parêntese correspondente
    const widgetContent = extractBalancedParentheses(content, openParenIndex);

    if (widgetContent) {
      // Verificar se realmente parece ser um widget (tem parâmetros nomeados)
      if (looksLikeWidget(widgetContent)) {
        // Encontrar strings dentro do widget
        /// OLD const stringMatches = findStringsInWidget(widgetContent, widgetStart + match[0].length - 1, content);
        const stringMatches = findStringsInWidget(widgetContent, openParenIndex + 1, content);

        for (const stringMatch of stringMatches) {
          // Verificar se a string não é uma tradução já existente
          if (!isTranslationCall(stringMatch.content)) {
            matches.push({
              ...stringMatch,
              widget: widgetName,
              parameter: determineGenericParameter(widgetContent, stringMatch.content)
            });
          }
        }
      }
    }
  }

  return matches;
}

function isNotAWidget(className: string, content: string, matchIndex: number): boolean {
  // Filtrar classes que provavelmente não são widgets
  const nonWidgetPatterns = [
    // Tipos básicos e classes comuns
    /^(String|int|double|bool|List|Map|Set|Future|Stream|Duration|DateTime|Color|Size|Offset|Rect)$/,
    // Classes de navegação e utilitários
    /^(Navigator|Route|PageRoute|MaterialPageRoute|CupertinoPageRoute|GoRouter)$/,
    // Classes de estado e providers
    /^(Provider|Consumer|Selector|ChangeNotifier|ValueNotifier|StateNotifier)$/,
    // Classes de animação
    /^(Animation|AnimationController|Tween|Curve|Curves)$/,
    // Classes de HTTP e serialização
    /^(Http|Dio|Response|Request|Json|Serializable)$/,
    // Classes de banco de dados
    /^(Database|Hive|SqlFlite|Firebase|Firestore)$/,
    // Classes de testes
    /^(Test|Mock|Fake|Stub|When|Verify|Expect)$/,
  ];

  if (nonWidgetPatterns.some(pattern => pattern.test(className))) {
    return true;
  }

  // Verificar se está em contexto de import, class declaration, etc.
  const beforeMatch = content.substring(Math.max(0, matchIndex - 50), matchIndex).trim();
  const contextPatterns = [
    /import\s+.*$/, // import statements
    /class\s+.*$/, // class declarations
    /extends\s+.*$/, // extends clauses
    /implements\s+.*$/, // implements clauses
    /typedef\s+.*$/, // typedef statements
    /enum\s+.*$/, // enum declarations
    /mixin\s+.*$/, // mixin declarations
    /\.\s*$/, // method calls (SomeClass.method())
    /new\s+$/, // new keyword
    /as\s+$/, // type casting
    /is\s+$/, // type checking
  ];

  return contextPatterns.some(pattern => pattern.test(beforeMatch));
}

function looksLikeWidget(widgetContent: string): boolean {
  // Verificar se tem parâmetros nomeados (indicativo de widget)
  const namedParameterPattern = /\b[a-zA-Z_][a-zA-Z0-9_]*\s*:/;

  // Verificar se tem pelo menos um parâmetro nomeado
  if (!namedParameterPattern.test(widgetContent)) return false;

  // Verificar se não é apenas uma função/método comum
  const commonFunctionPatterns = [
    /^\s*\d+\s*$/, // apenas números
    /^\s*true\s*$|^\s*false\s*$/, // apenas booleanos
    /^\s*null\s*$/, // apenas null
    /^\s*[a-zA-Z_][a-zA-Z0-9_]*\s*$/, // apenas uma variável
  ];

  return !commonFunctionPatterns.some(pattern => pattern.test(widgetContent.trim()));
}

function determineGenericParameter(widgetContent: string, stringContent: string): string {
  // Tentar encontrar o parâmetro nomeado que contém a string
  const lines = widgetContent.split('\n');

  for (const line of lines) {
    if (line.includes(stringContent)) {
      // Procurar por parâmetro nomeado na linha
      const namedParamMatch = line.match(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*:/);
      if (namedParamMatch) {
        return namedParamMatch[1];
      }
    }
  }

  return '';
}

function removeDuplicateMatches(matches: StringMatch[]): StringMatch[] {
  const seen = new Set<string>();
  const uniqueMatches: StringMatch[] = [];

  for (const match of matches) {
    // Criar uma chave única baseada na posição
    const key = `${match.startLine}:${match.startCol}:${match.endLine}:${match.endCol}`;

    if (!seen.has(key)) {
      seen.add(key);
      uniqueMatches.push(match);
    }
  }

  return uniqueMatches;
}

function removeComments(content: string): string {
  // Remove comentários de linha única
  let result = content.replace(/\/\/.*$/gm, '');

  // Remove comentários de múltiplas linhas
  result = result.replace(/\/\*[\s\S]*?\*\//g, '');

  return result;
}

function findWidgetStringMatches(content: string, widgetName: string, params: string[]): StringMatch[] {
  const matches: StringMatch[] = [];

  // Regex mais robusta para encontrar instâncias do widget (incluindo const)
  const widgetRegex = new RegExp(`(?:const\\s+)?\\b${widgetName}\\s*\\(`, 'g');

  let widgetMatch: RegExpExecArray | null;
  while ((widgetMatch = widgetRegex.exec(content)) !== null) {
    const widgetStart = widgetMatch.index;
    const openParenIndex = widgetMatch.index + widgetMatch[0].length - 1;

    // Encontrar o fechamento do parêntese correspondente
    const widgetContent = extractBalancedParentheses(content, openParenIndex);

    if (widgetContent) {
      // Encontrar strings dentro do widget
      const stringMatches = findStringsInWidget(widgetContent, openParenIndex + 1, content);

      for (const stringMatch of stringMatches) {
        // Verificar se a string não é uma tradução já existente
        if (!isTranslationCall(stringMatch.content)) {
          matches.push({
            ...stringMatch,
            widget: widgetName,
            parameter: determineParameter(widgetContent, stringMatch.content, params)
          });
        }
      }
    }
  }

  return matches;
}

function extractBalancedParentheses(content: string, startIndex: number): string | null {
  let depth = 0;
  let i = startIndex;

  // Encontrar o conteúdo entre parênteses balanceados
  while (i < content.length) {
    const char = content[i];

    if (char === '(') {
      depth++;
    } else if (char === ')') {
      depth--;
      if (depth === 0) {
        // Encontrou o fechamento correspondente
        return content.substring(startIndex + 1, i);
      }
    }

    i++;
  }

  return null; // Parênteses não balanceados
}

function findStringsInWidget(widgetContent: string, startOffset: number, fullContent: string): StringMatch[] {
  const matches: StringMatch[] = [];

  // Regex mais robusta para strings com aspas simples, duplas ou template literals
  const stringRegex = /(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g;

  let match: RegExpExecArray | null;
  while ((match = stringRegex.exec(widgetContent)) !== null) {
    const stringContent = match[2]; // Conteúdo da string sem as aspas
    const fullString = match[0]; // String completa com aspas

    // Permitir strings vazias para widgets específicos (podem ser relevantes para i18n)
    // Filtrar apenas strings que não são nem texto nem placeholders úteis
    if (stringContent.length === 0) {
      // Permitir strings vazias em widgets como Text, título, etc.
      // Elas podem ser placeholders que precisam ser traduzidos
    }

    // Filtrar strings que parecem ser código (contém caracteres especiais)
    if (isCodeString(stringContent)) {
      continue;
    }

    // Verificar se não é uma variável ou chamada de função
    if (isVariableOrFunction(widgetContent, match.index, stringContent)) {
      continue;
    }

    const absoluteStart = startOffset + match.index;
    const position = getLineAndColumn(fullContent, absoluteStart);
    const endPosition = getLineAndColumn(fullContent, absoluteStart + match[0].length);

    matches.push({
      content: fullString,
      startLine: position.line,
      startCol: position.column,
      endLine: endPosition.line,
      endCol: endPosition.column,
      widget: '',
      parameter: ''
    });
  }

  return matches;
}

function isVariableOrFunction(widgetContent: string, stringIndex: number, stringContent: string): boolean {
  // Verificar se a string está sendo usada como valor de propriedade de objeto
  const beforeString = widgetContent.substring(0, stringIndex).trim();
  const afterString = widgetContent.substring(stringIndex + stringContent.length + 2).trim();

  // Se há um ponto antes da string, provavelmente é uma propriedade
  if (beforeString.endsWith('.')) return true;

  // Se há parênteses após a string, provavelmente é uma função
  if (afterString.startsWith('(')) return true;

  return false;
}

function isTranslationCall(stringContent: string): boolean {
  // Padrões comuns de tradução que devem ser ignorados
  const translationPatterns = [
    /context\.l10n\./,
    /AppLocalizations\.of\(context\)/,
    /Localizations\.of\(context\)/,
    /S\.of\(context\)/,
    /\.tr\(\)/,
    /\.tr\s*$/,
    /intl\./,
    /\.i18n/,
    /LocaleKeys\./,
    /I18n\./,
    /translations\./,
    /locale\./,
  ];

  return translationPatterns.some(pattern => pattern.test(stringContent));
}

function isCodeString(stringContent: string): boolean {
  // Filtrar strings que provavelmente são código, não texto de usuário
  const trimmed = stringContent.trim();

  // Permitir strings vazias (podem ser placeholders importantes)
  if (trimmed.length === 0) return false;

  // Se contém espaços ou pontuação de texto, provavelmente é texto de usuário
  if (/\s/.test(trimmed) || /[.!?,:;]/.test(trimmed)) {
    return false;
  }

  // Permitir nomes próprios ou palavras simples (como 'Savana')
  if (/^[A-Z][a-z]+$/.test(trimmed)) {
    return false;
  }

  const codePatterns = [
    /^[0-9]+$/, // Apenas números
    /^[0-9a-fA-F]{8,}$/, // Hashes/IDs longos
    /^[\/\\]/, // Paths
    /^https?:\/\//, // URLs
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Emails
    /^#[0-9a-fA-F]{6}$/, // Cores hex
    /^[A-Z_][A-Z0-9_]*$/, // Constantes em maiúsculas
    /^\$[a-zA-Z_]/, // Variáveis interpoladas
    /^[{}[\]()<>]$/, // Símbolos únicos
    /^[a-z]+\.[a-z]+/, // Propriedades de objetos (ex: app.title)
    /^[a-zA-Z_][a-zA-Z0-9_]*$/, // Identificadores simples apenas se tiverem underscores
  ];

  return codePatterns.some(pattern => pattern.test(trimmed));
}

function determineParameter(widgetContent: string, stringContent: string, possibleParams: string[]): string {
  // Tentar determinar qual parâmetro contém a string
  for (const param of possibleParams) {
    if (param && widgetContent.includes(`${param}:`)) {
      const paramIndex = widgetContent.indexOf(`${param}:`);
      const stringIndex = widgetContent.indexOf(stringContent);

      // Verificar se a string aparece após o parâmetro
      if (stringIndex > paramIndex) {
        return param;
      }
    }
  }

  return '';
}

function getLineAndColumn(content: string, offset: number): { line: number, column: number } {
  const beforeOffset = content.substring(0, offset);
  const lines = beforeOffset.split('\n');
  return {
    line: lines.length - 1,
    column: lines[lines.length - 1].length
  };
}
