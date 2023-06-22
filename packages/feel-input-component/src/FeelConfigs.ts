/*
 * Copyright 2021 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as Monaco from "@kie-tools-core/monaco-editor";

export const MONACO_FEEL_LANGUAGE = "feel-language";

export const MONACO_FEEL_THEME = "feel-theme";

export const feelTheme = (): Monaco.editor.IStandaloneThemeData => {
  return {
    base: "vs",
    inherit: true,
    rules: [
      { token: "feel-keyword", foreground: "26268C", fontStyle: "bold" },
      { token: "feel-numeric", foreground: "3232E7" },
      { token: "feel-boolean", foreground: "26268D", fontStyle: "bold" },
      { token: "feel-string", foreground: "2A9343" },
      { token: "feel-function", foreground: "3232E8" },
    ],
    colors: {
      "editorLineNumber.foreground": "#000000",
    },
  };
};

export const feelTokensConfig = (): Monaco.languages.IMonarchLanguage => {
  return {
    keywords: [
      "for",
      "in",
      "return",
      "if",
      "then",
      "else",
      "some",
      "every",
      "satisfies",
      "instance",
      "of",
      "function",
      "external",
      "or",
      "and",
      "between",
      "not",
      "null",
    ],
    functions: [
      "abs",
      "after",
      "all",
      "any",
      "append",
      "before",
      "ceiling",
      "code",
      "coincides",
      "concatenate",
      "contains",
      "count",
      "date",
      "date and time",
      "day of week",
      "day of year",
      "decimal",
      "decision table",
      "distinct values",
      "duration",
      "during",
      "ends",
      "even",
      "exp",
      "finished by",
      "finishes",
      "flatten",
      "floor",
      "get entries",
      "get value",
      "includes",
      "index of",
      "insert before",
      "invoke",
      "list contains",
      "log",
      "lower case",
      "matches",
      "max",
      "mean",
      "median",
      "meets",
      "met by",
      "min",
      "mode",
      "modulo",
      "month of year",
      "nn all",
      "nn any",
      "nn count",
      "nn max",
      "nn mean",
      "nn median",
      "nn min",
      "nn mode",
      "nn stddev",
      "nn sum",
      "not",
      "now",
      "number",
      "odd",
      "overlaps after",
      "overlaps before",
      "overlaps",
      "product",
      "remove",
      "replace",
      "reverse",
      "sort",
      "split",
      "sqrt",
      "started by",
      "starts with",
      "starts",
      "stddev",
      "string length",
      "string",
      "sublist",
      "substring after",
      "substring before",
      "substring",
      "sum",
      "time",
      "today",
      "union",
      "upper case",
      "week of years",
      "years and months duration",
    ],
    tokenizer: {
      root: [
        [/(?:true|false)/, "feel-boolean"],
        [/[0-9]+/, "feel-numeric"],
        [/(?:"(?:.*?)")/, "feel-string"],
        [/[\w$]*[a-z_$][\w$]*/, { cases: { "@keywords": "feel-keyword", "@functions": "feel-function" } }],
      ],
    },
  };
};

export const feelDefaultConfig = (
  options?: Monaco.editor.IStandaloneEditorConstructionOptions
): Monaco.editor.IStandaloneEditorConstructionOptions => {
  return {
    language: MONACO_FEEL_LANGUAGE,
    theme: MONACO_FEEL_THEME,
    fontSize: 15,
    contextmenu: false,
    useTabStops: false,
    folding: false,
    automaticLayout: true,
    lineNumbersMinChars: 0,
    overviewRulerBorder: false,
    scrollBeyondLastLine: false,
    hideCursorInOverviewRuler: true,
    scrollbar: {
      useShadows: false,
    },
    minimap: {
      enabled: false,
    },

    ...options,
  };
};

export const feelDefaultSuggestions = (): Monaco.languages.CompletionItem[] => {
  const suggestions: Monaco.languages.CompletionItem[] = [];

  const suggestionTypes = {
    snippet: [
      ["if", "if $1 then\n\t$0\nelse\n\t"],
      ["for", "for element in $1 return\n\t$0"],
    ],
    function: [
      {
        label: "abs(n)",
        insertText: "abs($1)",
        description: "returns the absolute value of n",
        parameters: [["n", `\`number\`, \`days and time duration\`, \`years and months duration\``]],
        examples: ["abs( 10 ) = 10", "abs( -10 ) = 10", 'abs( @"PT5H" ) = @"PT5H"', 'abs( @"-PT5H" ) = @"PT5H"'],
      },
      {
        label: "after(point1, point2)",
        insertText: "after($1, $2)",
        description: "returns true when an point A is after an point B",
        parameters: [
          ["point1", `\`number\``],
          ["point2", `\`number\``],
        ],
        examples: ["after( 10, 5 ) = true", "after( 5, 10 ) = false"],
      },
      {
        label: "after(point, range)",
        insertText: "after($1, $2)",
        description: "returns true when an point A is after a range B",
        parameters: [
          ["point", `\`number\``],
          ["range", `\`range\` (\`interval\`)`],
        ],
        examples: ["after( 12, [1..10] ) = true", "after( 10, [1..10) ) = true", "after( 10, [1..10] ) = false"],
      },
      {
        label: "after(range, point)",
        insertText: "after($1, $2)",
        description: "returns true when a range A is after an point B",
        parameters: [
          ["range", `\`range\` (\`interval\`)`],
          ["point", `\`number\``],
        ],
        examples: [
          "after( [11..20], 12 ) = false",
          "after( [11 ..20], 10 ) = true",
          "after( (11..20], 11 ) = true",
          "after( [11 ..20], 11 ) = false",
        ],
      },
      {
        label: "after(range1, range1)",
        insertText: "after($1, $2)",
        description: "returns true when a range A is after a range B",
        parameters: [
          ["range1", `\`range\` (\`interval\`)`],
          ["range2", `\`range\` (\`interval\`)`],
        ],
        examples: [
          "after( [11..20], [1..10] ) = true",
          "after( [1 ..1 0], [11 ..20] ) = false",
          "after( [11 ..20], [1.. 11) ) = true",
          "after( (11..20], [1..11] ) = true",
        ],
      },
      {
        label: "all(list)",
        insertText: "all($1)",
        description: "return false if any item is false, else true if empty or all items are true, else null",
        parameters: [["list", `\`list\` of \`boolean\` elements`]],
        examples: ["all( [false,null,true] ) = false", "all( true ) = true", "all( [] ) = true", "all( 0 ) = null"],
      },
      {
        label: "any(list)",
        insertText: "any($1)",
        description: "return true if any item is true, else false if empty or all items are false, else null",
        parameters: [["list", `\`list\` of \`boolean\` elements`]],
        examples: ["any( [false,null,true] ) = true", "any( false ) = false", "any( [] ) = false", "any( 0 ) = null"],
      },
      {
        label: "append(list, item)",
        insertText: "append($1, $2)",
        description: "return new list with items appended",
        parameters: [
          ["list", `\`list\``],
          ["item", "Any type"],
        ],
        examples: ["append( [1], 2, 3 ) = [1,2,3]"],
      },
      {
        label: "before(point1, point2)",
        insertText: "before($1, $2)",
        description: "returns true when an point A is before an point B",
        parameters: [
          ["point1", `\`number\``],
          ["point2", `\`number\``],
        ],
        examples: ["before( 1, 10 ) = true", "before( 10, 1 ) = false"],
      },
      {
        label: "before(point, range)",
        insertText: "before($1, $2)",
        description: "returns true when an point A is before a range B",
        parameters: [
          ["point", `\`number\``],
          ["range", `\`range\` (\`interval\`)`],
        ],
        examples: ["before( 1, [1.. 10] ) = false", "before( 1, (1..10] ) = true", "before( 1, [5.. 10] )= true"],
      },
      {
        label: "before(range, point)",
        insertText: "before($1, $2)",
        description: "returns true when a range A is before an point B",
        parameters: [
          ["range", `\`range\` (\`interval\`)`],
          ["point", `\`number\``],
        ],
        examples: ["before( [1..10], 10 ) = false", "before( [1..10), 10 ) = true", "before( [1..10], 15 ) = true"],
      },
      {
        label: "before(range1, range1)",
        insertText: "before($1, $2)",
        description: "returns true when a range A is before a range B",
        parameters: [
          ["range1", `\`range\` (\`interval\`)`],
          ["range2", `\`range\` (\`interval\`)`],
        ],
        examples: [
          "before( [1..10], [15..20] ) = true",
          "before( [1..10], [10..20] ) = false",
          "before( [1..10), [10..20] ) = true",
          "before( [1..10], (10..20] ) = true",
        ],
      },
      {
        label: "ceiling(n)",
        insertText: "ceiling($1)",
        description: "return n with rounding mode ceiling. If n is null the result is null.",
        parameters: [["n", `\`number\``]],
        examples: ["ceiling( 1.5 ) = 2", "ceiling( -1.5 ) = -1"],
      } /* 
      {   === DMN 1.4 ===
        label: "ceiling(n, scale)",
        insertText: "ceiling($1, $2)",
        description:
          "returns n with given scale and rounding mode ceiling. If at least one of n or scale is null, the result is null.",
        parameters: [
          ["n", `\`number\``],
          ["scale", `\`number\``],
        ],
        examples: ["ceiling( -1.56, 1 ) = -1.5"],
      }, */,
      {
        label: "code(value)",
        insertText: "code($1)",
        description: "",
        parameters: [],
        examples: [],
      },
      {
        label: "coincides(point1, point2)",
        insertText: "coincides($1, $2)",
        description: "return true when a point A coincides with a point B",
        parameters: [
          ["point1", `\`number\``],
          ["point2", `\`number\``],
        ],
        examples: ["coincides( 5, 5 ) = true", "coincides( 3, 4 ) = false"],
      },
      {
        label: "coincides(range1, range2)",
        insertText: "coincides($1, $2)",
        description: "return true when a range A coincides with a range B",
        parameters: [
          ["range1", `\`range\` (\`interval\`)`],
          ["range2", `\`range\` (\`interval\`)`],
        ],
        examples: ["coincides( 5, 5 ) = true", "coincides( 3, 4 ) = false"],
      },
      {
        label: "concatenate(list...)",
        insertText: "concatenate($1)",
        description: "return new list that is a concatenation of the arguments",
        parameters: [["list", `One or more \`list\``]],
        examples: ["concatenate( [1,2], [3] ) = [1,2,3]"],
      },
      {
        label: "contains(string, match)",
        insertText: "contains($1, $2)",
        description: "does the string contain the match?",
        parameters: [
          ["string", `string`],
          ["match", `string`],
        ],
        examples: ['contains( "foobar", "of" ) = false'],
      },
      {
        label: "count(list)",
        insertText: "count($1)",
        description: "return size of list, or zero if list is empty",
        parameters: [["list", `\`list\``]],
        examples: ["count( [1,2,3] ) = 3", "count( [] ) = 0", "count( [1, [2,3]] ) = 2"],
      },
      {
        label: "date(from)",
        insertText: "date($1)",
        description: "convert `from` to a date",
        parameters: [["from", `\`string\` or \`date and time\``]],
        examples: [
          'date( "2012-12-25" ) – date( "2012-12-24" ) = duration( "P1D" )',
          'date( date and time( "2012-12-25T11:00:00Z" ) ) = date( "2012-12-25")',
        ],
      },
      {
        label: "date(year, month, day)",
        insertText: "date($1, $2, $3)",
        description: "creates a date from year, month, day component values",
        parameters: [
          ["year", `\`number\``],
          ["month", `\`number\``],
          ["day", `\`number\``],
        ],
        examples: ['date( 2012, 12, 25 ) = date( "2012-12-25" )'],
      },
      {
        label: "date and time(from)",
        insertText: "date and time($1)",
        description: "convert `from` to a date and time",
        parameters: [["from", `string`]],
        examples: [
          'date and time( "2012-12-24T23:59:00" ) + duration( "PT1M" ) = date and time( "2012-12-25T00:00:00" )',
        ],
      },
      {
        label: "date and time(date, time)",
        insertText: "date and time($1, $2)",
        description: "creates a date time from the given date (ignoring any time component) and the given time",
        parameters: [
          ["date", `\`date\` or \`date and time\``],
          ["time", `\`time\``],
        ],
        examples: [
          'date and time ( "2012-12-24T23:59:00" ) = date and time ( date( "2012-12-24” ), time ( “23:59:00" ) )',
        ],
      },
      {
        label: "day of week(date)",
        insertText: "day of week($1)",
        description:
          "returns the day of the week according to the Gregorian calendar enumeration: “Monday”, “Tuesday”, “Wednesday”, “Thursday”, “Friday”, “Saturday”, “Sunday”",
        parameters: [["date", `\`date\` or \`date and time\``]],
        examples: ['day of week( date(2019, 9, 17) ) = "Tuesday"'],
      },
      {
        label: "day of year(date)",
        insertText: "day of year($1)",
        description: "returns the Gregorian number of the day within the year",
        parameters: [["date", `\`date\` or \`date and time\``]],
        examples: ["day of year( date(2019, 9, 17) ) = 260"],
      },
      {
        label: "decimal(n, scale)",
        insertText: "decimal($1, $2)",
        description: "return `n` with given `scale`",
        parameters: [
          ["n", `\`number\``],
          ["scale", `\`number\``],
        ],
        examples: ["decimal( 1/3, 2 ) = .33", "decimal( 1.5, 0 ) = 2", "decimal( 2.5, 0 ) = 2"],
      },
      {
        label: "distinct values(list)",
        insertText: "distinct values($1)",
        description: "duplicate removal",
        parameters: [["list", `\`list\``]],
        examples: ["distinct values( [1,2,3,2,1] ) = [1,2,3]"],
      },
      {
        label: "duration(from)",
        insertText: "duration($1)",
        description: "convert `from` to a days and time or years and months duration",
        parameters: [["from", `string`]],
        examples: [
          'date and time( "2012-12-24T23:59:00" ) - date and time( "2012-12-22T03:45:00" ) = duration( "P2DT20H14M" )',
          'duration( "P2Y2M" ) = duration( "P26M" )',
        ],
      },
    ],
  };

  /*
      ["date and time(year, month, day, hour, minute, second)", "date and time($1, $2, $3, $4, $5, $6)"], 
      [
        "date and time(year, month, day, hour, minute, second, hour offset)",
        "date and time($1, $2, $3, $4, $5, $6, $7)",
      ],
      ["date and time(year, month, day, hour, minute, second, timezone)", "date and time($1, $2, $3, $4, $5, $6, $7)"], 
      [
        "decision table(ctx, outputs, input expression list, input values list, output values, rule list, hit policy, default output value)",
        "decision table($1, $2, $3, $4, $5, $6, $7, $8)",
      ],


      ["during(range1, range2)", "during($1, $2)"],
      ["during(point, range)", "during($1, $2)"],
      ["ends with(string, match)", "ends with($1, $2)"],
      ["even(number)", "even($1)"],
      ["exp(number)", "exp($1)"],
      ["finished by(range, point)", "finished by($1, $2)"],
      ["finished by(range1, range2)", "finished by($1, $2)"],
      ["finishes(range1, range2)", "finishes($1, $2)"],
      ["finishes(point, range)", "finishes($1, $2)"],
      ["flatten(list)", "flatten($1)"],
      ["floor(n)", "floor($1)"],
      ["get entries(m)", "get entries($1)"],
      ["get value(m, key)", "get value($1, $2)"],
      ["includes(range, index)", "includes($1, $2)"],
      ["includes(range1, range2)", "includes($1, $2)"],
      ["index of(list, match)", "index of($1, $2)"],
      ["insert before(list, position, newItem)", "insert before($1, $2, $3)"],
      ["invoke(ctx, namespace, model name, decision name, parameters)", "invoke($1, $2, $3, $4, $5)"],
      ["list contains(list, element)", "list contains($1, $2)"],
      ["log(number)", "log($1)"],
      ["lower case(string)", "lower case($1)"],
      ["matches(input, pattern)", "matches($1, $2)"],
      ["matches(input, pattern, flags)", "matches($1, $2, $3)"],
      ["max(list)", "max($1)"],
      ["mean(list)", "mean($1)"],
      ["median(list)", "median($1)"],
      ["meets(range1, range2)", "meets($1, $2)"],
      ["met by(range1, range2)", "met by($1, $2)"],
      ["min(list)", "min($1)"],
      ["mode(list)", "mode($1)"],
      ["modulo(dividend, divisor)", "modulo($1, $2)"],
      ["month of year(date)", "month of year($1)"],
      ["nn all(list)", "nn all($1)"],
      ["nn any(list)", "nn any($1)"],
      ["nn count(list)", "nn count($1)"],
      ["nn max(list)", "nn max($1)"],
      ["nn mean(list)", "nn mean($1)"],
      ["nn median(list)", "nn median($1)"],
      ["nn min(list)", "nn min($1)"],
      ["nn mode(list)", "nn mode($1)"],
      ["nn stddev(list)", "nn stddev($1)"],
      ["nn sum(list)", "nn sum($1)"],
      ["not(negand)", "not($1)"],
      ["now()", "now()"],
      ["number(from, grouping separator, decimal separator)", "number($1, $2, $3)"],
      ["odd(number)", "odd($1)"],
      ["overlaps after(range1, range2)", "overlaps after($1, $2)"],
      ["overlaps before(range1, range2)", "overlaps before($1, $2)"],
      ["overlaps(range1, range2)", "overlaps($1, $2)"],
      ["product(list)", "product($1)"],
      ["remove(list, position)", "remove($1, $2)"],
      ["replace(input, pattern, replacement)", "replace($1, $2, $3)"],
      ["replace(input, pattern, replacement, flags)", "replace($1, $2, $3, $4)"],
      ["reverse(list)", "reverse($1)"],
      ["sort(list, precedes)", "sort($1, $2)"],
      ["sort(list)", "sort($1)"],
      ["split(string, delimiter)", "split($1, $2)"],
      ["sqrt(number)", "sqrt($1)"],
      ["started by(range, point)", "started by($1, $2)"],
      ["started by(range1, range2)", "started by($1, $2)"],
      ["starts with(string, match)", "starts with($1, $2)"],
      ["starts(range1, range2)", "starts($1, $2)"],
      ["starts(point, range)", "starts($1, $2)"],
      ["stddev(list)", "stddev($1)"],
      ["string length(string)", "string length($1)"],
      ["string(from)", "string($1)"],
      ["string(mask, p)", "string($1, $2)"],
      ["sublist(list, start position)", "sublist($1, $2)"],
      ["sublist(list, start position, length)", "sublist($1, $2, $3)"],
      ["substring after(string, match)", "substring after($1, $2)"],
      ["substring before(string, match)", "substring before($1, $2)"],
      ["substring(string, start position)", "substring($1, $2)"],
      ["substring(string, start position, length)", "substring($1, $2, $3)"],
      ["sum(list)", "sum($1)"],
      ["time(from)", "time($1)"],
      ["time(hour, minute, second)", "time($1, $2, $3)"],
      ["time(hour, minute, second, offset)", "time($1, $2, $3, $4)"],
      ["today()", "today()"],
      ["union(list)", "union($1)"],
      ["upper case(string)", "upper case($1)"],
      ["week of year(date)", "week of year($1)"],
      ["years and months duration(from, to)", "years and months duration($1, $2)"],
    ],
  }; */

  for (const suggestion of suggestionTypes.snippet) {
    suggestions.push({
      kind: Monaco.languages.CompletionItemKind.Keyword,
      insertTextRules: Monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      label: suggestion[0],
      insertText: suggestion[1],
    } as Monaco.languages.CompletionItem);
  }

  for (const suggestion of suggestionTypes.function) {
    suggestions.push({
      kind: Monaco.languages.CompletionItemKind.Function,
      insertTextRules: Monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      label: suggestion.label,
      insertText: suggestion.insertText,
      documentation:
        suggestion.description !== ""
          ? {
              isTrusted: true,
              value: generateDocumentationMarkDown(
                generateMarkdownFEELCode([suggestion.label]),
                suggestion.description,
                generateMarkdownParametersTable(suggestion.parameters),
                generateMarkdownFEELCode(suggestion.examples)
              ),
            }
          : null,
    } as Monaco.languages.CompletionItem);
  }

  return suggestions;
};

/**
 * It generates a Markdown FEEL code block given an array of code statement. E.g:
 *  \`\`\`FEEL
 *  string length( "tes" ) = 3
 *  string length( "\U01F40Eab" ) = 3
 *  \`\`\`
 */
const generateMarkdownFEELCode = (codeStatement: string[]): string => {
  return `\`\`\`FEEL\n${codeStatement.join(`\n`)}\n\`\`\``;
};

/**
 * It generates a Markdown Table to show all the parameters requested by a function. E.g:
 *  | Parameter | Type |
 *  |-|-|
 *  | \`name\`| type |
 *  | \`name2\`| type2 |
 */
const generateMarkdownParametersTable = (parameters: string[][]): string => {
  let rows = parameters.map((item) => `|\`${item[0]}\`|${item[1]}|`);
  return `| Parameter | Type |\n|-|-|\n${rows.join(`\n`)}`;
};

const generateDocumentationMarkDown = (
  feelFunctionTitle: string,
  description: string,
  parametersTable: string,
  feelFunctionExamples: string
): string => {
  return `${feelFunctionTitle}\n---\n_${description}_\n\n${parametersTable}\n\nExample:\n${feelFunctionExamples}`;
};
