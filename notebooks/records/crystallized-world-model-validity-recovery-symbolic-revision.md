<!-- Generated from the preservation audit. Do not treat recorded outputs as rerun validation of the cleaned source. -->

# Audit: `Untitled18.ipynb`

## Notebook metadata

- Source: `the preserved source archive (`Untitled18.ipynb`)`; source was inspected read-only. [notebook]
- Format: nbformat 4.0; 8 cells: 7 large code cells and one empty code cell. [notebook metadata; cells 0–7]
- Kernel: Python 3. Colab metadata requests a GPU and records `gpuType: T4`; no package lockfile or version manifest is embedded. [notebook metadata]
- Recorded neural runs used CUDA, Tesla T4 (14.6 GiB), PyTorch `2.11.0+cu128`, AMP enabled, and full (not fast-dev) settings. [cells 0–3 outputs]
- The notebook is a chronological experiment series, not a conventional narrative notebook. Every substantive cell is a standalone program that retrains or simulates from scratch and writes to a hard-coded `/content/...` directory. [cells 0–6]
- Proposed descriptive title: **Crystallized World Models: Prospective Validity, Homeostatic Recovery, and MDL-Gated Symbolic Revision**. Proposed slug: `crystallized-world-model-validity-recovery-symbolic-revision`. [inferred synthesis from cells 0–6]

## Ordered experiment inventory

1. **Crystallized world model, original planning task**: extract a 65-state finite machine from a recurrent neural model; compare long rollouts, position-reaching plans, and online change detection. [cell 0]
2. **Crystallized world model, corrected exact-horizon planning task**: repeats experiment 1 but replaces easy shortest-path/position planning with exact terminal-state arrival at a sampled horizon. [cell 1]
3. **Prospective validity V2**: predict entry into a visible wind zone omitted from the symbolic abstraction; compare observation/action ablations, negative control, lead time, and validity-aware plan selection. [cell 2]
4. **Homeostatic symbolic recovery V3**: distinguish state error, transient validity error, and permanent regime error; test re-grounding, fallback/re-entry hysteresis, escalation, and equal-budget active versus passive table repair. [cell 3]
5. **Runtime refinement V4**: compare naive exception-state growth with re-grounding plus MDL-gated adoption under transient shocks and a mixed transient/permanent regime. [cell 4]
6. **Calibrated compression gate V5**: sweep 81 gate configurations over four stress profiles and transient/permanent conditions; select a gate by preregistered feasibility and tie-break rules. [cell 5]
7. **MDL-gated symbolic rule invention V6 (Option 2)**: synthesize dynamics from a typed grammar under the V5-frozen gate; compare frozen, lookup, passive synthesis, and active synthesis; audit two out-of-grammar laws. The recorded scientific computation completed, but its execution stopped during CSV export. The stored source contains a later ordered-union schema fix that was not rerun in the archived output. [cell 6]
8. Empty trailing cell. [cell 7]

## Shared environment and methods

- All environments use deterministic, quantized 1-D mechanics with 13 positions, velocities clipped to `[-2,2]`, 3 actions corresponding to acceleration `{-1,0,+1}`, hence 65 symbolic states and 195 state-action transitions. [cells 0–6]
- Neural observations are 16×16 rendered channels with nuisance/distractor information; the supplied symbolic state is `(position, velocity)`. The neural studies explicitly do **not** discover the abstraction or ontology. [cells 0–3]
- Cells 0–3 train recurrent world models from synthetically generated trajectories, query the trained network over supplied state/action labels and nuisance renderings, and evaluate the resulting deterministic transition table against the simulator. [cells 0–3]
- Cells 4–6 are deterministic finite-machine simulations with no neural training. [cells 4–6]
- Seeds are set for Python and NumPy everywhere and additionally for PyTorch/CUDA in neural cells. However, neural cells enable cuDNN benchmarking, TF32, and mixed precision, so bitwise determinism is not guaranteed despite fixed seeds. [cells 0–3]

## Experiment 1 — original crystallization protocol

### Question and boundary

- Explicit question: can a finite transition system queried from a learned recurrent model retain accurate long-horizon dynamics/planning after free-running neural drift, and can neural/machine disagreement detect an unmodeled dynamics change? [cell 0]
- Explicit boundary: positive control for crystallization; symbolic state and actions are supervised; the simulator is used for generation/evaluation only. [cell 0]

### Exact configuration and methods

- Seed 1729; observation distractor probability 0.10 and amplitude 1.0; hidden size 128; action embedding 24; sequence length 14; 1,800 AdamW steps; batch 768; learning rate 0.002; weight decay 0.0001; gradient clip 1.0; initial-state loss weight 0.35. [cell 0]
- Extraction uses 96 nuisance variants/state-action. Rollout batch 2,048 at horizons `1,2,4,8,16,32,64,128`. Planning uses 160 cases, max depth 28, neural beam width 128. Validity evaluation uses 2,048 trajectories, horizon 28, nominal fraction 0.5, threshold at nominal 0.99 quantile, encode chunk 8,192. [cell 0]
- Machine planning is shortest-path BFS to any state at the target **position**; neural planning is beam search and succeeds if it reaches that position at any depth. Both are open-loop. [cell 0]
- Hidden validity change is persistent wind `-1` or `+1`; metrics include neural/machine disagreement-based domain-exit and counterexample scores, AUROC/AUPRC, nominal FPR, event detection, within-one-step detection, and latency. [cell 0]

### Results

- Model size 191,657 parameters; training took 24.7 s. Training improved from loss 5.6389, initial-state accuracy 1.4%, terminal-step accuracy 2.7% at step 1 to loss 0.0026 and both accuracies 100% at step 1,800. A temporary degradation occurred around steps 630–720 (terminal accuracy 98.7–99.3%) before recovery. [cell 0 output]
- Extracted table: 65 states, 3 actions, 195 transitions; held-out simulator transition accuracy 100%; mean/min confidence 0.9968/0.9833; minimum nuisance stability 1.0. [cell 0 output]
- Neural versus machine state accuracy by horizon: 1–32, `100/100%`; 64, `99.90/100%`; 128, `99.61/100%`. Neural/machine position MAE: 0 through 32; at 64, `0.001/0`; at 128, `0.010/0`. First strict machine crossover: 64. [cell 0 output]
- Planning success was 100% for both machine BFS and neural beam, median plan length 3.0 for both. [cell 0 output]
- Validity monitor: domain-exit AUROC 0.803, AUPRC 0.789, nominal FPR 1.00%; counterexample AUROC/AUPRC 1.000/1.000; event detection 99.32%, 85.74% within one step, median latency 0.0. [cell 0 output]

### Interpretation

- Explicitly supported: supplied-state crystallization is exact here and avoids small long-horizon neural drift. [cell 0]
- Inferred caution: the 100%/100% planning comparison is non-discriminating because the task accepts reaching a target position at any depth and median plans are only 3 steps; cell 1 appears to correct this weakness. [cells 0–1]

## Experiment 2 — corrected exact-horizon planning

### Protocol change

- All full-run parameters remain those of cell 0. Fast-dev settings become environment-overridable for steps, batch, and planning-case count. [cell 1]
- The planner now receives a guaranteed-reachable exact terminal symbolic state generated by a discarded witness trajectory, must arrive at exactly a sampled horizon from `max(4, max_depth/2)` through 28, and the machine searches a time-expanded graph; neural beam distance includes position plus `0.5 × velocity difference`. [cell 1]

### Results

- Model size 191,657; training 25.7 s; final step-1,800 loss 0.0025 and initial/terminal accuracies 100%. There was a transient training regression around steps 810–945 (loss 0.0414–0.0672–0.0545 and terminal accuracy 98.7–99.7%). [cell 1 output]
- Extracted transition accuracy 100%; confidence mean/min 0.9966/0.9843; nuisance stability 1.0. [cell 1 output]
- Neural/machine state accuracy: 100% for horizons 1–32; at 64, `99.95/100%`; at 128, `99.90/100%`. Position MAE at 64 and 128 was 0.001 for neural and 0 for machine. First strict crossover: 64. [cell 1 output]
- Exact-horizon planning: machine graph search 100% success, median plan length 22; neural beam 26.25% success, median successful length 21; median required horizon 22. [cell 1 output]
- Validity: domain-exit AUROC 0.816, AUPRC 0.796, nominal FPR 1%; counterexample AUROC/AUPRC 1.0/1.0; event detection 99.32%, within-one-step 85.74%, median latency 0.0. [cell 1 output]

### Interpretation

- Explicit result: the finite machine retains exact planning while finite-width neural beam search fails most long exact-arrival tasks despite near-perfect random-rollout accuracy. [cell 1]
- Inferred: cell 1 supersedes cell 0 for planning claims; cell 0 is still valid evidence for the earlier, easier task and for rollout/validity replication. [cells 0–1]

## Experiment 3 — prospective validity V2

### Hypotheses

- P1 joint observation+action monitoring beats observation-only and action-only exit-within-k prediction; P2 joint monitoring ranks risky plans above paired safe plans; P3 alerts precede exit at a validation-calibrated 5% safe-plan FPR while postdictive disagreement cannot; P4 validity-aware tie-breaking reduces exits; P5 an input-independent hidden switch remains chance. [cell 2]

### Data, configuration, and methods

- Seed 2601. Visible wind zone width 3; training zone starts `(0,1,3,4,6,8,9,10)`, validation `(5,)`, held-out test `(2,7)`; distractor probability 0.08. Wind affects dynamics after zone entry but zone identity is omitted from symbolic `q`. [cell 2]
- World model: hidden 128, action embedding 24, sequence 14, 700 steps, batch 768, LR 0.002, initial loss weight 0.35; extraction 96 nuisance samples. [cell 2]
- Forecast horizon 12; reported k=`1,3,5,8,12`; 48 candidate plans/context. Paired corpora: 20,000/4,000/6,000 pairs, materialized as 40,000/8,000/12,000 plan samples. Independent seeds are used by the generators; paired safe/risky samples share observation/context and differ only in actions. [cell 2]
- Monitor: observation dimension 96, action hidden 64, action embedding 20, batch 768, LR 0.002; joint 1,000 steps, ablations 700, hidden-switch control 700; hidden-control train/test 40,000/12,000; evaluation averages 3 nuisance draws. Planning has 400 paired cases at horizons 8–12. Threshold uses validation safe plans only with target FPR 0.05. [cell 2]
- Metrics: horizon AUROC/AUPRC/Brier, within-pair risky>safe ranking, prospective detection and alert-minus-exit latency, postdictive counterexample latency, safe selection, actual exits, and true goal success. [cell 2]

### Results

- Nominal model 191,945 parameters; final world loss 0.0197 with initial/terminal accuracy 100%; extracted table 100% accurate; confidence mean/min 0.9849/0.9197; nuisance/context stability 1.0. Paired-data generation took 1.2 s. [cell 2 output]
- Joint monitor `(AUROC, AUPRC, Brier)` by k: 1 `(0.998,0.983,0.0038)`; 3 `(0.997,0.985,0.0209)`; 5 `(0.985,0.965,0.0446)`; 8 `(0.958,0.948,0.0797)`; 12 `(0.922,0.937,0.1077)`. [cell 2 output]
- Observation-only: k1 `(0.947,0.281,0.1008)`; k3 `(0.838,0.366,0.2068)`; k5 `(0.705,0.400,0.2396)`; k8 `(0.567,0.446,0.2499)`; k12 `(0.500,0.500,0.2509)`. [cell 2 output]
- Action-only: k1 `(0.487,0.032,0.1779)`; k3 `(0.490,0.139,0.2507)`; k5 `(0.513,0.269,0.2519)`; k8 `(0.563,0.450,0.2492)`; k12 `(0.614,0.602,0.2401)`. [cell 2 output]
- Unobservable-switch negative control: k1 `(0.508,0.042,0.2489)`; k3 `(0.496,0.123,0.2481)`; k5 `(0.491,0.202,0.2459)`; k8 `(0.487,0.326,0.2486)`; k12 `(0.485,0.494,0.2501)`. [cell 2 output]
- Risky>safe pair ranking: joint 92.5% (final print 92.47%), observation-only 50.5% (50.48%), action-only 61.9% (61.94%). [cell 2 output]
- Validation-selected threshold 0.6912 produced held-out safe FPR 5.78%, not exactly the 5% target; prospective detection 74.50%, median latency −5 steps. Manifest counterexamples occurred in 80.05% and postdictive median/min latency was +1/+1. [cell 2 output]
- Planning `(safe selection, exits, goal success)`: random machine tie `(52.50%,47.50%,56.00%)`; observation-only `(48.75%,51.25%,50.25%)`; action-only `(68.50%,31.50%,71.50%)`; joint `(77.75%,22.25%,78.50%)`; oracle `(100%,0%,100%)`. [cell 2 output]

### Interpretation

- P1–P5 are supported by the reported comparisons, with an important caveat: the realized held-out safe FPR is 5.78%, while 5% was a validation target, not a hard test guarantee. [cell 2]
- Negative/null findings retained: observation-only is chance at k=12 and worsens plan selection versus the random tie baseline; the unobservable switch remains at chance as intended. [cell 2]

## Experiment 4 — homeostatic symbolic recovery V3

### Hypotheses and taxonomy

- L1 is one impulse, L2 a force lasting 2–5 transitions, L3 a permanent force; the first disagreement is observationally identical, so escalation is reset → fallback → revision. [cell 3]
- P1 re-grounding improves L1 recovery; P2 balanced fallback/hysteresis handles L2 without revision; P3 operating points trade over/under-response on L3; P4 active distinct probes improve global table accuracy over passive trajectories at equal budget; P5 a neural re-grounding control is required. [cell 3]

### Exact configuration and methods

- Seed 3307; distractor probability 0.10; world hidden 128/action embedding 24/sequence 14; 700 steps, batch 768, LR 0.002, initial loss weight 0.35; extraction 96 nuisance samples. [cell 3]
- Frozen surprise calibration: 64 samples/transition, sigma floor 0.02, z threshold 3.0. Episodes: horizon 48, event time 8–12, 512 episodes/level; L2 duration 2–5. Recovery streak 3, recovery window 20. [cell 3]
- Operating points `(name, fallback_after, revision_evidence, reentry_after, evidence_decay)`: responsive `(2,4.0,2,0.5)`, balanced `(2,6.0,3,0.75)`, conservative `(3,9.0,4,1.0)`. Structural revision: 256 trials, equal budget 32, evaluation trajectory 128. [cell 3]

### Results

- Model 191,657 parameters; final training loss 0.0306, initial/terminal accuracy 100%; transition table 100%; confidence mean/min 0.9760/0.8106; nuisance stability 1.0. Baseline mean NLL 0.00278, mean scale 0.02000, checksum 4.441652. [cell 3 output]
- Recovery `(integrated error, median recovery, recovered)`: L1 machine open `(19.596,20,10.35%)`, machine grounded `(1.000,0,100%)`, neural open `(19.596,19.5,10.16%)`, neural grounded `(1.000,0,100%)`; L2 machine open `(18.902,11,15.43%)`, machine grounded `(2.662,0,100%)`, neural open `(18.910,11,15.62%)`, neural grounded `(2.662,0,100%)`; L3 machine/neural open integrated error 19.584 and grounded 14.201, with recovery undefined/not applicable. [cell 3 output]
- Responsive confusion matrix rows true L1/L2/L3 and columns maximum depth 1/2/3: `[[512,0,0],[90,326,96],[0,2,510]]`; accuracy 87.7604%; bad-plan steps 2.0892; unnecessary fallback 0.3053; false revision L1/L2 9.375%; pre-event revision 0%; L3 revision 99.6094%; median classification latency 1. [cell 3 output]
- Balanced matrix `[[512,0,0],[90,422,0],[0,6,506]]`; accuracy 93.75%; bad steps 2.02995; unnecessary fallback 0.69857; false revision 0%; pre-event revision 0%; L3 revision 98.8281%; latency 1. [cell 3 output]
- Conservative matrix `[[512,0,0],[297,215,0],[0,30,482]]`; accuracy 78.7109%; bad steps 2.70052; unnecessary fallback 0.50391; false revision 0%; pre-event revision 0%; L3 revision 94.1406%; latency 2. [cell 3 output]
- Passive repair: mean distinct coverage 26.2695, global accuracy 36.1098%, on-policy accuracy 51.1932%. Active distinct probes: coverage 32, global accuracy 38.7540%, on-policy accuracy 39.2120%. [cell 3 output]

### Interpretation

- P1 is strongly supported, but symbolic and neural models benefit identically from re-grounding; there is no exclusivity result. P2 is supported at balanced. P3 is supported by responsive false revisions and conservative under-escalation. [cell 3]
- P4 is narrowly supported for global accuracy (38.75% vs 36.11%) and coverage, but active is worse on-policy (39.21% vs 51.19%); neither repair is close to a globally accurate full table under budget 32. This negative outcome motivates later compressed-rule experiments. [cell 3]

## Experiment 5 — runtime MDL refinement V4

### Hypotheses and methods

- P1 naive exact exception patches grow model size after isolated shocks while gated remains at 65 states; P2 gated planning beats naive on clean nominal tasks; P3 after permanent force the gate adopts one compressed rule and restores exactness while naive accumulates exceptions. [cell 4]
- Seed 4407; 128 trials; horizon 800; 32 transient shocks in transient condition, 16 before a permanent change at t=400 in mixed; minimum shock gap 8. Gate buffer 64, min buffer 16, min candidate errors 3, error code `log2(65)` bits, structural rule cost 12 bits, minimum gain 12 bits, 8 confirmations all required. Planning: 64 tasks, max depth 24; checkpoints every 40 steps. [cell 4]
- Candidate global force rules are supplied. Naive creates exception/clone state per observed contradiction; gated re-grounds, buffers evidence, and adopts only MDL-positive independently confirmed rules. [cell 4]

### Results

- Nominal transition overlap with either permanent wind table is 26.67%. [cell 4 output]
- Transient: naive states `118.36 ± 0.45` versus gated `65.00 ± 0`; transition accuracy 96.36% versus 100%; planning `86.69% ± 1.27%` versus `100% ± 0`; gated false revision 0%. [cell 4 output]
- Mixed: naive states `296.35 ± 2.94` versus gated `65.00 ± 0`; transition accuracy 37.02% versus 100%; planning `15.60% ± 0.93%` versus `100% ± 0`; gated revision 100%; adoption delay `33.91 ± 0.56` steps. Elapsed 37.85 s. [cell 4 output]
- Warning: `RuntimeWarning: Mean of empty slice` in `mean_ci`; likely generated when aggregating a metric such as adoption delay for a condition with no events. It did not stop execution, but the affected undefined aggregate must remain NaN rather than be interpreted as zero. [cell 4 stderr; inferred cause from cell 4 code]

## Experiment 6 — gate calibration V5

### Calibration design

- Seed 5507; horizon 600; permanent onset 300; 64 trials/cell. Full factorial 81 settings: buffer `{24,48,96}`, gain `{0,12,24}`, support `{4,12,24}`, probes `{0,4,8}`. Minimum records 12, minimum current errors 3, rule cost 12 bits, error code `log2(65)`, probe cooldown 8, planning depth 24. [cell 5]
- Four stress profiles: sparse impulses (20 local shocks), dense impulses (60), coherent bursts (8; duration 10–18), and noisy observer/probes (32 local shocks, observation error 0.02, probe error 0.10). Each setting is tested in transient-only and permanent-change conditions. [cell 5]
- Feasible iff worst-profile transient false adoption ≤2%, permanent prechange false adoption ≤2%, and correct final rule ≥95%. Select lowest worst delay, then fewer mean queries, smaller buffer, higher gain, higher support. [cell 5]

### Results

- 27/81 settings were feasible: exactly all support-24 settings (all buffers/gains/probe budgets). Every support-4 or support-12 setting was infeasible because false adoption exceeded 2%; nevertheless all printed settings had 100% permanent recovery and 100% permanent planning. [cell 5 output]
- Feasible no-probe settings had worst delay 34.86 (B24 G0/G12/G24, B48 G0/G12), 34.88 (B48 G24), 47.97/49.39/50.77 (B96 G0/G12/G24), with zero false adoption, zero queries, 100% recovery/planning. Adding 4 probes raised feasible delays to 38.61–40.36 for B24/48 and 52.78–54.27 for B96, with mean 4.44–4.69 queries. Adding 8 raised delays to 43.23–47.75 for B24/48 and 56.16–60.14 for B96, with 10.09–11.22 queries. [cell 5 output]
- Infeasible support-4/12 settings show the speed/safety tradeoff: minimum worst delay 12.95 at B24-G0-S4-Q0 with transient/prechange false adoption 100%/96.9%; delays increase to 63.52 at B96-G24-S12-Q8 while false adoption falls to 3.1%/1.6%, still failing the transient 2% cap. [cell 5 output]
- Selected B24-G24-S24-Q0: buffer 24, gain 24 bits, support 24, zero probes; worst transient/prechange false adoption 0/0%; worst permanent recovery 100%; worst delay 34.859375; mean queries 0; permanent planning 100%. [cell 5 output]
- Selected-gate permanent delays by profile: sparse 33.38, dense 32.56, coherent bursts 33.00, noisy observer/probes 34.86; adapted planning 100%, frozen planning 7.3%, 7.3%, 7.2%, 7.3%, respectively. For all transient profiles: false adoption 0%, recovery 100%, delay NaN (no adoption), adapted and frozen planning 100%. Elapsed 348.79 s. [cell 5 output]

### Interpretation

- Explicit: persistent support, rather than MDL threshold or confirmation probes, is the decisive safety dimension in this sweep; probes only add delay/query cost once support is 24. [cell 5 output]
- Scope: candidate worlds remain supplied global forces `{-1,0,+1}`; this is calibration, not invention. [cell 5]

## Experiment 7 — grammar-based symbolic invention V6

### Hypotheses and methods

- Question: after the frozen V5 patience gate decides persistence, can a typed grammar invent dynamics rather than choose from named candidate worlds? [cell 6]
- Four matched controllers: frozen, contradiction lookup patches, passive gate+grammar search, active gate+grammar search with synthesis-only falsification probes. Active probes do not decide persistence and adoption requires one remaining semantic table. [cell 6]
- Seed 6207; horizon 650; onset 250; 40 trials/regime; frozen B24-G24-S24-Q0; min records 12, min current errors 3, error code `log2(65)`; active ≤16 probes/attempt and 48 total; cooldown 8; max program cost 48 bits; 18 local bird strikes; 6 coherent bursts of duration 10–18; planning depth 24; max prechange false-adoption target 2%; active exact-recovery target 90%. [cell 6]
- Grammar composes constants, signs of state/action, predicates, guarded terms, and clipped addition, deduplicated by full 195-transition semantics. It generated 2,045 unique semantic programs. [cell 6]
- Representable targets and canonical program costs: global wind `+1` (4 bits); velocity drag `-sgn(v)` (6); action coupling `sgn(a)` (5); center seeking `clip((+1 if p < 7 else 0)+(-1 if p >= 7 else 0),-2,2)` (27); upper-half brake `(-1 if p >= 7 else 0)` (12); brake-plus-action `clip(-sgn(v)+sgn(a),-2,2)` (14). Parity checkerboard and seeded random local table are asserted absent from the grammar. [cell 6]

### Results, including failures

- Representable per-rule `(active exact, passive exact, lookup transition accuracy, active planning, active delay, mean active queries)`: global wind `(97.5%,97.5%,65.2%,97.8%,28.1,2.2)`; velocity drag `(97.5%,97.5%,69.8%,98.0%,32.2,2.5)`; action coupling `(92.5%,92.5%,69.6%,95.3%,47.2,0.9)`; center seeking `(100%,100%,79.3%,100%,31.2,0.0)`; upper-half brake `(100%,100%,85.6%,100%,118.0,0.1)`; brake-plus-action `(97.5%,97.5%,88.7%,97.7%,32.4,0.3)`. Modal active inventions equal the target canonical expressions. [cell 6 output]
- Aggregate representable controllers `(exact recovery, transition accuracy, planning)`: frozen `(0%,41.4%,15.5%)`; lookup `(0%,76.4%,58.6%)`; passive `(97.5%,98.7%,98.1%)`; active `(97.5%,98.7%,98.1%)`. [cell 6 output]
- Out-of-grammar negative results: parity checkerboard active adoption 100%, transition accuracy 54.7%, planning 18.9%, modal wrong rule `clip(sgn(v)+(-1 if v == 0 else 0),-2,2)`; random-local-table active adoption 100%, accuracy 56.2%, planning 16.6%, modal wrong rule `clip(sgn(a)+(sgn(v) if a == 0 else 0),-2,2)`. [cell 6 output]
- Predeclared outcomes: P1 active exact recovery ≥90% PASS; P2 active beats passive exact recovery FAIL (tie); P3 active beats lookup planning PASS; P4 false prechange adoption ≤ calibrated limit PASS. [cell 6 output]
- Critical failed outcome: after printing all scientific summaries, the archived execution raised `ValueError: dict contains fields not in fieldnames: 'representable_adoption_rate', 'unrepresentable_adoption_rate', 'false_prechange_adoption_rate', 'mean_queries'`. That error is consistent with an earlier exporter taking fieldnames only from the first frozen-controller row. The stored cell source now builds an ordered union of keys, so source and output are different revisions. Because the corrected exporter was not rerun in the notebook, execution still stopped before later grammar CSVs, checkpoint/plot/archive writes and final summary in the available evidence. [cell 6 source/output version comparison]

### Interpretation

- Explicit positive result: representable dynamics are usually recovered exactly by grammar synthesis and planning is restored. [cell 6]
- Explicit negative result: active probes provide no aggregate advantage over passive synthesis here, contrary to P2. [cell 6]
- Strong boundary failure: the system does not refuse out-of-grammar laws; it adopts a wrong in-grammar approximation 100% of the time. Therefore V6 demonstrates synthesis within a supplied hypothesis class, not robust open-world invention or calibrated abstention. [cell 6]

## Warnings, errors, and reproducibility blockers

- **Cell 6 source/output mismatch:** the recorded run failed at heterogeneous CSV export, while the stored source already uses the ordered union of keys. The source-level fix is plausible but unvalidated by the archived run, so later declared artifacts remain absent from the evidence. [cell 6]
- **Cell 4 NaN warning** should be removed by checking for an all-NaN/empty finite array before calling `np.nanmean`; undefined transient adoption delays should be serialized explicitly as null/NaN. [cell 4]
- Hard-coded `/content/...` paths make local execution awkward and successive cells 0/1 use the same output directory, so running cell 1 can overwrite cell 0 artifacts. Give each run a unique relative output directory. [cells 0–1]
- No dependency file or tested version matrix. Recorded versions identify only PyTorch/CUDA for neural runs; NumPy, Matplotlib, Python, and hardware/driver versions are absent. [cells 0–6]
- Neural runs enable `cudnn.benchmark=True`, AMP, and TF32 without deterministic-algorithm enforcement; exact reproduction across hardware/software is not promised. Save environment, deterministic flags, and hashes. [cells 0–3]
- All source is in seven giant cells (665–1,624 lines), limiting testability and making partial reruns/inspection difficult. Factor shared mechanics, metrics, plotting, and artifact writing into modules and use small orchestration cells. [cells 0–6]
- Fast-dev modes change scientific sample sizes and can relax exact-table audit gates; fast runs must be labeled smoke tests and never merged with full results. [cells 0–6]
- Synthetic datasets are generated in memory and only aggregates/artifacts are intended to be saved; exact data-generation seeds/calls need a machine-readable manifest for independent verification. [cells 0–6]
- Outputs contain embedded PNGs totaling about 1.0 MB and verbose progress logs; stripping them is safe only after preserving result tables and figures as named artifacts. [cells 0–6]
- Statistical limitations: most percentages are single-seed synthetic simulations; V4 reports 95% CI half-widths, but other experiments generally do not report uncertainty across independent training seeds. [cells 0–6; inferred]
- Comparisons are internal to supplied abstractions, grammars, and simulators. No external dataset, empirical system, autonomous state discovery, or formal validity guarantee is tested. [cells 0–6]

## Adversarial pass: claims that must not be overstated

- Do not cite cell 0's 100% neural planning as evidence of long-horizon neural planning parity; cell 1's corrected task yields 26.25%. [cells 0–1]
- Do not call the validity monitor formally safe: its probability is statistical, only 74.5% of exits are prospectively detected, and held-out safe FPR is 5.78%. [cell 2]
- Do not claim symbolic re-grounding is uniquely effective: the neural observer with the same observation performs identically in V3. [cell 3]
- Do not claim equal-budget active probing recovered the changed table in V3: global accuracy is only 38.75%, albeit slightly above passive 36.11%. [cell 3]
- Do not generalize V4/V5 gate behavior beyond the supplied global-force candidate family and four scripted stress profiles. [cells 4–5]
- Do not claim active synthesis outperformed passive synthesis in V6; the preregistered comparison failed. [cell 6]
- Do not claim out-of-grammar detection/refusal: both unrepresentable controls were wrongly adopted in 100% of trials. [cell 6]
- Do not imply V6 was fully reproducibly saved: the run terminated during its first heterogeneous CSV export. [cell 6]

## Recommended preservation/cleaning map

- Preserve cell 0 as `01_crystallization_original_positive_control.ipynb`, clearly labeled historical/easy planning protocol. [cell 0]
- Preserve cell 1 as `02_crystallization_exact_horizon.ipynb`, treated as the corrected primary planning result. [cell 1]
- Preserve cells 2–6 individually as `03_prospective_validity.ipynb`, `04_homeostatic_recovery.ipynb`, `05_runtime_mdl_refinement.ipynb`, `06_gate_calibration.ipynb`, and `07_symbolic_rule_invention.ipynb`. [cells 2–6]
- Remove the empty cell 7 in cleaned copies only. Retain the original notebook unchanged as provenance. [cell 7]

## Verbatim textual result record

The following stdout/stderr summaries are reproduced verbatim from the source notebook (plot payloads excluded). This preserves every printed training checkpoint and every printed operating-point result in addition to the structured audit above.

### Cell 0 textual output
```text
========================================================================================
CRYSTALLIZED WORLD MODEL — finite dynamics inside a recurrent neural model
========================================================================================
device=cuda | torch=2.11.0+cu128 | AMP=True | fast_dev=False
GPU=Tesla T4 | VRAM=14.6 GiB
world-model parameters=191,657
train    1/1800 | loss=5.6389 | q0=  1.4% | t14=  2.7%
train   45/1800 | loss=3.9649 | q0= 38.7% | t14=  6.1%
train   90/1800 | loss=2.5940 | q0=100.0% | t14= 16.1%
train  135/1800 | loss=1.7649 | q0=100.0% | t14= 26.4%
train  180/1800 | loss=1.2715 | q0=100.0% | t14= 45.3%
train  225/1800 | loss=0.8702 | q0=100.0% | t14= 64.7%
train  270/1800 | loss=0.5493 | q0=100.0% | t14= 84.5%
train  315/1800 | loss=0.3617 | q0=100.0% | t14= 93.4%
train  360/1800 | loss=0.2111 | q0=100.0% | t14= 97.5%
train  405/1800 | loss=0.1376 | q0=100.0% | t14= 98.4%
train  450/1800 | loss=0.0884 | q0=100.0% | t14= 99.5%
train  495/1800 | loss=0.0670 | q0=100.0% | t14= 99.9%
train  540/1800 | loss=0.0504 | q0=100.0% | t14=100.0%
train  585/1800 | loss=0.0395 | q0=100.0% | t14= 99.7%
train  630/1800 | loss=0.0634 | q0=100.0% | t14= 98.7%
train  675/1800 | loss=0.0728 | q0=100.0% | t14= 98.7%
train  720/1800 | loss=0.0443 | q0=100.0% | t14= 99.3%
train  765/1800 | loss=0.0267 | q0=100.0% | t14= 99.9%
train  810/1800 | loss=0.0178 | q0=100.0% | t14=100.0%
train  855/1800 | loss=0.0147 | q0=100.0% | t14=100.0%
train  900/1800 | loss=0.0125 | q0=100.0% | t14=100.0%
train  945/1800 | loss=0.0112 | q0=100.0% | t14=100.0%
train  990/1800 | loss=0.0115 | q0=100.0% | t14= 99.9%
train 1035/1800 | loss=0.0094 | q0=100.0% | t14=100.0%
train 1080/1800 | loss=0.0081 | q0=100.0% | t14=100.0%
train 1125/1800 | loss=0.0075 | q0=100.0% | t14=100.0%
train 1170/1800 | loss=0.0067 | q0=100.0% | t14=100.0%
train 1215/1800 | loss=0.0061 | q0=100.0% | t14=100.0%
train 1260/1800 | loss=0.0058 | q0=100.0% | t14=100.0%
train 1305/1800 | loss=0.0052 | q0=100.0% | t14=100.0%
train 1350/1800 | loss=0.0049 | q0=100.0% | t14=100.0%
train 1395/1800 | loss=0.0047 | q0=100.0% | t14=100.0%
train 1440/1800 | loss=0.0042 | q0=100.0% | t14=100.0%
train 1485/1800 | loss=0.0039 | q0=100.0% | t14=100.0%
train 1530/1800 | loss=0.0036 | q0=100.0% | t14=100.0%
train 1575/1800 | loss=0.0035 | q0=100.0% | t14=100.0%
train 1620/1800 | loss=0.0033 | q0=100.0% | t14=100.0%
train 1665/1800 | loss=0.0031 | q0=100.0% | t14=100.0%
train 1710/1800 | loss=0.0029 | q0=100.0% | t14=100.0%
train 1755/1800 | loss=0.0028 | q0=100.0% | t14=100.0%
train 1800/1800 | loss=0.0026 | q0=100.0% | t14=100.0%
training elapsed=24.7s

CRYSTALLIZATION AUDIT
----------------------------------------------------------------------------------------
finite states=65 | actions=3 | transitions=195
transition accuracy against withheld simulator=100.00%
mean/min neural confidence=0.9968/0.9833
minimum nuisance stability=1.0000

LONG-HORIZON ROLLOUT
----------------------------------------------------------------------------------------
 horizon | neural state acc | machine state acc | neural pos MAE | machine pos MAE
       1 |          100.00% |           100.00% |          0.000 |           0.000
       2 |          100.00% |           100.00% |          0.000 |           0.000
       4 |          100.00% |           100.00% |          0.000 |           0.000
       8 |          100.00% |           100.00% |          0.000 |           0.000
      16 |          100.00% |           100.00% |          0.000 |           0.000
      32 |          100.00% |           100.00% |          0.000 |           0.000
      64 |           99.90% |           100.00% |          0.001 |           0.000
     128 |           99.61% |           100.00% |          0.010 |           0.000

OPEN-LOOP PLANNING
----------------------------------------------------------------------------------------
machine BFS success=100.00% | median length=3.0
neural beam success=100.00% | median length=3.0

VALIDITY MONITOR
----------------------------------------------------------------------------------------
domain-exit AUROC=0.803 | AUPRC=0.789 | nominal FPR=1.00%
counterexample AUROC=1.000 | AUPRC=1.000
event detection=99.32% | within 1 step=85.74% | median latency=0.0

========================================================================================
FINAL SUMMARY
========================================================================================
machine transition accuracy: 100.00%
first strict machine rollout crossover: 64
planning success — machine: 100.00% | neural beam: 100.00%
validity AUROC: 0.803 | counterexample AUROC: 1.000
artifacts: /content/crystallized_world_model_results
bundle: /content/crystallized_world_model_results/run_bundle.zip
```

### Cell 1 textual output
```text
========================================================================================
CRYSTALLIZED WORLD MODEL — finite dynamics inside a recurrent neural model
========================================================================================
device=cuda | torch=2.11.0+cu128 | AMP=True | fast_dev=False
GPU=Tesla T4 | VRAM=14.6 GiB
world-model parameters=191,657
train    1/1800 | loss=5.6389 | q0=  1.4% | t14=  2.7%
train   45/1800 | loss=3.9649 | q0= 38.7% | t14=  6.1%
train   90/1800 | loss=2.5940 | q0=100.0% | t14= 16.1%
train  135/1800 | loss=1.7649 | q0=100.0% | t14= 26.4%
train  180/1800 | loss=1.2714 | q0=100.0% | t14= 45.3%
train  225/1800 | loss=0.8702 | q0=100.0% | t14= 64.7%
train  270/1800 | loss=0.5553 | q0=100.0% | t14= 84.6%
train  315/1800 | loss=0.3547 | q0=100.0% | t14= 92.6%
train  360/1800 | loss=0.2154 | q0=100.0% | t14= 98.4%
train  405/1800 | loss=0.1375 | q0=100.0% | t14= 98.6%
train  450/1800 | loss=0.0893 | q0=100.0% | t14= 99.6%
train  495/1800 | loss=0.0663 | q0=100.0% | t14=100.0%
train  540/1800 | loss=0.0501 | q0=100.0% | t14=100.0%
train  585/1800 | loss=0.0390 | q0=100.0% | t14= 99.7%
train  630/1800 | loss=0.0316 | q0=100.0% | t14= 99.9%
train  675/1800 | loss=0.0253 | q0=100.0% | t14=100.0%
train  720/1800 | loss=0.0204 | q0=100.0% | t14=100.0%
train  765/1800 | loss=0.0181 | q0=100.0% | t14=100.0%
train  810/1800 | loss=0.0414 | q0=100.0% | t14= 98.7%
train  855/1800 | loss=0.0672 | q0=100.0% | t14= 99.0%
train  900/1800 | loss=0.0545 | q0=100.0% | t14= 98.7%
train  945/1800 | loss=0.0246 | q0=100.0% | t14= 99.7%
train  990/1800 | loss=0.0199 | q0=100.0% | t14= 99.7%
train 1035/1800 | loss=0.0107 | q0=100.0% | t14=100.0%
train 1080/1800 | loss=0.0088 | q0=100.0% | t14=100.0%
train 1125/1800 | loss=0.0080 | q0=100.0% | t14=100.0%
train 1170/1800 | loss=0.0070 | q0=100.0% | t14=100.0%
train 1215/1800 | loss=0.0063 | q0=100.0% | t14=100.0%
train 1260/1800 | loss=0.0058 | q0=100.0% | t14=100.0%
train 1305/1800 | loss=0.0053 | q0=100.0% | t14=100.0%
train 1350/1800 | loss=0.0050 | q0=100.0% | t14=100.0%
train 1395/1800 | loss=0.0046 | q0=100.0% | t14=100.0%
train 1440/1800 | loss=0.0042 | q0=100.0% | t14=100.0%
train 1485/1800 | loss=0.0039 | q0=100.0% | t14=100.0%
train 1530/1800 | loss=0.0036 | q0=100.0% | t14=100.0%
train 1575/1800 | loss=0.0034 | q0=100.0% | t14=100.0%
train 1620/1800 | loss=0.0033 | q0=100.0% | t14=100.0%
train 1665/1800 | loss=0.0030 | q0=100.0% | t14=100.0%
train 1710/1800 | loss=0.0028 | q0=100.0% | t14=100.0%
train 1755/1800 | loss=0.0027 | q0=100.0% | t14=100.0%
train 1800/1800 | loss=0.0025 | q0=100.0% | t14=100.0%
training elapsed=25.7s

CRYSTALLIZATION AUDIT
----------------------------------------------------------------------------------------
finite states=65 | actions=3 | transitions=195
transition accuracy against withheld simulator=100.00%
mean/min neural confidence=0.9966/0.9843
minimum nuisance stability=1.0000

LONG-HORIZON ROLLOUT
----------------------------------------------------------------------------------------
 horizon | neural state acc | machine state acc | neural pos MAE | machine pos MAE
       1 |          100.00% |           100.00% |          0.000 |           0.000
       2 |          100.00% |           100.00% |          0.000 |           0.000
       4 |          100.00% |           100.00% |          0.000 |           0.000
       8 |          100.00% |           100.00% |          0.000 |           0.000
      16 |          100.00% |           100.00% |          0.000 |           0.000
      32 |          100.00% |           100.00% |          0.000 |           0.000
      64 |           99.95% |           100.00% |          0.001 |           0.000
     128 |           99.90% |           100.00% |          0.001 |           0.000

EXACT-HORIZON OPEN-LOOP PLANNING
----------------------------------------------------------------------------------------
machine graph-search success=100.00% | median length=22.0
neural beam success=26.25% | median length=21.0
median exact-arrival horizon=22.0

VALIDITY MONITOR
----------------------------------------------------------------------------------------
domain-exit AUROC=0.816 | AUPRC=0.796 | nominal FPR=1.00%
counterexample AUROC=1.000 | AUPRC=1.000
event detection=99.32% | within 1 step=85.74% | median latency=0.0

========================================================================================
FINAL SUMMARY
========================================================================================
machine transition accuracy: 100.00%
first strict machine rollout crossover: 64
planning success — machine: 100.00% | neural beam: 26.25%
validity AUROC: 0.816 | counterexample AUROC: 1.000
artifacts: /content/crystallized_world_model_results
bundle: /content/crystallized_world_model_results/run_bundle.zip
```

### Cell 2 textual output
```text
================================================================================================
PROSPECTIVE VALIDITY V2 — action-conditional boundary prediction
================================================================================================
device=cuda | torch=2.11.0+cu128 | AMP=True | fast_dev=False
GPU=Tesla T4 | VRAM=14.6 GiB
nominal world-model parameters=191,945
world    1/700 | loss=5.6478 | q0=  1.6% | t14=  1.0%
world   35/700 | loss=4.2696 | q0= 28.5% | t14=  7.2%
world   70/700 | loss=2.8775 | q0= 96.0% | t14= 11.8%
world  105/700 | loss=2.2094 | q0=100.0% | t14= 15.8%
world  140/700 | loss=1.6489 | q0=100.0% | t14= 35.2%
world  175/700 | loss=1.2957 | q0=100.0% | t14= 45.2%
world  210/700 | loss=0.9497 | q0=100.0% | t14= 61.5%
world  245/700 | loss=0.6476 | q0=100.0% | t14= 81.9%
world  280/700 | loss=0.4607 | q0=100.0% | t14= 89.3%
world  315/700 | loss=0.3172 | q0=100.0% | t14= 96.6%
world  350/700 | loss=0.2213 | q0=100.0% | t14= 96.5%
world  385/700 | loss=0.1533 | q0=100.0% | t14= 99.2%
world  420/700 | loss=0.1033 | q0=100.0% | t14=100.0%
world  455/700 | loss=0.0781 | q0=100.0% | t14= 99.9%
world  490/700 | loss=0.0615 | q0=100.0% | t14= 99.7%
world  525/700 | loss=0.0465 | q0=100.0% | t14=100.0%
world  560/700 | loss=0.0387 | q0=100.0% | t14=100.0%
world  595/700 | loss=0.0328 | q0=100.0% | t14=100.0%
world  630/700 | loss=0.0271 | q0=100.0% | t14=100.0%
world  665/700 | loss=0.0226 | q0=100.0% | t14=100.0%
world  700/700 | loss=0.0197 | q0=100.0% | t14=100.0%

CRYSTALLIZATION AUDIT
------------------------------------------------------------------------------------------------
states=65 | actions=3 | transitions=195
withheld nominal transition accuracy=100.00%
confidence mean/min=0.9849/0.9197 | minimum context+nuisance stability=1.0000

PAIRED-DATA AUDIT
------------------------------------------------------------------------------------------------
train/validation/test samples=40000/8000/12000 | generation=1.2s
zone starts train=(0, 1, 3, 4, 6, 8, 9, 10) | validation=(5,) | held-out test=(2, 7)

TRAINING PROSPECTIVE MONITORS
------------------------------------------------------------------------------------------------
monitor obs_action     1/1000 | loss=0.9808
monitor obs_action   200/1000 | loss=0.4496
monitor obs_action   400/1000 | loss=0.3166
monitor obs_action   600/1000 | loss=0.2708
monitor obs_action   800/1000 | loss=0.2070
monitor obs_action  1000/1000 | loss=0.2061
monitor obs_only       1/700 | loss=0.9971
monitor obs_only     140/700 | loss=0.8936
monitor obs_only     280/700 | loss=0.7431
monitor obs_only     420/700 | loss=0.7884
monitor obs_only     560/700 | loss=0.7400
monitor obs_only     700/700 | loss=0.7373
monitor action_only    1/700 | loss=0.9712
monitor action_only  140/700 | loss=0.9741
monitor action_only  280/700 | loss=0.9309
monitor action_only  420/700 | loss=0.9754
monitor action_only  560/700 | loss=0.9522
monitor action_only  700/700 | loss=0.9568
monitor obs_action     1/700 | loss=1.0380
monitor obs_action   140/700 | loss=1.0139
monitor obs_action   280/700 | loss=1.0128
monitor obs_action   420/700 | loss=0.9941
monitor obs_action   560/700 | loss=1.0359
monitor obs_action   700/700 | loss=0.9659

HELD-OUT ZONE PREDICTION
------------------------------------------------------------------------------------------------
 monitor               | horizon | AUROC | AUPRC | Brier
 observation+actions   |       1 | 0.998 | 0.983 | 0.0038
 observation+actions   |       3 | 0.997 | 0.985 | 0.0209
 observation+actions   |       5 | 0.985 | 0.965 | 0.0446
 observation+actions   |       8 | 0.958 | 0.948 | 0.0797
 observation+actions   |      12 | 0.922 | 0.937 | 0.1077
 observation-only      |       1 | 0.947 | 0.281 | 0.1008
 observation-only      |       3 | 0.838 | 0.366 | 0.2068
 observation-only      |       5 | 0.705 | 0.400 | 0.2396
 observation-only      |       8 | 0.567 | 0.446 | 0.2499
 observation-only      |      12 | 0.500 | 0.500 | 0.2509
 actions-only          |       1 | 0.487 | 0.032 | 0.1779
 actions-only          |       3 | 0.490 | 0.139 | 0.2507
 actions-only          |       5 | 0.513 | 0.269 | 0.2519
 actions-only          |       8 | 0.563 | 0.450 | 0.2492
 actions-only          |      12 | 0.614 | 0.602 | 0.2401
 unobservable-switch   |       1 | 0.508 | 0.042 | 0.2489
 unobservable-switch   |       3 | 0.496 | 0.123 | 0.2481
 unobservable-switch   |       5 | 0.491 | 0.202 | 0.2459
 unobservable-switch   |       8 | 0.487 | 0.326 | 0.2486
 unobservable-switch   |      12 | 0.485 | 0.494 | 0.2501
paired risky>safe ranking: {'observation+actions': 0.925, 'observation-only': 0.505, 'actions-only': 0.619}

LEAD-TIME CONTRAST
------------------------------------------------------------------------------------------------
threshold=0.6912 | held-out safe-plan FPR=5.78%
prospective detection=74.50% | median alert-exit latency=-5.0 steps
manifest counterexamples=80.05% | postdictive median/min latency=1.0/1.0 steps

VALIDITY-AWARE COUNTERFACTUAL PLANNING
------------------------------------------------------------------------------------------------
 method                | safe selection | domain exits | true goal success
 machine-random-tie    |        52.50% |      47.50% |            56.00%
 observation-only      |        48.75% |      51.25% |            50.25%
 actions-only          |        68.50% |      31.50% |            71.50%
 observation+actions   |        77.75% |      22.25% |            78.50%
 oracle-boundary       |       100.00% |       0.00% |           100.00%

================================================================================================
FINAL V2 SUMMARY
================================================================================================
nominal machine transition accuracy: 100.00%
paired risky>safe ranking — joint/obs/action: 92.47% / 50.48% / 61.94%
prospective detection=74.50% | safe FPR=5.78% | median prospective latency=-5.0
validity-aware safe-plan selection=77.75% | machine-only=52.50%
unobservable-switch AUROC at k=12: 0.485
artifacts: /content/prospective_validity_v2_results
bundle: /content/prospective_validity_v2_results/run_bundle.zip
```

### Cell 3 textual output
```text
================================================================================================
HOMEOSTATIC SYMBOLIC RECOVERY V3 — reset, fallback, revision
================================================================================================
device=cuda | torch=2.11.0+cu128 | AMP=True | fast_dev=False
GPU=Tesla T4 | VRAM=14.6 GiB
world-model parameters=191,657
train    1/700 | loss=5.6457 | q0=  1.6% | t14=  2.5%
train   35/700 | loss=4.2522 | q0= 22.0% | t14=  5.5%
train   70/700 | loss=2.9752 | q0= 98.8% | t14=  9.2%
train  105/700 | loss=2.3136 | q0=100.0% | t14= 15.6%
train  140/700 | loss=1.8867 | q0=100.0% | t14= 24.6%
train  175/700 | loss=1.5418 | q0=100.0% | t14= 39.2%
train  210/700 | loss=1.2709 | q0=100.0% | t14= 43.4%
train  245/700 | loss=1.0600 | q0=100.0% | t14= 56.9%
train  280/700 | loss=0.8312 | q0=100.0% | t14= 70.4%
train  315/700 | loss=0.6393 | q0=100.0% | t14= 74.6%
train  350/700 | loss=0.4882 | q0=100.0% | t14= 81.8%
train  385/700 | loss=0.3750 | q0=100.0% | t14= 90.1%
train  420/700 | loss=0.2722 | q0=100.0% | t14= 96.0%
train  455/700 | loss=0.1893 | q0=100.0% | t14= 97.0%
train  490/700 | loss=0.1492 | q0=100.0% | t14= 97.4%
train  525/700 | loss=0.1014 | q0=100.0% | t14= 98.6%
train  560/700 | loss=0.0733 | q0=100.0% | t14= 99.3%
train  595/700 | loss=0.0537 | q0=100.0% | t14=100.0%
train  630/700 | loss=0.0443 | q0=100.0% | t14= 99.9%
train  665/700 | loss=0.0391 | q0=100.0% | t14= 99.7%
train  700/700 | loss=0.0306 | q0=100.0% | t14=100.0%

CRYSTALLIZATION AUDIT
------------------------------------------------------------------------------------------------
transition accuracy=100.00%
confidence mean/min=0.9760/0.8106 | minimum nuisance stability=1.0000

FROZEN SURPRISE BASELINE
------------------------------------------------------------------------------------------------
mean NLL=0.00278 | mean scale=0.02000 | checksum=4.441652

POST-SHOCK PREDICTION RECOVERY
------------------------------------------------------------------------------------------------
 level | system                 | integrated error | median recovery | recovered
     1 | machine-open-loop      |           19.596 |          20.000 |    10.35%
     1 | machine-re-grounded    |            1.000 |           0.000 |   100.00%
     1 | neural-open-loop       |           19.596 |          19.500 |    10.16%
     1 | neural-re-grounded     |            1.000 |           0.000 |   100.00%
     2 | machine-open-loop      |           18.902 |          11.000 |    15.43%
     2 | machine-re-grounded    |            2.662 |           0.000 |   100.00%
     2 | neural-open-loop       |           18.910 |          11.000 |    15.62%
     2 | neural-re-grounded     |            2.662 |           0.000 |   100.00%
     3 | machine-open-loop      |           19.584 |             n/a |       n/a
     3 | machine-re-grounded    |           14.201 |             n/a |       n/a
     3 | neural-open-loop       |           19.584 |             n/a |       n/a
     3 | neural-re-grounded     |           14.201 |             n/a |       n/a

ESCALATION CONFUSION MATRICES
------------------------------------------------------------------------------------------------
responsive:
[[512   0   0]
 [ 90 326  96]
 [  0   2 510]]
{'classification_accuracy': 0.8776041666666666, 'mean_bad_plan_steps': 2.0891927083333335, 'mean_unnecessary_fallback_steps': 0.3053385416666667, 'false_revision_rate_L1_L2': 0.09375, 'pre_event_revision_rate': 0.0, 'L3_revision_rate': 0.99609375, 'median_classification_latency': 1.0}
balanced:
[[512   0   0]
 [ 90 422   0]
 [  0   6 506]]
{'classification_accuracy': 0.9375, 'mean_bad_plan_steps': 2.0299479166666665, 'mean_unnecessary_fallback_steps': 0.6985677083333334, 'false_revision_rate_L1_L2': 0.0, 'pre_event_revision_rate': 0.0, 'L3_revision_rate': 0.98828125, 'median_classification_latency': 1.0}
conservative:
[[512   0   0]
 [297 215   0]
 [  0  30 482]]
{'classification_accuracy': 0.787109375, 'mean_bad_plan_steps': 2.7005208333333335, 'mean_unnecessary_fallback_steps': 0.50390625, 'false_revision_rate_L1_L2': 0.0, 'pre_event_revision_rate': 0.0, 'L3_revision_rate': 0.94140625, 'median_classification_latency': 2.0}

STRUCTURAL REVISION CONTRAST
------------------------------------------------------------------------------------------------
passive-on-policy {'mean_distinct_coverage': 26.26953125, 'mean_global_accuracy': 0.3610977564102563, 'mean_onpolicy_accuracy': 0.511932373046875}
active-distinct-probes {'mean_distinct_coverage': 32.0, 'mean_global_accuracy': 0.38754006410256414, 'mean_onpolicy_accuracy': 0.392120361328125}

================================================================================================
FINAL V3 SUMMARY
================================================================================================
nominal machine transition accuracy: 100.00%
L1 machine-open-loop: integrated error=19.596, median recovery=20.000
L1 machine-re-grounded: integrated error=1.000, median recovery=0.000
L1 neural-open-loop: integrated error=19.596, median recovery=19.500
L1 neural-re-grounded: integrated error=1.000, median recovery=0.000
responsive: classification=87.76% | bad steps=2.089 | false revision L1/L2=9.38% | L3 revision=99.61%
balanced: classification=93.75% | bad steps=2.030 | false revision L1/L2=0.00% | L3 revision=98.83%
conservative: classification=78.71% | bad steps=2.701 | false revision L1/L2=0.00% | L3 revision=94.14%
passive-on-policy: coverage=26.27 | global accuracy=36.11% | on-policy accuracy=51.19%
active-distinct-probes: coverage=32.00 | global accuracy=38.75% | on-policy accuracy=39.21%
artifacts: /content/homeostatic_recovery_v3_results
bundle: /content/homeostatic_recovery_v3_results/run_bundle.zip
```

### Cell 4 textual output
```text
====================================================================================================
RUNTIME REFINEMENT V4 — disagreement, re-grounding, compression gate
====================================================================================================
fast_dev=False | trials=128 | horizon=800 | states=65
nominal overlap with permanent rules: wind=-1 26.67% | wind=+1 26.67%
finished transient: 128 trials
finished mixed: 128 trials

AGGREGATE RESULTS (mean ± 95% CI half-width)
----------------------------------------------------------------------------------------------------
TRANSIENT
  states: naive=118.36±0.45 | gated=65.00±0.00
  transition accuracy: naive=96.36% | gated=100.00%
  planning success: naive=86.69%±1.27% | gated=100.00%±0.00%
  gated false-revision rate=0.00%
MIXED
  states: naive=296.35±2.94 | gated=65.00±0.00
  transition accuracy: naive=37.02% | gated=100.00%
  planning success: naive=15.60%±0.93% | gated=100.00%±0.00%
  gated revision rate=100.00% | adoption delay=33.91±0.56 steps
/tmp/ipykernel_602/2477367804.py:480: RuntimeWarning: Mean of empty slice
  mean = float(np.nanmean(arr))

====================================================================================================
FINAL V4 SUMMARY
====================================================================================================
elapsed=37.85s
transient: states naive/gated=118.36/65.00 | planning naive/gated=86.69%/100.00%
mixed: states naive/gated=296.35/65.00 | planning naive/gated=15.60%/100.00%
artifacts: /content/runtime_mdl_refinement_v4_results
bundle: /content/runtime_mdl_refinement_v4_results/run_bundle.zip
```

### Cell 5 textual output
```text
============================================================================================================
CALIBRATED COMPRESSION GATE V5 — delay, false adoption, and query cost
============================================================================================================
fast_dev=False | states=65 | operating_points=81 | profiles=4 | trials/cell=64
nominal overlap with changed regimes: wind=-1 26.67% | wind=+1 26.67%
completed  1/81: B24-G0-S4-Q0
completed  2/81: B24-G0-S4-Q4
completed  3/81: B24-G0-S4-Q8
completed  4/81: B24-G0-S12-Q0
completed  5/81: B24-G0-S12-Q4
completed  6/81: B24-G0-S12-Q8
completed  7/81: B24-G0-S24-Q0
completed  8/81: B24-G0-S24-Q4
completed  9/81: B24-G0-S24-Q8
completed 10/81: B24-G12-S4-Q0
completed 11/81: B24-G12-S4-Q4
completed 12/81: B24-G12-S4-Q8
completed 13/81: B24-G12-S12-Q0
completed 14/81: B24-G12-S12-Q4
completed 15/81: B24-G12-S12-Q8
completed 16/81: B24-G12-S24-Q0
completed 17/81: B24-G12-S24-Q4
completed 18/81: B24-G12-S24-Q8
completed 19/81: B24-G24-S4-Q0
completed 20/81: B24-G24-S4-Q4
completed 21/81: B24-G24-S4-Q8
completed 22/81: B24-G24-S12-Q0
completed 23/81: B24-G24-S12-Q4
completed 24/81: B24-G24-S12-Q8
completed 25/81: B24-G24-S24-Q0
completed 26/81: B24-G24-S24-Q4
completed 27/81: B24-G24-S24-Q8
completed 28/81: B48-G0-S4-Q0
completed 29/81: B48-G0-S4-Q4
completed 30/81: B48-G0-S4-Q8
completed 31/81: B48-G0-S12-Q0
completed 32/81: B48-G0-S12-Q4
completed 33/81: B48-G0-S12-Q8
completed 34/81: B48-G0-S24-Q0
completed 35/81: B48-G0-S24-Q4
completed 36/81: B48-G0-S24-Q8
completed 37/81: B48-G12-S4-Q0
completed 38/81: B48-G12-S4-Q4
completed 39/81: B48-G12-S4-Q8
completed 40/81: B48-G12-S12-Q0
completed 41/81: B48-G12-S12-Q4
completed 42/81: B48-G12-S12-Q8
completed 43/81: B48-G12-S24-Q0
completed 44/81: B48-G12-S24-Q4
completed 45/81: B48-G12-S24-Q8
completed 46/81: B48-G24-S4-Q0
completed 47/81: B48-G24-S4-Q4
completed 48/81: B48-G24-S4-Q8
completed 49/81: B48-G24-S12-Q0
completed 50/81: B48-G24-S12-Q4
completed 51/81: B48-G24-S12-Q8
completed 52/81: B48-G24-S24-Q0
completed 53/81: B48-G24-S24-Q4
completed 54/81: B48-G24-S24-Q8
completed 55/81: B96-G0-S4-Q0
completed 56/81: B96-G0-S4-Q4
completed 57/81: B96-G0-S4-Q8
completed 58/81: B96-G0-S12-Q0
completed 59/81: B96-G0-S12-Q4
completed 60/81: B96-G0-S12-Q8
completed 61/81: B96-G0-S24-Q0
completed 62/81: B96-G0-S24-Q4
completed 63/81: B96-G0-S24-Q8
completed 64/81: B96-G12-S4-Q0
completed 65/81: B96-G12-S4-Q4
completed 66/81: B96-G12-S4-Q8
completed 67/81: B96-G12-S12-Q0
completed 68/81: B96-G12-S12-Q4
completed 69/81: B96-G12-S12-Q8
completed 70/81: B96-G12-S24-Q0
completed 71/81: B96-G12-S24-Q4
completed 72/81: B96-G12-S24-Q8
completed 73/81: B96-G24-S4-Q0
completed 74/81: B96-G24-S4-Q4
completed 75/81: B96-G24-S4-Q8
completed 76/81: B96-G24-S12-Q0
completed 77/81: B96-G24-S12-Q4
completed 78/81: B96-G24-S12-Q8
completed 79/81: B96-G24-S24-Q0
completed 80/81: B96-G24-S24-Q4
completed 81/81: B96-G24-S24-Q8

OPERATING-POINT CALIBRATION
------------------------------------------------------------------------------------------------------------
 point       ok | false(trans/pre) | recovery | worst delay | queries | permanent planning
 B24-G0-S24-Q0 True |   0.0%/  0.0% |   100.0% |       34.86 |    0.00 |   100.00%
 B24-G12-S24-Q0 True |   0.0%/  0.0% |   100.0% |       34.86 |    0.00 |   100.00%
 B24-G24-S24-Q0 True |   0.0%/  0.0% |   100.0% |       34.86 |    0.00 |   100.00%
 B48-G0-S24-Q0 True |   0.0%/  0.0% |   100.0% |       34.86 |    0.00 |   100.00%
 B48-G12-S24-Q0 True |   0.0%/  0.0% |   100.0% |       34.86 |    0.00 |   100.00%
 B48-G24-S24-Q0 True |   0.0%/  0.0% |   100.0% |       34.88 |    0.00 |   100.00%
 B48-G12-S24-Q4 True |   0.0%/  0.0% |   100.0% |       38.61 |    4.47 |   100.00%
 B48-G24-S24-Q4 True |   0.0%/  0.0% |   100.0% |       39.12 |    4.53 |   100.00%
 B24-G24-S24-Q4 True |   0.0%/  0.0% |   100.0% |       39.36 |    4.56 |   100.00%
 B48-G0-S24-Q4 True |   0.0%/  0.0% |   100.0% |       39.61 |    4.59 |   100.00%
 B24-G0-S24-Q4 True |   0.0%/  0.0% |   100.0% |       39.73 |    4.61 |   100.00%
 B24-G12-S24-Q4 True |   0.0%/  0.0% |   100.0% |       40.36 |    4.69 |   100.00%
 B48-G0-S24-Q8 True |   0.0%/  0.0% |   100.0% |       43.23 |   10.09 |   100.00%
 B24-G0-S24-Q8 True |   0.0%/  0.0% |   100.0% |       43.73 |   10.22 |   100.00%
 B48-G12-S24-Q8 True |   0.0%/  0.0% |   100.0% |       45.36 |   10.62 |   100.00%
 B24-G24-S24-Q8 True |   0.0%/  0.0% |   100.0% |       45.61 |   10.69 |   100.00%
 B24-G12-S24-Q8 True |   0.0%/  0.0% |   100.0% |       47.73 |   11.22 |   100.00%
 B48-G24-S24-Q8 True |   0.0%/  0.0% |   100.0% |       47.75 |   11.22 |   100.00%
 B96-G0-S24-Q0 True |   0.0%/  0.0% |   100.0% |       47.97 |    0.00 |   100.00%
 B96-G12-S24-Q0 True |   0.0%/  0.0% |   100.0% |       49.39 |    0.00 |   100.00%
 B96-G24-S24-Q0 True |   0.0%/  0.0% |   100.0% |       50.77 |    0.00 |   100.00%
 B96-G0-S24-Q4 True |   0.0%/  0.0% |   100.0% |       52.78 |    4.66 |   100.00%
 B96-G12-S24-Q4 True |   0.0%/  0.0% |   100.0% |       52.98 |    4.48 |   100.00%
 B96-G24-S24-Q4 True |   0.0%/  0.0% |   100.0% |       54.27 |    4.44 |   100.00%
 B96-G0-S24-Q8 True |   0.0%/  0.0% |   100.0% |       56.16 |   10.16 |   100.00%
 B96-G12-S24-Q8 True |   0.0%/  0.0% |   100.0% |       58.86 |   10.44 |   100.00%
 B96-G24-S24-Q8 True |   0.0%/  0.0% |   100.0% |       60.14 |   10.34 |   100.00%
 B24-G0-S4-Q0 False | 100.0%/ 96.9% |   100.0% |       12.95 |    0.00 |   100.00%
 B24-G12-S4-Q0 False |  96.9%/ 92.2% |   100.0% |       14.33 |    0.00 |   100.00%
 B24-G24-S4-Q0 False |  93.8%/ 70.3% |   100.0% |       15.95 |    0.00 |   100.00%
 B24-G0-S4-Q4 False | 100.0%/ 95.3% |   100.0% |       16.25 |    8.80 |   100.00%
 B24-G0-S12-Q0 False |  84.4%/ 64.1% |   100.0% |       17.72 |    0.00 |   100.00%
 B24-G12-S12-Q0 False |  82.8%/ 64.1% |   100.0% |       17.80 |    0.00 |   100.00%
 B24-G12-S4-Q4 False |  96.9%/ 90.6% |   100.0% |       17.94 |    7.86 |   100.00%
 B24-G24-S12-Q0 False |  79.7%/ 54.7% |   100.0% |       18.08 |    0.00 |   100.00%
 B24-G12-S12-Q4 False |  81.2%/ 64.1% |   100.0% |       20.30 |    6.14 |   100.00%
 B24-G0-S4-Q8 False | 100.0%/ 95.3% |   100.0% |       20.70 |   18.72 |   100.00%
 B24-G24-S4-Q4 False |  90.6%/ 68.8% |   100.0% |       20.94 |    6.89 |   100.00%
 B24-G0-S12-Q4 False |  84.4%/ 64.1% |   100.0% |       22.47 |    6.45 |   100.00%
 B24-G24-S12-Q4 False |  79.7%/ 54.7% |   100.0% |       23.08 |    6.17 |   100.00%
 B24-G12-S4-Q8 False |  96.9%/ 90.6% |   100.0% |       24.72 |   17.41 |   100.00%
 B48-G0-S4-Q0 False |  70.3%/ 40.6% |   100.0% |       25.20 |    0.00 |   100.00%
 B48-G0-S12-Q0 False |  31.2%/ 12.5% |   100.0% |       25.20 |    0.00 |   100.00%
 B24-G0-S12-Q8 False |  84.4%/ 64.1% |   100.0% |       25.84 |   13.75 |   100.00%
 B48-G12-S4-Q0 False |  64.1%/ 29.7% |   100.0% |       26.62 |    0.00 |   100.00%
 B48-G12-S12-Q0 False |  29.7%/ 10.9% |   100.0% |       26.62 |    0.00 |   100.00%
 B24-G24-S4-Q8 False |  90.6%/ 68.8% |   100.0% |       26.83 |   15.25 |   100.00%
 B48-G24-S4-Q0 False |  46.9%/ 20.3% |   100.0% |       27.91 |    0.00 |   100.00%
 B48-G24-S12-Q0 False |  20.3%/  7.8% |   100.0% |       27.91 |    0.00 |   100.00%
 B24-G24-S12-Q8 False |  79.7%/ 54.7% |   100.0% |       28.08 |   13.59 |   100.00%
 B48-G0-S4-Q4 False |  68.8%/ 40.6% |   100.0% |       28.91 |    5.55 |   100.00%
 B48-G0-S12-Q4 False |  29.7%/ 12.5% |   100.0% |       29.75 |    4.86 |   100.00%
 B48-G12-S12-Q4 False |  29.7%/ 10.9% |   100.0% |       30.39 |    4.72 |   100.00%
 B24-G12-S12-Q8 False |  81.2%/ 64.1% |   100.0% |       30.42 |   14.81 |   100.00%
 B48-G12-S4-Q4 False |  60.9%/ 26.6% |   100.0% |       30.81 |    5.25 |   100.00%
 B48-G24-S4-Q4 False |  43.8%/ 20.3% |   100.0% |       30.84 |    4.92 |   100.00%
 B48-G24-S12-Q4 False |  20.3%/  7.8% |   100.0% |       30.91 |    4.55 |   100.00%
 B48-G0-S12-Q8 False |  29.7%/ 12.5% |   100.0% |       35.38 |   11.12 |   100.00%
 B48-G0-S4-Q8 False |  68.8%/ 40.6% |   100.0% |       35.41 |   12.72 |   100.00%
 B48-G12-S4-Q8 False |  60.9%/ 26.6% |   100.0% |       37.69 |   12.22 |   100.00%
 B48-G12-S12-Q8 False |  29.7%/ 10.9% |   100.0% |       38.14 |   11.38 |   100.00%
 B48-G24-S12-Q8 False |  20.3%/  7.8% |   100.0% |       38.28 |   10.94 |   100.00%
 B48-G24-S4-Q8 False |  43.8%/ 20.3% |   100.0% |       40.09 |   12.16 |   100.00%
 B96-G0-S4-Q0 False |  15.6%/  6.2% |   100.0% |       47.97 |    0.00 |   100.00%
 B96-G0-S12-Q0 False |   7.8%/  3.1% |   100.0% |       47.97 |    0.00 |   100.00%
 B96-G12-S4-Q0 False |   9.4%/  4.7% |   100.0% |       49.39 |    0.00 |   100.00%
 B96-G12-S12-Q0 False |   4.7%/  3.1% |   100.0% |       49.39 |    0.00 |   100.00%
 B96-G24-S4-Q0 False |   4.7%/  3.1% |   100.0% |       50.77 |    0.00 |   100.00%
 B96-G24-S12-Q0 False |   3.1%/  1.6% |   100.0% |       50.77 |    0.00 |   100.00%
 B96-G0-S4-Q4 False |  14.1%/  6.2% |   100.0% |       51.62 |    4.70 |   100.00%
 B96-G0-S12-Q4 False |   7.8%/  3.1% |   100.0% |       52.50 |    4.69 |   100.00%
 B96-G12-S12-Q4 False |   4.7%/  3.1% |   100.0% |       53.09 |    4.56 |   100.00%
 B96-G12-S4-Q4 False |   9.4%/  4.7% |   100.0% |       53.97 |    4.77 |   100.00%
 B96-G12-S12-Q8 False |   4.7%/  3.1% |   100.0% |       55.34 |    9.69 |   100.00%
 B96-G24-S4-Q4 False |   4.7%/  3.1% |   100.0% |       55.77 |    4.75 |   100.00%
 B96-G24-S12-Q4 False |   3.1%/  1.6% |   100.0% |       56.27 |    4.72 |   100.00%
 B96-G12-S4-Q8 False |   9.4%/  4.7% |   100.0% |       59.09 |   10.81 |   100.00%
 B96-G0-S12-Q8 False |   7.8%/  3.1% |   100.0% |       60.50 |   11.38 |   100.00%
 B96-G24-S4-Q8 False |   4.7%/  3.1% |   100.0% |       61.39 |   10.91 |   100.00%
 B96-G0-S4-Q8 False |  14.1%/  6.2% |   100.0% |       63.50 |   12.38 |   100.00%
 B96-G24-S12-Q8 False |   3.1%/  1.6% |   100.0% |       63.52 |   11.25 |   100.00%

SELECTED GATE
------------------------------------------------------------------------------------------------------------
{
  "operating_point": "B24-G24-S24-Q0",
  "buffer_size": 24,
  "mdl_gain_threshold": 24.0,
  "persistence_support": 24,
  "confirmation_probes": 0,
  "feasible": true,
  "worst_transient_false_adoption_rate": 0.0,
  "worst_prechange_false_adoption_rate": 0.0,
  "worst_permanent_recovery_rate": 1.0,
  "worst_profile_mean_adoption_delay": 34.859375,
  "mean_permanent_confirmation_queries": 0.0,
  "mean_permanent_planning_success": 1.0
}

SELECTED-GATE STRESS AUDIT
------------------------------------------------------------------------------------------------------------
sparse-impulses          transient | false=  0.0% | recover= 100.0% | delay=   nan | plan= 100.0% | frozen-plan= 100.0%
sparse-impulses          permanent | false=  0.0% | recover= 100.0% | delay= 33.38 | plan= 100.0% | frozen-plan=   7.3%
dense-impulses           transient | false=  0.0% | recover= 100.0% | delay=   nan | plan= 100.0% | frozen-plan= 100.0%
dense-impulses           permanent | false=  0.0% | recover= 100.0% | delay= 32.56 | plan= 100.0% | frozen-plan=   7.3%
coherent-bursts          transient | false=  0.0% | recover= 100.0% | delay=   nan | plan= 100.0% | frozen-plan= 100.0%
coherent-bursts          permanent | false=  0.0% | recover= 100.0% | delay= 33.00 | plan= 100.0% | frozen-plan=   7.2%
noisy-observer-probes    transient | false=  0.0% | recover= 100.0% | delay=   nan | plan= 100.0% | frozen-plan= 100.0%
noisy-observer-probes    permanent | false=  0.0% | recover= 100.0% | delay= 34.86 | plan= 100.0% | frozen-plan=   7.3%

============================================================================================================
FINAL CALIBRATION SUMMARY
============================================================================================================
selected=B24-G24-S24-Q0 | elapsed=348.79s
worst transient false adoption=0.00% | worst permanent recovery=100.00% | worst mean delay=34.86
artifacts: /content/calibrated_gate_v5_results
bundle: /content/calibrated_gate_v5_results/run_bundle.zip
```

### Cell 6 textual output
```text
====================================================================================================================
OPTION 2 V6 — MDL-GATED SYMBOLIC RULE INVENTION
====================================================================================================================
fast_dev=False | states=65 | transitions=195 | grammar semantic programs=2045 | trials/regime=40
frozen gate: B24-G24-S24-Q0
target global-wind          | bits= 4.0 | canonical=+1
target velocity-drag        | bits= 6.0 | canonical=-sgn(v)
target action-coupling      | bits= 5.0 | canonical=sgn(a)
target center-seeking       | bits=27.0 | canonical=clip((+1 if p < 7 else 0) + (-1 if p >= 7 else 0), -2, 2)
target upper-half-brake     | bits=12.0 | canonical=(-1 if p >= 7 else 0)
target brake-plus-action    | bits=14.0 | canonical=clip(-sgn(v) + sgn(a), -2, 2)
target parity-checkerboard  | OUTSIDE GRAMMAR
target random-local-table   | OUTSIDE GRAMMAR
completed 1/8: global-wind
completed 2/8: velocity-drag
completed 3/8: action-coupling
completed 4/8: center-seeking
completed 5/8: upper-half-brake
completed 6/8: brake-plus-action
completed 7/8: parity-checkerboard
completed 8/8: random-local-table

REPRESENTABLE-RULE AUDIT
--------------------------------------------------------------------------------------------------------------------
 rule                 | active exact | passive exact | lookup trans | active plan | delay | queries | modal active invention
 global-wind          |        97.5% |         97.5% |        65.2% |       97.8% |  28.1 |     2.2 | +1
 velocity-drag        |        97.5% |         97.5% |        69.8% |       98.0% |  32.2 |     2.5 | -sgn(v)
 action-coupling      |        92.5% |         92.5% |        69.6% |       95.3% |  47.2 |     0.9 | sgn(a)
 center-seeking       |       100.0% |        100.0% |        79.3% |      100.0% |  31.2 |     0.0 | clip((+1 if p < 7 else 0) + (-1 if p >= 7 else 0), -2, 2)
 upper-half-brake     |       100.0% |        100.0% |        85.6% |      100.0% | 118.0 |     0.1 | (-1 if p >= 7 else 0)
 brake-plus-action    |        97.5% |         97.5% |        88.7% |       97.7% |  32.4 |     0.3 | clip(-sgn(v) + sgn(a), -2, 2)

OUT-OF-GRAMMAR BOUNDARY AUDIT
--------------------------------------------------------------------------------------------------------------------
 parity-checkerboard  | active adopts=100.0% | active accuracy=  54.7% | active planning=  18.9% | modal=clip(sgn(v) + (-1 if v == 0 else 0), -2, 2)
 random-local-table   | active adopts=100.0% | active accuracy=  56.2% | active planning=  16.6% | modal=clip(sgn(a) + (sgn(v) if a == 0 else 0), -2, 2)

AGGREGATE CONTROLLER AUDIT — representable targets
--------------------------------------------------------------------------------------------------------------------
 frozen  | exact=   0.0% | transition=  41.4% | planning=  15.5%
 lookup  | exact=   0.0% | transition=  76.4% | planning=  58.6%
 passive | exact=  97.5% | transition=  98.7% | planning=  98.1%
 active  | exact=  97.5% | transition=  98.7% | planning=  98.1%

PREDECLARED PREDICTIONS
--------------------------------------------------------------------------------------------------------------------
 P1_active_exact_recovery_at_least_target: PASS
 P2_active_beats_passive_exact_recovery: FAIL
 P3_active_beats_lookup_planning: PASS
 P4_false_prechange_at_most_calibrated_limit: PASS
ValueError: dict contains fields not in fieldnames: 'representable_adoption_rate', 'unrepresentable_adoption_rate', 'false_prechange_adoption_rate', 'mean_queries'
```
