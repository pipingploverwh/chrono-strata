# Security Policy

## Overview

This repository and its associated infrastructure are protected using **modern defensive security controls**, including **continuous monitoring, anomaly detection, and deception-based systems (honeypots)** designed to identify, analyze, and mitigate malicious activity.

All security measures are **strictly defensive**, passive in nature, and compliant with applicable laws and regulations.

---

## Supported Versions

We provide security updates for the following versions:

| Version                         | Supported      |
| ------------------------------- | -------------- |
| main / latest                   | ✅              |
| previous minor releases         | ⚠️ Best effort |
| archived or deprecated versions | ❌              |

If you are unsure whether a version is supported, assume **only the latest version** is in scope.

---

## Security Monitoring & Deception Notice

> **⚠️ Important Notice**

This project and its related services may include **decoy systems, credentials, APIs, services, and endpoints** that are intentionally deployed for **defensive security research and threat detection**.

### What this means:

* Any interaction with these systems is **logged and analyzed**
* Activity may be retained for **threat intelligence and defensive research**
* These systems are **isolated** and contain **no production data**
* No counter-offensive or retaliatory actions are taken

### What this does NOT mean:

* No personal profiling
* No tracking beyond technical indicators
* No exploitation of interacting systems
* No law-enforcement action unless legally required

By interacting with this infrastructure, you acknowledge that **you may be engaging with monitored environments**.

---

## Reporting a Vulnerability

We welcome responsible disclosure from security researchers.

### Please report vulnerabilities via:

* **Email:** `security@[your-domain].ai`
* **Subject:** `Responsible Disclosure – Security Issue`

### Include the following:

* Clear description of the vulnerability
* Affected component(s)
* Reproduction steps (if applicable)
* Impact assessment
* Any supporting logs or screenshots

---

## Disclosure Guidelines

To protect users and infrastructure, we ask that you:

* ❌ Do **not** publicly disclose vulnerabilities before coordination
* ❌ Do **not** access data beyond what is strictly necessary to demonstrate impact
* ❌ Do **not** attempt lateral movement or privilege escalation
* ❌ Do **not** interact with decoy systems beyond proof-of-concept

Violations may invalidate responsible disclosure protections.

---

## Response Timeline

We aim to follow this response cadence:

| Stage                  | Target Time          |
| ---------------------- | -------------------- |
| Initial acknowledgment | 48 hours             |
| Triage & validation    | 3–7 business days    |
| Fix or mitigation      | As severity dictates |
| Coordinated disclosure | Mutual agreement     |

---

## Scope Clarification

### In Scope

* This repository
* Public APIs and endpoints
* CI/CD pipelines
* Infrastructure-as-code artifacts

### Out of Scope

* Denial of Service (DoS/DDoS)
* Social engineering
* Physical security
* Third-party services not controlled by us

---

## Safe Harbor

We support **good-faith security research** conducted under this policy.

If you:

* Act in good faith
* Avoid privacy violations
* Follow this policy

We will **not pursue legal action** against you for your research.

---

## Contact

For all security matters:

* **Email:** `security@[your-domain].ai`

Thank you for helping keep this project and its users safe.

— Security Team
