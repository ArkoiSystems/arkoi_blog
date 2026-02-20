---
title: "Building a Compiler from Scratch: The Journey Begins"
description: "Starting the compiler project - understanding lexical analysis, tokenization, and the first steps of language implementation"
date: "2025-02-10"
author: "ArkoiSystems"
tags: ["compiler", "language-design", "low-level", "systems"]
published: true
---

# Introduction

Building a compiler is one of the most rewarding challenges in systems programming. It's a journey through the entire spectrum of computer science: from parsing theory and formal grammars to code generation and optimization. This post documents the beginning of the ArkoiSystems compiler project.

## Why Build a Compiler?

Compilers are the bridge between human-readable code and machine instructions. Understanding how they work gives you insight into:

- **Language Design** - What makes a programming language good or bad
- **Performance** - How code translates to actual CPU instructions
- **Optimization** - How compilers make code faster
- **Error Handling** - How to provide great developer experience through diagnostics

## Architecture Overview

Our compiler follows the traditional multi-phase architecture:

```
Source Code → Lexer → Parser → Semantic Analysis → Code Generation → Machine Code
```

Each phase transforms the program representation:

1. **Lexer** (Tokenization) - Convert characters into tokens
2. **Parser** - Build an Abstract Syntax Tree (AST)
3. **Semantic Analysis** - Type checking and validation
4. **Code Generation** - Emit target machine code

## Phase 1: Lexical Analysis

The lexer is the compiler's first pass. It reads source code character by character and groups them into meaningful tokens.

### What is a Token?

A token is the smallest meaningful unit in a program:

```rust
let x = 42;
```

This simple line contains these tokens:

- `let` - KEYWORD
- `x` - IDENTIFIER
- `=` - OPERATOR
- `42` - NUMBER_LITERAL
- `;` - SEMICOLON

### Building the Lexer

Our lexer implementation uses a state machine approach:

```c
typedef enum {
    TOKEN_KEYWORD,
    TOKEN_IDENTIFIER,
    TOKEN_NUMBER,
    TOKEN_OPERATOR,
    TOKEN_SEMICOLON,
    TOKEN_EOF
} TokenType;

typedef struct {
    TokenType type;
    char* lexeme;
    int line;
    int column;
} Token;
```

The lexer maintains:

- **Current position** in the source code
- **Line and column numbers** for error reporting
- **Peek buffer** for lookahead

### Handling Whitespace and Comments

Good lexers skip whitespace efficiently and handle different comment styles:

```c
// Single-line comment
/* Multi-line
   comment */
```

## Phase 2: Parsing

The parser takes tokens from the lexer and builds an Abstract Syntax Tree (AST). This represents the grammatical structure of the program.

### Grammar Design

We define our language grammar using BNF (Backus-Naur Form):

```bnf
program     → statement*
statement   → varDecl | exprStmt
varDecl     → "let" IDENTIFIER "=" expression ";"
expression  → equality
equality    → comparison ( ( "==" | "!=" ) comparison )*
```

### Recursive Descent Parsing

We use a recursive descent parser - each grammar rule becomes a function:

```c
Expr* parse_expression() {
    return parse_equality();
}

Expr* parse_equality() {
    Expr* left = parse_comparison();

    while (match(TOKEN_EQUAL_EQUAL) || match(TOKEN_BANG_EQUAL)) {
        Token op = previous();
        Expr* right = parse_comparison();
        left = make_binary(left, op, right);
    }

    return left;
}
```

## Error Handling and Diagnostics

Great compilers have great error messages. We're building diagnostic capabilities from the start:

```
error: undefined variable 'y'
  --> main.txt:3:9
   |
 3 | let x = y + 1;
   |         ^ not found in this scope
   |
help: did you mean 'x'?
```

Key principles for good diagnostics:

- **Show the source location** with line and column numbers
- **Point to the exact problem** with carets or underlines
- **Suggest fixes** when possible
- **Use color** to highlight different message types

## Next Steps

The compiler is just beginning. Future posts will cover:

- **Type System** - Implementing static type checking
- **Intermediate Representation** - Building an IR for optimization
- **Code Generation** - Emitting assembly or LLVM IR
- **Optimization** - Making code faster

## Resources

Essential reading for compiler implementation:

- "Crafting Interpreters" by Robert Nystrom
- "Engineering a Compiler" by Keith Cooper
- "Modern Compiler Implementation in C" by Andrew Appel
- LLVM documentation and tutorials

## Conclusion

Building a compiler is a marathon, not a sprint. Each phase builds on the previous one, and getting the foundations right is crucial. The lexer and parser form that foundation - once they're solid, the rest of the compiler can be built with confidence.

Stay tuned for the next post where we'll dive deep into semantic analysis and type checking.

---

_Follow along with the ArkoiSystems compiler project. All code will be open source and available on GitHub._
