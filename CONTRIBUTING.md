# 🤝 Contributing to AidChain

Thank you for your interest in contributing to AidChain! This document provides guidelines for contributing to the project, especially in the context of the **Hedera Africa Hackathon**.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

---

## 🤗 Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Keep discussions professional and on-topic

---

## 🚀 Getting Started

1. **Read the Documentation**
   - [`README.md`](./README.md) - Project overview
   - [`SETUP.md`](./SETUP.md) - Setup instructions
   - [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) - Architecture and best practices

2. **Set Up Your Development Environment**
   ```bash
   git clone https://github.com/Housseeeem/AidChain.git
   cd AidChain
   # Follow SETUP.md instructions
   ```

3. **Create a Branch**
   ```bash
   git checkout -b feat/your-feature-name
   ```

---

## 🔄 Development Workflow

### Branch Naming Convention

Use descriptive branch names with prefixes:

- `feat/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/update-description` - Documentation updates
- `refactor/component-name` - Code refactoring
- `test/test-description` - Adding tests
- `chore/task-description` - Maintenance tasks

**Examples:**
```bash
feat/file-encryption
fix/jwt-token-expiration
docs/api-endpoint-documentation
refactor/user-controller
test/authentication-flow
chore/update-dependencies
```

### Development Process

1. **Pull Latest Changes**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feat/your-feature
   ```

3. **Make Changes**
   - Write code following our standards (see below)
   - Test your changes locally
   - Update documentation if needed

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add file encryption feature"
   ```

5. **Push to Repository**
   ```bash
   git push origin feat/your-feature
   ```

6. **Create Pull Request**
   - Go to GitHub repository
   - Click "New Pull Request"
   - Fill in the PR template (see below)

---

## 📝 Coding Standards

### Backend (Express.js/Node.js)

#### File Structure
```javascript
// controllers/exampleController.js

const { Model } = require('../collections/Model');

/**
 * Description of what this controller does
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const exampleController = async (req, res) => {
  try {
    const { requiredParam } = req.body;
    
    // Input validation
    if (!requiredParam) {
      return res.status(400).json({ 
        error: 'Missing required parameter: requiredParam' 
      });
    }
    
    // Business logic
    const result = await Model.findOne({ field: requiredParam });
    
    if (!result) {
      return res.status(404).json({ 
        error: 'Resource not found' 
      });
    }
    
    // Success response
    return res.status(200).json({ 
      data: result,
      message: 'Success'
    });
    
  } catch (error) {
    console.error('Error in exampleController:', error);
    return res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};

module.exports = { exampleController };
```

#### Best Practices
- ✅ Always use `async/await` (no callbacks)
- ✅ Use try-catch for error handling
- ✅ Return appropriate HTTP status codes
- ✅ Validate all user inputs
- ✅ Use descriptive variable names
- ✅ Add JSDoc comments for functions
- ❌ Never log sensitive data (passwords, tokens)
- ❌ Never use `var` (use `const` or `let`)

### Frontend (Next.js/React)

#### Component Structure
```javascript
"use client";

import { useState, useEffect } from 'react';
import API from '@/utils/api';

/**
 * ExampleComponent - Description of what this component does
 */
export default function ExampleComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await API.get('/endpoint');
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Component content */}
    </div>
  );
}
```

#### Best Practices
- ✅ Use `"use client"` for client components
- ✅ Handle loading and error states
- ✅ Use Tailwind CSS for styling
- ✅ Use the centralized `API` instance
- ✅ Store JWT in localStorage
- ✅ Add prop types documentation
- ❌ Don't use inline styles
- ❌ Don't make direct fetch calls (use API instance)

---

## 📦 Commit Guidelines

### Commit Message Format

```
<type>: <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat: add file encryption before storage

fix: resolve JWT token expiration handling

docs: update API endpoint documentation

refactor: simplify blockchain integration logic

test: add unit tests for user controller

chore: update dependencies to latest versions
```

### Commit Message Best Practices

- ✅ Use present tense ("add" not "added")
- ✅ Use imperative mood ("move" not "moves")
- ✅ Capitalize first letter
- ✅ No period at the end
- ✅ Keep first line under 50 characters
- ✅ Reference issues if applicable: `fix: resolve #123`

---

## 🔀 Pull Request Process

### Before Creating a PR

1. **Test Your Changes**
   - Test backend endpoints with Postman/Thunder Client
   - Test frontend UI flows manually
   - Check for console errors

2. **Review Your Code**
   - Remove console.logs and debugging code
   - Check for commented-out code
   - Ensure code follows standards

3. **Update Documentation**
   - Update README if needed
   - Update API documentation in copilot-instructions.md
   - Add JSDoc comments

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Other (describe)

## Changes Made
- Specific change 1
- Specific change 2
- Specific change 3

## Testing Done
- [ ] Tested locally
- [ ] All existing features still work
- [ ] New feature works as expected

## Related Issues
Closes #123

## Screenshots (if applicable)
[Add screenshots]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-reviewed the code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
```

### Review Process

1. At least one maintainer must approve
2. All discussions must be resolved
3. All checks must pass (if CI/CD is set up)
4. No merge conflicts

---

## 🧪 Testing Guidelines

### Manual Testing Checklist

Before submitting a PR, test:

#### Backend
- [ ] API endpoint returns correct status codes
- [ ] Request validation works
- [ ] Error handling works properly
- [ ] MongoDB operations succeed
- [ ] JWT authentication works

#### Frontend
- [ ] UI renders correctly
- [ ] Forms submit successfully
- [ ] Error messages display properly
- [ ] Loading states work
- [ ] Navigation works
- [ ] Token persistence works

### Future Automated Testing

When setting up tests:

**Backend (Jest + Supertest):**
```javascript
describe('POST /users/register', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/users/register')
      .send({ username: 'testuser', password: 'password123' });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message');
  });
});
```

**Frontend (React Testing Library):**
```javascript
describe('LoginPage', () => {
  it('should render login form', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });
});
```

---

## 📚 Documentation

### What to Document

1. **New Features**
   - Add to README if user-facing
   - Add to copilot-instructions.md if developer-facing
   - Update API documentation

2. **Breaking Changes**
   - Clearly document in PR
   - Update migration guide
   - Notify team members

3. **Configuration Changes**
   - Update `.env.example`
   - Update SETUP.md
   - Document in PR description

### Documentation Style

- Use clear, concise language
- Include code examples
- Add diagrams for complex flows
- Keep it up-to-date

---

## 🏆 Hackathon-Specific Guidelines

### Time Management

- Focus on core features first
- Document as you go
- Keep commits small and frequent
- Test incrementally

### Priority Features

1. **MVP Core**: User auth, file upload, basic storage
2. **Blockchain**: Hedera HCS integration for file hashes
3. **AI**: Basic anonymization (even if mocked)
4. **Polish**: UI/UX improvements, error handling

### Submission Checklist

Before hackathon deadline:

- [ ] All core features working
- [ ] README is complete and clear
- [ ] `.env.example` files are up-to-date
- [ ] Code is clean and commented
- [ ] Demo video/screenshots ready
- [ ] Hedera integration documented
- [ ] Public GitHub repo accessible

---

## 🆘 Getting Help

- **Slack/Discord**: Ask team members
- **GitHub Issues**: Create an issue for bugs
- **Documentation**: Check `.github/copilot-instructions.md`
- **Hedera Support**: [Hedera Discord](https://hedera.com/discord)

---

## 🎉 Thank You!

Your contributions make AidChain better! 🚀

Remember: Quality over quantity. Write clean, maintainable code that you'd be proud to show.

Happy coding! 💻
