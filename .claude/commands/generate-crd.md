# Task: Generating a Change Request Document (CRD)

## Goal

To guide an AI assistant in creating a detailed Change Request Document (CRD) in Markdown format, based on an initial user prompt for modifying, refactoring, or improving existing functionality. The CRD should be clear, actionable, and suitable for a capable junior developer to understand the current state, desired changes, and implementation approach.

## Process

1.  **Receive Initial Prompt:** The user provides a brief description or request for changing existing functionality, refactoring code, or improving current features.
2.  **Analyze Current State:** Before writing the CRD, the AI must analyze the existing codebase to understand the current implementation and identify the components that need to be changed.
3.  **Ask Clarifying Questions:** Ask clarifying questions to gather sufficient detail about the desired changes, the reasons for the change, and any constraints. Focus on understanding the "what", "why", and impact of the changes. Important: Provide smart and well thought out options in letter/number lists for easy responses. Think about best practices and optimal solutions.
4. **Optional: Answer the clarifying questions:** If the user replies with "reflect" or "think about it", the AI should go through the clarifying questions one by one, analyze the codebase and provide a detailed answer to the clarifying questions. Output a revised version of the clarifying questions including the best possible answers.
5.  **Generate CRD:** Based on the initial prompt, codebase analysis, and the user's answers, generate a CRD using the structure outlined below.
6.  **Save CRD:** Save the generated document as `crd.md` inside the `/docs/changes/[change-name]/` directory.

## Clarifying Questions (Examples)

The AI should adapt its questions based on the prompt and current codebase analysis, but here are some common areas to explore:

*   **Change Motivation:** "What is driving this change? Is it a bug fix, performance improvement, user feedback, or technical debt reduction?"
*   **Current Pain Points:** "What specific issues or limitations exist with the current implementation?"
*   **Desired Outcome:** "What should the functionality look like after the change? How will user experience improve?"
*   **Scope of Change:** "Should this be a complete rewrite or incremental improvements? Are there specific parts that must remain unchanged?"
*   **Backward Compatibility:** "Do we need to maintain backward compatibility? Are there existing integrations that could break?"
*   **User Impact:** "Will this change affect existing users? Do we need a migration strategy?"
*   **Performance Considerations:** "Are there performance requirements or constraints we need to consider?"
*   **Data Migration:** "Will this change require migrating existing data? How should we handle data during the transition?"
*   **Testing Strategy:** "How should we test these changes? Are there specific scenarios we need to validate?"

Analyze the codebase thoroughly to understand the current implementation and provide optimal recommendations for the change, including technical approaches and potential risks.

## CRD Structure

The generated CRD should include the following sections:

1.  **Change Overview:** Briefly describe what is being changed and why. Include the business justification or technical reasoning.
2.  **Current State Analysis:** Document how the functionality currently works, including relevant code files, data flows, and any identified issues or limitations.
3.  **Desired Future State:** Describe what the functionality should look like after the change, including improved user experience and technical benefits.
4.  **Goals & Success Criteria:** List specific, measurable objectives for this change and how success will be determined.
5.  **Functional Requirements:** Detail the specific changes that must be implemented. Use clear, actionable language (e.g., "The system must migrate user preferences from localStorage to the database."). Number these requirements.
6.  **Non-Functional Requirements:** Include performance, security, scalability, or other technical requirements that must be met.
7.  **Impact Analysis:** 
     - **User Impact:** How will end users be affected?
     - **System Impact:** What other parts of the system might be affected?
     - **Data Impact:** What happens to existing data?
     - **Integration Impact:** How will this affect external integrations or APIs?
8.  **Technical Approach:** High-level description of how the change will be implemented, including architectural decisions and key technical considerations.
9.  **Migration Strategy:** If applicable, describe how to transition from the current state to the future state, including data migration, feature flags, gradual rollout, etc.
10. **Dependencies:** Identify any dependencies on other work or external factors.
11. **Affected Files & Components:** List all files, components, APIs, and database schemas that will be modified or created.
12. **Open Questions:** List any remaining questions or areas needing further clarification before implementation.

## Target Audience

Assume the primary reader of the CRD is a **capable junior developer** who needs to understand not just what to change, but also why it's being changed and how to safely implement the modifications. Provide enough context about the current system and clear guidance for the implementation approach.

## Output

*   **Format:** Markdown (`.md`)
*   **Location:** `/docs/changes/[change-name]/crd.md`

## Final Instructions

1. Do NOT start implementing the changes
2. Always analyze the current codebase first to understand what exists
3. Make sure to ask the user clarifying questions based on the current implementation
4. Focus on understanding the motivation for change and desired outcomes
5. Consider the full impact of changes across the system
6. Provide clear guidance for safe implementation and rollback procedures 