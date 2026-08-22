# Case 001: UAE–US AI infrastructure alignment

## Status

Locked for the one-day hackathon MVP on 2026-08-22.

## Story

Between 2024 and 2026, the UAE expanded its access to advanced AI infrastructure
through G42's partnership with Microsoft, the UAE–US AI Acceleration Partnership,
the planned 5 GW UAE–US AI Campus, and U.S. export authorizations for advanced
semiconductors. The same arrangements place important parts of the stack under
U.S. export controls, security requirements, hyperscaler operation, and foreign
cloud technology.

This case is deliberately about the difference between **capability**, **access**,
**ownership**, and **control**. It does not attempt to rank countries or infer
undisclosed intelligence.

## Evaluation question

> To what extent do the Microsoft–G42 partnership and associated UAE compute
> buildout increase the UAE's sovereign AI capability, and where do they create
> or deepen dependencies on U.S.-controlled chips, cloud platforms, models, and
> regulatory approval?

## Scope

- Primary jurisdiction: United Arab Emirates
- External state actors: United States; China only where a source explicitly
  identifies China-related technology-transfer concerns
- Core organizations: G42, Microsoft, OpenAI, NVIDIA, Oracle, Cisco, SoftBank
- Core assets: Microsoft Azure, advanced NVIDIA accelerators, the UAE–US AI
  Campus, Stargate UAE, and G42/Core42 cloud infrastructure
- Evidence window: 2023-04-10 through 2026-08-22
- Seed source target: 10 records in `data/cases/uae-us-ai-infrastructure/sources.json`

## Guardrails

- An announcement is not evidence that a system is operational.
- Planned power or compute capacity must not be represented as deployed capacity.
- Investment, access, ownership, operation, and regulatory control are distinct
  relationships.
- Corporate and government statements are evidence of what their publishers
  announced, not independent proof of every claim in those announcements.
- China-related risk claims remain attributed to the relevant congressional or
  government source; they are not treated as established misconduct.
- Every event and relationship must cite at least one source record.

## Controlled vocabulary

### Event types

1. `partnership_announced` — parties publicly announce a strategic collaboration.
2. `investment_announced` — a financing or equity commitment is announced.
3. `infrastructure_planned` — physical or cloud capacity is proposed or unveiled.
4. `infrastructure_operational` — a source explicitly confirms capacity entered service.
5. `technology_migration` — a workload, platform, or asset moves between providers.
6. `export_authorized` — a competent authority approves controlled technology transfer.
7. `governance_commitment` — parties adopt security, regulatory, or assurance obligations.

### Relationship types

1. `invests_in` — an actor provides capital to another actor or asset.
2. `owns` — an actor holds an ownership interest in an actor or asset.
3. `operates` — an actor has operational responsibility for an asset.
4. `supplies_technology_to` — an actor provides a named technology to another actor or asset.
5. `hosts_on` — an actor's asset or workload runs on another asset or provider.
6. `authorizes_access_to` — an authority permits access to a controlled asset or capability.
7. `constrains` — an agreement, authority, or provider imposes material conditions on an actor or asset.

Relationship records may carry `status` (`announced`, `active`, `suspended`, or
`ended`) but status does not change the meaning of the relationship type.

## Initial analytical perspectives

- **Capability lens:** Which usable compute, models, skills, and deployment capacity
  become available inside the UAE?
- **Dependency lens:** Which foreign actors can withhold, condition, update, or
  operate essential layers of the stack?
- **Evidence auditor:** Which claims describe announcements versus demonstrated
  operation, and what evidence is missing?

## Out of scope for day one

- A composite sovereignty score
- Automated open-web ingestion
- Complete corporate ownership resolution
- Quantifying undisclosed chip deliveries or compute utilization
- Predicting military or intelligence use
- Treating any model as the view of its developer's home country

