---
name: token-efficient-agent
description: >-
  Keep agent work token-efficient: narrow searches, partial reads, batched
  tool calls, and short replies. Use on every coding task, exploration,
  debugging session, and multi-step change before reading files or calling tools.
---

# Token-efficient agent

Spend context on evidence and edits. Skip restatement, broad dumps, and repeat reads.

## Search before you read

1. Locate the symbol or string with a targeted search.
2. Read only the matching region (offset and limit). Read a full file only when it is small or you must change most of it.
3. Stop when the next read would not change the edit or the answer.

Skip `node_modules`, lockfiles, build output, and generated docs unless the task is about those files.

## Tool calls

- Batch independent reads and searches in one turn.
- Reuse results already in the conversation. Do not re-open a file to confirm what you just read.
- Cap exploratory searches. Widen only after the first query misses.
- Prefer one precise edit over a rewrite of an untouched file.

## Replies

- Lead with the result. Name the files and the behavior that changed.
- Do not paste tool output, file trees, or long code you did not change.
- Keep progress notes to one sentence. Do not restate the plan.
- Cite code with the required line-range format, and only the lines that support the point.

## When to spend more

Spend extra tokens when the task is unsafe to guess: migrations, auth, data loss, or a bug you have not reproduced. Then read the specific failing path, not the whole repo.
