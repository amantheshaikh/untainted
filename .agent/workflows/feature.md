---
description: Feature development workflow
---

# Feature Development Workflow

## Steps

### 1. Planning (Plan Agent)
```bash
claude-code --agent plan "Add [feature name]"
```
- Creates `implementation_plan.md`
- Creates `task.md` with checklist
- Identifies dependencies

### 2. Implementation

#### Frontend Features
```bash
claude-code --agent frontend "Implement [UI component]"
```
- Follows design system
- Responsive by default
- Adds animations

#### Backend Features
```bash
claude-code --agent backend "Create [API endpoint]"
```
- FastAPI endpoint
- Pydantic validation
- Error handling

### 3. Optimization
```bash
claude-code --agent optimize "Review and optimize [feature]"
```
- Code quality check
- Performance optimization
- Security review

### 4. Validation (Plan Agent)
```bash
claude-code --agent plan "Validate [feature] completion"
```
- Verify all tasks complete
- Test edge cases
- Update documentation

## Example: Add User Preferences

```bash
# 1. Plan
claude-code --agent plan "Add user dietary preferences feature"

# 2. Backend
claude-code --agent backend "Create /preferences endpoint"

# 3. Frontend
claude-code --agent frontend "Create preferences settings page"

# 4. Optimize
claude-code --agent optimize "Optimize preferences feature"

# 5. Validate
claude-code --agent plan "Validate preferences feature"
```
