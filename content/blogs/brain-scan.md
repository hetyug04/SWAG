---
slug: brain-scan
title: Trauma-Induced Plasticity
excerpt: Exploring how trauma responses can trigger plasticity and rewiring in modular neural networks.
date: Dec 03, 2025
readTime: 5 min read
---

# Blog Post

I want to see if I can combine different parts of my models so far. One thing I realized is that the "trauma" response is an essential part of plasticity and rewiring to make new connections as it perfectly imitates real life. If you're expecting the same thing for a long time and all of a sudden it changes to something else, you must rewire your brain to compensate the overall response not just the initial reaction.

If you burn your hand on a stove, your immediate reaction would be to avoid all stoves. But your overall response would be to be wary of hot surfaces. The optimization here relies on what parts of the brain in specific are changed to make new connections in response, reinforce old connections, and have the capability to make novel connections in response to boredom.

This idea would be combined with the modular brain concept, in which different model sets are trained separately to specialize in specific tasks, and are set up together under a controller model which determines the best way to route information between modules, both in parallel and serial.

I'm trying to think how it would be tested, maybe to compare efficiency, or ability to solve multistep problems which require emergent intelligence beyond the abilities of the modules themselves.

I'm thinking a key testing factor would be to see if it runs live on the terminal, as processing power is definitely a concern till it's tested. If it runs live, after pretraining of modules, I can deploy it immediately and see if it learns a new concept or shows emergent behavior.

### Some math for the nerds:

$$
\lambda_t = \sigma( \frac{1}{k} \sum_{i=0}^k (\mathcal{L}_{t-i} - \mu)^2 )
$$

This is how the loss function of the trauma response is defined. If the model over time is wrong, or shows high variance/shock, the plasticity gate, $\lambda$, opens and allows for higher learning rates and module switching.

## B. The "Rule Shift" Experiment (The Null Hypothesis)

We need a test that specifically isolates the benefit of the "Trauma" mechanism.

**Hypothesis:** A Trauma-equipped Modular network adapts to a reversal of rules faster than a standard Continuous Learning network.

**Null Hypothesis ($H_0$):** The Trauma mechanism causes catastrophic forgetting, performing worse than a standard model with a fixed low learning rate.

### Proposed Test Environment: The "Poisoned Apple" Grid World

*   **Phase 1 (Normal):** Agent navigates a grid. Green objects = +10 reward (food). Red objects = -10 reward (fire).
*   **Phase 2 (The Trauma Event):** Suddenly, the rules invert. Green objects = -50 reward (poison). Red objects = +10 reward.

### Measurement:

*   **Standard Model:** Will likely keep eating green objects for thousands of steps.
*   **Your Model:** Upon hitting the first Green object (-50 shock), it should trigger "Trauma."

**Success Metric:** Does it immediately avoid Green (specific avoidance)? Or does it investigate Red to see if all rules flipped (generalized abstraction)?

The new idea here is that I want to use brain scan datasets to train the modules and the router!!!

-- TO BE CONTINUED (probably not)

