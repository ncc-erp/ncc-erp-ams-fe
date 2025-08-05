# Frontend Code Guidelines: Commit Rules

## Overview
This document outlines the commit message rules for the frontend (FE) of the ERP-AMS project. Following these guidelines ensures consistency and clarity in the project's commit history.

---

## Commit Message Format
Each commit message must follow this format:

```
<type>(<scope>): <subject>
```

### **1. Type**
The type indicates the purpose of the commit. Allowed types are:
- **feat**: A new feature.
- **fix**: A bug fix.
- **refactor**: Code changes that neither fix a bug nor add a feature.
- **test**: Adding or updating tests.
- **revert**: Reverting a previous commit.
- **hotfix**: A critical fix that needs immediate attention.
- **BREAKING CHANGE**: A change that breaks backward compatibility.

### **2. Scope**
The scope specifies the area of the frontend codebase affected by the commit. Examples:
- **UI**: User interface changes.
- **API**: API integration changes.
- **STYLE**: Styling-related changes.
- **TEST**: Test-related changes.
- **CONFIG**: Configuration-related changes.

### **3. Subject**
The subject is a brief description of the change. It must:
- Be written in lowercase.
- Be concise and clear.
- Avoid ending with a period.

---

## Examples
### Valid Commit Messages:
- `feat(UI): add new login page`
- `fix(API): resolve issue with checkout endpoint integration`
- `refactor(STYLE): update button styling`
- `test(TEST): add unit tests for asset list component`
- `hotfix(CONFIG): fix critical bug in environment variables`

### Invalid Commit Messages:
- `Added new feature` (missing type and scope)
- `fix: resolve issue` (missing scope)
- `feat(UI): Add new feature.` (subject should not end with a period)

---

## Commitlint Configuration
The frontend project uses [Commitlint](https://commitlint.js.org/) to enforce commit message rules. Below is the configuration:

```cjs
// filepath: commitlint.config.cjs
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "refactor",
        "test",
        "revert",
        "hotfix",
        "BREAKING CHANGE",
      ],
    ],
    "type-empty": [2, "never"],
    "scope-case": [2, "always", "upper-case"],
    "scope-empty": [2, "never"],
    "subject-case": [2, "always", "lower-case"],
  },
};
```

---

## Additional Notes
- Use meaningful commit messages to describe the changes clearly.
- Squash commits when merging pull requests to keep the history clean.
- For large changes, break them into smaller commits with clear messages.

For further assistance, contact the frontend development team.