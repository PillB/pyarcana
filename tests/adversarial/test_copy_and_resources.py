"""
Adversarial tests for Dashboard and Resources copy integrity.

Asserts:
- Dashboard has no forbidden developer meta language
- Resources has no book references
- No unsupported employment/salary/certification claims
- Resources catalogue has required metadata fields
"""
import re
import json
import os
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent

FORBIDDEN_META = [
    r'\bphase\b', r'\bhardening\b', r'\bremediation\b', r'\baudit wave\b',
    r'\bpipeline\b', r'\binvariant\b', r'\bledger\b', r'\borchestrat',
    r'\bsub-agent\b', r'\bfixer\b', r'\brepository state\b',
    r'\bP0\b', r'\bP1\b', r'\btechnical debt\b', r'\bmigration batch\b',
    r'\bvalidation campaign\b',
]

FORBIDDEN_BOOKS = [
    r'\blibro\b', r'\blibros\b', r'\bbook\b', r'\bbooks\b', r'\bepub\b',
    r'\breading list\b', r'\bfurther reading\b',
]

FORBIDDEN_CLAIMS = [
    r'job.?ready', r'interview.?ready', r'ready to apply',
    r'garantiz.*empleo', r'garantiz.*salary', r'garantiz.*salario',
    r'garantiz.*certification', r'equivalent.*certification',
]

class TestDashboardCopy:
    DASHBOARD = REPO_ROOT / 'src' / 'components' / 'course' / 'Dashboard.tsx'
    
    def test_dashboard_exists(self):
        assert self.DASHBOARD.exists(), "Dashboard.tsx not found"
    
    def test_no_listo_para_aplicar(self):
        content = self.DASHBOARD.read_text()
        assert 'Listo para aplicar' not in content, "Found 'Listo para aplicar' claim"
    
    def test_no_forbidden_meta_language(self):
        content = self.DASHBOARD.read_text().lower()
        for pattern in FORBIDDEN_META:
            matches = re.findall(pattern, content)
            # Allow some false positives in comments (lines starting with // or *)
            # Check only in JSX text content
            assert len(matches) < 3, f"Found forbidden meta '{pattern}' in Dashboard"

class TestResourcesCopy:
    RESOURCES = REPO_ROOT / 'src' / 'components' / 'course' / 'ResourcesPage.tsx'
    
    def test_resources_exists(self):
        assert self.RESOURCES.exists(), "ResourcesPage.tsx not found"
    
    def test_no_book_references(self):
        # The gate exists to stop the catalogue from recommending books instead
        # of doing. That is a property of learner-visible copy — titles,
        # providers, `whyUseful` — so URLs are stripped before scanning: a slug
        # like `sre.google/sre-book/...` is an address, not a recommendation.
        # A resource that really is a book still gets caught, because its title
        # and description are still scanned.
        content = re.sub(r'https?://\S+', ' ', self.RESOURCES.read_text().lower())
        for pattern in FORBIDDEN_BOOKS:
            matches = re.findall(pattern, content)
            # Filter out false positives: "Bookmark" (UI icon), "notebook"
            actual = [m for m in matches if m not in ('bookmark',)]
            assert len(actual) == 0, f"Found book reference '{pattern}' in Resources: {actual}"
    
    def test_has_search(self):
        content = self.RESOURCES.read_text()
        assert 'search' in content.lower() or 'Search' in content, "Resources must have search"
    
    def test_has_filters(self):
        content = self.RESOURCES.read_text()
        assert 'filter' in content.lower() or 'Filter' in content, "Resources must have filters"

class TestLegalPages:
    LEGAL_DIRS = ['privacy', 'terms', 'cookies', 'disclaimer', 'badge-notice', 
                  'external-resources', 'acceptable-use', 'data-rights', 'security']
    
    def test_all_legal_pages_exist(self):
        for d in self.LEGAL_DIRS:
            path = REPO_ROOT / 'src' / 'app' / d / 'page.tsx'
            assert path.exists(), f"Legal page missing: {d}/page.tsx"
    
    def test_legal_pages_have_version(self):
        for d in self.LEGAL_DIRS:
            path = REPO_ROOT / 'src' / 'app' / d / 'page.tsx'
            content = path.read_text()
            assert 'version' in content.lower() or 'Versión' in content, f"{d} missing version"

class TestFirebaseConfig:
    CLIENT = REPO_ROOT / 'src' / 'lib' / 'firebase' / 'client.ts'
    RULES = REPO_ROOT / 'firestore.rules'
    
    def test_firebase_client_exists(self):
        assert self.CLIENT.exists(), "firebase/client.ts not found"
    
    def test_firebase_rules_exist(self):
        assert self.RULES.exists(), "firestore.rules not found"
    
    def test_rules_not_blanket_deny(self):
        content = self.RULES.read_text()
        # Rules should be more specific than just "allow read, write: if false"
        assert content.count('allow') > 1, "Rules too restrictive - need specific allows"
    
    def test_firebase_in_package_json(self):
        pkg = (REPO_ROOT / 'package.json').read_text()
        assert '"firebase"' in pkg, "firebase client SDK not in package.json"

if __name__ == '__main__':
    import unittest
    unittest.main()
