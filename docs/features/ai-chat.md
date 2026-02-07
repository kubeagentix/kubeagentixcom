---
sidebar_position: 1
---

# AI Chat

KubeAgentics features an AI-powered chat interface that helps you understand, troubleshoot, and manage your Kubernetes clusters.

## Overview

The AI Chat provides natural language interaction with your cluster:

- **Ask questions** about cluster state and resources
- **Get explanations** of Kubernetes concepts
- **Troubleshoot issues** with AI-guided assistance
- **Generate commands** for common operations

## Supported AI Providers

Configure your preferred LLM provider in Settings > AI Configuration:

| Provider | Models | Features |
|----------|--------|----------|
| Google (Gemini) | gemini-2.5-flash, gemini-1.5-pro | Recommended, tool support |
| OpenAI | gpt-4o, gpt-4o-mini | Tool support |
| Anthropic | claude-3-5-sonnet | Tool support |
| Ollama | Any local model | Privacy, offline use |
| OpenRouter | Various | Model flexibility |

## Getting Started

1. Navigate to **Settings > AI Configuration**
2. Select your provider
3. Enter your API key
4. Choose a model
5. Click **Save & Connect**

## Chat Modes

### General Chat
Ask anything about Kubernetes:
- "What is a StatefulSet?"
- "How do I scale a deployment?"
- "Explain this error message"

### Resource Context
Select a resource in the sidebar to ask contextual questions:
- "Why is this pod failing?"
- "What's the resource usage of this deployment?"
- "Show me the recent events for this service"

### RCA Mode
Investigate issues with guided root cause analysis:
- AI examines logs, events, and metrics
- Provides structured analysis
- Suggests remediation steps

## Tips

- Be specific about namespaces and resource names
- Include error messages in your questions
- Use the context panel to provide additional information
