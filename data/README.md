# Data for boolean-live-plus.html (Search builder)

| File | Source | Licence |
|---|---|---|
| thesaurus.json | A curated list of business research terms and WordNet 3.0 synonyms | WordNet licence, see WORDNET-LICENSE.txt |
| stw.json | STW Thesaurus for Economics, ZBW Leibniz Information Centre for Economics, https://zbw.eu/stw/ (English labels, related and broader terms; geographic and commodity descriptors removed) | Open Database License (ODbL) 1.0, see STW-LICENSE.txt |
| elsst.json | ELSST, European Language Social Science Thesaurus, version 7 (CESSDA), https://elsst.cessda.eu/ (English labels, related and broader terms, lower-cased) | CC BY-SA 4.0, https://creativecommons.org/licenses/by-sa/4.0/ . elsst.json is shared under the same licence |
| aat.json | Art & Architecture Thesaurus, J. Paul Getty Trust, https://www.getty.edu/research/tools/vocabularies/aat/ (English labels from the Associated Concepts, Physical Attributes, Styles and Periods, Activities and Agents facets, with related and broader terms; terms without alternative labels or links removed) | Open Data Commons Attribution License (ODC-By) 1.0, https://opendatacommons.org/licenses/by/1-0/ |
| openalex-keywords.json | Keywords from about 15,000 highly cited business, management and accounting works (2015 to 2026) indexed in OpenAlex, https://openalex.org/, with the keywords most often found alongside each one | CC0 |

openalex-keywords.json format: `k` is the keyword list (most common first), `r[i]` lists the indexes of keywords related to `k[i]`.
stw.json format: `p` preferred labels, `a` alternative labels, `r` indexes of related and broader descriptors.

elsst.json and aat.json use the same format as stw.json.
