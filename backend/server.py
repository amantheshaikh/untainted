from __future__ import annotations

import difflib
import json
import os
import re
import urllib.parse
import urllib.request
import requests
from pathlib import Path
from dataclasses import dataclass, field
from typing import Any, Dict, Iterable, List, Optional, Set, Tuple
from collections import defaultdict, deque  # deque possibly unused now? check
# deque was used for rate limiting in memory, but that was in app.py or server.py?
# server.py had no rate limiting? app.py does.
# deque might be unused in server.py.
# process_ingredients logic? No.
# I'll keep collections just in case for now, but remove the obvious ones.

# Try to import openfoodfacts ProductDataset
try:
    from openfoodfacts import ProductDataset
    OFF_DATASET_AVAILABLE = True
except ImportError:
    ProductDataset = None  # type: ignore
    OFF_DATASET_AVAILABLE = False

# Removed: argparse, base64, html, io, mimetypes, traceback, urllib.error, http.server, HTTPServer, PIL, cv2, pytesseract


CLEAN_EATING_WATCHLIST = {
    "sugar",
    # ... (same list, just renaming variable for clarity)
    "refined sugar",
    "invert sugar",
    "high fructose corn syrup",
    "hfcs",
    "glucose syrup",
    "fructose syrup",
    "maltodextrin",
    "dextrose",
    "palm oil",
    "hydrogenated",
    "partially hydrogenated",
    "shortening",
    "msg",
    "monosodium glutamate",
    "e621",
    "sodium benzoate",
    "e211",
    "potassium sorbate",
    "e202",
    "sodium nitrite",
    "e250",
    "bha",
    "bht",
    "tert-butylhydroquinone",
    "tb hq",
    "e319",
    "sodium nitrate",
    "sodium nitrates",
    "sodium nitrites",
    "artificial colour",
    "artificial color",
    "artificial flavour",
    "artificial flavor",
    "tartrazine",
    "e102",
    "sunset yellow",
    "e110",
    "ponceau 4r",
    "e124",
    "aspartame",
    "acesulfame k",
    "acesulfame-k",
    "saccharin",
    "sucralose",
    "acesulfame",
    "potassium bromate",
    "propyl gallate",
    "calcium propionate",
    "corn syrup solids",
    "neotame",
    "carrageenan",
    "polysorbate 80",
    "propylene glycol",
    "mono and diglycerides",
    "mono- and diglycerides",
    "monoglycerides",
    "diglycerides",
    "lecithin",
}

DEFAULT_FLAG_IDS = {
    "en:sugar",
    "en:sugar-various-sugars",
    "en:high-fructose-corn-syrup",
    "en:palm-oil",
    "en:palm-oil-and-fat",
    "en:monosodium-glutamate",
    "en:e621",
    "en:sodium-benzoate",
    "en:tartrazine",
    "en:sodium-nitrate",
    "en:sodium-nitrite",
    "en:potassium-bromate",
    "en:propyl-gallate",
    "en:calcium-propionate",
    "en:corn-syrup-solids",
    "en:neotame",
    "en:carrageenan",
    "en:polysorbate-80",
    "en:propylene-glycol",
    "en:mono-and-diglycerides-of-fatty-acids",
    "en:lecithins",
}

# Flags for strict Clean Eating mode only
CLEAN_EATING_FLAG_IDS = {
    "en:sugar",
    "en:sugar-various-sugars",
    "en:high-fructose-corn-syrup",
    "en:palm-oil",
    "en:palm-oil-and-fat",
    "en:monosodium-glutamate",
    "en:e621",
    "en:sodium-benzoate",
    "en:tartrazine",
    "en:sodium-nitrate",
    "en:sodium-nitrite",
    "en:potassium-bromate",
    "en:propyl-gallate",
    "en:calcium-propionate",
    "en:corn-syrup-solids",
    "en:neotame",
    "en:carrageenan",
    "en:polysorbate-80",
    "en:propylene-glycol",
    "en:mono-and-diglycerides-of-fatty-acids",
    "en:lecithins",
}

DEFAULT_STOPWORDS = {
    "en": {
        "and",
        "with",
        "contains",
        "containing",
        "made of",
        "made from",
        "made with",
        "may contain",
        "including",
        "includes",
        "ingredients",
        "other ingredients",
        "trace",
        "traces",
        "total",
        "per",
        "into",
    }
}

SPECIAL_TOKEN_REPLACEMENTS: List[Tuple[re.Pattern, str]] = [
    (re.compile(r"mono-\s+and\s+diglycerides", re.IGNORECASE), "mono-and-diglycerides"),
]

SPECIAL_STOPWORD_EXEMPT = {
    "mono- and diglycerides",
    "mono-and-diglycerides",
    "mono and diglycerides",
}

LANG_LINE_RE = re.compile(r"^([a-z]{2}(?:-[a-z0-9]+)?)\s*:(.*)$", re.IGNORECASE)

OFF_DEFAULT_COUNTRY = os.environ.get("OFF_COUNTRY", "world")
OFF_DEFAULT_LANGUAGE = os.environ.get("OFF_LANGUAGE", "en").lower() or "en"

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
TEMPLATE_PATH = BASE_DIR / "templates" / "index.html"
_revamped_candidates = [
    PROJECT_ROOT,
    PROJECT_ROOT / "build",
    PROJECT_ROOT / "dist",
]
REVAMPED_DIR = next((path for path in _revamped_candidates if path.exists()), PROJECT_ROOT)
REVAMPED_BUILD_DIR = PROJECT_ROOT / "build"
REVAMPED_DIST_DIR = PROJECT_ROOT / "dist"
REVAMPED_ROOT = REVAMPED_BUILD_DIR if REVAMPED_BUILD_DIR.exists() else REVAMPED_DIST_DIR
REVAMPED_INDEX = REVAMPED_ROOT / "index.html"
REVAMPED_AVAILABLE = REVAMPED_INDEX.exists()
REVAMPED_ERROR: Optional[str]
if REVAMPED_AVAILABLE:
    REVAMPED_ERROR = None
else:
    if REVAMPED_DIR.exists():
        REVAMPED_ERROR = "Build output not found (expected dist/ or build/)"
    else:
        REVAMPED_ERROR = None

_tax_langs_env = [lang.strip().lower() for lang in os.environ.get("OFF_TAXONOMY_LANGS", "en").split(",") if lang.strip()]
_seen_langs: Set[str] = set()
OFF_TAXONOMY_LANGS: List[str] = []
for lang in _tax_langs_env or ["en"]:
    if lang not in _seen_langs:
        OFF_TAXONOMY_LANGS.append(lang)
        _seen_langs.add(lang)

_cors_allowed_origins_raw = os.environ.get("CORS_ALLOW_ORIGINS", "*").strip()
if not _cors_allowed_origins_raw:
    _cors_allowed_origins_raw = "*"
CORS_ALLOWED_ORIGINS = [origin.strip() for origin in _cors_allowed_origins_raw.split(",") if origin.strip()] or ["*"]
CORS_ALLOW_HEADERS = os.environ.get(
    "CORS_ALLOW_HEADERS",
    "Content-Type, X-Requested-With, Accept, Authorization",
).strip()
CORS_ALLOW_METHODS = os.environ.get("CORS_ALLOW_METHODS", "GET, POST, OPTIONS").strip()
CORS_ALLOWED_ORIGINS_LOOKUP = {origin.lower(): origin for origin in CORS_ALLOWED_ORIGINS if origin != "*"}

ACTIVE_LANGS: Set[str] = {"en"}
if OFF_DEFAULT_LANGUAGE:
    ACTIVE_LANGS.add(OFF_DEFAULT_LANGUAGE.lower())

OFF_TAXONOMY_PATH = os.environ.get("OFF_TAXONOMY_PATH")
OFF_ADDITIVES_PATH = os.environ.get("OFF_ADDITIVES_PATH")
OFF_DATASET_TYPE = os.environ.get("OFF_DATASET_TYPE", "csv")
OFF_DATASET_FIELDS = [f.strip() for f in os.environ.get(
    "OFF_DATASET_FIELDS", "code,product_name,ingredients_text,ingredients_text_en,brands,ingredients_tags"
).split(",") if f.strip()]
OFF_DATASET_MAX_SCAN = int(os.environ.get("OFF_DATASET_MAX_SCAN", "200000"))

# Nutriment thresholds (grams per 100g) used to augment diet rules when
# OpenFoodFacts `nutriments` data is available on a product.
# - DIABETIC_SUGARS_PER_100G_THRESHOLD: above this, mark as high-sugar
# - KETO_NET_CARBS_PER_100G_THRESHOLD: above this, mark as too many net carbs
DIABETIC_SUGARS_PER_100G_THRESHOLD = float(os.environ.get("DIABETIC_SUGARS_PER_100G_THRESHOLD", "5.0"))
KETO_NET_CARBS_PER_100G_THRESHOLD = float(os.environ.get("KETO_NET_CARBS_PER_100G_THRESHOLD", "5.0"))

# Try a couple of default locations for ingredients.txt when env var is not set
if not OFF_TAXONOMY_PATH:
    guesses = [
        BASE_DIR / "ingredients.txt",
        BASE_DIR / "taxonomies" / "ingredients.txt",
    ]
    for guess in guesses:
        if guess.exists():
            OFF_TAXONOMY_PATH = str(guess)
            break

if not OFF_ADDITIVES_PATH:
    guesses = [
        BASE_DIR / "additives.txt",
        BASE_DIR / "taxonomies" / "additives.txt",
    ]
    for guess in guesses:
        if guess.exists():
            OFF_ADDITIVES_PATH = str(guess)
            break


# --- Utility helpers -----------------------------------------------------

def normalize_additive_code(text: str) -> str:
    """
    Normalize additive codes to E-number format.
    
    Converts INS codes to E-numbers and handles sub-classifications.
    Examples:
        - "INS 500" -> "e500"
        - "INS 500 (ii)" -> "e500(ii)"
        - "INS 500(ii)" -> "e500(ii)"
        - "E 500 (ii)" -> "e500(ii)"
        - "e500 (ii)" -> "e500(ii)"
    
    Args:
        text: Input text that may contain additive codes
        
    Returns:
        Normalized text with E-number format
    """
    # Pattern to match INS/E codes with optional spaces and sub-classifications
    # Matches: INS 500, INS 500(ii), INS 500 (ii), E500, E 500, E500(ii), E 500 (ii), etc.
    pattern = r'\b(?:INS|E)\s*(\d+)\s*(\([ivx]+\))?'
    
    def replace_code(match):
        number = match.group(1)
        subclass = match.group(2) if match.group(2) else ""
        # Remove spaces from sub-classification if present
        subclass = subclass.replace(" ", "")
        return f"e{number}{subclass}"
    
    # Apply the replacement
    result = re.sub(pattern, replace_code, text, flags=re.IGNORECASE)
    return result


def normalize_token(text: str) -> str:
    """
    Normalize text for matching, preserving E-number sub-classifications.
    
    Keeps parentheses for E-number codes (e.g., e500(ii)) but removes them elsewhere.
    """
    text = text.strip().lower()
    text = re.sub(r"[\u2010\u2011\u2012\u2013\u2014]", "-", text)
    
    # Check if this looks like an E-number with sub-classification
    # Pattern: e followed by digits, optionally followed by (roman numerals)
    is_enumber = re.match(r'^e\d+(\([ivx]+\))?$', text)
    
    if is_enumber:
        # For E-numbers, only remove spaces but keep parentheses
        text = re.sub(r"[^a-z0-9()\-]", "", text)
    else:
        # For everything else, remove all special characters including parentheses
        text = re.sub(r"[^a-z0-9+\-\s]", " ", text)
    
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def titleize(text: str) -> str:
    parts = []
    for piece in text.split():
        parts.append(piece.upper() if piece.isupper() else piece.capitalize())
    return " ".join(parts)


@dataclass
class IngredientNode:
    node_id: str
    names: Dict[str, str] = field(default_factory=dict)
    synonyms: Dict[str, List[str]] = field(default_factory=dict)
    parent_ids: Set[str] = field(default_factory=set)
    parents: List["IngredientNode"] = field(default_factory=list)
    properties: Dict[str, Any] = field(default_factory=dict)

    def add_name(self, lang: str, value: str) -> None:
        key = lang.lower()
        cleaned = value.strip()
        if not cleaned:
            return
        parts = [part.strip() for part in re.split(r"[;,]", cleaned) if part.strip()]
        if not parts:
            return
        primary = parts[0]
        if key not in self.names:
            self.names[key] = primary
        elif primary.lower() != self.names[key].lower():
            self.add_synonym(key, primary)
        for extra in parts[1:]:
            self.add_synonym(key, extra)

    def add_synonym(self, lang: str, value: str) -> None:
        key = lang.lower()
        cleaned = value.strip()
        if not cleaned:
            return
        bucket = self.synonyms.setdefault(key, [])
        if cleaned not in bucket:
            bucket.append(cleaned)

    def add_parent(self, node_id: str) -> None:
        node_id = node_id.strip()
        if node_id:
            self.parent_ids.add(node_id)


class IngredientTaxonomy:
    def __init__(self, path: Optional[str] = None):
        self.nodes: Dict[str, IngredientNode] = {}
        self.mapping: Dict[str, str] = {}
        self.stopwords: Dict[str, Set[str]] = {}
        self._plain_tokens: Set[str] = set()
        if path:
            self.load(path)

    def load(self, path: str) -> None:
        nodes, stopwords = self._parse_file(path)
        self.nodes = nodes
        self.stopwords = stopwords
        self.mapping.clear()
        self._plain_tokens.clear()

        active_langs = {lang.lower() for lang in ACTIVE_LANGS}

        for node_id, node in nodes.items():
            plain = normalize_token(node_id.split(":", 1)[-1])
            self._register_mapping(node_id.lower(), node_id)
            if plain:
                self._register_mapping(plain, node_id, prefer=True)
                self._plain_tokens.add(plain)
            for lang, name in node.names.items():
                token = normalize_token(name)
                if token:
                    if lang.lower() in active_langs:
                        self._register_mapping(token, node_id, prefer=True)
                        self._plain_tokens.add(token)
                    self._register_mapping(f"{lang}:{token}", node_id)
            for lang, syns in node.synonyms.items():
                for syn in syns:
                    token = normalize_token(syn)
                    if token:
                        if lang.lower() in active_langs:
                            self._register_mapping(token, node_id)
                            self._plain_tokens.add(token)
                        self._register_mapping(f"{lang}:{token}", node_id)

        # resolve parent references
        for node in nodes.values():
            node.parents = [nodes[parent_id] for parent_id in node.parent_ids if parent_id in nodes]

    def _register_mapping(self, key: str, node_id: str, prefer: bool = False) -> None:
        if not key:
            return
        existing = self.mapping.get(key)
        if not existing or prefer:
            self.mapping[key] = node_id
            return
        if existing == node_id:
            return
        existing_canonical = normalize_token(existing.split(":", 1)[-1])
        new_canonical = normalize_token(node_id.split(":", 1)[-1])
        if key == new_canonical and key != existing_canonical:
            self.mapping[key] = node_id

    def _parse_file(self, path: str) -> Tuple[Dict[str, IngredientNode], Dict[str, Set[str]]]:
        nodes: Dict[str, IngredientNode] = {}
        stopwords: Dict[str, Set[str]] = {}
        ingredient_header = re.compile(r"#\s*ingredient/([^\s#]+)", re.IGNORECASE)
        parent_hint = re.compile(r"#\s*<\s*([a-z]{2}(?::[^\s#]+)?)", re.IGNORECASE)

        def fresh_block() -> Dict[str, Any]:
            return {
                "slug": None,
                "names": {},
                "synonyms": {},
                "parents": set(),
                "properties": {},
            }

        block: Dict[str, Any] = fresh_block()

        def add_name_entry(lang: str, value: str) -> None:
            bucket = block.setdefault("names", {}).setdefault(lang.lower(), [])
            bucket.append(value.strip())

        def add_synonym_entry(lang: str, value: str) -> None:
            bucket = block.setdefault("synonyms", {}).setdefault(lang.lower(), [])
            bucket.append(value.strip())

        def finalize_block() -> None:
            nonlocal block
            names = block.get("names", {})
            synonyms = block.get("synonyms", {})
            if not names and not synonyms:
                block = fresh_block()
                return

            slug = block.get("slug")
            slug_lang = "en"
            slug_value: Optional[str] = None
            if slug:
                if ":" in slug:
                    slug_lang, slug_value = slug.split(":", 1)
                else:
                    slug_value = slug
            if not slug_value:
                primary_lang = "en" if names.get("en") else next(iter(names), "en")
                primary_values = names.get(primary_lang, [])
                primary_name = primary_values[0] if primary_values else f"ingredient-{len(nodes) + 1}"
                slug_value = normalize_token(primary_name).replace(" ", "-") or f"ingredient-{len(nodes) + 1}"
                slug_lang = primary_lang

            node = IngredientNode(node_id=f"{slug_lang}:{slug_value}")

            for lang, values in names.items():
                for value in values:
                    node.add_name(lang, value)

            for lang, values in synonyms.items():
                for value in values:
                    node.add_synonym(lang, value)

            for parent_id in block.get("parents", set()):
                if ":" not in parent_id:
                    parent_id = f"en:{parent_id}"
                node.add_parent(parent_id)

            node.properties.update(block.get("properties", {}))

            for lang, values in list(node.synonyms.items()):
                seen: Set[str] = set()
                deduped = []
                for value in values:
                    low = value.lower()
                    if low in seen:
                        continue
                    seen.add(low)
                    deduped.append(value)
                node.synonyms[lang] = deduped

            nodes[node.node_id] = node
            block = fresh_block()

        with open(path, "r", encoding="utf-8") as handle:
            for raw_line in handle:
                line = raw_line.strip()
                if not line:
                    finalize_block()
                    continue

                if line.startswith("#"):
                    header_match = ingredient_header.match(line)
                    if header_match:
                        finalize_block()
                        block["slug"] = header_match.group(1).strip()
                        continue

                    parent_match = parent_hint.match(line)
                    if parent_match:
                        block.setdefault("parents", set()).add(parent_match.group(1))
                    continue

                if line.lower().startswith("stopwords"):
                    cleaned = line.replace("stopwords;", "stopwords:")
                    parts = cleaned.split(":", 2)
                    if len(parts) >= 3:
                        if parts[0].lower().startswith("stopwords") and ":" in cleaned:
                            lang = parts[1].strip().lower()
                            words = parts[2].replace(";", ",")
                        else:
                            lang = parts[0].split(";", 1)[-1].strip().lower()
                            words = parts[-1]
                        tokens = [normalize_token(w) for w in words.split(",") if normalize_token(w)]
                        if lang and tokens:
                            stopwords.setdefault(lang, set()).update(tokens)
                    continue

                if line.startswith("<"):
                    alias = line[1:].strip()
                    match = LANG_LINE_RE.match(alias)
                    if match:
                        lang = match.group(1).strip().lower()
                        value = match.group(2).strip()
                        add_synonym_entry(lang, value)
                    continue

                if ":" not in line:
                    finalize_block()
                    block["slug"] = line.strip()
                    continue

                key, _, rest = line.partition(":")
                field = key.strip()
                value = rest.strip()
                if not field:
                    continue

                lowered_field = field.lower()
                lang_match = LANG_LINE_RE.match(line)
                if lang_match and len(field) == 2:
                    lang = field.lower()
                    add_name_entry(lang, value)
                    continue

                if lowered_field == "synonyms":
                    lang, _, names_value = value.partition(":")
                    lang = lang.strip().lower()
                    words = [name.strip() for name in names_value.split(",") if name.strip()]
                    for word in words:
                        add_synonym_entry(lang, word)
                    continue

                if lowered_field == "name":
                    lang, _, text_value = value.partition(":")
                    lang = lang.strip().lower()
                    add_name_entry(lang, text_value.strip())
                    continue

                if lowered_field == "parents":
                    for parent_id in [p.strip() for p in value.split(",") if p.strip()]:
                        block.setdefault("parents", set()).add(parent_id)
                    continue

                if lowered_field == "children":
                    continue

                block.setdefault("properties", {})[field] = value

        finalize_block()
        return nodes, stopwords

    def lookup(self, token: str) -> Optional[IngredientNode]:
        if not token:
            return None
        direct = self.mapping.get(token)
        if direct:
            return self.nodes.get(direct)
        for lang in _build_preferred_languages():
            lang_key = f"{lang}:{token}"
            if lang_key in self.mapping:
                return self.nodes.get(self.mapping[lang_key])
        return None

    def fuzzy(self, token: str) -> Optional[IngredientNode]:
        if not token or not self._plain_tokens:
            return None

        search_pool = list(self._plain_tokens)
        normalized = token

        def best_match(cutoff: float) -> Optional[str]:
            matches = difflib.get_close_matches(normalized, search_pool, n=5, cutoff=cutoff)
            if not matches:
                return None
            best = max(matches, key=lambda candidate: difflib.SequenceMatcher(None, normalized, candidate).ratio())
            return best

        length = len(normalized)
        initial_cutoff = 0.9 if length <= 4 else 0.82 if length <= 8 else 0.75
        match = best_match(initial_cutoff)
        if match is None and length >= 5:
            match = best_match(max(initial_cutoff - 0.1, 0.65))

        if match is None and " " in normalized:
            condensed = normalized.replace(" ", "")
            condensed_pool = {candidate: candidate.replace(" ", "") for candidate in search_pool}
            # Try matching without spaces for messy OCR results
            matches = difflib.get_close_matches(condensed, list(condensed_pool.values()), n=5, cutoff=0.7)
            if matches:
                reverse_lookup = {value: key for key, value in condensed_pool.items()}
                match = reverse_lookup.get(matches[0])

        if match is None:
            return None
        return self.lookup(match)

    def display_name(self, node: IngredientNode) -> str:
        for lang in _build_preferred_languages():
            if lang in node.names:
                return node.names[lang]
        if node.names:
            return next(iter(node.names.values()))
        return node.node_id.split(":", 1)[-1]

    def describe(self, node: IngredientNode) -> Dict[str, Any]:
        display = self.display_name(node)
        parents: List[str] = []
        for parent in node.parents[:5]:
            parents.append(self.display_name(parent))
        synonyms: List[str] = []
        for lang in _build_preferred_languages():
            synonyms.extend(node.synonyms.get(lang, []))
        cleaned_synonyms = []
        seen: Set[str] = set()
        for synonym in synonyms:
            low = synonym.lower()
            if low in seen or normalize_token(synonym) == normalize_token(display):
                continue
            seen.add(low)
            cleaned_synonyms.append(synonym)
            if len(cleaned_synonyms) >= 8:
                break
        return {
            "id": node.node_id,
            "display": display,
            "parents": parents,
            "synonyms": cleaned_synonyms,
        }


@dataclass
class NormalizedIngredient:
    original: str
    token: str
    canonical: str
    display: str
    taxonomy: Optional[Dict[str, Any]]
    confidence: float = 1.0  # 1.0 = exact match, 0.75-0.99 = fuzzy, <0.75 = heuristic
    match_type: str = "exact"  # "exact", "synonym", "fuzzy", "heuristic"
    position: int = 0  # Position in ingredient list (1 = first, highest concentration)


class IngredientNormalizer:
    def __init__(self, taxonomy: Optional[IngredientTaxonomy], additives: Optional[IngredientTaxonomy] = None):
        self.taxonomy = taxonomy
        self.additives = additives

    def normalize(self, text: str) -> List[NormalizedIngredient]:
        tokens = self._tokenize(text)
        seen: Set[str] = set()
        results: List[NormalizedIngredient] = []
        position = 0
        for raw_token in tokens:
            normalized = normalize_token(raw_token)
            if not normalized or _is_stopword(normalized):
                continue
            canonical, display, taxonomy_info, confidence, match_type = self._resolve(normalized)
            if canonical in seen:
                continue
            seen.add(canonical)
            position += 1
            results.append(
                NormalizedIngredient(
                    original=raw_token,
                    token=normalized,
                    canonical=canonical,
                    display=display,
                    taxonomy=taxonomy_info,
                    confidence=confidence,
                    match_type=match_type,
                    position=position,
                )
            )
        return results

    def _tokenize(self, text: str) -> List[str]:
        if not text:
            return []
        cleaned = text.replace("\r", "\n").replace("•", ",")
        segments = re.split(r"[\n;]+", cleaned)
        tokens: List[str] = []
        for segment in segments:
            segment = segment.strip()
            if not segment:
                continue
            for pattern, replacement in SPECIAL_TOKEN_REPLACEMENTS:
                segment = pattern.sub(replacement, segment)
            
            # Step 1: Normalize additive codes (INS -> E, handle spaces in sub-classifications)
            # This must happen BEFORE we flatten parentheses
            segment = normalize_additive_code(segment)
            
            # Step 2: Remove percentage indicators (e.g., "96%", "17.5%")
            # These indicate ingredient contribution but don't affect matching
            segment = re.sub(r'\d+(?:\.\d+)?\s*%', '', segment)
            
            # Step 3: Replace parentheses with commas to flatten nested list structure
            # BUT preserve E-number sub-classifications (already normalized in step 1)
            # We need to protect E-numbers before flattening
            enumber_pattern = r'\be\d+\([ivx]+\)'
            enumbers = re.findall(enumber_pattern, segment, re.IGNORECASE)
            
            # Temporarily replace E-numbers with placeholders
            for i, enumber in enumerate(enumbers):
                segment = segment.replace(enumber, f"__ENUMBER_{i}__", 1)
            
            # Now safe to flatten parentheses
            segment = segment.replace("(", ", ").replace(")", "")
            
            # Restore E-numbers
            for i, enumber in enumerate(enumbers):
                segment = segment.replace(f"__ENUMBER_{i}__", enumber)
            
            segment = re.sub(r"\[[^]]*\]", " ", segment)
            segment = re.sub(r"\s+", " ", segment).strip()
            if not segment:
                continue
            pieces = [p.strip() for p in segment.split(",") if p.strip()]
            if not pieces:
                pieces = [segment]
            for piece in pieces:
                lowered_piece = piece.lower()
                if lowered_piece in SPECIAL_STOPWORD_EXEMPT:
                    parts = [piece]
                else:
                    parts = _split_on_stopwords(piece) or [piece]
                for part in parts:
                    token = normalize_token(part.strip(".- "))
                    if token:
                        tokens.append(part.strip())
        return tokens

    def _resolve(self, token: str) -> Tuple[str, str, Optional[Dict[str, Any]], float, str]:
        """
        Resolve a token to its canonical form with confidence scoring.

        Returns:
            Tuple of (canonical, display, taxonomy_info, confidence, match_type)

            Confidence scores:
            - 1.0: Exact match in taxonomy
            - 0.95: Synonym match
            - 0.75-0.94: Fuzzy match (varies by similarity)
            - 0.5: Heuristic fallback (no taxonomy match)
        """
        sources: List[Tuple[Optional[IngredientTaxonomy], str]] = []
        if self.taxonomy is not None:
            sources.append((self.taxonomy, "ingredients"))
        if self.additives is not None:
            sources.append((self.additives, "additives"))

        # Prefer exact matches first (ingredients wins ties to preserve existing behaviour)
        for source, tag in sources:
            if source is None:
                continue
            node = source.lookup(token)
            if node is not None:
                canonical = normalize_token(node.node_id.split(":", 1)[-1])
                display = source.display_name(node)
                info = source.describe(node)
                info["source"] = tag

                # Determine if this was an exact ID match or synonym match
                node_token = normalize_token(node.node_id.split(":", 1)[-1])
                if token == node_token:
                    return canonical, display, info, 1.0, "exact"
                else:
                    # Matched via synonym
                    return canonical, display, info, 0.95, "synonym"

        # Fallback to fuzzy with additives first (chemical names) then ingredients
        for source, tag in sorted(sources, key=lambda pair: 0 if pair[1] == "additives" else 1):
            if source is None:
                continue
            node = source.fuzzy(token)
            if node is not None:
                canonical = normalize_token(node.node_id.split(":", 1)[-1])
                display = source.display_name(node)
                info = source.describe(node)
                info["source"] = tag

                # Calculate fuzzy confidence based on token length and similarity
                # Longer tokens with fuzzy match = lower confidence
                token_len = len(token)
                if token_len <= 4:
                    confidence = 0.90  # Short tokens, high confidence threshold was used
                elif token_len <= 8:
                    confidence = 0.82  # Medium tokens
                else:
                    confidence = 0.75  # Long tokens, more chance of mismatch

                return canonical, display, info, confidence, "fuzzy"

        # No taxonomy match - heuristic fallback
        return token, titleize(token), None, 0.5, "heuristic"


# Global mutable state prepared later
INGREDIENT_TAXONOMY: Optional[IngredientTaxonomy] = None
INGREDIENT_NORMALIZER: Optional[IngredientNormalizer] = None
INGREDIENT_TAXONOMY_ERROR: Optional[str] = None
ADDITIVES_TAXONOMY: Optional[IngredientTaxonomy] = None
ADDITIVES_TAXONOMY_ERROR: Optional[str] = None
INGREDIENT_STOPWORDS: Dict[str, Set[str]] = {}
STOPWORD_PHRASES: List[str] = []
STOPWORD_PATTERNS: List[re.Pattern] = []
OFF_DATASET_ERROR: Optional[str] = None
OFF_DATASET_CACHE: Dict[str, Dict[str, Any]] = {}
OFF_DATASET_SCANNED = 0


def _build_preferred_languages(extra: Optional[str] = None) -> List[str]:
    langs: List[str] = []

    def add(lang: Optional[str]) -> None:
        if lang and lang not in langs:
            langs.append(lang)

    add("en")
    add(OFF_DEFAULT_LANGUAGE)
    add(extra)
    for lang in OFF_TAXONOMY_LANGS:
        add(lang)
    langs.append("xx")
    return langs


def _set_stopwords(stopwords_map: Optional[Dict[str, Set[str]]]) -> None:
    global INGREDIENT_STOPWORDS, STOPWORD_PHRASES, STOPWORD_PATTERNS

    combined: Dict[str, Set[str]] = {lang: set(values) for lang, values in DEFAULT_STOPWORDS.items()}
    if stopwords_map:
        for lang, values in stopwords_map.items():
            combined.setdefault(lang.lower(), set()).update(values)

    active_langs = {lang.lower() for lang in ACTIVE_LANGS}
    cleaned: Dict[str, Set[str]] = {}
    for lang, values in combined.items():
        lang_key = lang.lower()
        if lang_key not in active_langs:
            continue
        normalized_values = {normalize_token(value) for value in values if normalize_token(value)}
        if normalized_values:
            cleaned[lang_key] = normalized_values

    INGREDIENT_STOPWORDS = cleaned

    phrases: Set[str] = set()
    for lang in _build_preferred_languages():
        phrases.update(INGREDIENT_STOPWORDS.get(lang.lower(), set()))
    STOPWORD_PHRASES = sorted(phrases, key=len, reverse=True)
    STOPWORD_PATTERNS = [re.compile(r"\b" + re.escape(phrase) + r"\b", re.IGNORECASE) for phrase in STOPWORD_PHRASES]


_set_stopwords(None)


def _is_stopword(token: str) -> bool:
    norm = normalize_token(token)
    if not norm:
        return False
    for lang in _build_preferred_languages():
        if norm in INGREDIENT_STOPWORDS.get(lang, set()):
            return True
    return False


def _split_on_stopwords(chunk: str) -> List[str]:
    if not chunk or not STOPWORD_PATTERNS:
        return [chunk]
    temp = chunk
    for pattern in STOPWORD_PATTERNS:
        temp = pattern.sub(",", temp)
    return [part.strip() for part in temp.split(",") if part.strip()]


def _ensure_taxonomy() -> Optional[IngredientTaxonomy]:
    global INGREDIENT_TAXONOMY, INGREDIENT_TAXONOMY_ERROR
    if INGREDIENT_TAXONOMY is not None:
        return INGREDIENT_TAXONOMY

    errors: List[str] = []

    if OFF_TAXONOMY_PATH:
        try:
            taxonomy = IngredientTaxonomy(OFF_TAXONOMY_PATH)
            _set_stopwords(taxonomy.stopwords)
            INGREDIENT_TAXONOMY = taxonomy
            return taxonomy
        except Exception as exc:
            errors.append(f"local:{exc}")

    if errors:
        INGREDIENT_TAXONOMY_ERROR = "; ".join(errors)
    return None


def _ensure_additives_taxonomy() -> Optional[IngredientTaxonomy]:
    global ADDITIVES_TAXONOMY, ADDITIVES_TAXONOMY_ERROR
    if ADDITIVES_TAXONOMY is not None:
        return ADDITIVES_TAXONOMY

    if not OFF_ADDITIVES_PATH:
        return None

    try:
        taxonomy = IngredientTaxonomy(OFF_ADDITIVES_PATH)
        ADDITIVES_TAXONOMY = taxonomy
        return taxonomy
    except Exception as exc:
        ADDITIVES_TAXONOMY_ERROR = str(exc)
        return None


def _ensure_normalizer() -> IngredientNormalizer:
    global INGREDIENT_NORMALIZER
    if INGREDIENT_NORMALIZER is None:
        taxonomy = _ensure_taxonomy()
        additives = _ensure_additives_taxonomy()
        INGREDIENT_NORMALIZER = IngredientNormalizer(taxonomy, additives)
    return INGREDIENT_NORMALIZER


# --- Dataset helpers -----------------------------------------------------

def _get_off_product_dataset():
    global OFF_DATASET_ERROR
    if not OFF_DATASET_AVAILABLE:
        if OFF_DATASET_ERROR is None:
            OFF_DATASET_ERROR = "openfoodfacts ProductDataset not available"
        return None

    dataset = getattr(_get_off_product_dataset, "_dataset", None)
    if dataset is not None:
        return dataset

    kwargs: Dict[str, Any] = {"dataset_type": OFF_DATASET_TYPE}
    if OFF_DATASET_FIELDS:
        kwargs["fields"] = OFF_DATASET_FIELDS
    try:
        dataset = ProductDataset(**kwargs)
        setattr(_get_off_product_dataset, "_dataset", dataset)
        setattr(_get_off_product_dataset, "_iterator", iter(dataset))
        return dataset
    except Exception as exc:
        OFF_DATASET_ERROR = str(exc)
        setattr(_get_off_product_dataset, "_dataset", None)
        setattr(_get_off_product_dataset, "_iterator", None)
        return None


def off_dataset_lookup(barcode: str) -> Optional[Dict[str, Any]]:
    global OFF_DATASET_SCANNED
    barcode = (barcode or "").strip()
    if not barcode:
        return None
    if barcode in OFF_DATASET_CACHE:
        return OFF_DATASET_CACHE[barcode]

    dataset = _get_off_product_dataset()
    # If dataset is available, try to search it (partial scan)
    if dataset is not None:
        iterator = getattr(_get_off_product_dataset, "_iterator", None)
        if iterator is None:
            try:
                iterator = iter(dataset)
                setattr(_get_off_product_dataset, "_iterator", iterator)
            except TypeError:
                iterator = None

        while iterator and OFF_DATASET_SCANNED < OFF_DATASET_MAX_SCAN:
            try:
                product = next(iterator)
            except StopIteration:
                setattr(_get_off_product_dataset, "_iterator", None)
                break
            except Exception:
                setattr(_get_off_product_dataset, "_iterator", None)
                break

            OFF_DATASET_SCANNED += 1
            if not isinstance(product, dict):
                continue
            code = str(product.get("code") or product.get("id") or "").strip()
            if not code:
                continue
            OFF_DATASET_CACHE.setdefault(code, product)
            if code == barcode:
                return product

    
    # 2. API Lookup (Fallback)
    try:
        url = f"https://world.openfoodfacts.org/api/v0/product/{barcode}.json"
        print(f"[DEBUG] Lookup OFF API: {url}")
        headers = {
            "User-Agent": "UntaintedApp/1.0 (aman@untainted.io) - Development"
        }
        resp = requests.get(url, headers=headers, timeout=10)
        print(f"[DEBUG] OFF API Response Code: {resp.status_code}")
        if resp.status_code == 200:
            data = resp.json()
            status = data.get("status")
            print(f"[DEBUG] OFF API Product Status: {status}")
            if status == 1:
                product = data.get("product")
                OFF_DATASET_CACHE[barcode] = product
                return product
    except Exception as e:
        print(f"OFF API lookup failed for {barcode}: {e}")

    return OFF_DATASET_CACHE.get(barcode)


def _extract_product_fields(product: Dict[str, Any]) -> Tuple[Optional[str], Optional[str], Optional[List[str]]]:
    if not isinstance(product, dict):
        return None, None, None

    name: Optional[str] = None
    for key in (
        f"product_name_{OFF_DEFAULT_LANGUAGE}",
        "product_name",
        "product_name_en",
        "generic_name",
    ):
        value = product.get(key)
        if isinstance(value, str) and value.strip():
            name = value.strip()
            break
    if not name and isinstance(product.get("product_name_locales"), dict):
        locales = product["product_name_locales"]
        for lang in _build_preferred_languages():
            value = locales.get(lang)
            if isinstance(value, str) and value.strip():
                name = value.strip()
                break

    ingredients_text: Optional[str] = None
    for key in (
        f"ingredients_text_{OFF_DEFAULT_LANGUAGE}",
        "ingredients_text",
        "ingredients_text_en",
        "ingredients_text_raw",
    ):
        value = product.get(key)
        if isinstance(value, str) and value.strip():
            ingredients_text = value.strip()
            break
        if isinstance(value, list):
            parts = []
            for item in value:
                if isinstance(item, dict):
                    txt = item.get("text") or item.get("id")
                else:
                    txt = str(item)
                if txt:
                    parts.append(str(txt))
            if parts:
                ingredients_text = ", ".join(parts)
                break

    code = str(product.get("code") or product.get("id") or "").strip()

    ingredients_tags: Optional[List[str]] = None
    tags_value = product.get("ingredients_tags") or product.get("ingredients_tags_en")
    if isinstance(tags_value, list):
        ingredients_tags = [str(tag) for tag in tags_value if tag]
    elif isinstance(tags_value, str):
        ingredients_tags = [part.strip() for part in tags_value.split(",") if part.strip()]

    ingredients: List[str] = []
    if ingredients_text:
        ingredients = [ingredients_text]
    elif ingredients_tags:
        ingredients = ingredients_tags

    return code, name, ingredients


# --- Ingredient processing ------------------------------------------------

NORMALIZER = _ensure_normalizer()


CLEAN_EATING_NORMALIZED = {normalize_token(token) for token in CLEAN_EATING_WATCHLIST}
CLEAN_EATING_CANONICALS = {normalize_token(flag.split(":", 1)[-1]) for flag in CLEAN_EATING_FLAG_IDS}
FLAG_CANONICALS = {normalize_token(flag.split(":", 1)[-1]) for flag in DEFAULT_FLAG_IDS}


def _diet_tokens(ids: Iterable[str]) -> Set[str]:
    tokens: Set[str] = set()
    for identifier in ids:
        if not identifier:
            continue
        lowered = identifier.lower()
        tokens.add(lowered)
        tokens.add(normalize_token(lowered.split(":", 1)[-1]))
    return {token for token in tokens if token}


def _expand_taxonomy_ids(seed_ids: Iterable[str]) -> Set[str]:
    normalizer = NORMALIZER or _ensure_normalizer()
    taxonomy = normalizer.taxonomy
    if not taxonomy:
        return set(seed_ids)

    children: Dict[str, Set[str]] = defaultdict(set)
    for node_id, node in taxonomy.nodes.items():
        for parent_id in node.parent_ids:
            children[parent_id].add(node_id)

    result: Set[str] = set()
    queue = deque()
    for identifier in seed_ids:
        if not identifier:
            continue
        canonical = identifier if ':' in identifier else f'en:{identifier}'
        queue.append(canonical)

    while queue:
        current = queue.popleft()
        if current in result:
            continue
        result.add(current)
        for child in children.get(current, ()):  # type: ignore[arg-type]
            queue.append(child)

    return result


_DIET_RULE_CACHE: Optional[Dict[str, Dict[str, Set[str]]]] = None


DIET_FALLBACK_TOKENS: Dict[str, Set[str]] = {
    "vegetarian": {
        "beef",
        "chicken",
        "duck",
        "egg",
        "egg white",
        "egg yolk",
        "eggs",
        "fish",
        "goat",
        "ham",
        "lamb",
        "meat",
        "mutton",
        "pork",
        "prawn",
        "salami",
        "sausage",
        "seafood",
        "shellfish",
        "shrimp",
        "turkey",
        "whole egg",
    },
    "vegan": {
        "butter",
        "casein",
        "cheese",
        "cream",
        "egg",
        "gelatin",
        "ghee",
        "honey",
        "lactose",
        "milk",
        "whey",
    },
    "jain": {
        "garlic",
        "ginger",
        "onion",
        "potato",
        "radish",
        "root vegetable",
        "root vegetables",
        "tuber",
    },
    # Additional diet fallbacks to match frontend preferences
    "sattvic": {
        "onion",
        "garlic",
        "asafoetida",
        "onion powder",
        "garlic powder",
    },
    "no-onion-garlic": {
        "onion",
        "garlic",
        "onion powder",
        "garlic powder",
        "asafoetida",
    },
    # these will be populated from ALLERGY_FALLBACK_TOKENS when rules are built
    "gluten-free": set(),
    "dairy-free": set(),
    "diabetic-friendly": {
        "sugar",
        "refined sugar",
        "sucrose",
        "glucose",
        "fructose",
        "maltodextrin",
        "high fructose corn syrup",
        "corn syrup",
        "dextrose",
        "maltose",
    },

    "no-maida": {
        "maida",
        "refined wheat",
        "bleached flour",
        "white flour",
        "all purpose flour",
        "all-purpose flour",
    },
    "keto": {
        "sugar",
        "starch",
        "maltodextrin",
        "dextrose",
        "flour",
        "wheat",
        "rice",
        "corn",
        "potato",
        "sugar syrup",
        "corn syrup",
    },
    "paleo": {
        "sugar",
        "refined sugar",
        "grains",
        "wheat",
        "corn",
        "rice",
        "oats",
        "barley",
        "dairy",
        "milk",
        "cheese",
        "yogurt",
        "bean",
        "legume",
        "soy",
        "peanut",
        "vegetable oil",
        "sunflower oil",
        "canola oil",
        "processed food",
        "artificial sweetener",
    },
    "low-fodmap": {
        "onion",
        "garlic",
        "wheat",
        "rye",
        "barley",
        "milk",
        "lactose",
        "honey",
        "agave",
        "high fructose corn syrup",
        "apple",
        "pear",
        "peach",
        "plum",
        "cauliflower",
        "mushroom",
        "bean",
    },
    }


ALLERGY_FALLBACK_TOKENS: Dict[str, Set[str]] = {
    "gluten": {
        "gluten",
        "wheat",
        "barley",
        "rye",
        "spelt",
        "durum",
        "farina",
        "semolina",
        "triticale",
        "malt",
        "graham",
        "bulgur",
    },
    "dairy": {
        "dairy",
        "milk",
        "butter",
        "cheese",
        "cream",
        "casein",
        "whey",
        "lactose",
        "ghee",
        "yogurt",
        "yoghurt",
        "curd",
        "paneer",
        "dahi"
    },
    "nuts": {
        "nut",
        "nuts",
        "tree nut",
        "peanut",
        "almond",
        "cashew",
        "hazelnut",
        "pecan",
        "pistachio",
        "walnut",
        "macadamia",
        "brazil nut",
        "pine nut",
    },
    "soy": {
        "soy",
        "soya",
        "soybean",
        "soy bean",
        "edamame",
        "tofu",
        "tempeh",
        "miso",
    },
    "eggs": {
        "egg",
        "eggs",
        "albumen",
        "albumin",
        "egg white",
        "egg yolk",
        "ovalbumin",
        "ovomucoid",
    },
    "shellfish": {
        "shellfish",
        "crab",
        "lobster",
        "shrimp",
        "prawn",
        "crayfish",
        "krill",
        "langoustine",
        "mussel",
        "clam",
        "oyster",
        "scallop",
        "whelk",
    },
    "fish": {
        "fish",
        "anchovy",
        "cod",
        "haddock",
        "pollock",
        "salmon",
        "sardine",
        "tilapia",
        "trout",
        "tuna",
        "mackerel",
    },
    "sesame": {
        "sesame",
        "sesame seed",
        "tahini",
        "benne",
    },
}


def _normalize_taxonomy_id(identifier: Optional[Any]) -> Optional[str]:
    if not identifier:
        return None
    if not isinstance(identifier, str):
        identifier = str(identifier)
    cleaned = identifier.strip()
    if not cleaned:
        return None
    lowered = cleaned.lower()
    if ':' not in lowered:
        lowered = f'en:{lowered}'
    return lowered


def _tokens_from_ids(ids: Iterable[str]) -> Set[str]:
    tokens: Set[str] = set()
    for identifier in ids:
        if not identifier:
            continue
        suffix = identifier.split(':', 1)[-1]
        token = normalize_token(suffix)
        if token:
            tokens.add(token)
    return tokens


def _normalize_allergy_preferences(values: Iterable[Any]) -> Tuple[List[str], Set[str]]:
    labels: List[str] = []
    label_tracker: Set[str] = set()
    tokens: Set[str] = set()

    for entry in values:
        if entry is None:
            continue
        text = entry if isinstance(entry, str) else str(entry)
        if not text:
            continue
        label = text.strip()
        if not label:
            continue
        normalized = normalize_token(label)
        if not normalized:
            continue
        lowered_label = label.lower()
        if lowered_label not in label_tracker:
            labels.append(label)
            label_tracker.add(lowered_label)
        tokens.add(normalized)
        fallback = ALLERGY_FALLBACK_TOKENS.get(normalized)
        if fallback:
            for alias in fallback:
                alias_norm = normalize_token(alias)
                if alias_norm:
                    tokens.add(alias_norm)
    return labels, tokens


def _build_diet_rules() -> Dict[str, Dict[str, Set[str]]]:
    seeds: Dict[str, Iterable[str]] = {
        "vegetarian": [
            "en:meat",
            "en:fish",
            "en:seafood",
            "en:gelatin",
            "en:lard",
            "en:animal-fat",
            "en:animal-enzymes",
            "en:egg",
        ],
        "vegan": [
            "en:meat",
            "en:fish",
            "en:seafood",
            "en:gelatin",
            "en:lard",
            "en:animal-fat",
            "en:animal-enzymes",
            "en:egg",
            "en:milk",
            "en:dairy",
            "en:honey",
            "en:whey",
        ],
        "jain": [
            "en:meat",
            "en:fish",
            "en:seafood",
            "en:egg",
            "en:honey",
            "en:root-vegetables",
            "en:garlic",
            "en:onion",
        ],
        # additional diet seeds to cover frontend preferences
        "sattvic": [
            "en:garlic",
            "en:onion",
        ],
        "no-onion-garlic": [
            "en:garlic",
            "en:onion",
        ],
        "gluten-free": [
            "en:wheat",
            "en:barley",
            "en:rye",
            "en:spelt",
            "en:semolina",
        ],
        "dairy-free": [
            "en:milk",
            "en:cheese",
            "en:butter",
            "en:cream",
        ],
        "diabetic-friendly": [
            "en:sugar",
            "en:sugar-various-sugars",
        ],
        "no-maida": [
            "en:wheat",
            "en:flour",
        ],
        "keto": [
            "en:sugar",
            "en:starch",
            "en:flour",
            "en:wheat",
        ],
        "paleo": [
            "en:sugar",
            "en:grains",
            "en:wheat",
            "en:corn",
            "en:rice",
            "en:oats",
            "en:barley",
            "en:milk",
            "en:cheese",
            "en:dairy",
            "en:soy",
            "en:peanut",
            "en:canola-oil",
            "en:sunflower-oil",
        ],
        "low-fodmap": [
            "en:onion",
            "en:garlic",
            "en:wheat",
            "en:rye",
            "en:barley",
            "en:milk",
            "en:honey",
            "en:agave-syrup",
            "en:high-fructose-corn-syrup",
            "en:apple",
            "en:pear",
            "en:peach",
            "en:plum",
            "en:cauliflower",
            "en:mushroom",
        ],
    }

    rules: Dict[str, Dict[str, Set[str]]] = {}
    for key, value in seeds.items():
        expanded = _expand_taxonomy_ids(value)
        tokens = _tokens_from_ids(expanded)
        fallback_tokens: Set[str] = set(DIET_FALLBACK_TOKENS.get(key, set()))
        # include allergy-based fallbacks for certain diet types
        try:
            if key == "gluten-free":
                fallback_tokens.update(ALLERGY_FALLBACK_TOKENS.get("gluten", set()))
            if key == "dairy-free":
                fallback_tokens.update(ALLERGY_FALLBACK_TOKENS.get("dairy", set()))
        except NameError:
            # defensive: ALLERGY_FALLBACK_TOKENS should be defined earlier in the file
            pass
        if key in {"vegan", "jain"}:
            fallback_tokens.update(DIET_FALLBACK_TOKENS.get("vegetarian", set()))
        for fallback in fallback_tokens:
            normalized = normalize_token(fallback)
            if not normalized:
                continue
            tokens.add(normalized)
            norm_id = _normalize_taxonomy_id(fallback)
            if norm_id:
                expanded.add(norm_id)
        rules[key] = {
            "ids": expanded,
            "tokens": tokens,
        }
    return rules


def _get_diet_rules() -> Dict[str, Dict[str, Set[str]]]:
    global _DIET_RULE_CACHE
    if _DIET_RULE_CACHE is None:
        _DIET_RULE_CACHE = _build_diet_rules()
    return _DIET_RULE_CACHE


def _collect_diet_signatures(item: NormalizedIngredient) -> Tuple[Set[str], Set[str]]:
    ids: Set[str] = set()
    tokens: Set[str] = set()
    info = item.taxonomy or {}

    def _add_identifier(identifier: Optional[str]) -> None:
        norm_id = _normalize_taxonomy_id(identifier)
        if norm_id:
            ids.add(norm_id)
            suffix = norm_id.split(':', 1)[-1]
            token = normalize_token(suffix)
            if token:
                tokens.add(token)

    _add_identifier(info.get("id"))
    for parent in info.get("parents") or []:
        _add_identifier(parent)

    for surface in (item.canonical, item.token, item.display):
        token = normalize_token(surface)
        if token:
            tokens.add(token)

    return ids, tokens


def process_ingredients(
    text: str,
    preferences: Optional[Dict[str, Any]] = None,
    product_meta: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    normalizer = NORMALIZER or _ensure_normalizer()
    items = normalizer.normalize(text)

    active_diets: Set[str] = set()
    allergy_tokens: Set[str] = set()
    allergy_labels: List[str] = []
    nutriments: Optional[Dict[str, Any]] = None

    diet_rules = _get_diet_rules()

    if preferences and isinstance(preferences, dict):
        # 1. Handle "Legacy" single diet key
        #    (Many clients might still send { "diet": "vegan" })
        raw_diet = preferences.get("diet") or preferences.get("dietaryPreference")
        if isinstance(raw_diet, str):
            lowered = raw_diet.lower().strip()
            if lowered in diet_rules:
                active_diets.add(lowered)

        # 2. Handle dietary_preferences list (e.g. ["Vegan", "Paleo"])
        pref_list = preferences.get("dietary_preferences")
        if isinstance(pref_list, (list, tuple, set)):
            for item in pref_list:
                if isinstance(item, str):
                    lowered = item.lower().strip()
                    dashed = lowered.replace(" ", "-")
                    if lowered and lowered in diet_rules:
                        active_diets.add(lowered)
                    elif dashed and dashed in diet_rules:
                        active_diets.add(dashed)
        
        # 3. Handle health_restrictions list (e.g. ["Keto", "Low FODMAP"])
        health_list = preferences.get("health_restrictions")
        if isinstance(health_list, (list, tuple, set)):
            for item in health_list:
                if isinstance(item, str):
                    lowered = normalize_token(item) # "low fodmap"
                    dashed = lowered.replace(" ", "-") # "low-fodmap"
                    if lowered in diet_rules:
                        active_diets.add(lowered)
                    elif dashed in diet_rules:
                        active_diets.add(dashed)
                    # Try direct lower match if normalize changed too much
                    elif item.lower().strip() in diet_rules:
                        active_diets.add(item.lower().strip())

        raw_allergies = preferences.get("allergies")
        if isinstance(raw_allergies, (list, tuple, set)):
            labels, tokens = _normalize_allergy_preferences(raw_allergies)
            allergy_labels = labels
            allergy_tokens = tokens

    # 4. Handle custom_avoidance (e.g. from MultiSelect: [{"name": "Mango"}, ...])
    custom_avoidance_tokens: Set[str] = set()
    raw_custom = preferences.get("custom_avoidance") if preferences else None
    if isinstance(raw_custom, (list, tuple, set)):
        for item in raw_custom:
            val = None
            if isinstance(item, str):
                val = item
            elif isinstance(item, dict):
                val = item.get("name") or item.get("id")
            
            if val and isinstance(val, str):
                # Split by comma to handle synonyms like "mango, mangoes"
                for part in val.split(","):
                    cleaned = normalize_token(part)
                    if cleaned:
                        custom_avoidance_tokens.add(cleaned)

    # accept nutriments passed via product_meta (OpenFoodFacts product dict)
    if isinstance(product_meta, dict):
        nutriments = product_meta.get("nutriments") or product_meta.get("nutriment")

    # Get user's health conditions for FSSAI insights
    health_conditions = []
    if preferences:
        health_list = preferences.get("health_restrictions") or preferences.get("health_conditions") or []
        if isinstance(health_list, (list, tuple)):
            health_conditions = [str(h).lower().replace(" ", "_") for h in health_list]

    is_safe, hits, diet_hits, allergy_hits, health_insights = evaluate_items(
        items, list(active_diets), allergy_tokens, custom_avoidance=custom_avoidance_tokens,
        nutriments=nutriments, health_conditions=health_conditions
    )

    display = [item.display for item in items]
    canonical = [item.canonical for item in items]
    taxonomy = [item.taxonomy for item in items if item.taxonomy]

    # Build confidence data for each ingredient
    confidence_data = []
    uncertain_ingredients = []
    for item in items:
        conf_entry = {
            "ingredient": item.display,
            "confidence": item.confidence,
            "match_type": item.match_type,
            "position": item.position,
        }
        confidence_data.append(conf_entry)

        # Flag uncertain matches for user verification
        if item.confidence < 0.8:
            uncertain_ingredients.append({
                "ingredient": item.display,
                "original": item.original,
                "confidence": item.confidence,
                "match_type": item.match_type,
                "message": f"'{item.original}' matched as '{item.display}' with {item.confidence*100:.0f}% confidence"
            })

    # Calculate average confidence
    avg_confidence = sum(item.confidence for item in items) / len(items) if items else 1.0

    if normalizer.taxonomy and normalizer.additives:
        source_label = "taxonomy+additives"
    elif normalizer.taxonomy:
        source_label = "taxonomy"
    elif normalizer.additives:
        source_label = "additives"
    else:
        source_label = "heuristic"

    return {
        "source": source_label,
        "ingredients": display,
        "canonical": canonical,
        "taxonomy": taxonomy,
        "status": "safe" if is_safe else "not_safe",
        "is_clean": is_safe, # Kept for backward compatibility if needed, but primary is status
        "hits": hits,
        "diet_hits": diet_hits,
        "active_diets": sorted(list(active_diets)),
        "diet_preference": active_diets.pop() if active_diets else None, # Legacy compat
        "allergy_hits": allergy_hits,
        "allergy_preferences": allergy_labels,
        "health_insights": health_insights,
        "taxonomy_error": INGREDIENT_TAXONOMY_ERROR,
        "additives_error": ADDITIVES_TAXONOMY_ERROR,
        # New confidence scoring fields
        "confidence": {
            "average": round(avg_confidence, 2),
            "ingredients": confidence_data,
        },
        "uncertain_matches": uncertain_ingredients,
        "needs_verification": len(uncertain_ingredients) > 0,
    }


def evaluate_items(
    items: List[NormalizedIngredient],
    diet_preferences: List[str],
    allergy_tokens: Optional[Set[str]] = None,
    custom_avoidance: Optional[Set[str]] = None,
    nutriments: Optional[Dict[str, Any]] = None,
    health_conditions: Optional[List[str]] = None,
) -> Tuple[bool, List[str], List[str], List[str], List[str]]:
    hits: Set[str] = set()
    diet_hits: List[str] = []
    seen_diet: Set[str] = set()
    allergy_hits: List[str] = []
    seen_allergies: Set[str] = set()
    health_insights: List[str] = []
    seen_insights: Set[str] = set()
    
    diet_rules = _get_diet_rules()

    # Pre-fetch rules for all active diets
    active_rules = []
    strict_clean_eating = False
    
    for d in diet_preferences:
        # Check for Clean Eating preference
        if normalize_token(d) in {"clean eating", "clean-eating"}:
             strict_clean_eating = True
             continue # Handled separately via Watchlist
             
        r = diet_rules.get(d)
        if r:
            active_rules.append((d, r["ids"], r["tokens"]))

    allergy_token_set: Set[str] = set(allergy_tokens or set())
    custom_avoidance_set: Set[str] = set(custom_avoidance or set())
    
    for item in items:
        token = item.canonical.replace("-", " ")
        display_norm = normalize_token(item.display or item.canonical)
        info = item.taxonomy or {}
        
        # 0. Check Custom Avoidance (User specific)
        for avoid in custom_avoidance_set:
             # Ensure we compare apples to apples (normalized)
             if avoid in display_norm or avoid in token:
                 hits.add(f"{avoid.title()} (Custom Selection)")
                 
        # 1. Check Clean Eating Watchlist (Global "Unclean" list)
        is_watchlisted = False
        watchlist_match = None
        
        # Check tokens against watchlist
        for forbidden in CLEAN_EATING_NORMALIZED:
            if forbidden and forbidden in token:
                 is_watchlisted = True
                 watchlist_match = forbidden
                 break # Found one match is enough for this ingredient
        
        if not is_watchlisted:
            if display_norm in CLEAN_EATING_NORMALIZED:
                is_watchlisted = True
                watchlist_match = display_norm
            else:
                for syn in info.get("synonyms") or []:
                    syn_norm = normalize_token(syn)
                    if syn_norm in CLEAN_EATING_NORMALIZED:
                        is_watchlisted = True
                        watchlist_match = syn_norm
                        break

        if not is_watchlisted:
            node_id = info.get("id") if isinstance(info, dict) else None
            if node_id and (node_id in CLEAN_EATING_FLAG_IDS or normalize_token(node_id.split(":", 1)[-1]) in CLEAN_EATING_CANONICALS):
                 is_watchlisted = True
                 watchlist_match = display_norm or token

        # Logic: If watchlisted...
        # If Strict Clean Eating -> Add to Hits (Unsafe)
        # Else -> Add to Health Insights (Info)
        if is_watchlisted:
            label = watchlist_match or display_norm
            if strict_clean_eating:
                 hits.add(label)
            else:
                 if label not in seen_insights:
                     seen_insights.add(label)
                     health_insights.append(label)

        # 2. Diet & Health Rules (Vegan, Keto, etc)
        item_ids, item_tokens = _collect_diet_signatures(item)
        
        for diet_name, id_rule, token_rule in active_rules:
             has_conflict = bool(item_ids & id_rule) or bool(item_tokens & token_rule)
             if has_conflict:
                normalized_display = (item.display or item.canonical).strip()
                if normalized_display and normalized_display.lower() not in seen_diet:
                    seen_diet.add(normalized_display.lower())
                    diet_hits.append(f"{normalized_display} ({diet_name})")

        # 3. Allergies (Highest Priority)
        if allergy_token_set:
            combined_tokens: Set[str] = set(item_tokens)
            for identifier in item_ids:
                suffix = identifier.split(":", 1)[-1]
                norm_suffix = normalize_token(suffix)
                if norm_suffix:
                    combined_tokens.add(norm_suffix)
            if combined_tokens & allergy_token_set:
                normalized_display = (item.display or item.canonical).strip()
                if normalized_display:
                    lowered_display = normalized_display.lower()
                    if lowered_display not in seen_allergies:
                        seen_allergies.add(lowered_display)
                        allergy_hits.append(f"{normalized_display} (Allergen)")

    # Nutriment-based checks (Diabetes / Keto / FSSAI Insights)
    if nutriments:
        def _get_nutriment(keys: List[str]) -> Optional[float]:
            for k in keys:
                if k in nutriments:
                    try:
                        val = nutriments[k]
                        # Handle string values like "5g" or "5 g"
                        if isinstance(val, str):
                            val = ''.join(c for c in val if c.isdigit() or c == '.')
                        return float(val) if val else None
                    except:
                        pass
            return None

        sugars = _get_nutriment(["sugars_100g", "sugars", "sugar_100g", "sugars_value", "sugar", "total_sugars"])
        carbs = _get_nutriment(["carbohydrates_100g", "carbohydrates", "carbohydrate_100g", "carbs_100g", "carbs", "total_carbohydrates"])
        fiber = _get_nutriment(["fiber_100g", "fiber", "dietary_fiber", "fibre"])
        sodium = _get_nutriment(["sodium_100g", "sodium", "sodium_mg", "salt"])
        saturated_fat = _get_nutriment(["saturated_fat_100g", "saturated_fat", "saturated_fat_g"])
        trans_fat = _get_nutriment(["trans_fat_100g", "trans_fat", "trans_fat_g"])
        calories = _get_nutriment(["energy_100g", "energy", "calories", "energy_kcal", "kcal"])
        protein = _get_nutriment(["protein_100g", "protein", "proteins"])

        net_carbs = None
        if carbs is not None:
             net_carbs = carbs - (fiber or 0.0)

        for diet_name in diet_preferences:
            # diabetic-friendly: flag high sugar content
            if diet_name == "diabetic-friendly" and sugars is not None:
                if sugars >= DIABETIC_SUGARS_PER_100G_THRESHOLD:
                    label = f"High Sugar ({sugars}g/100g)"
                    if label.lower() not in seen_diet:
                        seen_diet.add(label.lower())
                        diet_hits.append(label)

            # keto: flag high net carbs
            if diet_name == "keto" and net_carbs is not None:
                if net_carbs >= KETO_NET_CARBS_PER_100G_THRESHOLD:
                    label = f"High Net Carbs ({net_carbs:.1f}g/100g)"
                    if label.lower() not in seen_diet:
                        seen_diet.add(label.lower())
                        diet_hits.append(label)

            # low-sodium: flag high sodium
            if diet_name in ("low-sodium", "hypertension", "heart-healthy") and sodium is not None:
                if sodium > 400:  # FSSAI threshold for "high sodium"
                    label = f"High Sodium ({sodium:.0f}mg/100g)"
                    if label.lower() not in seen_diet:
                        seen_diet.add(label.lower())
                        diet_hits.append(label)

            # low-fat diets: flag high saturated fat
            if diet_name in ("low-fat", "heart-healthy") and saturated_fat is not None:
                if saturated_fat > 1.5:  # FSSAI threshold
                    label = f"High Saturated Fat ({saturated_fat}g/100g)"
                    if label.lower() not in seen_diet:
                        seen_diet.add(label.lower())
                        diet_hits.append(label)

        # FSSAI-based health insights for all users (not just specific diets)
        # These are informational, not blocking

        # High sugar warning (WHO recommends max 25g/day)
        if sugars is not None and sugars > 10:
            insight = f"High sugar: {sugars}g per 100g ({sugars/25*100:.0f}% of daily limit per 100g)"
            if insight.lower() not in seen_insights:
                seen_insights.add(insight.lower())
                health_insights.append(insight)

        # High sodium warning
        if sodium is not None and sodium > 400:
            insight = f"High sodium: {sodium:.0f}mg per 100g ({sodium/2000*100:.0f}% of daily limit)"
            if insight.lower() not in seen_insights:
                seen_insights.add(insight.lower())
                health_insights.append(insight)

        # Trans fat warning (should be as close to 0 as possible)
        if trans_fat is not None and trans_fat > 0.2:
            insight = f"Contains trans fat: {trans_fat}g per 100g (FSSAI recommends avoiding)"
            if insight.lower() not in seen_insights:
                seen_insights.add(insight.lower())
                health_insights.append(insight)

        # Positive insights
        if fiber is not None and fiber >= 6.0:
            insight = f"High fiber: {fiber}g per 100g (good for digestion)"
            if insight.lower() not in seen_insights:
                seen_insights.add(insight.lower())
                health_insights.append(insight)

        if protein is not None and protein >= 10.0:
            insight = f"Good protein source: {protein}g per 100g"
            if insight.lower() not in seen_insights:
                seen_insights.add(insight.lower())
                health_insights.append(insight)

        # Health condition specific insights
        if health_conditions:
            for condition in health_conditions:
                if condition in ("diabetes", "diabetic") and sugars is not None:
                    if sugars > 5:
                        insight = f"Diabetes caution: {sugars}g sugar exceeds 5g/100g threshold"
                        if insight.lower() not in seen_insights:
                            seen_insights.add(insight.lower())
                            health_insights.append(insight)

                if condition in ("hypertension", "high_blood_pressure") and sodium is not None:
                    if sodium > 200:
                        insight = f"Hypertension caution: {sodium:.0f}mg sodium is high for blood pressure management"
                        if insight.lower() not in seen_insights:
                            seen_insights.add(insight.lower())
                            health_insights.append(insight)

                if condition in ("heart_disease", "cardiovascular") and saturated_fat is not None:
                    if saturated_fat > 1.5:
                        insight = f"Heart health caution: {saturated_fat}g saturated fat per 100g"
                        if insight.lower() not in seen_insights:
                            seen_insights.add(insight.lower())
                            health_insights.append(insight)

    # Verdict Logic
    # Safe if NO Allergy hits AND NO Diet hits AND (NO Strict Hits)
    is_safe = (len(hits) == 0) and (len(diet_hits) == 0) and (len(allergy_hits) == 0)
    
    return is_safe, sorted(list(hits)), diet_hits, allergy_hits, health_insights

# Cleanup complete



def build_capabilities() -> Dict[str, Any]:
    dataset_info = {
        "available": OFF_DATASET_AVAILABLE,
        "error": OFF_DATASET_ERROR,
        "type": OFF_DATASET_TYPE,
        "fields": OFF_DATASET_FIELDS,
        "max_scan": OFF_DATASET_MAX_SCAN,
        "scanned": OFF_DATASET_SCANNED,
        "cache_size": len(OFF_DATASET_CACHE),
    }

    taxonomy_info = {
        "path": OFF_TAXONOMY_PATH,
        "loaded": INGREDIENT_TAXONOMY is not None,
        "error": INGREDIENT_TAXONOMY_ERROR,
    }

    additives_info = {
        "path": OFF_ADDITIVES_PATH,
        "loaded": ADDITIVES_TAXONOMY is not None,
        "error": ADDITIVES_TAXONOMY_ERROR,
    }

    frontend_info = {
        "revamped_root": str(REVAMPED_ROOT) if REVAMPED_AVAILABLE else None,
        "available": REVAMPED_AVAILABLE,
        "error": REVAMPED_ERROR,
    }

    return {
        "ocr": {
            "server": PYTESSERACT_AVAILABLE,
            "preprocessing": OPENCV_AVAILABLE,
        },
        "taxonomy": taxonomy_info,
        "additives": additives_info,
        "frontend": frontend_info,
        "off_sdk": False,
        "dataset": dataset_info,
    }


# --- HTTP handler --------------------------------------------------------


# Legacy Handler removed
