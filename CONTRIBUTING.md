# Contributing to Urlaubsplanner

Thank you for your interest in contributing to the Mitarbeiter-Urlaubsverwaltung project! 🎉

## Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/urlaubsplaner.git
   cd urlaubsplaner
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Guidelines

### Code Style

#### Java/Spring Boot
- Follow standard Java naming conventions
- Use meaningful variable and method names
- Add JavaDoc comments for public methods
- Keep methods small and focused (Single Responsibility Principle)
- Use Lombok annotations to reduce boilerplate

#### React/TypeScript
- Use functional components with hooks
- Follow React best practices
- Use TypeScript strict mode
- Keep components small and reusable
- Use meaningful prop names

### Commit Messages

Follow conventional commits:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

Example:
```
feat: add email notification for approved requests
fix: resolve vacation days calculation bug
docs: update API documentation
```

## Pull Request Process

1. **Update documentation** if needed
2. **Add/update tests** for your changes
3. **Ensure all tests pass**
   ```bash
   # Backend
   cd backend && mvn test
   
   # Frontend
   cd frontend && npm test
   ```

4. **Update the README.md** with details of changes if applicable
5. **Submit your pull request** with a clear description

## Reporting Issues

When reporting issues, please include:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Your environment (OS, Java version, Node version)

## Feature Requests

We welcome feature requests! Please:
- Check if the feature already exists or is planned
- Provide a clear use case
- Explain why it would be valuable

## Questions?

Feel free to open an issue for any questions or clarifications.

Thank you for contributing! 🙏
