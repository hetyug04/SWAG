# August 2026 experiment notebooks

These three cleaned notebooks preserve the complete chronological experiment archive supplied on August 3, 2026:

1. `active-automata-symbolic-theory-revision.ipynb` — 19 active-automata, representation, abstraction, and neural-to-symbolic experiments.
2. `crystallized-world-model-validity-recovery-symbolic-revision.ipynb` — seven crystallization, validity, recovery, refinement, calibration, and rule-invention experiments.
3. `scaling-crystallized-models-quotient-ontology-certification.ipynb` — language-model, quotient-transfer, ontology, active-learning, and certification experiments from V10.1 through V16.2. Two source cells that concatenated complete programs are split into independent sections.

The notebooks are output-free by design. The full scientific record—including exact configurations, every recorded positive/negative/null result, interrupted and failed runs, warnings, interpretation boundaries, and original cell indices—is in [`records/`](records/). The `*-cells.json` files provide a machine-readable cell and output-size inventory.

## Reproduce

Python 3.11 or 3.12 is recommended. Create an isolated environment from this directory:

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
jupyter lab
```

Open a notebook, run its setup cell once, then run one experiment section at a time. Artifacts are written beneath `outputs/<experiment>/`; this directory is intentionally ignored by Git.

Several registered full runs require a T4/A100-class GPU, substantial RAM, network downloads, or hours of compute. Environment-provided fast/dev modes are smoke tests only and must not be compared with the recorded full settings. CPU-only symbolic sections are identified in their source headers.

Tiny Shakespeare and text8 are downloaded by their respective experiment code when absent. For long-lived replication, cache those files and record their SHA-256 hashes; the historical notebook did not pin dataset checksums.

## Preservation and repairs

The source notebooks are identified in notebook metadata by SHA-256. Cleanup removed empty cells and embedded outputs, added provenance/section headings, separated concatenated programs, and gave every experiment a collision-free relative artifact directory.

Six narrow source/diagnostic repairs are explicitly recorded in affected cell metadata and in the scientific records:

- removed a dead `INITIAL_QUERIES=4` assignment while retaining the recorded/default value 2;
- made an unintended legacy single-seed autorun opt-in before the ten-seed replication;
- repaired two malformed conjunctions in the deterministic FP32 experiment that previously produced a `SyntaxError` and no result;
- guarded an all-NaN confidence-interval summary to preserve an undefined result without a warning;
- cast V13 graph messages to float before float32 aggregation, matching the completed V13.1 correction;
- displayed V14's `cells + 1` failure sentinel as “not reached” instead of the misleading `43/42`.

These repairs make the code parse and make artifact handling portable; they do not convert historical failed/interrupted runs into completed evidence. A rerun must be reported as a new result with its own environment manifest.

## What reproducible means here

All nonempty source programs, seeds, registered parameters, metrics, and controls are preserved. Exact bitwise replay is not guaranteed: several source runs used AMP, TF32, cuDNN benchmarking, GPU-specific branches, unpinned transitive dependencies, and a single seed. The records distinguish exact finite certificates from bounded or sampled fidelity and distinguish learner-visible evidence from private ground-truth audits.
