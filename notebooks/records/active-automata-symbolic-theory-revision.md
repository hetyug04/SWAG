<!-- Generated from the preservation audit. Do not treat recorded outputs as rerun validation of the cleaned source. -->

# Audit: `NFAWorldModel.ipynb`

## Notebook metadata

- Source: `the preserved source archive (`NFAWorldModel.ipynb`)`; audited read-only.
- SHA-256: `684828b322a7d9ae6ce755e881a2f78f757871a4313ef5e830649836871633ca`; size 2,138,945 bytes; filesystem modification time 2026-08-01 12:32:32 EDT.
- Notebook format 4.0; 20 cells: 19 nonempty code cells and one empty trailing code cell. There are no markdown cells and no cell IDs. Execution counts are non-monotone (2,5,7,8,9,10,12,14,18,33,39,40,41,3,4,6,9,11,12), so the notebook is an experiment archive, not a top-to-bottom executable narrative. [cells 0–19]
- Kernel metadata: Python 3; Colab metadata declares a T4 GPU and `accelerator: GPU`, although cells 0–12 explicitly describe symbolic/CPU work and cells 13–18 use PyTorch/CUDA when available. [notebook metadata; cells 0–18]
- All substantive cells are self-contained scripts pasted into single cells. Many write JSON/CSV/PNG into transient `/content/...` paths; those files are not notebook attachments. Embedded figures and logs dominate notebook size. [cells 0–18]
- Proposed descriptive title: **From Active Automata Learning to Symbolic Theory Revision: Controlled Experiments in Representation, Abstraction, and Neural-World Extraction**.
- Proposed slug: `active-automata-symbolic-theory-revision`.

## Ordered experiment inventory and findings

### E1. Warm-started NFA/RFSA theory revision

**Question/hypothesis.** Can an NL*-style residual finite-state automaton learner abandon a larger, nearly correct inherited NFA and recover a smaller exact theory through active contradiction queries; does a hard model-capacity limit force genuine replacement rather than exception accumulation? [cells 0–1]

**World/data.** Fully synthetic hidden regular-language oracle over `{a,b}`; ground model has 11 states, 17 arcs, complexity 28. The inherited model has 22 states, 64 arcs, complexity 86 and bounded accuracy 0.9663. No external dataset is used. [cells 0–1]

**Method and exact design.** Warm start enabled; committee counterexample strategy; at most 40 rounds, 256 candidate queries/round, maximum query length 16, 4 initial examples of maximum length 5, bounded score through length 10, seed 7. Cell 0 is uncapped. Cell 1 caps emitted hypotheses at 10 states/24 arcs; the comment says the hidden solution is 9 states/21 arcs but the learner is not given that size. [cells 0–1]

**Results.** Cell 0: round 0 gives accuracy 0.9170, 8 states, 19 arcs, `U=13`, `V=16`, 8 prime rows, 237 queries, not exact; contradiction `ababbba -> True`; round 1 reaches exactness/accuracy 1.0000 with 9 states, 21 arcs, `U=13`, `V=20`, 9 prime rows, 299 queries, and `collapse=True`. Cell 1: inherited theory is over budget; round 0 accuracy 0.9170, 8 states/18 arcs, 237 queries; the same contradiction; round 1 exact 1.0000 with 9 states/20 arcs and 299 queries. Both print `Success: True`. The one-arc discrepancy between cells 0 and 1 is unexplained in prose and should be retained as a version difference, not averaged away. [cells 0–1]

**Interpretation.** Explicit: the scripts operationalize theory revision as contradiction-driven reorganization/collapse. Inferred: the result supports exact recovery in this one synthetic finite oracle under a bounded search regime; it does not establish robustness to noise, nonresettable systems, or unknown representation classes. [cells 0–1]

### E2. Budgeted Mealy-world revision and uncapped control

**Question/hypothesis.** Can a warm-started active learner recover a smaller exact transducer from a full-capacity but inaccurate inherited Mealy theory, and does the hard cap matter? [cells 2–4]

**World/data.** Synthetic deterministic complete Mealy machine over inputs `{a,b}` and outputs `{0,1,2}`. Ground model: 6 states/12 arcs/complexity 18. Inherited model: 8 states/16 arcs/complexity 24, bounded accuracy 0.9335. [cells 2–4]

**Method and exact design.** Warm start depth 1; committee querying; maximum 30 rounds, 512 candidates/round, maximum query length 12, bounded scoring through length 8, seed 19. Cells 2–3 cap hypotheses at 8 states/16 arcs; cell 4 disables the cap while retaining 8 inherited states. Cell 3 is cell 2 with complete endpoint-query logging; cell 4 is the uncapped control. [cells 2–4]

**Results.** In every version, round 0 yields accuracy 0.6595, 5 states/10 arcs, `S=5`, `E=3`, 28 table queries, split/merge/rewrite counts 376/169/17, not exact; search query 29 finds contradiction `abbb -> 0100`. Round 1 reaches exactness/accuracy 1.0000 with 6 states/12 arcs, `S=8`, `E=4`, 52 cumulative table queries, split/merge/rewrite 155/294/14, `collapse=True`; round charges are 28 table + 1 search, then 23 table + 0 search. Capped and uncapped trajectories are identical in the recorded run, so there is no observed causal effect of the capacity intervention in this instance. All print `Success: True`. [cells 2–4]

**Interpretation.** Explicit: the learner replaces a capacity-saturating inherited model with a smaller exact one. Inferred negative/null result: because the uncapped control is numerically identical, the hard budget was not necessary for the observed recovery path in this particular run. [cells 2–4]

### E3. Multi-framework automata unification

**Question/hypothesis.** Given four locally scrambled interfaces, can independent active learners recover local Mealy theories and can an MDL meta-learner select one shared latent world only when appropriate? [cells 5–6]

**World/data.** Two synthetic cases: four views of one shared six-state, three-action world and four independently generated worlds. Inputs/outputs are renamed per framework. No external data. [cells 5–6]

**Initial method/results.** Seed 31; local maximum 20 rounds; counterexamples through length 8 with 3,000 candidate queries/round; adapter cost 1/symbol; unrelated control enabled; 5 observations printed. In the shared case, local sizes are 6,2,6,6 states with 57,21,57,57 queries, yet all are reported exact; the selected single block scores 33 versus 80 for four separate theories, a 47-unit gain, with 6 latent states/18 arcs. In the unrelated case, F4 first needs a contradiction and 109 total queries; the separate partition scores 80 and is selected, with zero gain. Explicit conclusion: controlled unification succeeds but remains inside an automata meta-language. [cell 5]

**Strengthened method/results.** Cell 6 retains seed 31 but uses a stated SUL state upper bound of 8 and W-method-style conformance. Shared case: each local learner returns 6 states/18 arcs with 57 table queries plus 312 W-tests (369 total); one shared block costs 215 bits versus 392 bits separately, a 177-bit improvement, and exactly recovers all hidden action translations. Unrelated case totals are F1 369, F2 642 after contradiction `rovelili`, F3 525, F4 492 after contradiction `qoxiqoxi`; all finish at 6/18 and exact. The four-separate solution is best at 392 bits; forced combinations are much larger (next best 780 bits), so false unification is rejected. [cell 6]

**Interpretation/version warning.** Cell 6 is scientifically preferable: cell 5's two-state shared-view result indicates observational minimization/nonidentifiability and its simple complexity score differs materially from cell 6's encoded bit cost. These are revisions, not independent replications. [cells 5–6]

### E4. Program-synthesis frame invention

**Question/hypothesis.** Can representation search replace four flat transition tables with a shorter shared multi-register coordinate program, without being told the coordinates or action translations? [cell 7]

**Method.** Seed 73; 4 views; 250 held-out traces/view up to length 24; unrelated control; all 15 partitions; search over either flat tables or a supplied finite register-program DSL, exact fit first then shortest explicit bit description. [cell 7]

**Results.** Related views: each has 6 states/30 arcs, 31 discovery queries, exact audit and held-out trace accuracy 1.000. Four flat tables cost 436 bits; the best shared `(2,3)` register program costs 138 bits (77 dynamics + 40 decoders + 21 adapters), saving 298 bits; next candidates cost 208. Search time 6.869 s. Unrelated views likewise reconstruct exactly, but only the fully separate partition is valid; it costs 436 bits, saving 0; search 5.654 s. All three declared outcomes are true: related unification, multi-register selection, rejection of total unrelated unification. [cell 7]

**Interpretation.** Explicit: shorter coordinate language with exact update rules is invented relative to graph tables. Boundary: the program DSL, MDL objective, resettable deterministic world, and primitives are supplied; unrestricted conceptual invention is not demonstrated. [cell 7]

### E5. Executable Boolean library invention

**Question/hypothesis.** Can exact NAND-only program reconstruction support paid MDL macro invention that transfers specifically to related held-out Boolean functions? [cell 8]

**Method.** Seed 104729; 9 mechanism-family trials; base and transfer program cost limits 14; maximum 2,000,000 candidate evaluations; macro header cost 2; minimum macro-body cost 2; 2,000 bootstrap samples. Evidence chain is exact reconstruction, paid abstraction, freeze, related/unrelated transfer, expanded and shuffled ablations, and oracle comparison. [cell 8]

**Results.** Semantic mechanism recovery succeeds in 8/9 families (88.9%); family 08 is the negative result: invented expression is not semantically the hidden id-06 mechanism, though it still lowers corpus MDL 68→59 and related mean cost 5.4→2.6, worse than oracle 1.8. Across trials: mean paid MDL gain 5.33 primitive calls; mean reuse 5.11; related held-out code-cost ratio 0.521 (95% bootstrap CI 0.4501–0.5898); candidate-evaluation ratio 0.692 (CI 0.4144–1.0026, therefore including no improvement); unrelated evaluation ratio 1.792 (CI 1.0215–2.6710, indicating harm); unrelated code-cost ratio 0.666; invented/shuffled evaluation and code ratios 0.494 and 0.721. Fixed depth-3 solve rates are base 37.8%, expanded 37.8%, invented 97.8%, shuffled 66.7%, oracle 100%. All predeclared rubric booleans pass and `Operational Level-4 success=True`. [cell 8]

**Interpretation.** The library improves representation and depth-limited solvability for planted related families but can increase raw search evaluations, and one family is semantically misrecovered. [cell 8]

### E6. Sequential Level-4 library invention

**Question/hypothesis.** Do reusable Boolean operations learned from actively reconstructed sequential worlds shorten and accelerate exact synthesis on unseen related sequential worlds? [cell 9]

**Method.** Seed 424243; 3 state bits, 1 input bit, 1 output bit; 6 training and 6 transfer worlds; library size ≤3; synthesis cost ≤13; ≤2,000,000 evaluations; macro header 2; minimum definition 2; 100 rollouts/world of length 80. Hidden reusable gates have truth IDs 6 and 9. [cell 9]

**Results.** Six training worlds are exact with rollout accuracy 1.000, 9–11 queries of 16, and program cost 20. Two macros are learned with MDL gains 41 and 44; two-part MDL falls 120→35 with definition cost 11; both hidden mechanisms are recovered. On related transfer: base/expanded cost 21 and 73,876.3 evaluations with 12 queries; invented/oracle cost 6 and 3,479.8 evaluations with 8.33 queries; shuffled cost 14 and 157,874.3 evaluations with 10.67 queries. Unrelated costs are base 12, expanded 12, invented 11, shuffled 8, oracle 11. All declared rubric checks pass, including long-rollout exactness; sequential success is true. [cell 9]

### E7. Representation-dependent sample complexity

**Question/hypothesis.** Does a learned Boolean vocabulary change passive exact-recovery sample complexity, search effort, and active identification as a function of semantics, macro price, and enumeration order? [cell 10]

**Method.** Seed 314159; exhaustive 16-point truth-table worlds over 4 variables; 8 training worlds; 16 factorial worlds; 24 paired passive observation orders; 6 active replications; 8 sweep worlds/mixture level; mixture levels 0,.25,.5,.75,1; maximum program cost 7 and 15M universe evaluations; active pool 512; 2,000 bootstraps. Learned truth IDs are XOR=6 and XNOR=9; disjoint control gates 2 and 13. [cell 10]

**Results.** Base universe covers 4,960/65,536 semantics; unit invented covers 61,924; unit disjoint 25,867. Eight training worlds reconstruct exactly with mean 10.50 observations. Frozen XOR+XNOR description lengths: base 10, invented unit 2, disjoint unit 6. Passive mean-k: base 13.13; invented unit 9.18/9.34 depending macro/NAND order; invented expansion 12.53/13.13; disjoint unit 12.59/12.49; disjoint expansion 13.05/13.13. Registered contrasts: right-unit −3.945 observations (CI −4.133,−3.760); right-expansion −0.604 (−0.719,−0.490); disjoint-unit −0.536 (−0.682,−0.404); disjoint-expansion −0.076 (−0.135,−0.018); semantics×cost interaction +2.880 (+2.661,+3.102). Invented and oracle trajectories are identical. Active totals range from 16.12–17.06 for invented unit versus 22.50–23.40 base; detailed policy-by-condition totals are preserved in cell output. Sweep: compression advantage versus sample advantage `r=.820`, `R²=.672`, slope .324; invented DL versus recovery-k `r=.700`, `R²=.490`. All validity audits pass. [cell 10]

**Negative results.** Two predeclared predictions fail: disjoint-unit does not hurt versus base; it modestly helps. Right-expansion is not within the declared <0.5 mean-shift approximation to base (shift 0.604). The script explicitly calls these scientific results rather than code failures. [cell 10]

### E8. Fallible concept adoption under contamination and noise

**Question/hypothesis.** When XOR/XNOR vocabulary is useful, will a greedy MDL learner adopt it as the training corpus becomes less related and noisier, relative to an exhaustive global optimum? [cells 11–12]

**Method.** Seed 271828; every 3-input Boolean meaning (256); libraries of ≤2 words drawn from 9 nontrivial gates; 32 training functions; 120 replications per each of 25 related-fraction×noise cells (3,000 corpora); related fractions 0,.25,.5,.75,1; noise 0,.02,.05,.10,.20; mismatch penalty 2; 64 clean held-out functions and 32 passive orders; 2,000 bootstrap repetitions. The 46 zero/one/two-word libraries all reach all 256 meanings. [cells 11–12]

**Baseline/results common to both cells.** NAND-only held-out mean-k 7.121; XOR/XNOR oracle 4.723; potential advantage 2.398. Greedy never beats global MDL; held-out functions/orders are frozen; noise affects adoption only. `P(greedy=opt)` ranges .63–1.00 across cells. Transfer improvement `delta-k` rises with relatedness and usually falls with noise: at relatedness 1 it is 2.398,2.393,2.342,2.036,1.520 across increasing noise. [cells 11–12]

**Reporting correction.** Cell 11's broad `P(exists)` and `P(adopt|exists)` are 1.00 everywhere and `P(full)` is .97–1.00, because almost any MDL-positive vocabulary counts; this obscures planted-concept failure. Cell 12 replaces this primary endpoint with XOR+XNOR specifically. `P(right-opt)` is 0 for relatedness 0/.25; at .50 it is .19,.07,.09,.02,.01; at .75 it is .88,.86,.58,.17,.01; at 1.0 it is 1.00,.99,.93,.55,.03. Conditional on right-optimality, greedy finds the right library with probability 1.00 in every defined cell, so `P(full)=P(right-opt)`. This is the scientifically meaningful negative result: under low relatedness or high noise the target library is not globally supported, rather than the greedy step missing it. [cells 11–12]

**Boundary.** Explicit: breaks guaranteed adoption (G3), but not reachability (G1); only partially challenges planted-family knowledge (G2). [cells 11–12]

### E9. Black-box Newtonian law discovery

**Question/hypothesis.** Can symbolic regression recover and reuse `force/mass` solely from frozen neural black-box responses, transfer to a held-out output channel, and reject a random-network control? [cell 13]

**Method/data.** Synthetic four-channel law `y_i=u_i/u_0`; mass .5–5, force −10–10; OOD mass .25–.45 or 5.5–8 and force −16–16. Seed 8675309; 3 neural oracles; hidden width 128; 1,800 steps, batch 2,048, LR .002. Grammar `{variables,0,1,+,-,*,protected reciprocal}` to cost 2; note `INITIAL_QUERIES=4` is immediately overwritten by environment-default 2; max 28 queries, pool 2,048, committee 24, stable 3 steps, 96 unlabeled anchors, evaluation 4,096. [cell 13]

**Results.** Three NNs: ID RMSE .02714/.03055/.03244; OOD RMSE 4.06640/3.80611/4.02371. The analytic and all trained worlds recover `(inv(u0)*ui)` for training channels with stable-k 2; macro `M0` has 3 occurrences, saving 1, and is aligned. Held-out channel is always recovered physically by active/base, active/macro and random/base at stable-k 2; random/macro is k=3 only for trained_nn_1 and k=2 otherwise. Random NN learns constants `0`, `1`, `0-1`, invents no MDL-positive macro, and has zero false-mechanics recovery. Summary rates are all 1.00 for analytic/trained rule recovery, aligned macro adoption, and held-out active recovery; false control rate 0.00. Independent OOD comparison gives NN RMSE 4.0569/3.9616/3.9360 versus distilled-symbol RMSE 0.0000. [cell 13]

**Interpretation.** Explicit: reusable mechanics-equivalent behavior is extracted, not internal NN concepts; arithmetic is supplied. Inferred caution: active macro did not reduce stable query count versus active base (both 2), so transfer efficiency is a null result even though abstraction recovery succeeds. [cell 13]

### E10. Tiny transformer to symbolic DFA

**Question/hypothesis.** Can bounded L* queries compress a frozen transformer's black-box classifier into a small executable DFA, without reading internals? [cell 14]

**Method/data.** Synthetic hidden 5-state language over `{a,b}`, accepting state 4. Seed 424242; 3 transformers; train length 20, model max 48, 2,200 steps, batch 512, LR .002; model 64 dimensions, 4 heads, 2 layers, FF 160, zero dropout. Exhaustive equivalence certificate through length 10; max 32 L* rounds/64 states; 6,000 OOD words of length 21–40. [cell 14]

**Results.** All transformers achieve ID 1.0000 but long truth accuracy .8470/.8260/.8315. Analytic, each transformer, and constant control converge using 2,047 unique queries; extracted states are 5,5,5,5,1. Bounded endpoint fidelity is 1.0000 for all. Transformer DFAs preserve endpoint fidelity ID/OOD at 1.0000 and .8470/.8260/.8315, yet each extracted DFA has truth ID/OOD 1.0000/1.0000. Constant truth OOD is .1643. A five-state transition table is printed for transformer 0. [cell 14]

**Warnings/interpretation.** PyTorch emits `enable_nested_tensor...norm_first=True`. Exactness is only certified through length 10; the apparently perfect OOD truth score is an independent sample metric. Explicitly, states are a behavioral shadow, not evidence of internal neural states. The curious combination of imperfect NN OOD fidelity and perfect DFA truth means extraction denoises/extrapolates beyond the endpoint on the sampled OOD set; it should not be described as exact recovery of all lengths. [cell 14]

### E11–E13. Evolving neural arithmetic worlds and claim-closing replications

**Initial single-seed study.** Seed 7; 60 epochs; checkpoints 0,5,10,15,20,30,40,50,60; 14 steps/epoch, batch 192, sequence length 14, hidden 32, embedding 16, LR .006; equivalence depth 4 plus 1,800 random words; 8 L* rounds; 30-state cap. The task is modular LSB-first ADD/SUB as a 5-state Mealy machine. At epoch 0 the NN exact score is .011 and a 12-state hypothesis has .272 fidelity/.011 truth; epoch 5 extraction fails at the state cap; epochs 10 onward yield exact 5-state truth machines despite small endpoint errors, stabilizing to fidelity/truth 1.000. Final evolving and pretrained-only extraction are both 5 states, fidelity/truth 1.000, exact. The online run preserves weights exactly versus a control (`max difference=0`). [cell 15]

**Cell 16 duplicate execution warning.** Cell 16 executes an inherited single-seed `main()` before its replication `replication_main()`, producing two experiments and two figures in one cell. Its first run uses the cell-16 schedule (10 steps/epoch, depth 3, 750 random equivalence words) and ends with evolving fidelity .998/truth 1.000 versus pretrained .999/1.000. [cell 16]

**Ten-seed replication.** Seeds 0–9; checkpoints 0,5 and every epoch 10–22; other core architecture LR .006, sequence length 14, hidden 32, embedding 16, cap 30. Predeclared H1/H1-strict predict a canonical 4-state carry/borrow-merged waypoint, H2 a subsequent +1 split, H3 exact symbolic recovery before sustained NN mastery ≥.99 for 3 epochs. First exact epochs by seed: 10,11,10,19,10,10,10,12,10,10; NN mastery: 11,11,10,12,12,13,11,13,11,11. No seed has any canonical/faithful waypoint, making H1 false (0/10, Wilson upper .2775) and H2 ineligible. Exact recovery precedes mastery in 7/10 (Wilson .3968–.8922), supporting H3 descriptively. Numerous individual checkpoint extractions fail at the 30-state cap or return nonexact over-split machines even after NN sequence accuracy is ~1; those are real negative outcomes, not omitted errors. [cell 16]

**Paired claim-closing experiment.** Seeds 0–9 paired across LR .003 and .006; batch 96, 6 steps/epoch, max 150 steps; snapshots every 2 steps in epochs 4–12 and transition, at declared accuracy crossings; grammar-constrained malformed prefixes; 500 random equivalence words; 30-state primary and 60-state first-event control; GPU AMP is on in the recorded run. The primary claim is slow→faithful undersplit intermediates, fast→oversplit or absent; exact arithmetic plus ≥.90 endpoint fidelity defines early crystallization, with .95 sensitivity. [cell 17]

**Per-seed summaries.** Slow arm seeds 0–9 `(exact,faithful90,faithful95,mastery,path)`: `(None,None,None,None,undersplit)`, `(None,None,None,None,undersplit)`, `(145,None,None,None,undersplit)`, `(None,None,None,None,undersplit)`, `(None,None,None,None,undersplit)`, `(None,None,None,None,undersplit)`, `(148,None,None,None,mixed)`, `(None,None,None,None,undersplit)`, `(124,150,None,None,mixed)`, `(None,None,None,None,undersplit)`. Fast arm: `(107,112,120,124,direct)`, `(None,None,None,121,oversplit)`, `(85,99,101,105,direct)`, `(130,130,130,110,direct)`, `(106,106,106,112,direct)`, `(105,125,127,143,direct)`, `(90,101,102,129,undersplit)`, `(None,None,None,None,mixed)`, `(84,90,103,119,direct)`, `(125,125,125,121,oversplit)`. Values are optimizer steps. [cell 17]

**Aggregate results.** Slow: canonical 0/10, faithful canonical 0/10, faithful undersplit 10/10 (Wilson .7225–1), faithful oversplit 2/10 (.0567–.5098), direct exact 0/10, cap-harvest exact 3/10; no eligible early faithful-before-mastery comparison. Fast: canonical 0/10; undersplit 2/10, oversplit 3/10, direct exact 6/10, oversplit-or-direct 8/10, sampled-perfect-but-exactly-wrong 2/10, cap-harvest exact 8/10, post-mastery churn 2/10; among 9 eligible seeds, faithful exact at both .90 and .95 precedes mastery in 6/9 (Wilson .3542–.8794). Directional contrasts are slow-minus-fast undersplit .8 and fast-minus-slow oversplit .1; explicitly exploratory, not a definitive significance test. Minimum teacher accuracy at a faithful-exact-.90 event is .90444. [cell 17]

**Interpretation.** The original canonical 4-state waypoint hypothesis is decisively unsupported in both replications. The paired data instead support frequent slow-arm undersplitting and more fast-arm direct/oversplit paths. Exact truth machines can appear while endpoint fidelity is imperfect, so they are denoising hypotheses and must not be called faithful crystallized NN theories unless the fidelity threshold is met. [cells 16–17]

**Failed deterministic revision.** Cell 18 attempts deterministic FP32 by default (`EVOLVING_AMP=0`, cuDNN benchmark/TF32 off, deterministic on) but has a SyntaxError at source line 1562, beginning `machine is not None and not exact and machine.n_states < 5 and`. It produces no scientific run; only the failure is evidence. [cell 18]

## Cross-cutting scientific synthesis

Explicitly supported across the synthetic settings: active finite-state learners can recover compact exact observable theories; MDL can unify renamed views or construct paid reusable abstractions; frozen learned vocabularies can lower code length and often samples/search for related tasks; symbolic extraction can denoise imperfect neural endpoints. [cells 0–17]

Explicit or preserved negative/null evidence: the Mealy capacity cap has no observed effect [cells 2–4]; semantic macro recovery fails in 1/9 and its evaluation CI includes no advantage [cell 8]; representation controls violate two registered predictions [cell 10]; correct XOR/XNOR adoption collapses under contamination/noise because the target is no longer globally optimal [cell 12]; Newton macro transfer does not reduce stable query count [cell 13]; canonical 4-state neural-learning waypoints occur 0/10 and 0/20 arm-runs [cells 16–17]; many snapshot extractions hit state caps [cells 15–17]; deterministic revision fails to parse [cell 18].

All broader conclusions remain conditional on synthetic, resettable finite worlds, supplied representation grammars/DSLs, exact or controlled-noise labels, and extensive private ground-truth auditing. General claims about unrestricted scientific concept invention, internal neural representations, or real-world law discovery are not established. [cells 5–18]

## Reproducibility blockers and cleanup requirements

1. Split every standalone script into its own notebook or module and add markdown protocol/result cells. Current execution order is not meaningful. [cells 0–19]
2. Preserve versions explicitly: cells 0/1, 2/3/4, 5/6, 11/12, 15/16/17/18 are revisions or controls, not IID replications. [corresponding cells]
3. Fix cell 18 syntax before any rerun; add parse/compile tests. [cell 18]
4. Remove cell 16's unintended first `main()` execution or separate it from `replication_main()`. [cell 16]
5. Replace transient `/content/...` defaults with repository-relative, experiment-specific output directories. Cells 0/1 share `nlstar_rfsa_experiment`; 2–4 share `budgeted_mealy_world`; 11/12 share `fallible_adoption_extension`; these overwrite on sequential runs. [cells 0–4,11–12]
6. Persist machine-readable results and plots alongside notebooks; the notebook currently contains only printed references to files that are not embedded as artifacts. [cells 0–18]
7. Pin Python, NumPy, PyTorch, Matplotlib and CUDA/cuDNN versions; record device and GPU model in results. Only kernel name and T4 metadata are present. [notebook metadata; cells 13–18]
8. Make determinism explicit. Cell 17's AMP/cuDNN benchmark run is numerically sensitive; cell 18's deterministic rewrite failed. Record environment variables (`EVOLVING_FAST`, `STRICT_MAX_STEPS`, AMP flags, NN-count/step overrides) in every result. [cells 13–18]
9. Resolve duplicate/overridden configuration, notably `INITIAL_QUERIES=4` immediately replaced by default 2. [cell 13]
10. Store generated worlds, train/test splits, passive orders, equivalence pools, and query transcripts or their hashes. Seeds alone do not protect against library/RNG/version changes. [cells 0–18]
11. Label private ground-truth evaluations separately from learner-visible evidence in saved schemas, as the prose mostly does. [cells 5–18]
12. Define “exact,” “bounded fidelity,” “converged,” “truth accuracy,” and “success” uniformly. Several experiments use finite certificates or sampled OOD tests, not global proof. [cells 0–18]
13. Add automated assertions for registered predictions and report failures without changing the primary endpoint post hoc; cell 11→12 is a useful correction but must be documented as such. [cells 10–12]
14. Capture warnings and failures in a dedicated diagnostics section: cell 14 nested-tensor warning; cell 17 AMP deprecation warning; cell 18 SyntaxError; repeated state-cap failures in cells 15–17. [cells 14–18]
15. The notebook uses modern type syntax (`tuple[str,...]`) and optional PyTorch APIs, so minimum supported Python must be declared. [cells 0–18]

## Output-size note

The largest scientifically redundant payloads are embedded figures and stepwise logs: cell 17 outputs occupy ~474 KB of notebook JSON and cell 16 ~229 KB; cell 18's error is only 478 bytes. Exact per-cell source/output sizes, purposes, memberships, and relevance flags are in `NFAWorldModel_cells.json`. [cells 0–19]
