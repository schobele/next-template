# Task: Commit changes to the repository

## Goal

Commit source changes based on a user-provided description. The resulting commit message must be clear, actionable, and aligned (loosely) with the Conventional Commits specification.

## Process

1. **Initial Prompt**  
   The user provides a concise description of the changes.

2. **Context Analysis**  
   Analyze the current diff and recent Git history to understand the purpose and impact of the changes.

3. **Message Options**  
   Generate three commit message suggestions:
   1) `feature(<component>): <description>`  
   2) ...
   3) ...

   Message should not include claude code contribution.
   Provide the three options in a numbered list. Only include the title i.e. first line of the commit message. Do include the body only after the user has selected the option.

4. **User Selection**  
   The user selects one of the message options. If `--extended` is included, append a longer commit body explaining the reasoning and implications of the change.

5. **Commit Execution**  
   Commit using the selected message format.