---
title: "Blockwise Adaptive Looped Transformers"
summary: >-
  A standard transformer applies the same sized stack of layers to every input,
  essentially spending the same compute on easy and hard problems. This project
  asks whether, when a network has several distinct looped stages, it is better
  to give each stage its own independent halting controller (blockwise
  adaptive) or to keep a single shared halting controller for the whole network
  (global). Four models sharing a three-block weight-tied backbone are compared
  at matched compute on a content-addressed variable-hop retrieval task. Every
  model solves the task at its best configuration, but at matched compute
  per-block adaptive halting is beaten by the simpler global controller (−0.094
  mean accuracy, 6.5% win rate) and is statistically identical to picking one
  good uniform depth. The adaptive machinery does perform real conditional
  computation, reaching 95% accuracy at ∼6.4 expected blocks and 99% at ∼7.8.
authors: "Het Patel"
date: "2026"
tags:
  - transformers
  - adaptive computation
  - looped transformers
  - adaptive halting
externalUrl: ""
download: "/uploads/blockwise-adaptive-looped-transformers/paper.pdf"
preview: "/uploads/blockwise-adaptive-looped-transformers/preview.png"
---
