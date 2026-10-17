# Real captures: Usuba review demo

All three images are unedited `grim` screenshots (downsampled and palette-optimized only) of one real run on Harris's
Dell (Omarchy, Hyprland) on **Oct 14, 2026, about 10:10-10:12 AM Mountain**. The model was `usuba-9b` (Q4_K_M GGUF) served
locally by llama.cpp on CPU. Nothing is mocked. The terminal commands were started by hand for the screenshot session
(`~/usuba/demo/review.py`), not through opencode.

**Not included:** a Quickshell plugin-load screenshot and a failing-plugin Checker output. The Dell has no such usable capture, and
the Q4_K_M GGUF is no longer on the Dell, so a fresh run was not possible on Oct 17, 2026. Do not describe these images as
the Checker Scripts' output: the review shown is the model's, given a Checker report plus plugin source.

The review is a preliminary, single-sample output from a model still in training. It shows no benchmark number and says nothing about accuracy.

| File | Shows | Caption | Suggested alt text |
|---|---|---|---|
| `checker-review-1-plugin-source.png` | A real Omarchy bar-widget QML file (`BarWidget.qml`, `b3.q7b.scriptural`), lines 98-136, in a terminal. | The plugin under review: QML for a bar widget. | Terminal showing the end of an Omarchy bar-widget QML file. |
| `checker-review-2-model-generating.png` | Split view: the same plugin on the left, Usuba streaming its JSON review on the right, partway through. | Usuba reading the plugin and writing its review, live. | Two terminals side by side. The right one shows a model's review being generated token by token. |
| `checker-review-3-verdict.png` | The finished review: verdict `changes_requested`, one `blocker` finding (`unbounded-input-resource`, about an unsafe cache path and an unbounded read). | The finished review. | The terminal shows verdict changes_requested with a blocker finding about an unbounded download and symlink risk. |

Staging: none of the pixels were edited. The `[TBD]` rule applies if these go on a page: label them preliminary and "model in training".
