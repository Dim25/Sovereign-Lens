export interface OptionSpaceRun {
  model: string
  provider: string
  generatedAt: string
  thesis: string
  capability: string
  dependency: string
  optionality: string
  counterargument: string
  missingEvidence: string[]
  falsifier: string
  status: 'complete' | 'pending'
}

export const optionSpaceRuns: OptionSpaceRun[] = [
  {
    model: 'Codex · local session', provider: 'Host analysis', generatedAt: '2026-08-23T02:47:00Z', status: 'complete',
    thesis: 'The relevant competition is not supplier influence alone, but whether the receiving state retains the practical ability to combine, evaluate, replace, and govern its technical stacks.',
    capability: 'Multi-alignment expands access to compute, training, standards, finance, and institutional relationships.',
    dependency: 'Dependencies become dangerous when control rights, maintenance, financing, or evaluation remain externally concentrated.',
    optionality: 'Real optionality requires tested substitution—not merely several announced partnerships.',
    counterargument: 'A deliberately diversified portfolio may distribute dependence and raise the cost of coercion by any single supplier.',
    missingEvidence: ['Exit and migration rights', 'Workload-level vendor concentration', 'Independent evaluation capacity', 'Observed migration cost'],
    falsifier: 'A state demonstrates repeatable migration of a critical workload between stacks without material loss of service, control, or affordability.',
  },
  {
    model: 'qwen3.8-max', provider: 'Alibaba Cloud Model Studio · Singapore', generatedAt: '2026-08-23T02:45:45Z', status: 'complete',
    thesis: 'Receiving states may achieve near-term AI capability gains while accumulating structural switching costs that erode long-term optionality.',
    capability: 'Multi-source engagement can expand access to models, training data, compute, and institutional knowledge.',
    dependency: 'Heterogeneous stacks can create integration lock-in, format fragmentation, and competing governance obligations.',
    optionality: 'Nominal optionality may be illusory when migration, retraining, regulatory re-alignment, and political costs exceed the cost of staying.',
    counterargument: 'Multi-alignment is rational hedging: no single provider dominates, so coercive leverage is distributed.',
    missingEvidence: ['Observed provider migrations', 'Capability ceilings versus single alignment', 'Open-source substitution effects', 'Institutional interoperability capacity'],
    falsifier: 'A receiving state migrates core AI infrastructure between stacks at acceptable cost within a politically relevant timeframe.',
  },
  {
    model: 'glm-5.2', provider: 'Alibaba Cloud Model Studio · Singapore', generatedAt: '2026-08-23T02:46:06Z', status: 'complete',
    thesis: 'Multi-alignment expands capability breadth while accumulating switching costs that can constrain future optionality.',
    capability: 'Breadth gains are plausible, but depth depends on absorption capacity and whether systems complement or fragment scarce talent.',
    dependency: 'Each alignment creates path dependencies in infrastructure, pipelines, data formats, compliance, and training.',
    optionality: 'Short-term choice is preserved, but technical debt and interoperability friction can compound over time.',
    counterargument: 'Multi-alignment may produce shallow competence across many systems rather than deep capability in any one.',
    missingEvidence: ['Procurement by stack', 'Measured switching cost', 'Interoperability assessment', 'Comparable capability-depth outcomes'],
    falsifier: 'Capability fails to increase, or observed behavior shows the state cannot meaningfully switch despite nominal multi-alignment.',
  },
  {
    model: 'deepseek-v4-pro', provider: 'Alibaba Cloud Model Studio · Singapore', generatedAt: '2026-08-23T02:46:29Z', status: 'complete',
    thesis: 'Diverse external and domestic systems can expand AI capability while raising switching costs for the receiving state.',
    capability: 'Diverse models, hardware, methods, and governance frameworks can create cross-pollination and redundancy.',
    dependency: 'Proprietary tools, data formats, and institutional relationships can deepen ecosystem-specific lock-in.',
    optionality: 'Multiple sources create initial choice, but rising migration costs can make future pivots expensive.',
    counterargument: 'Fragmentation, duplicated infrastructure, and incompatible standards may constrain net capability gains.',
    missingEvidence: ['Financial and operational switching cost', 'Attributed capability gains', 'Comparable multi-alignment cases', 'Cross-stack interoperability'],
    falsifier: 'A state migrates between ecosystems without significant cost or capability loss, or single-source reliance yields superior capability.',
  },
  {
    model: 'claude-fable-5', provider: 'Anthropic · first-party', generatedAt: '2026-08-23T02:58:32Z', status: 'complete',
    thesis: 'Externally supplied infrastructure, standards, training, institutions, and governance vocabulary can trade near-term capability for long-term optionality; multi-alignment matters only when its layers remain genuinely substitutable.',
    capability: 'Observe new usable compute, deployed services, locally trained engineers and regulators, and institutions able to execute policy—not announcements alone.',
    dependency: 'Track hardware, cloud, maintenance, standards, personnel pipelines, institutional templates, and governance vocabulary as separate lock-in channels.',
    optionality: 'Parallel commitments must be interoperable and load-bearing. Infer option space from revealed substitution, not stated diversification policy.',
    counterargument: 'AI may be more fluid than railway or telecom infrastructure: APIs, open weights, containers, and transferable skills could make several layers near-commodity.',
    missingEvidence: ['Observed stack-switching cost and duration', 'Primary procurement and contract terms', 'Cross-stack personnel portability', 'Governance language changing concrete decisions'],
    falsifier: 'Deep single-stack adopters switch quickly and cheaply, while multi-aligned states show no greater procurement, regulatory, or model-substitution flexibility.',
  },
]
