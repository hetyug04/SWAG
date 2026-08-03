<!-- Generated from the preservation audit. Do not treat recorded outputs as rerun validation of the cleaned source. -->

# Cell-by-cell scientific audit: `Untitled19.ipynb`

## Notebook identity and metadata

- Source: `the preserved source archive (`Untitled19.ipynb`)`; audited read-only. [notebook metadata]
- Proposed descriptive title: **From Crystallized Language Models to Active Predictive-State Discovery: V10.1–V16.2 Experiment Log**. Proposed slug: `crystallized-models-active-state-discovery-v10-v16`. [cells 0–11]
- Format: nbformat 4.0; 12 cells, all code cells; cell 2 is empty. Kernel: Python 3. Accelerator metadata: GPU, Colab GPU type T4. The outputs show that some cells were actually run on Tesla T4 and others on NVIDIA A100-SXM4-40GB, so notebook-level accelerator metadata is not a reliable run record. [notebook metadata; cells 0, 3–10]
- The notebook is an accreted chronological research log rather than one executable pipeline. Several cells redefine the same global names; cells 3 and 5 concatenate two complete programs in one cell; later cells depend on Colab `/content` paths. Running all cells in order will overwrite artifacts and is not a clean reproduction protocol. [cells 0–11]

## Ordered experiment inventory

1. V10.1: calibrated crystallized nanoGPT/GRU/MDL hybrid on Tiny Shakespeare; interrupted during neural training. [cell 0]
2. V11: quotient-MDL active learner for transfer across arbitrary state relabelings; completed successfully. [cell 1]
3. V12: variable-order MDL finite-state language model on text8, first T4-scale and then A100-scale revisions in the same cell; both completed. [cell 3]
4. V13: neural-quotient active learner; first implementation failed with a BF16/Float accumulation error. [cell 4]
5. V13.1: corrected neural-quotient learner completed, followed in the same cell by an older V13 rerun that was interrupted. [cell 5]
6. V13.1 replicate/continuation: reached crystallization metrics, then was interrupted. [cell 6]
7. V14: ontology-free active learner; completed and produced an important predominantly negative result. [cell 7]
8. V16 core: monotone observation-table predictive-state discovery; completed unit experiment. [cell 8]
9. V16.1: neural counterexample ranking with exact charged W-method verification; completed. [cell 9]
10. V16.2: 20–80-bit compositional-program entropy ladder with exact/PAC verification; completed. [cell 10]
11. V16.2 artifact dump: prints the JSON written by cell 10; no new experiment, but preserves higher-precision results and explicit scope boundary. [cell 11]

## Experiment 1 — V10.1 calibrated crystallized nanoGPT

### Question, systems, data, and method

The stated question is whether a neural + crystallized-symbolic mechanism works on the exact character-level Tiny Shakespeare data and 90/10 split used by Karpathy's nanoGPT example. Matched systems are: a nanoGPT-style causal Transformer; a parameter-matched 2-layer GRU without attention; a variable-order MDL probabilistic context machine; and a GRU/context-machine hybrid whose gate is fitted only on a held-out calibration tail. A symbolic suffix is retained only when predictive gain pays a description-length penalty relative to its shorter suffix; transitions append the emitted character and back off to the longest retained suffix. [cell 0]

The official corpus contained 1,115,394 characters and vocabulary 65. The observed partition was fit 953,854; checkpoint selection 10,000; gate calibration 40,000; validation 111,540 characters. Validation is excluded from fitting and gate choice; the 50,000-character calibration tail is split into checkpoint selection plus gate calibration. [cell 0]

### Exact configuration

Seed 1337; block 256; effective/micro batch 64/64; 2,000 steps; 40 evaluation batches; checkpoints 0,100,250,500,1000,1500,2000; Transformer LR 1e-3 to 1e-4, GRU LR 3e-4 to 3e-5, 100 warmup steps; weight decay .1; dropout .2; Transformer 6 layers/6 heads/width 384; GRU embedding 384, hidden 1024, 2 layers; symbolic order 8, minimum count 3, cap 50,000 states/order, backoff 32, definition penalty 2 nats; prefix observations 10k/25k/50k/100k/250k/500k; gate train/select fractions .60/.20 and 500 steps; generation 700 characters, temperature .82, top-k 24. Environment overrides and reduced CPU/dev configurations are embedded in the cell. Python, NumPy, Torch, and all CUDA devices are seeded. [cell 0]

### Observed results, including failure

Run environment: CUDA, torch 2.11.0+cu128, Tesla T4 14.6 GiB, FP16 AMP; 32,768,000 planned token presentations per neural learner, fused AdamW and compiled nanoGPT training. Selection NLL at step 0 was 4.2804 (nanoGPT) and 4.3673 (GRU); at step 100/2,000 (1,638,400 tokens) it was 2.4527 and 1.8934 respectively. The run then ended in `KeyboardInterrupt` while constructing the next training batch; no symbolic model, gate, final validation metrics, generation, or predeclared-prediction verdicts were produced. Inductor also warned that there were not enough SMs for `max_autotune_gemm`. [cell 0]

The source predeclares five tests—nontrivial MDL machine; hybrid beats nanoGPT validation NLL; hybrid beats both components; gate no-harm on calibration audit; and symbolic reaches NLL≤2 with fewer observations than nanoGPT—but none can be assigned PASS/FAIL from this interrupted run. [cell 0]

### Interpretation and blockers

Explicitly supported: early in training, the GRU had lower selection NLL than nanoGPT (1.8934 vs 2.4527). [cell 0] Inferred only: this does not establish final superiority or validate crystallization. Reproducibility blockers are long GPU runtime, network download, mutable PyTorch/compiler behavior, `/content` paths, hardware-dependent scale switching, CUDA nondeterminism (`cudnn.benchmark=True`), and the absence of completed artifacts. [cell 0]

## Experiment 2 — V11 quotient-MDL active transfer

### Hypothesis and method

The core hypothesis is that complete finite transition tables that differ only by arbitrary state names can be canonicalized into common abstract laws, compressed as one template per isomorphism class, and actively identified in unseen coordinates with fewer queries than learning all transitions. Persistent repeated residual structure should be promoted by MDL, while one-off perturbations should not reorganize the library. [cell 1]

Worlds are strongly connected, asymmetric deterministic machines. All 8! = 40,320 state permutations are enumerated for canonicalization. The library is mined from prior tables; the active policy queries transitions that reduce the template×coordinate hypothesis set; baselines are random quotient queries and local tabular acquisition. Novel laws are four-transition mutations, with active/dual/random validity tests and an MDL exception-vs-new-template comparison. [cell 1]

### Exact configuration and environment

Seed 20260802 (environment-overridable); 8 states, 3 actions, 24 transitions/world; 4 families; 6 prior tasks/family (24); 8 test tasks/family; 3 random-query repeats; 24 novel test tasks; 12 transient tasks; 4 transition changes; audit period 3; report budgets 0,1,2,3,4,5,6,8,10,12,16,20,24. NumPy and Python random are seeded. [cell 1]

### Results

- Four templates were recovered from 24 priors with 100% recovery. Raw description length 1,728.0 bits versus quotient 703.2 bits, compression 2.46×. Hypothesis space: 161,280 template×coordinate assignments. [cell 1]
- Exact identification: quotient-active median 7.0 queries and 100.0% exact@8; quotient-random median 7.0 and 78.1% exact@8; local-tabular median 24.0 and 0.0% exact@8. Thus active improved success at the fixed budget but not median versus random. [cell 1]
- Novel detection medians were 7.0 queries for active, dual, and random. Detected within 12: active 95.8%, dual 100.0%, random 100.0%. This is a null/negative comparison for active detection advantage: random was at least as good here. [cell 1]
- The novel family was four transitions from its nearest template; MDL promoted it after 3 repeated worlds; 12 unique transient worlds caused 0 false promotions. After promotion, future active exact identification remained median 7.0 queries versus 24 local. Elapsed 15.3 s. [cell 1]
- All six predeclared predictions passed: compression >1.5×; active median ≤10; active exact@8 exceeds random by ≥10 percentage points; dual detects ≥90% by 12; repeated regime promoted by 8 with no transient promotion; future median below half-table (12). [cell 1]

### Interpretation and limitations

Explicit: quotienting provides description-length compression and strong fixed-budget transfer across unseen labelings; recurrence-triggered promotion worked without transient false positives. [cell 1] Inferred: active selection's benefit is a tail/fixed-budget effect, not a median-query improvement, and active novelty detection was not superior. [cell 1] Blockers/limits: completely synthetic deterministic fully queryable tables; supplied state/action counts; exhaustive factorial enumeration limits scale; one seed; no confidence intervals; generated worlds rather than external data. [cell 1]

## Experiment 3 — V12 text8 MDL finite-state language model

### Question and method

The question is whether the one-pass variable-order probabilistic context machine scales from Tiny Shakespeare to text8, compresses candidate contexts, benefits from suffix orders beyond 4, and generalizes to a chronologically distant test segment. text8 is 100,000,000 lowercase Wikipedia characters (vocabulary 27) with conventional 90M/5M/5M train/validation/test positions. GPU sorting/counting accelerates fitting, but the learned object is an explicit finite-state machine. This is explicitly not a neural comparison. [cell 3]

Contexts of orders 1–12 with count ≥3 are compared with shorter contexts under an MDL gain criterion (backoff 32, definition penalty 2 nats), capped per order. Evaluation reports NLL-derived bits/character (bpc), top-1 next-character accuracy, model size, retained state count, eligible/retained compression, and a transition audit. Seed 20260802; generation 700 chars at temperature .90. [cell 3]

### Two sequential runs embedded in one cell

Run A (T4-oriented source revision, actually A100): cap 100,000/order; evaluated 1M validation and 1M test; prefixes 1M,3M,10M. Run B (A100-aware revision): cap 250,000/order; evaluated full 5M validation and 5M test; prefixes 1M,10M,30M,90M. Both used torch 2.11.0+cu128 on an A100-SXM4-40GB and GPU counting. Because cell 3 contains two full scripts, running it executes both and the second overwrites the same output directory. [cell 3]

### Scaling results

| run/prefix | retained states by order 1…12 | total states | eligible/retained | model | fit s | val bpc | test bpc | test top-1 |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| A/1M | 27,502,3354,7576,6575,3300,1522,893,479,306,212,156 | 24,902 | 18.85× | 2.9 MiB | 1.0 | 2.0767 | 2.1786 | 53.85% |
| A/3M | 27,580,4754,13997,15800,10504,5499,3367,2172,1398,891,648 | 59,637 | 21.49× | 7.1 MiB | 3.2 | 1.8876 | 1.9955 | 57.23% |
| A/10M | 27,657,6645,25266,37888,32482,20662,12591,8431,5749,4121,3448 | 157,967 | 23.53× | 18.7 MiB | 11.8 | 1.7652 | 1.8407 | 60.07% |
| B/1M | 27,502,3354,7576,6575,3300,1522,893,479,306,212,156 | 24,902 | 18.85× | 2.9 MiB | 1.1 | 2.1080 | 2.1736 | 53.90% |
| B/10M | 27,657,6645,25266,37888,32482,21270,13744,9581,6486,4302,3168 | 161,516 | 23.02× | 19.1 MiB | 9.9 | 1.7741 | 1.8345 | 60.33% |
| B/30M | 27,702,8580,39491,73468,78705,63659,44328,31546,22038,15577,12189 | 390,310 | 24.74× | 46.2 MiB | 25.5 | 1.6582 | 1.7306 | 62.40% |
| B/90M | 27,721,10833,59855,137983,180463,144993,102717,73548,52580,38344,30508 | 832,572 | 28.75× | 98.5 MiB | 59.8 | 1.5670 | 1.6359 | 64.31% |

For run A at 10M, held-out unigram was 4.1293 bpc/17.09%, order≤4 MDL 2.0544/54.88%, and order≤12 1.8407/60.07%; transition audit 100%. For run B at 90M, unigram was 4.1248/17.10%, order≤4 1.9762/56.06%, order≤12 1.6359/64.31%; transition audit 100%. All six predeclared predictions passed in each run: ≥10k states; improving scaling (within .01 tolerance between prefixes); order 12 beats order 4; ≥20% bpc improvement over unigram; compression ≥2×; exact transition audit. [cell 3]

For completeness, the following compact records preserve every per-order diagnostic as `order raw/eligible/retained/median-support`:

- Run A/1M: o1 27/27/27/21587; o2 621/565/502/555; o3 6,519/5,020/3,354/65; o4 31,894/19,580/7,576/26; o5 91,836/42,954/6,575/20; o6 189,327/62,391/3,300/16; o7 304,987/70,314/1,522/11; o8 424,187/70,267/893/8; o9 536,195/63,474/479/7; o10 631,294/54,128/306/6; o11 709,905/44,683/212/6; o12 772,619/35,962/156/5. [cell 3]
- Run A/3M: o1 27/27/27/64545; o2 678/636/580/1026.5; o3 8,491/6,702/4,754/96; o4 49,275/31,084/13,997/33; o5 160,753/79,859/15,800/23; o6 370,670/137,851/10,504/19; o7 657,471/177,772/5,499/14; o8 982,895/196,249/3,367/10; o9 1,317,828/194,527/2,172/9; o10 1,627,402/176,563/1,398/7; o11 1,896,238/153,067/891/6; o12 2,122,574/127,496/648/6. [cell 3]
- Run A/10M: o1 27/27/27/211376; o2 715/696/657/2148; o3 10,656/8,695/6,645/134; o4 74,164/48,772/25,266/39; o5 280,495/146,737/37,888/26; o6 727,718/296,442/32,482/21; o7 1,425,053/441,774/20,662/16; o8 2,301,646/545,983/12,591/15; o9 3,288,876/598,886/8,431/13; o10 4,293,753/592,413/5,749/11; o11 5,232,158/549,885/4,121/8; o12 6,074,623/487,300/3,448/6. [cell 3]
- Run B/1M: identical per-order raw/eligible/retained/support counts to Run A/1M. [cell 3]
- Run B/10M: o1 27/27/27/211376; o2 715/696/657/2148; o3 10,656/8,695/6,645/134; o4 74,164/48,772/25,266/39; o5 280,495/146,737/37,888/26; o6 727,718/296,442/32,482/21; o7 1,425,053/441,774/21,270/15; o8 2,301,646/545,983/13,744/13; o9 3,288,876/598,886/9,581/11; o10 4,293,753/592,413/6,486/9; o11 5,232,158/549,885/4,302/8; o12 6,074,623/487,300/3,168/7. [cell 3]
- Run B/30M: o1 27/27/27/650082; o2 727/719/702/4129.5; o3 12,757/10,615/8,580/175.5; o4 100,859/69,050/39,491/48; o5 431,513/236,004/73,468/31; o6 1,236,426/541,563/78,705/25; o7 2,657,418/925,937/63,659/19; o8 4,650,474/1,288,242/44,328/18; o9 7,111,375/1,564,854/31,546/17; o10 9,860,693/1,702,565/22,038/15; o11 12,647,283/1,704,154/15,577/12; o12 15,314,687/1,612,873/12,189/10. [cell 3]
- Run B/90M: o1 27/27/27/1941713; o2 728/727/721/11003; o3 15,170/12,871/10,833/243; o4 137,056/97,497/59,855/59; o5 673,189/382,250/137,983/34; o6 2,134,569/972,974/180,463/28; o7 4,957,559/1,832,275/144,993/30; o8 9,225,951/2,809,060/102,717/32; o9 14,909,385/3,736,311/73,548/32; o10 21,773,504/4,437,783/52,580/30; o11 29,292,201/4,797,902/38,344/25; o12 36,971,335/4,859,776/30,508/20. [cell 3]

Qualitative generations are locally coherent at phrase level but contain invented/nonwords and weak long-range syntax (examples include “primestead”, “perinter”, “peregrinuclear”, and topic drift). This supports local statistical learning, not factual or semantic competence. [cell 3]

### Interpretation and blockers

Explicit: held-out bpc and accuracy improve monotonically with more one-pass observations; deep suffix states outperform order≤4; MDL retains only a small fraction of eligible contexts and exact transition logic passes the audit. [cell 3] Inferred: the small differences between overlapping A and B results arise from evaluation span and cap changes, not necessarily nondeterminism. Blockers: download from `mattmahoney.net`; no archive checksum enforced despite importing `hashlib`; `/content` paths; high RAM/GPU requirements; hardware-dependent configuration; output overwrite between embedded runs; no neural baseline; single chronological split and seed. [cell 3]

## Experiments 4–6 — V13/V13.1 neural-quotient crystallization

### Shared hypothesis, environment, and method

An imperfect Transformer-predicted transition table is treated as a noisy codeword on a structured finite-program manifold. Candidate template×state-coordinate hypotheses are ranked; the environment is queried at maximally informative missing cells; verified rules are canonicalized under state renaming and recurring rules retained by MDL. The transfer test uses coordinate permutations unseen during neural training, and novelty is a four-transition residual law. Supplied: 8 states, 3 actions, a finite grammar of deterministic machines, and arbitrary cell queries. Learned: in-context transition predictor, recurring canonical templates, and held-out neural/symbolic gate. It explicitly does not test autonomous ontology or grammar discovery. [cells 4–6]

Shared seed 20260813; 32 candidate/4 recurring templates; 40,320 permutations and 1,290,240 template×coordinate hypotheses; 30,000 train, 4,000 neural-calibration, 2,000 prior, and 2,000 gate permutations; 6 prior, 3 gate, 8 test tasks/family; initial/maximum context 8; 8 extra extraction queries; recurrence 3; target neural accuracy .53±.025; up to 5,000 steps, batch 1,024, eval 8,192 every 25; LR 5e-4, weight decay .01; Transformer width 128, 4 heads, 5 layers, dropout 0; gate beta 0,.1,.25,.5,1; 24 novel tasks, 4 changes, audit period 3. V13 uses proposal top-k 4,096; V13.1 uses 16,384 and sweeps 1,024/4,096/16,384/65,536. Python, NumPy and Torch/CUDA are seeded, BF16 selected on A100. [cells 4–6]

### Cell 4 failed V13 result

The run initialized on A100 (8 states, 3 actions, 24 cells, 32 laws, 1,290,240 hypotheses) but failed before training metrics with `RuntimeError: index_add_(): self (Float) and source (BFloat16) must have the same scalar type`. This is a negative implementation result and yields no scientific performance verdict. [cell 4]

### Cell 5 completed V13.1 result

The neural learning curve rose from heldout-k8 accuracy 16.8% at step 1 (loss 2.0796) to 55.0% at step 675 (loss 1.1290); the deliberately imperfect checkpoint restored step 625 at 52.97%. Intermediate logged accuracies at steps 25,50,…,600,650 were 19.5,23.6,26.6,27.9,29.5,32.0,33.3,34.5,36.0,38.1,40.2,40.7,42.8,42.7,44.6,45.4,47.3,46.1,48.4,48.8,50.2,50.3,51.8,52.7,53.0,52.7%; losses are retained in the output. Nonmonotonic validation (e.g. 47.3→46.1 and 53.0→52.7) is a genuine negative detail. [cell 5]

Prior crystallization: neural cell accuracy 47.57%; active exact/re-solved table rate 91.7%; median total observations 8/24. Proposal sweep top-k 1,024/4,096/16,384/65,536 had truth recall and active exact 79.2/83.3/91.7/91.7%, each median 8 observations. Naively canonicalizing noisy tables produced 24 templates; recurrence decoding produced 4, recovered all four true templates, while shuffled-control exact recovery was 4.2%. [cell 5]

Gate calibration beta 0/.1/.25/.5/1 had exact@8 100% throughout; accuracy@4 41.0/39.9/42.4/39.6/43.1%; median exact 7.0/6.5/6.5/6.0/6.0. The selected no-harm beta was 1.0. On untouched representations: symbolic median exact 7, exact@8 100%, accuracy@4 41.3%; calibrated hybrid 6,100%,44.0%; clean oracle 7,100%,42.3%. Direct imperfect neural after 8 observations had table accuracy 43.5% and 0% exact; local tabular exact@8 was 0%. [cell 5]

Novel law: 91.7% detected by 12; median detection 7; nearest residual 4 transitions; promotion after 3 recurring worlds; future median exact 7. All eight predeclared predictions passed. Final summary: 47.6% neural local transitions→91.7% exact active crystallization; library recovery 100%; unseen exact@8 100%; elapsed 62.5 s. [cell 5]

### Cell 5 appended older V13 rerun and cell 6 replicate

After completing V13.1, cell 5 immediately executes an appended V13 program. It restored step 625 at 53.05%, obtained the same 47.57% neural table accuracy but only 79.2% active exact (top-k 4,096), recovered 4 templates with 100% truth recovery and shuffled exact 0%, then ended in `KeyboardInterrupt` before gate/transfer/novelty results. This demonstrates the consequential top-k correction in V13.1 and must not be merged with the completed V13.1 endpoint. [cell 5]

Cell 6 is another V13.1 execution: restored step 625 at 52.97%; neural table accuracy 47.74%; active exact 91.7%; proposal sweep exact 79.2,79.2,91.7,91.7% (the 4,096 point differs from cell 5's 83.3%); template recovery 100%; shuffled control 4.2%; then `KeyboardInterrupt` before gate/transfer. These small differences despite identical declared seed likely reflect GPU nondeterminism or differing process state; exact bitwise reproducibility is not demonstrated. [cell 6]

### Interpretation and blockers

Explicit: with the supplied finite grammar, large enough candidate proposal set and active queries, imperfect local neural predictions can be decoded into exact tables much more often than direct neural use; invariant template recovery and fixed-budget transfer succeeded in the completed run. [cell 5] Inferred: the result is error-correcting search over supplied structure, not open-ended rule discovery, and performance is bounded by truth recall in top-k proposals. [cells 4–6] Blockers: very large 8!×32 hypothesis tensor/search, A100-scale runtime, BF16 bug in V13, CUDA nondeterminism, duplicate conflicting scripts, interrupted replicates, one seed, synthetic tasks, supplied ontology/grammar/query access, and output-directory collisions. [cells 4–6]

## Experiment 7 — V14 ontology-free bootstrap (negative result)

### Question and method

V14 removes supplied state labels/count, action-effect labels/count, family labels, and candidate grammar. The learner receives opaque snapshots, 1,545-bit raw observations, six raw motor commands, and reset/intervention access. PCA plus BIC-selected Gaussian mixtures (K=2…9) proposes states; a behavioral pass merges visually split components using action-conditional futures. Empirical graphs are canonicalized and recurring graphs would form a grammar. Ontology-acquisition cost is explicitly separated from conditional rule-transfer cost. [cell 7]

Seed 20260820; hidden audit generator 6 states/3 action effects; 6 commands; 3 families; 4 prior and 8 test worlds/family; 3 novel recurrences/promotion threshold 3; 45 signal and 1,500 nuisance bits; flip probability .10; 120 snapshots/state; PCA 14; 10 anchors; 2 ontology transition repeats; 3 transition-query repeats; 4 novel changes; budgets 0,2,4,6,8,10,12,16,20,24,30,36. [cell 7]

### All world-level audit results

For family/world, selected K was always 9; inferred final states, ARI(raw/mixture/behavior), action ARI, graph accuracy were: F0W0 6, .574/.835/.987,1.000,100%; F0W1 6,.405/.857/.675,.762,0%; F0W2 2,.081/.786/.330,0,0%; F0W3 7,.525/.843/.920,1,0%; F1W0 7,.144/.896/.957,1,0%; F1W1 8,.875/.877/.893,1,0%; F1W2 7,.601/.867/.882,1,0%; F1W3 7,.540/.864/.965,1,0%; F2W0 4,.104/.733/.455,1,0%; F2W1 6,.518/.838/.823,1,83.3%; F2W2 4,.947/.825/.567,1,0%; F2W3 5,.826/.796/.723,1,0%. [cell 7]

Aggregate state ARI raw/mixture/behavior = .527/.843/.782; exact state-count rate 22.2%. Prior/test action ARI .897/.000; graph accuracy 15.3%. All 12 empirical graphs were canonically unique; recurring grammar productions 0; shuffled promotions 0. Unseen-renderer active and random both achieved 33.3% exact and median 25/36, so active provided no advantage. [cell 7]

Novel occurrences 1/2/3 had safe-policy rejections 0/0/0 and closed-world false accepts 49/43/37; no promotion after three matching residual graphs; future exact query figure 43/42 (exceeds the nominal 42-cell comparison in the printed summary). Median novel rejection was 0.0. [cell 7]

Predictions P1–P8 all failed: behavioral ontology ≥.90 with raw <.50; state-count accuracy; action ARI; graph accuracy; grammar recovery; 2× conditional active transfer; active median beating random; novelty rejection/promotion/reuse. P9 (no supplied labels/counts/grammar) and P10 (separated cost accounting) passed. Elapsed 65.4 s. [cell 7]

### Interpretation and blockers

Explicit: removing ontology and grammar assumptions caused the proposed bootstrap pipeline to fail at state discovery, graph recovery, transfer, and novelty handling, despite good mixture ARI and often high per-world action ARI. [cell 7] Inferred: ontology errors compound into unique incorrect graphs, preventing recurrence detection; better clustering alone is insufficient. [cell 7] Blockers/limits: synthetic balanced snapshots; hidden generator still assumes deterministic controlled worlds; fixed BIC range; SciPy/scikit-learn versions unpinned; single seed; reset/intervention access; no uncertainty intervals. The `future exact=43/42` output should be audited as a likely sentinel/off-by-one reporting convention before publication. [cell 7]

## Experiment 8 — V16 monotone observation-table core

### Question, method, and parameters

This unit experiment asks whether active suffix refinement can learn minimal Moore machines without state labels/count or fixed diagnostic depth. Histories are partitioned by acquired suffixes; counterexamples only split classes, so no irreversible merge occurs. Synthetic machines are reachable and minimal. Seed 20260822; state sizes 6,10,16,24; 3 actions; 2 outputs; 8 trials/size. Supplied: action alphabet, reset, and an exact synthetic equivalence oracle. [cell 8]

### Results

All 32 trials were exact (100%). For 6/10/16/24 states: median membership queries 89.5/187.5/373.5/560.0; median membership primitive actions 378.5/908.0/2,044.5/3,585.0; median suffixes 4/6/8/9; maximum suffix depth 4/3/6/6. [cell 8]

Explicit: monotone refinement recovered all tested finite machines and scaled to 24 states. [cell 8] Inferred: query/action cost grows substantially with state count; exactness depends on the uncharged/externally supplied exact equivalence oracle, so this is not yet an interaction-realistic result. Per-trial details were written to `/content/active_observation_table_v16_core.json` but are not embedded in the notebook, a reproducibility/data-preservation blocker. [cell 8]

## Experiment 9 — V16.1 neural counterexample ranking with exact W-method certificate

### Question, method, and parameters

This replaces V16's synthetic equivalence oracle with legal black-box W-method conformance tests. A neural network ranks tests, but only executed membership queries reject a conjecture; exhausting the suite certifies equivalence assuming at most eight reachable states. Baselines rank by length or randomly. Worlds are structured renamed affine-control Moore machines. [cell 9]

Seed 20260823; 8 states, 3 actions, 2 outputs; 64 training, 16 calibration, 32 held-out tasks; 768 collection tests/round; max word length 24; 900 neural steps, batch 1,024, hidden 256; CUDA if available. Python/NumPy/Torch/CUDA seeded. [cell 9]

### Results

Training acquisition at 16/32/48/64 prior tasks produced 17,795/35,889/56,115/75,442 examples, all exact. Neural loss 0.8866 at step 1, 0.7178 at 451, 0.6875 at 900. Calibration selected temperature 4.000; NLL .6213. [cell 9]

Across 32 held-out tasks all methods certified and were exactly correct 100%. Median interactions/actions/resets: length 632.5/510.5/121.5; random 1,051.5/883.5/172.0; neural 829.0/683.0/147.0. Neural ranking therefore used 31.1% more interactions than length ordering (reported saving −31.1%) but 21.2% fewer than random. Prior acquisition cost 567,117 interactions; calibration 140,129; prior amortized per test 17,722.4; neural end-to-end including amortized prior 18,551.4 interactions. [cell 9]

Explicit: the neural ranker preserves exact certification and beats random, but loses to the simple length heuristic and is overwhelmingly worse end-to-end when prior acquisition is charged. [cell 9] Inferred: the learned ranking is not worthwhile for this structured distribution/cost function. Limits: supplied 8-state bound, action alphabet, reset, structured prior distribution; no unknown-bound or non-resettable setting; per-task JSON is not embedded. [cell 9]

## Experiment 10 — V16.2 non-enumerable 20–80-bit entropy ladder

### Question and method

A Transformer and local MLP infer identities of compositional modules from raw 48-D observations under task-specific style shift/scale and noise. The symbolic verifier either purchases all independent identity bits for absolute exactness or purchases 20 random parity hashes (fixed-wrong-proposal soundness ≤2^-20) and falls back to all identity bits on any failed hash. Joint spaces from 2^20 to 2^80 are never enumerated. This deliberately separates proper-score information from logical elimination. [cells 10–11]

Seed 20260824 plus renderer generator seed 20260841; 16 classes, 4 bits/module; entropy 20/32/48/60/80 (5/8/12/15/20 modules); raw/style dims 48/12; Transformer d=128, 4 heads, 4 layers (801,680 parameters); local MLP width 512 (296,976); 2,200 steps, batch 768; 1,000 calibration and 1,000 test programs/rung; LR .002; noise .32; class signal 2.25; style shift .75; style scale .52; BF16 on T4. [cells 10–11]

Training losses Transformer/local at steps 1,250,500,750,1000,1250,1500,1750,2000,2200 were 2.9289/2.7910, .0865/.1464, .0805/.1404, .0739/.1368, .0502/.1168, .0663/.1283, .0473/.1164, .0540/.1151, .0528/.1267, .0688/.1289; sampled module counts were 20,5,8,8,12,8,20,8,12,5. Calibration temperature 1 for both; token NLL .0444876 Transformer and .1107365 MLP. [cells 10–11]

| model/H | token acc | proposal exact | score gain bits | neural bit fraction | exact q | PAC median/mean q | fallback | empirical correct/wrong accept |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Tr/20 | 97.92% | 90.6% | 19.4789 | 97.394% | 20 | 20/21.88 | 9.4% | 100%/0% |
| Tr/32 | 98.525% | 89.2% | 31.4237 | 98.199% | 32 | 20/23.456 | 10.8% | 100%/0% |
| Tr/48 | 98.375% | 83.6% | 47.1623 | 98.255% | 48 | 20/27.872 | 16.4% | 100%/0% |
| Tr/60 | 98.313% | 80.9% | 58.9618 | 98.270% | 60 | 20/31.460 | 19.1% | 100%/0% |
| Tr/80 | 98.515% | 76.9% | 78.7296 | 98.412% | 80 | 20/38.480 | 23.1% | 100%/0% |
| MLP/20 | 96.24% | 83.8% | 19.1774 | 95.887% | 20 | 20/23.240 | 16.2% | 100%/0% |
| MLP/32 | 96.10% | 74.6% | 30.6806 | 95.877% | 32 | 20/28.128 | 25.4% | 100%/0% |
| MLP/48 | 96.275% | 68.0% | 46.0420 | 95.921% | 48 | 20/35.360 | 32.0% | 100%/0% |
| MLP/60 | 95.993% | 61.9% | 57.4240 | 95.707% | 60 | 20/42.860 | 38.1% | 100%/0% |
| MLP/80 | 96.31% | 54.6% | 76.8271 | 96.034% | 80 | 20/56.320 | 45.4% | 100%/0% |

Raw context observations were 5/8/12/15/20 modules or 240/384/576/720/960 scalar features per program. Training consumed 20,661,504 module observations; over 5,000 test programs this amortizes to 4,132.3008/program. Calibration used 20,000 module observations. Runtime 129.554 s on Tesla T4. The PAC wrong-fixed-proposal bound was 9.5367431640625e-7; empirical correctness was 100% with zero wrong acceptances, but that finite sample does not prove a stronger bound. [cells 10–11]

Explicit: the Transformer extracts a larger fraction of program information and exact proposals more often than the local MLP; proposal exactness declines as entropy grows even while token accuracy stays high; PAC fallback and mean query cost grow with entropy; absolute exactness still requires H queries. [cells 10–11] The artifact explicitly says this is not a breakthrough because the 16-module ontology, four-bit identities, reset, and controlled parity-hash oracle are supplied; programs compose a supplied library; no real environment or active suffix discovery is tested. [cell 11]

Warnings/blockers: PyTorch warned nested tensors were disabled because `norm_first=True`; synthetic fixed renderer and query oracle; one seed; CUDA/BF16 and library versions unpinned; `/content` output; high training cost. Cell 11 depends on cell 10 having written `/content/entropy_ladder_v16_2.json`. [cells 10–11]

## Cross-experiment scientific synthesis

Explicit evidence progresses from (i) quotienting known finite ontologies across relabelings (V11), through (ii) scalable suffix-MDL language modeling (V12), (iii) neural error correction over a supplied finite grammar (V13.1), to (iv) attempted removal of the ontology/grammar assumptions (V14), then narrower exact-learning/certification calibrations (V16–V16.2). [cells 1,3,5,7–11]

The strongest negative scientific finding is V14: the earlier transfer gains do not survive the attempted autonomous ontology/grammar bootstrap. V16 and V16.1 repair exact state learning/certification in controlled finite machines, but V16 still uses an equivalence oracle and V16.1's neural ranking loses to length ordering. V16.2 scales the hypothesis entropy without enumeration, but only by supplying a modular ontology and parity-hash interface. [cells 7–11]

Thus the supported conclusion is narrower than “autonomous crystallized intelligence”: invariant structure, MDL retention, active verification, and neural proposals can be useful when the ontology/query contract is controlled; discovering that ontology robustly from raw observations remains unresolved. [cells 1,5,7–11]

## Reproducibility blockers and cleaning recommendations

1. Split every experiment/revision into a separate notebook/module; especially split cell 3's two V12 scripts and cell 5's V13.1 + V13 scripts. [cells 3,5]
2. Preserve source and raw outputs, but label incomplete runs clearly; never report cell 0, cell 4, the appended V13 in cell 5, or cell 6 as completed evidence. [cells 0,4–6]
3. Replace `/content` defaults with project-relative paths and unique run IDs; prevent silent overwrite. [cells 0–11]
4. Pin Python, PyTorch/CUDA, NumPy, SciPy, scikit-learn, Matplotlib versions; record actual GPU and effective configuration into each artifact. [cells 0–11]
5. Add checksums and cached-source instructions for Tiny Shakespeare/text8; add offline failure handling. [cells 0,3]
6. Add deterministic-mode option and explicitly document expected GPU nondeterminism; run multiple seeds with confidence intervals. [cells 0,4–7,9–10]
7. Save all JSON/CSV artifacts alongside cleaned notebooks. Cells 8 and 9 reference JSON files whose detailed trial records are not embedded. [cells 8–9]
8. Add assertions/tests for V14's `43/42` reporting and V13 dtype compatibility. [cells 4,7]
9. Separate generator/audit-only information from learner inputs in code modules and document supplied assumptions at the top of every notebook. [cells 1,4–11]
10. Add smoke-test configurations to V11/V16/V16.1/V16.2, CI tests for logic, and a manifest mapping experiment version→seed→artifact→status. [cells 1,8–11]

## Adversarial audit notes

- “All predictions PASS” is not equivalent to broad validation: several thresholds are evaluated on the same synthetic generator and one seed. [cells 1,3,5]
- V11 active and random share median 7 queries; V11 random/dual novelty detection outperform active at 12. Those null/negative comparisons must accompany the positive fixed-budget exact@8 result. [cell 1]
- V12 does not compare against a neural model and should not be framed as beating neural language models. [cell 3]
- V13.1's exact recovery is upper-bounded by candidate truth recall; increasing top-k is a material method change, not cosmetic tuning. [cells 4–6]
- V13.1 gate beta is chosen on held-out calibration but only one completed test run is present; “no harm” is empirical, not guaranteed. [cell 5]
- V14 conditional transfer cost cannot be presented as end-to-end efficiency; the cell explicitly separates ontology cost. [cell 7]
- V16's exact equivalence oracle is a strong hidden service; V16.1's exact W-method certificate is conditional on the supplied state bound. [cells 8–9]
- V16.2's 2^-20 claim applies to a fixed wrong proposal under the random-hash model; it is not a universal adaptive security guarantee. [cells 10–11]
- Duplicate seeded V13.1 runs differ slightly, so exact reproducibility has not been demonstrated. [cells 5–6]
