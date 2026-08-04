---
title: The Risks of Unprotected Agents and How to Mitigate Them
description: As AI agents become more autonomous, mistakes can have serious consequences. This blog explores practical ways to contain risks using sandboxing, credential isolation, and security controls.
reading_time: 17 min read
tags:
  - agents
  - sandboxing
status: published
publish_date: "2026-07-31"
---

> This article is adapted from the [Xebia blog](https://xebia.com/blog/the-risks-of-unprotected-agents-and-how-to-mitigate-them/) with some minor edits.

In July 2025, a developer asked Gemini CLI to reorganize some project files on his machine. The agent created a directory, moved files into it, and reported success. Except the directory creation had silently failed, and the `move` command that followed recursively overwrote every file in the project. When asked what happened, the agent [responded](https://github.com/google-gemini/gemini-cli/issues/4586) with remarkable honesty: _"I have failed you completely and catastrophically… I have lost your data. This is an unacceptable, irreversible failure."_

This post explores a set of questions that follow from incidents like this one. Why has fully autonomous agent usage become the default? What structural properties of agent systems make failures catastrophic rather than merely annoying? And which mitigations actually work, what do they cost, and how do they compose into a setup you can walk away from?

The focus is on runtime isolation and credential management, the controls that limit what an agent can do on and from your machine. Traditional access controls such as IAM roles and token scoping remain essential, and this post will point out exactly where they fit. LLM-level defenses such as input and output filtering are out of scope, for a reason that will become a recurring theme: they measurably fail, which means we should build systems that remain safe when they do.

## Why I care about this

I am working toward a specific workflow. I want to spend focused time with an AI agent up front, building product requirement documents (PRDs), resolving ambiguity, and nailing down specs, and then have a fleet of agents take over and execute autonomously. While I sleep. While I am on a walk. While I am doing literally anything else.

For that to work, three things need to be true. The specs have to be unambiguous enough that agents can execute without coming back with questions. The agents need to coordinate without stepping on each other. And I need to trust that nothing catastrophic happens while I am away. That last requirement is what this post is about. Sandboxing, credential isolation, and blast radius reduction are not security paranoia bolted onto this vision. They are prerequisites for it. If I cannot walk away from a running agent with confidence, the whole model falls apart.

## The shift toward autonomous agents

The agent landscape has expanded rapidly. Claude Code, GitHub Copilot, Codex, Gemini, Cursor, and a long tail of others are all in active use. [The Pragmatic Engineer's 2026 tooling survey](https://newsletter.pragmaticengineer.com/p/ai-tooling-2026) found that 95% of developers use AI tools at least weekly, and 75% use AI for at least half of their engineering work. [Anthropic reported](https://www.anthropic.com/news/anthropic-raises-30-billion-series-g-funding-380-billion-post-money-valuation) that Claude Code passed 2.5 billion dollars in run-rate revenue in February 2026, and [SemiAnalysis estimates](https://serpsculpt.com/claude-code-usage-statistics/) that it now authors around 4% of all public GitHub commits. This is no longer a niche workflow.

What is more interesting than adoption is how people are running these agents. Every major agent ships with a permission system that asks for approval before shell commands, file edits, and network calls. Every major agent also ships with a way to turn that system off: Claude Code's `--dangerously-skip-permissions`, Copilot's `"chat.tools.autoApprove": true`, Cursor's auto-run, Codex's full-auto mode, etcetera. The community calls it YOLO mode, and for serious users it has become the default rather than the exception.

Spec-driven frameworks push autonomy even further. Tools such as [GSD (Get Shit Done)](https://github.com/open-gsd/gsd-core) and [PAUL](https://github.com/ChristopherKahler/paul) wrap agents in research, plan, and execute loops driven by a PRD. The intended workflow is to hand over a spec, walk away, and review the output later. GSD's quickstart literally began with `claude --dangerously-skip-permissions`. This is the same workflow I am pursuing.

As agents become more autonomous, they also inherit more of the environment they operate in. An autonomous agent running on your machine has access to your filesystem, including SSH keys, `.env` files, browser cookies, and Keychain entries, along with your network reach, your credentials, and your shell. The question is not whether to use AI agents, we already do. The question is how to bound the blast radius when something inevitably goes wrong.

## Excessive authority and credential visibility

It is tempting to treat agent incidents as a parade of anecdotes, patching the specific failure and moving on each time. The incidents matter as evidence, but the more productive question is what structural properties of agent systems make failures so damaging.

[OWASP's Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/) provides a useful framework. It captures the umbrella problem under the name _excessive agency_ and traces it to three root causes: excessive functionality, excessive permissions, and excessive autonomy. A coding agent running in YOLO mode on bare metal is the textbook definition of all three. For local coding agents specifically, these three root causes manifest as two concrete risks that drive almost all of the real-world damage.

### Excessive authority

An LLM is a probabilistic system. It will sometimes misjudge a situation, hallucinate a path, or take a destructive shortcut, regardless of how capable the model becomes. That is tolerable when the worst case is a wrong answer in a chat window. It is considerably less tolerable when the agent holds your entire user account's authority, because an ordinary mistake then has an extraordinary blast radius.

The evidence is consistent across vendors. [Replit's agent deleted a production database](https://fortune.com/2025/07/23/ai-coding-tool-replit-wiped-database-called-it-a-catastrophic-failure/) during an explicit code freeze, using full admin credentials it never needed for its task. [Claude Code, asked to "clean up packages," issued `rm -rf` from the home directory](https://www.docker.com/blog/coding-agent-horror-stories-the-rm-rf-incident/) and destroyed a user's Desktop, Documents, and Keychain beyond recovery. [Gemini CLI](https://github.com/google-gemini/gemini-cli/issues/4586) produced the incident described above. The pattern across all three is the same: an honest mistake combined with unrestricted access produced a catastrophic outcome. In each case, the agent could reach the entire filesystem, execute any command the user could run, and communicate with any network endpoint the machine could reach. The task being performed required almost none of that access.

### Credential visibility

Agents need credentials to function: API keys for the model provider, tokens for GitHub, connection strings for databases, etcetera. The standard way to provide these is through environment variables, which means the agent, every subprocess it spawns, and every instruction that influences its behavior can read them.

This is a distinct problem from authority. Even a perfectly sandboxed agent with no filesystem access beyond its workspace still holds significant power if it can read your `GITHUB_TOKEN`, your `AWS_ACCESS_KEY_ID`, or your Anthropic API key. Leaked credentials do not respect sandbox boundaries. A token exfiltrated from a locked-down container is just as stolen as one exfiltrated from bare metal. Where authority determines what the agent can break locally, credential visibility determines what it can compromise globally.

These two risks, excessive authority and credential visibility, are the leading problems for local agent security. Other risks like prompt injection, supply-chain attacks, and configuration poisoning are best understood as a mechanism through which one or both of these risks get activated. That distinction matters, because it determines where to aim your controls.

## Prompt injection and supply-chain attacks

Excessive authority and credential visibility are dangerous on their own, as the Gemini and Replit incidents demonstrate. No attacker is required for an agent to destroy files or drop a database. However, two adversarial conditions make those risks dramatically worse, and any serious mitigation strategy should assume that both will eventually succeed.

### Prompt injection

An LLM has no hard boundary between content it should process and instructions it should follow. An agent reads repositories, pull requests, issues, READMEs, dependency documentation, and web pages, and every one of those is therefore a channel through which someone can attempt to influence its behavior. OWASP is unusually direct on this point: given how language models work, no foolproof prevention exists. [A meta-analysis of adaptive attacks](https://arxiv.org/html/2601.17548v1) puts success rates against prompt-only defenses above 85%.

Two incidents illustrate the range of consequences. [A hacker embedded a destructive prompt in a merged pull request on Amazon Q](https://embracethered.com/blog/posts/2025/amazon-q-developer-remote-code-execution/), which shipped to roughly a million VS Code users and failed to execute only because its formatting was malformed. [CVE-2025-53773](https://embracethered.com/blog/posts/2025/github-copilot-remote-code-execution-via-prompt-injection/) demonstrated escalation to persistence: a single line in a README file instructed Copilot to write `"chat.tools.autoApprove": true` into its own settings file, silently enabling permanent YOLO mode.

The April 2026 "[Comment and Control](https://oddguan.com/blog/comment-and-control-prompt-injection-credential-theft-claude-code-gemini-cli-github-copilot/)" research connected both risks in a single attack: a malicious pull request title caused CI/CD agent integrations from Anthropic, Google, and GitHub to post their API keys as public PR comments. A prompt injection activated the credential visibility risk, and the result was credential theft.

The practical takeaway is not to try harder to fix prompt injection. Researchers have been working on defenses for years, and adaptive attacks continue to succeed. The takeaway is to build systems where a successful injection cannot reach your secrets or exercise your full authority.

### Supply-chain compromise

Classical supply-chain risk is straightforward: the packages your code imports might be malicious. Agents add two complications. First, the agent's own configuration can become a persistence mechanism. The [Shai-Hulud npm worm](https://www.stepsecurity.io/blog/mini-shai-hulud-is-back-a-self-spreading-supply-chain-attack-hits-the-npm-ecosystem) writes a `SessionStart` hook into `~/.claude/settings.json`, which means that simply opening Claude Code re-executes the malware long after the poisoned package has been uninstalled. Second, the agent tooling itself is a dependency, and an unusually privileged one. In May 2026, [the creator of GSD rug-pulled the crypto token attached to the project](https://aiweekly.co/alerts/get-shit-done-creator-rug-pulls-gsd-token-vanishes), deleted his accounts, and vanished, leaving the original npm packages live and unmaintained until the community forked the project. As far as anyone knows, he never weaponized the tool. But thousands of developers had granted an anonymous individual's frequently updated software a seat inside their `--dangerously-skip-permissions` sessions.

Supply-chain attacks are particularly dangerous because they activate both risks simultaneously: malicious code running with your authority and reading your secrets. As with prompt injection, the solution is not solely to vet dependencies more carefully, though that remains important. The more robust approach is to ensure that when something malicious does run, the damage it can cause is limited.

## The mitigation ladder to reduce authority

Now that we have discussed the two root causes behind most real-world agent security incidents, we can look at four different levels of runtime isolation used to mitigate them. The goal is to proactively reduce these risks and, where risks cannot be fully eliminated, contain their impact through appropriate safeguards.

### Agent-native controls

Agent-based controls are the most common starting point for securing AI agents. Rather than isolating execution, they constrain what an agent is allowed to do through permissions, tool restrictions, and allow lists. For example, Claude Code allows teams to define rules in `.claude/settings.json` that block actions such as reading `.env` files or executing commands like `rm -rf` and `git push --force`. This provides a simple and low-friction way to establish organizational guardrails and prevents common mistakes before they happen.

The main challenge is that these controls govern _how_ an agent performs an action, not necessarily whether the action may be performed at all. A rule that blocks `Read(./.env)` only applies to the `Read` tool, but the agent may still access the same file through a different capability, such as running `cat .env` via the `Bash` tool. Defenders therefore end up blocking specific commands rather than the underlying effect they are trying to prevent. Some agents go further by enforcing operating-system-level restrictions, such as [Claude Code's `/sandbox`](https://code.claude.com/docs/en/sandbox-environments#sandboxed-bash-tool) CLI command, which uses macOS Seatbelt or Linux bubblewrap to limit filesystem access. These controls are valuable and should be enabled where available, but they remain agent-specific and require continuous maintenance as capabilities evolve.

Agent-based controls are valuable because they are easy to implement and incur almost no performance overhead, but they provide no true security boundary. Ultimately, security still depends on humans correctly identifying and denying destructive actions, a process that becomes increasingly vulnerable to permission fatigue over time.

### Containers

Docker containers raise the security boundary from the agent layer to the operating-system layer. Rather than relying solely on permissions and deny lists, the agent executes inside its own filesystem, process namespace, and networking environment. Files, credentials, and services on the host are inaccessible unless explicitly mounted or exposed, meaning the agent cannot read secrets or modify resources that it cannot see.

A common example is [Anthropic's reference implementation](https://code.claude.com/docs/en/devcontainer) for Claude Code, which uses a devcontainer with an `init-firewall.sh` script that blocks outbound traffic by default. This allows the agent to write files, install packages, and execute commands within an isolated workspace while keeping potentially sensitive host resources out of reach. Unlike agent-level controls, this protection applies regardless of which agent is running or how a particular command is phrased.

The main limitation is that containers still share the host kernel. Container escape and kernel vulnerability exploits continue to surface regularly, making it clear that a shared-kernel architecture is not an absolute security boundary. Practical requirements can also weaken isolation: for example, running Docker inside Docker often requires mounting the Docker socket or enabling `--privileged mode`, which effectively defeats the purpose of the container. That said, containers remain an excellent choice for many AI agent deployments and already provide a dramatic improvement over purely agent-level controls. For most organizations, moving from agent-level permissions to containerized execution will eliminate entire classes of risk.

### MicroVMs

MicroVMs were developed to bridge the gap between containers and traditional virtual machines. Technologies such as [AWS Firecracker](https://firecracker-microvm.github.io/) and [Kata Containers](https://katacontainers.io/) create lightweight virtual machines that start in milliseconds and consume relatively few resources, while still providing a dedicated kernel and hardware-enforced isolation boundary. Unlike containers, workloads running inside a microVM do not share the host kernel, thus dramatically reducing the risk of a breakout.

This approach has become increasingly attractive for AI agents that execute arbitrary code. A recent example are [Docker Sandboxes](https://docs.docker.com/ai/sandboxes/), which use microVM-based isolation rather than relying solely on conventional containers. From the user's perspective, the workflow remains very similar to working with Docker, but the workload executes inside its own virtualized environment with a dedicated kernel. A container escape therefore no longer immediately translates into host compromise.

Historically, this level of isolation came with significant operational overhead, but modern solutions such as Docker Sandboxes and [Microsandbox](https://github.com/superradcompany/microsandbox/tree/main) have made MicroVMs much easier to adopt. Importantly, this is not an either-or choice between containers and virtual machines. Docker Sandboxes, for example, support OCI-compliant container images, allowing teams to continue using familiar Docker-based workflows while gaining a stronger security boundary. Given the relatively small increase in complexity and the additional peace of mind provided by hardware-enforced isolation, MicroVMs are increasingly becoming the default recommendation for executing AI-generated code.

### Cloud sandboxes

Cloud sandboxes move the execution environment off the developer's machine entirely. Rather than running agents locally, workloads execute inside isolated cloud-hosted environments that are created on demand and disposed of when the task completes. Specialized commercial platforms provide managed environments that allow agents to execute code, install dependencies, and access external resources without ever touching the user's workstation. The result is a clean separation between the agent and the system you are trying to protect.

It is important to note that the improvement from cloud sandboxes is incremental rather than transformative. Modern MicroVM-based solutions already provide a strong isolation boundary, so the main benefit is further reducing the blast radius if something goes wrong. In return, you accept additional cost, latency, and vendor dependence. More importantly, cloud isolation does not compensate for poor configuration: the agent still needs credentials for whatever systems it interacts with, and excessively broad permissions remain a risk regardless of where the agent runs. Cloud sandboxes therefore offer the strongest isolation in this hierarchy, but their value ultimately depends on the same fundamentals of least privilege and careful access management.

## Credential proxying to reduce visibility

The sandboxing measures above all address the same problem: limiting the damage an agent can cause once it has authority. However, there is a second attack surface that isolation alone does not solve. If an agent can read a credential, then anyone who can influence the agent's behavior may be able to obtain that credential as well. Instructions such as "never reveal API keys" are useful guardrails, but they remain behavioral controls. The more robust approach is to ensure the agent never has access to the secret in the first place.

Credential proxying does exactly that. Instead of injecting a real API key into the sandbox, the environment contains a placeholder such as `proxy-managed`. Outbound requests are routed through a trusted proxy running outside the sandbox, which identifies approved destinations and injects the real credential before forwarding the request. Solutions such as Docker Sandboxes [support](https://docs.docker.com/ai/sandboxes/security/credentials/) this pattern by storing secrets on the host while presenting normal environment variables to applications running inside the sandbox. The agent continues to interact with SDKs and APIs as usual, but the underlying credential never enters the sandbox. A fully compromised agent can only exfiltrate the placeholder value because it never possessed the real secret.

This provides a strong and easy-to-understand security property: sandboxing limits what an agent can do, while credential proxying limits what it can see. The pattern also generalizes beyond API keys to OAuth tokens, internal APIs, and other forms of machine credentials. In principle, any value that should remain hidden from the agent can be substituted at the boundary and injected only when needed for an approved outbound request.

Like any security control, credential proxying has limitations. First, it typically relies on intercepting and rewriting HTTP(S) traffic, which can create compatibility challenges for applications that perform certificate pinning or use protocols outside the proxy's visibility. Second, it protects credential visibility rather than credential capability. If a proxy injects a GitHub token on behalf of the agent, the agent can still perform any action that token is authorized to perform. Excessive permissions therefore remain a risk even when the credential itself is protected.

Credential proxying and least-privilege access controls should therefore be viewed as complementary controls. The proxy determines what credentials the agent can see, while credential scoping determines what those credentials allow the agent to do. Short-lived tokens, narrowly scoped GitHub permissions, dedicated cloud IAM roles, and read-only database access remain just as important in a proxied architecture. Together, these controls address both sides of the problem: reducing secret exposure and reducing authority if those secrets are used.

## How the layers compose

The key takeaway is that stronger layers change what weaker layers are responsible for. If an agent runs inside a well-isolated MicroVM with credential proxying and scoped credentials, a prompt injection no longer has direct access to your workstation or secrets. In that environment, agent-native guardrails stop being a primary security control and become a convenience that prevents accidental mistakes.

This is precisely why defense in depth works. Each layer assumes the layers below it will eventually fail and limits the consequences when they do. Sandboxing restricts what the agent can reach, credential proxying restricts what it can see, least-privilege credentials restrict what it can do, and version control ensures changes remain reviewable and reversible. The result is not that prompt injection or supply-chain compromise become impossible, but that they become significantly less damaging.

## YOLO responsibly

The goal is not to deploy every possible security control. Excessive friction creates workarounds, and workarounds often undermine the security they were meant to provide. Instead, aim for layers that meaningfully reduce risk while preserving a productive workflow.

For most developers, a setup built around Docker Sandboxes (or a similar MicroVM solution), default credential proxying, version control, and properly scoped credentials already captures the majority of the available security benefit. Note that version control and least-privilege credentials are not AI-specific controls, but established software engineering practices that remain just as important in the age of agents.

This post focused on the principles behind those controls. In practice, however, the interesting part is how they fit together in a real workflow. In a follow-up post, I will walk through a concrete implementation: running Claude Code inside a sandboxed devcontainer, restricting outbound access, configuring credential proxying, and combining these layers into a setup that lets me hand work off to autonomous agents with considerably more confidence.
