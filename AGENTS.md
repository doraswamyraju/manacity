# AI Agent Guidelines for `manacity`

This repository uses the `codebase-memory` MCP server as the primary tool for codebase navigation, symbol discovery, and relationship understanding. AI coding agents working in this repository must adhere to the following guidelines prior to reading large blocks of files or making code changes.

---

## 1. Codebase Memory MCP as Primary Understanding Tool

Always prefer `codebase-memory` over broad filesystem searches or speculative scans when orienting yourself within this codebase.

### A. Index Status & Freshness
Before relying on the knowledge graph:
- Call `index_status` (with `project="D-manacity"` or the appropriate project identifier / path) to verify that the repository is indexed and reports status `ready`.
- Check whether recent file changes require re-indexing via `detect_changes` or `check_index_coverage`.
- If the repository is not indexed or changes have invalidated the index, execute `index_repository` (e.g. `mode="full"`).
- Always verify that indexing finished successfully before proceeding with graph exploration.

### B. Symbol Discovery & Relationship Mapping
- **Locate symbols**: Use `search_graph` to locate relevant functions, classes, interfaces, endpoints, or data models across backend, web, and mobile modules.
- **Trace relationships & flows**: Use `trace_path` to map call graphs and dependencies between components, and `query_graph` to understand connections, callers, callees, and imports.
- **Architecture context**: Use `get_architecture` to understand module boundaries and top-level architecture when working across components.

### C. Targeted Inspection
- Use `get_file_outline` to review the structural overview of a file without reading whole source files unnecessarily.
- Use `get_code_snippet` to retrieve and inspect only the relevant implementations, definitions, or targeted blocks identified from graph queries.

---

## 2. Fallback to Direct File Reading & Accuracy Standards

- **Incomplete Graph Results**: If graph queries are incomplete, ambiguities arise, or exact formatting/context is required to implement changes, read the specific target files directly using standard file reading tools.
- **Clear Attribution**: Clearly distinguish findings derived directly from the `codebase-memory` knowledge graph from findings obtained through direct file reading.
- **Truthful Tool Usage**: Never claim a `codebase-memory` MCP tool was used unless it was genuinely invoked during the session.

---

## 3. Safe Modification & Execution Rules

- **Preserve Existing Conventions**: Match the existing architecture, code conventions, formatting, naming styles, and patterns found in the respective directory (`backend`, `web`, `android`, etc.).
- **Minimal, Focused Changes**: Limit edits strictly to the task requirements. Avoid refactoring unrelated code or introducing unnecessary diffs.
- **Data & Secret Protection**:
  - Never overwrite, truncate, or reset existing data stores, local databases, migrations, or database contents.
  - Never modify, commit, or overwrite environment files (`.env`, `.env.local`), API keys, keystores, or secrets.
- **Post-Modification Verification**: Run the relevant tests, typechecks, or linters (e.g., project unit tests, `npm run build`, `tsc`, `gradle test`) to verify changes after making code modifications.

