---
description: Bug fixing workflow
---

# Bug Fix Workflow

## Steps

### 1. Analysis (Plan Agent)
```bash
claude-code --agent plan "Analyze bug: [description]"
```
- Identify root cause
- Determine affected components
- Create fix plan

### 2. Fix Implementation

#### Frontend Bug
```bash
claude-code --agent frontend "Fix [bug description]"
```

#### Backend Bug
```bash
claude-code --agent backend "Fix [bug description]"
```

### 3. Validation (Optimize Agent)
```bash
claude-code --agent optimize "Verify bug fix has no regressions"
```
- Test edge cases
- Check performance impact
- Ensure no new issues

## Example: Fix Barcode Scanner

```bash
# 1. Analyze
claude-code --agent plan "Analyze barcode scanner not detecting on mobile"

# 2. Fix
claude-code --agent frontend "Fix mobile barcode detection"

# 3. Validate
claude-code --agent optimize "Test barcode scanner on all devices"
```

## Quick Fixes

For simple bugs, skip planning:

```bash
# Direct fix
claude-code --agent [frontend|backend] "Fix [simple bug]"
```
