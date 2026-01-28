# Claude Code Agents

Specialized agents for efficient development with minimal token usage.

## Available Agents

### 🎯 Plan Agent
Strategic planning and architecture design.
```bash
claude-code --agent plan "Add user authentication"
```

### 🎨 Frontend Agent
UI/UX development following design system.
```bash
claude-code --agent frontend "Create nutrition display component"
```

### ⚙️ Backend Agent
API and core logic development.
```bash
claude-code --agent backend "Create /preferences endpoint"
```

### 🚀 Optimize Agent
Performance, SEO, and deployment optimization.
```bash
claude-code --agent optimize "Reduce bundle size"
```

## Quick Start

1. **Feature Development**
   ```bash
   # Plan → Implement → Optimize → Validate
   claude-code --agent plan "Add [feature]"
   claude-code --agent [frontend|backend] "Implement [feature]"
   claude-code --agent optimize "Optimize [feature]"
   ```

2. **Bug Fixes**
   ```bash
   # Analyze → Fix → Validate
   claude-code --agent plan "Analyze [bug]"
   claude-code --agent [frontend|backend] "Fix [bug]"
   ```

3. **Optimization**
   ```bash
   claude-code --agent optimize "Full optimization pass"
   ```

## Workflows

See `.agent/workflows/` for detailed workflows:
- `feature.md` - Feature development
- `bugfix.md` - Bug fixing
- `deploy.md` - Deployment process

## Agent Configurations

Agent configurations are in `.agent/agents/`:
- `plan.md` - Planning guidelines
- `frontend.md` - Design system & patterns
- `backend.md` - API patterns & algorithms
- `optimize.md` - Optimization checklists
