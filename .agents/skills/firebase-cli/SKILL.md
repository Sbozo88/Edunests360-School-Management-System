---
name: firebase-cli
description: Agent Skills for Firebase. Helps AI coding agents understand and work with Firebase services including Authentication, Firestore, Realtime Database, Cloud Functions, Hosting, Storage, and more.
source: https://github.com/firebase/agent-skills
---

# Firebase Agent Skills

A collection of skills for AI coding agents to help them understand and work with Firebase more effectively. Skills are packaged instructions and scripts that extend agent capabilities, following the [Agent Skills](https://agentskills.io/home) format.

## Installation

### Option 1: Agent Skills CLI

```bash
npx skills add firebase/agent-skills
```

### Option 2: Gemini CLI Extension

```bash
gemini extensions install https://github.com/firebase/agent-skills
```

### Option 3: Claude Plugin

```bash
# Add the Firebase marketplace
claude plugin marketplace add firebase/agent-skills

# Install the plugin
claude plugin install firebase@firebase

# Verify
claude plugin marketplace list
```

### Option 4: Manual Set Up

```bash
git clone https://github.com/firebase/agent-skills.git
```

Copy the contents of the `skills` directory to the appropriate location for your AI tool.

## Firebase CLI Quick Reference

### Authentication

```bash
# Login
firebase login

# Login in CI environments
firebase login:ci

# Check current user
firebase login:list

# Logout
firebase logout
```

### Project Management

```bash
# List projects
firebase projects:list

# Use a project
firebase use <project-id>

# Create alias
firebase use --add

# Initialize Firebase in directory
firebase init
```

### Firestore

```bash
# Deploy rules
firebase deploy --only firestore:rules

# Deploy indexes
firebase deploy --only firestore:indexes

# Export data
firebase firestore:export gs://bucket-name

# Import data
firebase firestore:import gs://bucket-name/export-prefix
```

### Hosting

```bash
# Deploy hosting
firebase deploy --only hosting

# Preview channel
firebase hosting:channel:deploy preview-channel

# List channels
firebase hosting:channel:list
```

### Cloud Functions

```bash
# Deploy functions
firebase deploy --only functions

# Deploy specific function
firebase deploy --only functions:functionName

# View logs
firebase functions:log
```

### Realtime Database

```bash
# Deploy rules
firebase deploy --only database

# Get data
firebase database:get /path

# Set data
firebase database:set /path data.json

# Push data
firebase database:push /path data.json

# Remove data
firebase database:remove /path
```

### Storage

```bash
# Deploy rules
firebase deploy --only storage
```

### Emulators

```bash
# Start all emulators
firebase emulators:start

# Start specific emulators
firebase emulators:start --only auth,firestore,functions

# Export emulator data
firebase emulators:export ./export-directory

# Import emulator data
firebase emulators:start --import ./export-directory
```

### Deploy Everything

```bash
# Deploy all services
firebase deploy

# Deploy specific services
firebase deploy --only hosting,functions

# Deploy with message
firebase deploy -m "Deploy message"
```

### Extensions

```bash
# List installed extensions
firebase ext:list

# Install extension
firebase ext:install <publisher/extension-id>

# Update extension
firebase ext:update <instance-id>
```

## Tips
- Use `firebase init` to set up a new project interactively
- Use `firebase emulators:start` for local development
- Use `firebase deploy --only <service>` for targeted deployments
- Set up `.firebaserc` for project aliases
- Use `firebase.json` for project configuration
