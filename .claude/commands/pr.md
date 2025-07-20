# Task: Open a Pull Request (PR) for review

## Goal

Create a Pull Request that clearly communicates the purpose, scope, and implications of a set of code changes. The PR should be informative, structured, and actionable—optimizing for fast, high-quality reviews and alignment.

## Process

1. **Receive Initial Prompt**  
   The user provides a short description of what the PR does and why it matters.

2. **Analyze Diff & History**  
   Inspect the changeset and recent commits to extract relevant technical details, context, and intent.

3. **Generate PR Title Options**  
   Suggest three concise PR titles:  
   1) `feat: <summary>`  
   2) ...
   3) ...
   (Select based on nature of the work. All titles must be imperative and scoped.)

4. **Generate PR Description**  
   Provide a markdown-formatted PR body suggestion that is easy to read and understand. It should be structured and include the what, why, how and any additional information that is highly relevant (optional), e.g. breaking changes, etc.

5. **User Review & Edit**  
   User can edit title or description, or approve directly.

6. **Create Pull Request**  
   Push PR to remote with selected title and description.