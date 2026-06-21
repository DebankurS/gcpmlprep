# TODO — GCP MLE Prep Project-Specific Fixes

- [x] **Silent Domain Validation Gaps in test.js (High Priority)**
  - Add domain validation assertions in `test.js` to ensure questions only use valid canonical domain strings:
    - `"Domain 1: Framing & Architecture"`
    - `"Domain 2: Data Preparation & Processing"`
    - `"Domain 3: Model Development"`
    - `"Domain 4: MLOps & Pipelines"`
    - `"Domain 5: Monitoring & Responsible AI"`
    - `"Domain 6: Generative AI"`
    - `"Domain 7: Agents & Reasoning Engines"`

- [x] **Loose Test Thresholds (Medium Priority)**
  - Update `test.js` to assert the exact question count of **38** (currently asserts `>= 30`).

- [ ] **Question Storage Standardization (Architectural)**
  - GCP uses multiple JSON files loaded asynchronously via fetch; standardizing with the other two projects to use a single script/module for simplicity (or migrating all to JSON) would simplify testing and consistency.
