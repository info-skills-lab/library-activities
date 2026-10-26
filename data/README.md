# Data for boolean-live-plus.html

| File | Source | Licence |
|---|---|---|
| thesaurus.json | Curated business terms (UNSW Library) and WordNet 3.0 synonyms | WordNet licence, see WORDNET-LICENSE.txt |
| stw.json | STW Thesaurus for Economics, ZBW Leibniz Information Centre for Economics, https://zbw.eu/stw/ (English labels, related and broader terms; geographic and commodity descriptors removed) | Open Database License (ODbL) 1.0, see STW-LICENSE.txt |
| openalex-keywords.json | Keywords from about 15,000 highly cited business, management and accounting works (2015 to 2026) indexed in OpenAlex, https://openalex.org/, with the keywords most often found alongside each one | CC0 |

openalex-keywords.json format: `k` is the keyword list (most common first), `r[i]` lists the indexes of keywords related to `k[i]`.
stw.json format: `p` preferred labels, `a` alternative labels, `r` indexes of related and broader descriptors.
