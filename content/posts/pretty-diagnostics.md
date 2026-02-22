---
title: "Pretty Diagnostics: Making Compiler Errors Actually Helpful"
description: "Designing beautiful, developer-friendly error messages with source context, colors, and actionable suggestions"
date: "2025-02-12"
author: "ArkoiSystems"
tags: ["diagnostics", "compiler", "developer-experience", "tooling"]
published: true
---

# Introduction

Bad error messages frustrate developers. Great error messages teach and guide. The difference between "undefined variable" and a diagnostic that shows you exactly where the problem is, suggests a fix, and explains why it matters - that's what separates good tools from great ones.

This post explores the ArkoiSystems Pretty Diagnostics project: a system for creating compiler error messages that developers actually appreciate.

## The Problem with Bad Diagnostics

Traditional compiler errors are often cryptic:

```
error: undefined symbol 'x'
```

What's wrong with this?

- **No source location** - Where is this error?
- **No context** - What code caused it?
- **No help** - How do I fix it?

Compare with a better diagnostic:

```
error: undefined variable 'x'
  --> main.rs:12:9
   |
12 |     y = x + 1;
   |         ^ not found in this scope
   |
help: did you mean 'y'?
```

This shows exactly what's wrong, where it is, and suggests a fix. That's the goal.

## Design Principles

Great diagnostics follow these principles:

### 1. Show the Source Code

Always include the relevant source lines:

```
error: type mismatch
  --> calc.c:5:13
   |
 5 |     int x = "hello";
   |             ^^^^^^^
   |             |
   |             expected 'int', found 'string'
```

### 2. Use Visual Markers

Carets, underlines, and arrows guide the eye:

```
error: missing semicolon
  --> main.c:3:18
   |
 3 |     let x = 42
   |                ^ expected ';' here
 4 |     let y = 10;
```

### 3. Provide Context

Show surrounding code to understand the problem:

```
warning: unused variable 'count'
  --> app.c:10:9
   |
 8 |     int total = 0;
 9 |     int count = 0;
10 |
11 |     for (int i = 0; i < 10; i++) {
12 |         total += i;
13 |     }
   |
help: if this is intentional, prefix with underscore: '_count'
```

### 4. Suggest Fixes

When possible, tell users how to fix the issue:

```
error: cannot find function 'printl'
  --> main.c:15:5
   |
15 |     printl("Hello");
   |     ^^^^^^ not found
   |
help: did you mean 'printf'?
```

## Implementation Architecture

Our diagnostic system has several components:

```
Source Code → Lexer/Parser → Error Reporter → Formatter → Terminal Output
```

### Source Location Tracking

Every token and AST node tracks its location:

```c
typedef struct {
    const char* filename;
    uint32_t line;
    uint32_t column;
    uint32_t offset;  // Byte offset in file
    uint32_t length;  // Length of the span
} SourceSpan;

typedef struct {
    TokenType type;
    const char* lexeme;
    SourceSpan span;
} Token;
```

### Diagnostic Structure

Each diagnostic contains all necessary information:

```c
typedef enum {
    DIAG_ERROR,
    DIAG_WARNING,
    DIAG_NOTE,
    DIAG_HELP
} DiagLevel;

typedef struct {
    DiagLevel level;
    const char* message;
    SourceSpan primary_span;
    const char* primary_label;

    // Secondary spans (for multi-location errors)
    SourceSpan* secondary_spans;
    const char** secondary_labels;
    int num_secondary;

    // Optional suggestions
    const char* suggestion;
    const char* suggestion_code;
} Diagnostic;
```

### Rendering Diagnostics

The renderer formats diagnostics for terminal output:

```c
void render_diagnostic(const Diagnostic* diag) {
    // Print header with color
    const char* color = diag_level_color(diag->level);
    printf("%s%s:%s %s\n",
        color,
        diag_level_name(diag->level),
        COLOR_RESET,
        diag->message);

    // Print source location
    printf("  %s-->%s %s:%d:%d\n",
        COLOR_BLUE,
        COLOR_RESET,
        diag->primary_span.filename,
        diag->primary_span.line,
        diag->primary_span.column);

    // Print source code with highlighting
    render_source_excerpt(diag);

    // Print suggestions if any
    if (diag->suggestion) {
        printf("  %shelp:%s %s\n",
            COLOR_GREEN,
            COLOR_RESET,
            diag->suggestion);
    }
}
```

## Color and Formatting

Colors make diagnostics easier to parse:

```c
#define COLOR_RED     "\x1b[31m"
#define COLOR_YELLOW  "\x1b[33m"
#define COLOR_BLUE    "\x1b[34m"
#define COLOR_GREEN   "\x1b[32m"
#define COLOR_CYAN    "\x1b[36m"
#define COLOR_BOLD    "\x1b[1m"
#define COLOR_RESET   "\x1b[0m"
```

Example output:

```
error: type mismatch
  --> calc.c:5:13
   |
 5 |     int x = "hello";
   |             ^^^^^^^ expected 'int', found 'string'
```

## Advanced Features

### Multi-Location Diagnostics

Some errors involve multiple locations:

```
error: conflicting types for 'add'
  --> main.c:10:5
   |
10 |     int add(int a, int b) {
   |     ^^^^^^^^^^^^^^^^^^^^^ found definition here
   |
note: previous declaration here
  --> main.c:3:5
   |
 3 |     float add(int a, int b);
   |     ^^^^^^^^^^^^^^^^^^^^^^^^ declared as returning 'float'
```

### Suggested Fixes

For simple errors, show the exact fix:

```
error: missing closing bracket
  --> expr.c:8:20
   |
 8 |     result = (x + y;
   |                    ^ expected ')'
   |
help: add closing parenthesis:
   |
 8 |     result = (x + y);
   |                    +
```

### Severity Levels

Different levels for different situations:

- **Error** - Prevents compilation
- **Warning** - Potentially problematic but allowed
- **Note** - Additional context for other diagnostics
- **Help** - Suggestions for fixing issues

### Code Actions

IDE integration can turn diagnostics into automated fixes:

```json
{
  "diagnostic": {
    "message": "unused variable 'x'",
    "span": { "start": 120, "end": 121 }
  },
  "codeAction": {
    "title": "Prefix with underscore",
    "edit": {
      "range": { "start": 120, "end": 121 },
      "newText": "_x"
    }
  }
}
```

## Testing Diagnostics

Good diagnostics need good tests:

```c
void test_undefined_variable(void) {
    const char* source =
        "fn main() {\n"
        "    let y = x + 1;\n"
        "}\n";

    Diagnostic* diag = compile_and_get_first_error(source);

    assert_equal(diag->level, DIAG_ERROR);
    assert_equal(diag->primary_span.line, 2);
    assert_equal(diag->primary_span.column, 13);
    assert_string_contains(diag->message, "undefined");
}
```

## Performance Considerations

Pretty diagnostics shouldn't slow down compilation:

- **Lazy rendering** - Only format when actually displayed
- **String interning** - Reuse common strings
- **Batch reporting** - Collect all errors before printing
- **Configurable verbosity** - JSON output for IDE integrations

## Real-World Examples

### Rust

Rust sets the gold standard for compiler diagnostics:

```
error[E0425]: cannot find value `x` in this scope
 --> main.rs:2:13
  |
2 |     let y = x + 1;
  |             ^ help: a local variable with a similar name exists: `y`
```

### Elm

Elm's friendly errors explain what went wrong:

```
-- TYPE MISMATCH ---------------------------------------------------- Main.elm

The 1st argument to `add` is not what I expect:

8|    add "hello" 5
          ^^^^^^^
This argument is a string of type:

    String

But `add` needs the 1st argument to be:

    Int
```

## Conclusion

Great diagnostics transform the developer experience. They turn frustrating debugging sessions into learning opportunities. At ArkoiSystems, Pretty Diagnostics isn't an afterthought - it's a core part of building tools people love to use.

The goal: every error message should leave developers feeling helped, not blamed.

---

_The ArkoiSystems Pretty Diagnostics system is designed to be reusable across different compiler and tool projects. Check out the code on GitHub._
