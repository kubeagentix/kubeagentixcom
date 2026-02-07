---
sidebar_position: 2
---

# Issue Tracking Integration

Connect KubeAgentics to your issue tracking system to create and manage tickets for Kubernetes incidents, RCA reports, and operational tasks.

## Supported Providers

| Provider | Authentication | Features |
|----------|---------------|----------|
| GitHub Issues | Personal Access Token | Create issues, add comments, sync labels |
| Jira | API Token + Email | Create issues, transitions, custom fields |
| GitLab | Personal Access Token | Create issues, labels, assignees |
| Linear | API Key | Create issues, team assignment |
| Azure DevOps | Personal Access Token | Work items, boards integration |

## Setting Up GitHub Issues

GitHub Issues is the recommended starting point for most users. Your GitHub Personal Access Token provides access to all repositories you have access to.

### Step 1: Generate a Personal Access Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click **Generate new token (classic)**
3. Give it a descriptive name like "KubeAgentics"
4. Select the following scopes:
   - `repo` - Full control of private repositories
5. Click **Generate token**
6. Copy the token immediately (you won't see it again)

### Step 2: Configure in KubeAgentics

1. Open KubeAgentics and navigate to **Settings**
2. Click the **Issue Tracking** tab
3. Click **Add Backend**
4. Select **GitHub Issues** as the provider
5. Enter a name (e.g., "My GitHub")
6. The URL defaults to `https://api.github.com` (keep this for github.com)
7. Select **API Key** for authentication
8. Paste your Personal Access Token
9. Click **Test Connection** to verify
10. Click **Add** to save

### Step 3: Using GitHub Issues

Once configured, you can:
- Create issues from RCA reports
- Link Kubernetes resources to GitHub issues
- Add comments with cluster context

#### Example: Creating an Issue from RCA

After running an RCA on a failing pod:
1. Click "Create Issue" in the RCA panel
2. Select your GitHub backend
3. Choose the repository (owner/repo format)
4. Review the auto-generated title and description
5. Click Create

## Setting Up Jira

For enterprise users, Jira provides robust issue tracking with advanced workflows.

### Step 1: Generate an API Token

1. Go to [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click **Create API token**
3. Give it a label like "KubeAgentics"
4. Copy the token

### Step 2: Configure in KubeAgentics

1. Navigate to **Settings > Issue Tracking**
2. Click **Add Backend**
3. Select **Jira** as the provider
4. Enter your Jira instance URL (e.g., `https://your-company.atlassian.net`)
5. Select **Basic Auth** for authentication
6. Enter your email as the username
7. Paste your API token as the password
8. Click **Test Connection** to verify
9. Click **Add** to save

## Credential Security

Your credentials are stored securely in your system's native keychain:

| Platform | Storage Location |
|----------|-----------------|
| macOS | Keychain Access |
| Windows | Windows Credential Manager |
| Linux | Secret Service API |

Credentials are:
- Encrypted at rest using system-level encryption
- Never stored in plain text
- Never transmitted except to the configured API endpoint
- Accessible only by KubeAgentics

## Troubleshooting

### Connection Test Fails

1. **Check the URL** - Ensure the URL is correct and includes `https://`
2. **Verify the token** - Regenerate the token if unsure
3. **Check network** - Ensure KubeAgentics can reach the API endpoint
4. **Review scopes** - Ensure your token has the required permissions

### Rate Limiting

If you hit rate limits:
- GitHub: 5,000 requests/hour with authentication
- Jira: Depends on your plan

Consider reducing the sync interval in settings if you experience issues.

### Token Expired

Tokens may expire based on your organization's security policies. Generate a new token and update the configuration:
1. Go to Settings > Issue Tracking
2. Click Edit on the backend
3. Enter the new token
4. Save

## API Reference

For advanced users, KubeAgentics uses these APIs:

- **GitHub**: [GitHub REST API v3](https://docs.github.com/en/rest/issues)
- **Jira**: [Jira REST API v3](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)
- **GitLab**: [GitLab REST API](https://docs.gitlab.com/ee/api/issues.html)
