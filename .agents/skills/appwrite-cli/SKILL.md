---
name: appwrite-cli
description: Agent Skills for Appwrite. Helps AI coding agents work with Appwrite services including Authentication, Databases/TablesDB, Storage, Functions, and more across multiple languages.
source:
  - https://github.com/appwrite/agent-skills
  - https://github.com/appwrite/sdk-for-cli
---

# Appwrite Agent Skills

Agent Skills to help developers using AI coding agents with Appwrite. These skills follow the [Agent Skills Open Standard](https://agentskills.io/home).

## Installation

```bash
npx skills add appwrite/agent-skills
```

This installs the packaged `appwrite-*` skills into your local skills directory.

## Available Language Skills

| Skill | Language |
|-------|----------|
| `appwrite-typescript` | TypeScript / Node.js |
| `appwrite-dart` | Dart / Flutter |
| `appwrite-kotlin` | Kotlin / Android |
| `appwrite-swift` | Swift / iOS |
| `appwrite-php` | PHP |
| `appwrite-python` | Python |
| `appwrite-ruby` | Ruby |
| `appwrite-go` | Go |
| `appwrite-dotnet` | .NET / C# |

## Usage

Skills are automatically available once installed. The agent will use them when relevant tasks are detected.

## Prompt Examples

### TypeScript (server-side)
```
Use the appwrite-typescript skill. Create a Node.js script that uses Users service
to create a user, then adds an initial profile row in TablesDB. Use env vars for
endpoint, project ID, and API key. Include error handling and a small retry for
transient failures.
```

### TypeScript (web client)
```
Use the appwrite-typescript skill. Build a browser login flow with Account service:
- email/password signup
- email/password session login
- fetch current user
- logout current session
Return production-ready TypeScript code.
```

### Python
```
Use the appwrite-python skill. Write a script that uploads a local file to Storage,
then prints the file ID and a preview URL. Use InputFile.from_path and catch
Appwrite exceptions.
```

### Kotlin (Android)
```
Use the appwrite-kotlin skill. Generate Android repository code to paginate rows
using cursor queries and expose a suspend function API. Keep UI concerns out of
the data layer.
```

---

## Appwrite CLI Reference

### Installation

```bash
npm install -g appwrite-cli
```

### Authentication

```bash
# Login
appwrite login

# Logout
appwrite logout

# Check current session
appwrite client --debug
```

### Project Setup

```bash
# Initialize project
appwrite init project

# Initialize collection
appwrite init collection

# Initialize function
appwrite init function
```

### Databases

```bash
# List databases
appwrite databases list

# Create database
appwrite databases create --database-id <id> --name <name>

# Create collection
appwrite databases createCollection --database-id <db> --collection-id <id> --name <name>

# List documents
appwrite databases listDocuments --database-id <db> --collection-id <col>

# Create document
appwrite databases createDocument --database-id <db> --collection-id <col> --document-id unique() --data '{"key":"value"}'

# Delete document
appwrite databases deleteDocument --database-id <db> --collection-id <col> --document-id <id>
```

### Storage

```bash
# List buckets
appwrite storage listBuckets

# Create bucket
appwrite storage createBucket --bucket-id <id> --name <name>

# Upload file
appwrite storage createFile --bucket-id <id> --file-id unique() --file <path>

# List files
appwrite storage listFiles --bucket-id <id>

# Download file
appwrite storage getFileDownload --bucket-id <id> --file-id <fid>
```

### Functions

```bash
# List functions
appwrite functions list

# Create function
appwrite functions create --function-id <id> --name <name> --runtime node-18.0

# Deploy function
appwrite functions createDeployment --function-id <id> --code <path> --activate true

# Execute function
appwrite functions createExecution --function-id <id>
```

### Users

```bash
# List users
appwrite users list

# Create user
appwrite users create --user-id unique() --email <email> --password <pass> --name <name>

# Delete user
appwrite users delete --user-id <id>
```

### Deploy

```bash
# Deploy everything
appwrite deploy

# Deploy specific resource
appwrite deploy --all
appwrite deploy --function
appwrite deploy --collection
```

## Tips
- Use `appwrite init` to interactively set up your project
- Use `unique()` for auto-generated IDs
- Set environment variables: `APPWRITE_ENDPOINT`, `APPWRITE_PROJECT_ID`, `APPWRITE_API_KEY`
- Use the Appwrite Console at `https://cloud.appwrite.io` for visual management
