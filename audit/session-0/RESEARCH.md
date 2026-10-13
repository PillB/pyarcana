# Sesión 0 — Research: setup root causes, best tutorials, teaching with pictures, "Ford" synthesis

Phase A output for `docs/handovers/session-0-setup-intro.md`. Audit file, not learner-facing (English).
Researched 2026-10-05. Every claim carries a source ID from the registry in §0. Each ID gives the URL,
the date and **how it was read**, because the sandbox could reach only part of the web.

---

## 0. Method, access limits and source registry

### 0.1 What could and could not be read

The egress proxy blocked these hosts for both `curl` and WebFetch, checked once on 2026-10-05 and not
retried:

- **Blocked hosts:**
  - www.python.org, docs.python.org, peps.python.org, blog.python.org, discuss.python.org;
  - docs.github.com, github.blog;
  - learn.microsoft.com;
  - stackoverflow.com, api.stackexchange.com;
  - tutorial.djangogirls.org, swcarpentry.github.io, carpentries.github.io;
  - git-scm.com, realpython.com, theodinproject.com, freecodecamp.org, cs50.harvard.edu;
  - w3.org, developers.google.com, code.visualstudio.com;
  - arxiv.org, eric.ed.gov, doi.org, Springer, ResearchGate;
  - ed.team, platzi.com.
- **Stack Overflow is also refused by the WebSearch tool** ("domains not accessible to our user
  agent"). So **no Stack Overflow vote or question counts appear in this file.** Every such number
  is **not verified**.
- **The GitHub search API was refused** (the session is bound to its repositories). I used the
  GitHub MCP `search_issues` instead. It is a *semantic* search, so its `total_count` is a relevance
  set, not an exact keyword count. I quote its counts only as rough indicators.

The workaround: most primary sources live in public GitHub repositories, and
`raw.githubusercontent.com` plus `git clone` worked. Read that way, in full:

- the CPython docs and PEPs;
- GitHub Docs (`github/docs`, commit date 2026-10-02);
- the Git for Windows installer script;
- the `gh` source;
- the Microsoft windows-dev-docs source;
- the VS Code docs;
- the Django Girls, Carpentries and Odin Project curricula;
- WCAG source;
- CS50 docs;
- GitHub Skills.

Also reachable directly: packages.ubuntu.com and launchpad.net.

Academic papers, Real Python, freeCodeCamp, the Microsoft/Google style guides, the W3C WAI tutorial
and the Spanish-language sites were **only seen as WebSearch result summaries**. Those claims are
marked **[snippet]**. Treat them as secondary until someone opens the original.

**Caveat on GitHub-source reads:** the GitHub source of a docs site is usually the same as the
live page, but it can lead or lag the deployed version by days. Where that matters, it is noted.

### 0.2 Source registry

Unless stated otherwise, all were accessed on 2026-10-05.
Method key: **R** = read in full from GitHub raw or a clone; **D** = read directly from the host;
**S** = WebSearch summary only; **I** = GitHub issue (title, date and comments via the MCP search).

| ID | Source | URL | Method / date |
|---|---|---|---|
| P1 | PEP 693, Python 3.12 Release Schedule | https://peps.python.org/pep-0693/ (src: github.com/python/peps/blob/main/peps/pep-0693.rst) | R |
| P2 | PEP 719, Python 3.13 Release Schedule | https://peps.python.org/pep-0719/ | R |
| P3 | PEP 745, Python 3.14 Release Schedule | https://peps.python.org/pep-0745/ | R |
| P4 | PEP 773, A Python Installation Manager for Windows (Status: Final, resolved 25-Apr-2025) | https://peps.python.org/pep-0773/ | R |
| P5 | "Using Python on Windows", main/dev docs | https://docs.python.org/dev/using/windows.html (src: cpython `main` Doc/using/windows.rst) | R |
| P6 | "Using Python on Windows", 3.14 docs | https://docs.python.org/3.14/using/windows.html (src: cpython `3.14`) | R |
| P7 | "Using Python on Windows", 3.12 docs | https://docs.python.org/3.12/using/windows.html (src: cpython `3.12`) | R |
| P8 | 3.12 Windows installer UI strings `Tools/msi/bundle/Default.wxl` and `bundle.wxs` at tag v3.12.10 | https://github.com/python/cpython/blob/v3.12.10/Tools/msi/bundle/Default.wxl | R |
| P9 | "Using Python on macOS", main docs | https://docs.python.org/dev/using/mac.html | R |
| P10 | Python docs licence (PSF License v2) | https://docs.python.org/3/license.html | R |
| P11 | python.org release page 3.12.10 (file list) | https://www.python.org/downloads/release/python-31210/ | S |
| P12 | discuss.python.org "Python 3.12 is now security-fix-only" | https://discuss.python.org/t/python-3-12-is-now-security-fix-only/87520 | S |
| P13 | pymanager issue #336 "Pymanager doesn't find a suitable install for 3.12.13" (2026-05-11) | https://github.com/python/pymanager/issues/336 | I (body read) |
| P14 | pymanager issue #230 "py installs old patch versions for 3.12…" (2025-12-03) | https://github.com/python/pymanager/issues/230 | I (body read) |
| P15 | Python docs in Spanish (python-docs-es, branches 3.12/3.13/3.14 contain `using/windows.po`) | https://github.com/python/python-docs-es | R (existence only) |
| U1 | Ubuntu package `python3` in noble: 3.12.3-0ubuntu2.1; `python3.12` in noble-updates: 3.12.3-1ubuntu0.17 | https://packages.ubuntu.com/noble/python3 | D |
| U2 | deadsnakes PPA description and package list | https://launchpad.net/~deadsnakes/+archive/ubuntu/ppa | D |
| G1 | Git for Windows installer script `installer/install.iss` (main) | https://github.com/git-for-windows/build-extra/blob/main/installer/install.iss | R |
| G2 | Git `Documentation/BreakingChanges.adoc` (master; GIT-VERSION-GEN says v2.56 in development) | https://github.com/git/git/blob/master/Documentation/BreakingChanges.adoc | R |
| H1 | GitHub Docs "About mandatory two-factor authentication" + reusable `mandatory-2fa-contributors-2023` | https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/about-mandatory-two-factor-authentication | R (github/docs @2026-10-02) |
| H2 | GitHub Docs "About remote repositories" + reusable `password-authentication-deprecation` | https://docs.github.com/en/get-started/git-basics/about-remote-repositories | R |
| H3 | GitHub Docs "Set up Git" | https://docs.github.com/en/get-started/git-basics/set-up-git | R |
| H4 | GitHub Docs "Creating an account on GitHub" | https://docs.github.com/en/account-and-profile/how-tos/account-management/creating-an-account-on-github | R |
| H5 | GitHub Docs "Connecting to your code locally" (Start your journey, GitHub Desktop) | https://docs.github.com/en/get-started/start-your-journey/connecting-to-your-code-locally | R |
| H6 | GitHub Docs "Authenticating to GitHub in GitHub Desktop" + desktop reusables | https://docs.github.com/en/desktop/installing-and-authenticating-to-github-desktop/authenticating-to-github-in-github-desktop | R |
| H7 | GitHub Docs "Configuring Git to handle line endings" | https://docs.github.com/en/get-started/git-basics/configuring-git-to-handle-line-endings | R |
| H8 | GitHub Docs "Creating screenshots" (contributing guide) | https://docs.github.com/en/contributing/writing-for-github-docs/creating-screenshots | R |
| H9 | GitHub Docs style guide, "Alt text" | https://docs.github.com/en/contributing/style-guide-and-content-model/style-guide#alt-text | R |
| H10 | GitHub Docs "Username considerations for external authentication" (39-char limit) | https://docs.github.com/en/admin/managing-iam/iam-configuration-reference/username-considerations-for-external-authentication | R |
| H11 | GitHub Docs licence: CC BY 4.0 (content), MIT (code) | https://github.com/github/docs/blob/main/LICENSE | R |
| H12 | GitHub Docs "Creating a repository for your project on GitHub" (Start your journey) | https://docs.github.com/en/get-started/start-your-journey/creating-a-repository-for-your-project-on-github | R |
| B1 | GitHub Blog "Token authentication requirements for Git operations" (publication date not captured; announces the 2021-08-13 cut-off) | https://github.blog/security/application-security/token-authentication-requirements-for-git-operations/ | S |
| B2 | GitHub Changelog "Git password authentication is shutting down" (2021-08-12) | https://github.blog/changelog/2021-08-12-git-password-authentication-is-shutting-down/ | S |
| B3 | GitHub Blog "Raising the bar for software security: GitHub 2FA begins March 13" (2023-03-09) | https://github.blog/news-insights/product-news/raising-the-bar-for-software-security-github-2fa-begins-march-13/ | S |
| B4 | GitHub Blog "Securing millions of developers through 2FA" | https://github.blog/security/supply-chain-security/securing-millions-of-developers-through-2fa/ | S |
| C1 | `gh` source `pkg/cmd/auth/login/login.go`, `pkg/cmd/auth/shared/login_flow.go`, `git_credential.go`, `internal/authflow/flow.go` (trunk) | https://github.com/cli/cli/tree/trunk/pkg/cmd/auth | R |
| C2 | cli/cli issue #2422 "WSL2 - gh auth login doesn't launch browser" (2020-11-17, 11 comments) | https://github.com/cli/cli/issues/2422 | I |
| C3 | cli/cli issue #13920 "gh auth login stores token in plain text without prior warning" (2026-07-20) | https://github.com/cli/cli/issues/13920 | I |
| D1 | desktop/desktop issue #22325 "Sign in via browser fails to redirect back to the app on Windows (protocol handler fragility)" | https://github.com/desktop/desktop/issues/22325 | S |
| M1 | Microsoft Learn "Python on Windows for beginners" (src `hub/dev-environment/python.md`, ms.date 09/14/2026) | https://learn.microsoft.com/en-us/windows/dev-environment/python | R (MicrosoftDocs/windows-dev-docs `docs` branch) |
| M2 | Microsoft Learn es-es "Python en Windows para principiantes" | https://learn.microsoft.com/es-es/windows/dev-environment/python | S (exists) |
| V1 | VS Code docs "Getting Started with Python in VS Code" | https://code.visualstudio.com/docs/python/python-tutorial | R (microsoft/vscode-docs) |
| V2 | VS Code docs "Visual Studio Code on Windows" (User vs System setup) | https://code.visualstudio.com/docs/setup/windows | R |
| V3 | VS Code docs "Terminal basics" | https://code.visualstudio.com/docs/terminal/basics | R |
| V4 | VS Code docs "Workspace Trust" | https://code.visualstudio.com/docs/editing/workspaces/workspace-trust | R |
| I1 | microsoft/vscode-python #9576 "VS Code claiming that python isn't installed even when an interpreter is showing" (2020-01-14, 79 comments) | https://github.com/microsoft/vscode-python/issues/9576 | I |
| I2 | microsoft/vscode-python #2559 "Activating an environment fails because running powershell scripts is disabled by default on Windows" (2018-09-12, 72 comments) | https://github.com/microsoft/vscode-python/issues/2559 | I |
| I3 | python/cpython #85499 "Windows Store 'stub' Python executables give confusing behaviour" (2020-07-17) | https://github.com/python/cpython/issues/85499 | I |
| I4 | python/cpython #89947 "Python execution broken after update via Windows Store" (2021-11-11, 19 comments) | https://github.com/python/cpython/issues/89947 | I |
| I5 | python/pymanager #139 "Python commands don't work with Python Install Manager" (2025-06-23); #370 "python.exe and other aliases not working before reinstalling the manager" (2026-06-16, open); #380 "py & pymanager commands are gone" (2026-06-30); #371 "Unable to run Python distribution by running python or python3" (2026-06-17) | https://github.com/python/pymanager/issues | I |
| I6 | git-for-windows/git #1725 "'Memory violation detected' by Dell Data Protection" (2018, 28 comments); #2457 "installation and security vulnerabilities" (2020, 28 comments) | https://github.com/git-for-windows/git/issues/1725 | I |
| DG1 | Django Girls tutorial (en) — `intro_to_command_line`, `python_installation/instructions.md`, `python_introduction/prompt.md`, `book.json` (py_release 3.14.3) | https://tutorial.djangogirls.org/en/ (src github.com/DjangoGirls/tutorial) | R |
| DG2 | Django Girls tutorial (es) — `intro_to_command_line`, `python_installation/instructions.md` | https://tutorial.djangogirls.org/es/ | R |
| SC1 | Carpentries workshop-template install instructions (`_includes/install_instructions/shell.html`, `python.html`, `git.html`) | https://github.com/carpentries/workshop-template | R |
| SC2 | swcarpentry/shell-novice `learners/setup.md`, `episodes/01-intro.md` | https://swcarpentry.github.io/shell-novice/ | R |
| SC3 | Carpentries workshop-template wiki "Configuration Problems and Solutions" | https://github.com/carpentries/workshop-template/wiki/Configuration-Problems-and-Solutions | R |
| SC4 | Carpentries blog "Updating our Lesson Setup Instructions" (2025-03) | https://carpentries.org/blog/2025/03/lesson-setup-instructions-task-force-recommendations/ | S |
| SC5 | Carpentries blog "Scaffolding Installation for Online Workshops" (2020-04) | https://carpentries.org/blog/2020/04/scaffolds/ | S (title/summary only) |
| OP1 | The Odin Project `foundations/installations/installations.md`, `setting_up_git.md` | https://github.com/TheOdinProject/curriculum/tree/main/foundations/installations | R |
| CS1 | CS50 Docs "Visual Studio Code for CS50" (cs50.dev) | https://cs50.readthedocs.io/cs50.dev/ (src github.com/cs50/cs50.readthedocs.io) | R |
| GS1 | GitHub Skills "Introduction to GitHub" README | https://github.com/skills/introduction-to-github | R |
| RP1 | Real Python "How to Install Python on Your System: A Guide" | https://realpython.com/installing-python/ | S |
| FC1 | freeCodeCamp "How to Install Python on Windows" | https://www.freecodecamp.org/news/how-to-install-python-in-windows-operating-system/ | S |
| FC2 | freeCodeCamp Español "Los Mejores Tutoriales de Python" | https://www.freecodecamp.org/espanol/news/los-mejores-tutoriales-de-python/ | S (exists) |
| PL1 | Platzi "Gestión de GitHub Tokens para Acceso Seguro a Repositorios"; "Instalando Git en Windows 7" | https://platzi.com/cursos/gitgithub/gestion-de-github-tokens-para-acceso-seg/ ; https://platzi.com/git-github/tutoriales/instalando-git-en-windows-7/ | S |
| PE1 | Python Perú website repo (build instructions only, no learner tutorial found) | https://github.com/pythonpe/python.pe | S + R (README) |
| E1 | Atkinson, Derry, Renkl & Wortham (2000) "Learning from Examples: Instructional Principles from the Worked Examples Research", *Review of Educational Research* 70(2):181–214, doi:10.3102/00346543070002181 | https://eric.ed.gov/?id=EJ627412 | S |
| E2 | Sweller & Cooper (1985) "The use of worked examples as a substitute for problem solving in learning algebra", *Cognition and Instruction* 2(1):59–89, doi:10.1207/s1532690xci0201_3 | https://www.semanticscholar.org/paper/3f0f4438bb4cd3fc69abf0bf9362d8687fd3d66c | S |
| E3 | Mayer (2017) "Using multimedia for e-learning", *J. Computer Assisted Learning* 33:403–423 | https://onlinelibrary.wiley.com/doi/abs/10.1111/jcal.12197 | S |
| E4 | Gellevij & van der Meij (2004) "Empirical Proof for Presenting Screen Captures in Software Documentation", *Technical Communication* 51(2) | https://www.ingentaconnect.com/content/stc/tc/2004/00000051/00000002/art00005 | S |
| E5 | van der Meij (2000) "The role and design of screen images in software documentation", *J. Computer Assisted Learning* | https://onlinelibrary.wiley.com/doi/10.1046/j.1365-2729.2000.00142.x | S |
| E6 | Meng (2019) "Effects of Visual Signaling in Screenshots: An Eye Tracking Study", *Technical Communication* 66(4) | https://www.ingentaconnect.com/content/stc/tc/2019/00000066/00000004/art00007 | S |
| E7 | van der Meij & van der Meij, "A comparison of paper-based and video tutorials for software learning"; and "Eight guidelines for the design of instructional videos for software training" (journal/year not captured in the snippet) | https://research.utwente.nl/en/publications/a-comparison-of-paper-based-and-video-tutorials-for-software-lear | S |
| E8 | Carroll, "The Minimal Manual" (1987 PDF mirrored by Software Carpentry instructor training) and the four minimalism principles as stated by Carroll & van der Meij (exact paper titles not captured in the snippet) | https://www.instructionaldesign.org/theories/minimalism/ ; https://edutechwiki.unige.ch/en/Minimalist_instruction | S |
| E9 | "Open Source Software Development Tool Installation: Challenges and Strategies For Novice Developers", arXiv:2404.14637 (2024; authors not captured in the snippet) | https://arxiv.org/abs/2404.14637 | S |
| W1 | WCAG 2.2 SC 1.1.1 Non-text Content (normative text) | https://www.w3.org/TR/WCAG22/#non-text-content (src w3c/wcag `guidelines/sc/20/non-text-content.html`) | R |
| W2 | WCAG 2.2 SC 1.4.5 Images of Text, normative text + Understanding doc | https://www.w3.org/WAI/WCAG22/Understanding/images-of-text.html (src w3c/wcag) | R |
| W3 | W3C WAI Images Tutorial: Complex Images; An alt Decision Tree | https://www.w3.org/WAI/tutorials/images/complex/ ; https://www.w3.org/WAI/tutorials/images/decision-tree/ | S |
| ST1 | Microsoft Writing Style Guide, "Screenshots" | https://learn.microsoft.com/en-us/style-guide/ (search returned only the *internal* edition URL `writing-style-guide-msft-internal/images-video/screenshots`) | S, **content not verified** |
| ST2 | Google developer documentation style guide, "Figures and other images" | https://developers.google.com/style/images | S |

---

## 1. Root causes: why beginners fail at setup

### 1.1 Evidence per candidate

Verdict key: **Confirmed** = at least one primary source names it as a real, recurring beginner
failure. **Partly** = real, but narrower than the brief implies. **Rejected / changed** = the
premise is out of date.

1. **Never opened a terminal, or can't tell the shell from the Python REPL.** **Confirmed.**
   - Every beginner-grade tutorial spends a full chapter on "what is the command line" before any
     install [DG1, SC2, OP1].
   - Django Girls teaches the prompt symbol explicitly: `>` on Windows, `%` on macOS, `$` on Linux,
     with "Ignore the left part and only type in the command" [DG1 `prompt.md`].
   - Django Girls then has a separate "Python prompt" chapter whose sign is `>>>` [DG1
     `python_introduction/prompt.md`].
   - The Carpentries wiki records learners opening `git-cmd` instead of Git Bash, so that "none of
     the bash commands seem to work" [SC3].
   - It also records learners who "created/saved files and don't know where they are" [SC3].
   - The REPL-vs-shell confusion (typing `pip install` at `>>>` and getting a `SyntaxError`) is
     widely reported on Stack Overflow, but **not verified** here because Stack Overflow is blocked.
2. **PATH not set, or a shell left open from before the install.** **Confirmed, high frequency.**
   - The 3.12 Windows installer's PATH checkbox, "Add python.exe to PATH", is **unchecked by
     default** (`PrependPath` Value="0") [P8].
   - The VS Code Python tutorial added an explicit note: "If you install Python while VS Code or a
     terminal is already open, close and reopen the terminal … A terminal reads your system
     configuration when it starts" [V1].
   - Django Girls: "you may open a new command prompt and try again; this happens if you use a
     command prompt that was opened before the Python installation" [DG1].
   - VS Code's setup page: "Restart your console after installation" [V2].
   - The Carpentries wiki records `jupyter not found` caused by a distribution not appending to
     PATH [SC3].
3. **The Windows Store `python` alias.** **Confirmed, and quantified.**
   - PEP 773 reports that "approximately 300,000 installs per month come through this redirector,
     making up about 90% of the total installs of that version" [P4]. This is Python-team telemetry
     on the Store app. Typing `python` on a clean Windows machine sends people to the Store.
   - The cpython issue "Windows Store 'stub' Python executables give confusing behaviour" [I3].
   - vscode-python #9576, 79 comments: "VS Code claiming that python isn't installed even when an
     interpreter is showing" [I1].
   - Microsoft's own FAQ: "Why does running python.exe open the Microsoft Store?" The python.org
     "add to PATH" install takes priority, but "other installers may add `python` at a *lower*
     priority than the built-in shortcut" [M1].
   - **2025–26 change:** the alias is now the *designed* path. PyManager's `python`, `py` and
     `pymanager` are themselves app execution aliases [P5].
   - The python.org troubleshooting table's first fix for "`python` gives me a 'command not found'
     error or opens the Store app" is: open "Manage app execution aliases" and check "Python
     (default)" [P5].
   - pymanager issues show the alias layer still breaking: #370 (open), #380, #371, #139 [I5].
4. **Several Pythons installed.** **Confirmed.**
   - PEP 773: "installing Python from the Store followed by Python from the traditional installer
     with its PATH modification enabled will almost always shadow the Store package's Python" [P4].
   - The python.org troubleshooting table has rows for "`python` doesn't launch the same runtime as
     `py`" and for the legacy launcher shadowing PyManager ("can't open file") [P5].
   - Microsoft: "You may end up with multiple versions … it may not be obvious which version of
     Python you are using" [M1].
   - The Carpentries wiki: "Use `which python` to make sure the Python being run is actually
     Anaconda's" [SC3].
   - macOS ships an Apple-controlled `/usr/bin/python3`. A python.org install adds a second one;
     the docs say the defaults "should ensure" the new one wins [P9].
5. **Git Bash vs PowerShell.** **Confirmed, though often a consequence of other causes.**
   - The Git for Windows installer's PATH page has three options. Only "Git from the command line
     and also from 3rd-party software" (the default, labelled Recommended) makes Git work in
     PowerShell and cmd [G1].
   - The Carpentries setup warns that without it "Git Bash will not work properly, requiring you to
     remove the Git Bash installation, re-run the installer" [SC1].
   - In Git Bash with MinTTY, interactive programs such as `python` can hang unless they run
     through `winpty` [SC3].
   - In PowerShell, `Activate.ps1` fails because script execution is disabled by default: vscode-python
     #2559, 72 comments [I2]. This matters later, when venvs arrive.
   - PowerShell and Bash also differ in syntax: `$env:VAR` vs `export`, `\` vs `/`, `where.exe`
     vs `which` [M1].
6. **GitHub refusing a password over HTTPS.** **Confirmed, with a permanent root cause.**
   - From 2021-08-13 GitHub stopped accepting account passwords for Git operations [B1, B2].
   - The docs now say: "Password-based authentication for Git has been removed … When Git prompts
     you for your password, enter your personal access token" [H2].
   - The error text "Support for password authentication was removed on August 13, 2021" still
     generates GitHub Community threads years later, for example #42562 and #114406 (WebSearch
     listing, 2026-10-05).
   - **GitHub Desktop is not affected:** it signs in through the browser [B1 snippet; H6: "Authenticating
     … using your username and password is not supported. We require authenticating using the
     browser instead"].
   - On Windows, Git for Windows installs Git Credential Manager by default, which also does the
     browser flow [G1].
   - The Carpentries wiki's older Git rows ("username or password is rejected although student knows
     that they are correct") are this cause, recorded before tokens existed [SC3].
7. **Two-factor authentication.** **Partly. The brief's wording needs correcting (see §5.5).**
   - Mandatory 2FA applies to accounts "selected" for it after taking contributor actions. Examples:
     publishing a release, an app or an action; contributing to high-importance repositories; owning
     an organisation [H1].
   - A brand-new learner account is not necessarily required to enable 2FA on day one. GitHub still
     "strongly recommend[s] it" [H1, H4].
   - **The blocking failure is losing the 2FA device.** "GitHub Support will not be able to restore
     access to accounts with two-factor authentication enabled if you lose your two-factor
     authentication credentials" [OP1, quoting GitHub policy].
   - Email verification "does not count as 2FA" [H1].
8. **SSH vs HTTPS confusion.** **Confirmed as a source of friction. Avoidable by design.**
   - GitHub Docs label HTTPS "(recommended)". SSH means "you must generate SSH keys on each computer
     you use" [H3].
   - The Odin Project teaches SSH (`ssh-keygen -t ed25519`, passphrase prompts, `~/.ssh`) on day one
     [OP1].
   - The Carpentries wiki records SSH-key and remote-URL mix-ups (`Permission denied (publickey)`,
     `git remote rm origin`) [SC3].
   - `gh auth login` asks "What is your preferred protocol for Git operations on this host?" with
     HTTPS first (the default) [C1].
   - Recommendation: never mention SSH in Sesión 0.
9. **Antivirus and corporate laptops.** **Partly confirmed, low frequency, high severity.**
   - git-for-windows #1725, "Memory violation detected by Dell Data Protection", 28 comments [I6].
   - The Carpentries wiki: "Turn off Windows Sophos" for Jupyter output problems [SC3].
   - Corporate TLS interception: the Carpentries pick "Use the native Windows Secure Channel
     Library" so that people "stuck behind corporate firewalls that do MITM … are still able to
     access remote git repos" (template comment) [SC1].
   - Git for Windows now **defaults** to Secure Channel (`CURL Option` default `WinSSL`) [G1].
   - VS Code: running as admin is unsupported when AppLocker is configured [V2].
   - OneDrive-redirected user folders break installs [SC1, SC3].
10. **Non-admin accounts.** **Partly. Mostly solved by per-user installers.**
    - Python 3.12 "Install Now" does "*not* need to be an administrator" [P7]. PyManager MSIX is
      per-user [P5].
    - The VS Code User setup "does not require administrator permissions" [V2].
    - Git for Windows is per-machine by default and usually asks for admin rights. That is my
      judgement from typical behaviour, **not verified** in G1 within the time spent.
    - **The python.org macOS .pkg requires admin:** "A macOS user name with Administrator privilege
      is needed" [P9].
    - WSL2 requires admin [SC1].
    - The Carpentries recommend Git Bash partly because it "does not require admin privileges"
      [SC1].
11. **Shared or old computers.** **Partly. Data is thin.**
    - Python 3.12 supports Windows 8.1+, but the PEP 773 MSIX route needs Windows 10+ [P7, P4].
    - Python macOS installers target macOS 10.13+ (3.12.10 universal2 [P11 snippet]); current
      installers target "typically from at least macOS 10.15" [P9].
    - The Carpentries call Windows XP/Vista/7/8 "End Of Life" and route Windows 10 below 1903 to Git
      Bash [SC1].
    - **Shared computers:** a credential left in the OS store signs the next user in as the previous
      one. Inferred from how GCM, `gh` and Desktop store tokens [C1, G1]; **no incident data found**.
    - `gh` falls back to plain-text token storage when no credential store exists [C1, C3].
12. **Extra causes found during research (not in the brief).**
    - **Non-US keyboards.** "Students with non-US keyboards may have difficulty finding … tilde,
      square brackets, curly brackets … quotes" [SC3]. Relevant to the Latin-American Spanish layout
      (AltGr combinations).
    - **Git's default editor is Vim.** Git for Windows' fallback editor is Vim. The installer's own
      text: "Vim is the default editor of Git for Windows only for historical reasons" [G1]. A learner
      who runs `git commit` without `-m` lands in Vim.
    - **Unclear success signal.** The 24-session study found "knowing if the installation was
      successful or not" was a main challenge. Learners fell back on unofficial sources (Stack
      Overflow, blogs, YouTube) [E9 snippet].
    - **Ubuntu `venv` missing.** On Debian/Ubuntu, `python3 -m venv` fails with "ensurepip is not
      available" until `python3-venv` is installed. PEP 668 blocks system-wide `pip install` [snippet,
      multiple secondary sources; U1 confirms `python3-venv` is a separate package].
    - **macOS SSL certificates.** The python.org macOS install is not complete until `Install
      Certificates.command` runs. Without it, HTTPS from Python fails with `CERTIFICATE_VERIFY_FAILED`
      [P9; snippet for the error string].

### 1.2 Ranking

**Honesty statement.** No dataset ranks these causes for beginners. The available quantitative
signals are:

- (a) PEP 773 telemetry on the Store redirector, which is real data;
- (b) GitHub issue comment counts, which measure developer pain, not beginner frequency;
- (c) the Carpentries' accumulated workshop wiki, which is qualitative and frequency-weighted only
  by what helpers bothered to write down.

So the **frequency** column is a judgement anchored to that evidence. The **severity** column is
judgement on a 1–5 scale. 5 means the learner cannot continue alone; 1 means a one-line fix the
page can give. Rank = frequency first, severity as tie-break.

| Rank | Cause | Frequency (H/M/L) and evidence | Severity (1–5) and why | Basis |
|---|---|---|---|---|
| 1 | Shell vs REPL vs "where do I type this" (never used a terminal) | H — whole chapters in every beginner tutorial [DG1, SC2, OP1]; Carpentries wiki rows [SC3]; E9 "unclear instructions" | 4 — nothing else can be followed until it is solved; one picture + prompt-symbol rule fixes it | judgement + qualitative |
| 2 | PATH not set / stale terminal | H — PATH checkbox unchecked by default [P8]; explicit warnings in V1, V2, DG1 | 3 — fix is "close and reopen" or re-run the installer, but the learner can't diagnose it alone | judgement + installer default (data) |
| 3 | Store alias / `python` opens the Store or "Python was not found" | H on Windows — ~300k installs/month via redirector, ~90% of that version's installs [P4]; I1 (79 comments), I3, I5 | 3 — confusing but recoverable once you know "Manage app execution aliases" [P5, M1] | data (P4) + issues |
| 4 | GitHub password refused over HTTPS | M–H for CLI users; ~0 for Desktop/GCM/`gh` users — B1/B2/H2; community threads | 5 if it happens (no path forward without knowing about tokens), 0 if the page routes sign-in through browser OAuth | judgement |
| 5 | Several Pythons installed | M — P4, P5 troubleshooting rows, M1, SC3 | 3 — `python` and `py` disagree; code runs in the "wrong" Python later | judgement |
| 6 | Git Bash vs PowerShell (and PowerShell execution policy) | M — G1 PATH page; SC1 warning; I2 (72 comments) | 2–3 — confusing, rarely blocking if Git is on PATH and one shell is chosen | judgement + issues |
| 7 | Vim as Git editor | M — G1 default; anyone who runs `git commit` without `-m` | 3 — learners don't know how to quit Vim; installer text itself warns | judgement + installer default (data) |
| 8 | Non-admin / managed laptop | L–M (higher in the PyArcana audience if learners use work laptops — unknown) — P9 (mac admin), SC1, V2 | 5 on macOS python.org .pkg and WSL2; 1 on Windows per-user installers | judgement |
| 9 | 2FA lock-out (lost phone / no recovery codes) | L — H1, OP1 | 5 — GitHub Support cannot restore access [OP1 quoting GitHub] | judgement |
| 10 | SSH vs HTTPS confusion | L if the page never mentions SSH; M in SSH-first curricula [OP1, SC3] | 3 | judgement |
| 11 | Antivirus / corporate TLS interception / OneDrive | L — I6, SC1, SC3 | 4–5 — needs IT; the learner cannot fix it | judgement + issues |
| 12 | Old or shared computer | L — SC1, P7, P4 | 4 if the OS is too old (Win ≤ 8, macOS < 10.13); 2 for credential leakage | judgement |
| 13 | Non-US keyboard symbols | M for Spanish layouts, unmeasured — SC3 | 2 — slows every command; fix is a key table | judgement |
| 14 | macOS certificates step skipped | L–M for macOS python.org users — P9 | 2 now (nothing in Sesión 0 does HTTPS from Python), 4 later (pip, requests) | judgement |

What this ranking implies for the design:

- Causes 1–3 decide whether the learner finishes at all. They each deserve a picture, a "deberías ver"
  checkpoint and a "si no funciona" box.
- Cause 4 can be **designed away**: sign in with GitHub Desktop or `gh auth login`'s browser flow,
  and never ask for a password in a terminal.
- Cause 9 is rare but catastrophic, so it gets a hard "save your recovery codes" step.

---

## 2. What the best tutorials do well and get wrong

The columns are: what to copy, what to avoid or what is out of date, and the source.

| Source | Does best (copy this) | Gets wrong / out of date | Ref |
|---|---|---|---|
| **Django Girls (en)** — "Intro to command line" | Friendly frame ("your new friend"); defines terminal and its synonyms (*cmd, CLI, prompt, console, terminal*); **one OS per collapsible block**; teaches the prompt symbol per OS and "ignore the left part"; first command is harmless (`whoami`); "type, don't copy-paste"; explicit "ask your coach" escape hatch | Coach-dependent (assumes a workshop); uses prompt symbols inside code blocks, which learners copy | DG1 |
| **Django Girls (en)** — "Python installation" | Screenshot of the PATH checkbox with the instruction "make sure you tick"; Linux checks `python3 --version` *before* installing; explains the stale-terminal failure | Windows path is **out of date for 2026**: it sends people to `/downloads/windows/` for the ".exe" installer and mentions "Add Python {{version}} to PATH" (old label), no mention of the Python install manager [P5] or the Store alias; macOS block tells the user to change Gatekeeper to "App Store and identified developers" (unnecessary for notarized pkgs [P9]); no `Install Certificates.command` | DG1 (book.json py_release 3.14.3) |
| **Django Girls (es)** | Full Spanish translation of the command-line chapter; neutral Spanish | **Badly stale**: Windows section says "Add Python 3.6 to PATH", links Python 3.4.6 and 3.6.1 installers, "Windows x86-64 executable installer" naming from the 3.6 era | DG2 |
| **Software Carpentry setup (workshop-template)** | Every installer page enumerated in order with the exact option text to pick (e.g. "Git from the command line and also from 3rd-party software", "Checkout Windows-style, commit Unix-style", "Git Credential Manager"); explains *why* for risky ones ("If you don't do this Git Bash will not work properly"); picks Secure Channel for corporate networks; flags OneDrive and admin rights explicitly; WSL vs Git Bash decision guide by Windows version | Long and wall-like; picks **Nano** as Git editor and **"Let Git decide"** for branch name (gives `master`, chosen for lesson compatibility, template comment) — wrong for us; Python via **Miniforge/conda** (heavy, data-science framing); 2025 task force moves Windows users toward **WSL 2** first [SC4], which needs admin and adds a second OS | SC1, SC4 |
| **Software Carpentry "The Unix Shell"** | Defines shell vs terminal; "Where to type commands: How to open a new shell" callout per OS; first action `cd` to land in home; troubleshooting callout about duplicated unzip folders (anticipates a concrete beginner error) | Assumes Bash everywhere; Windows learners must have Git Bash | SC2 |
| **Carpentries "Configuration Problems and Solutions" wiki** | A real *failure catalogue* from workshops, symptom → fix (Git Bash vs git-cmd, HOME unset, winpty hang, `which python`, keyboard layouts) | Many rows are stale (Git 1.8.x, Canopy); no frequency counts | SC3 |
| **Microsoft Learn "Python on Windows for beginners"** (ms.date 2026-09-14) | Two tabs: **WinGet** one-liners vs manual; "Why does running python.exe open the Microsoft Store?" FAQ explains the alias and how to turn it off ("Manage app execution aliases" → "App Installer" Python entries → Off) | **Internally contradictory in 2026**: recommends `winget install Python.Python.3.14` *and* the Store; FAQ still says "When you install Python from the Microsoft Store, the `py` command is **not included**" and "recommended to use the `python3` command" — both contradicted by PyManager, where `py` is the recommended multi-version command and `python3` "is not meant to be widely used or recommended" [P5]; no 3.12 guidance | M1 (source from MicrosoftDocs/windows-dev-docs; live page may differ) |
| **Microsoft Learn es-es** | Exists in Spanish (machine-translated mirror of M1) | Inherits M1's contradictions | M2 [snippet] |
| **python.org "Using Python on Windows" (current)** | Authoritative; one recommended path (Python install manager), `python` = latest, `py` = choose versions, `py list`; **symptom → fix troubleshooting table** (best in class): Store opening, aliases, `%LocalAppData%\Microsoft\WindowsApps` on PATH, legacy launcher conflict | Reference-style, not a tutorial; no screenshots of the MSIX flow; the first-run "add to PATH?" prompt for `%LocalAppData%\Python\bin` is explained in prose only | P5, P6 |
| **python.org "Using Python on Windows" (3.12)** | The classic full-installer flow, "Install Now" vs "Customize", "Add Python to PATH" explanation, re-run Modify to fix | Its screenshot `win_installer.png` shows **Python 3.8.0** with label "Add Python 3.8 to PATH"; the real 3.12.10 label is "Add python.exe to PATH" [P8] | P7, P8 |
| **python.org "Using Python on macOS"** | Screenshot per installer screen (`mac_installer_01…08`); explicit **completion signal**: "If `Successfully installed certifi` and `update complete` appear … the installation is complete"; explains Apple's `/usr/bin/python3` | Installers are provided only for versions **not in security status**, so a 3.12 learner gets the last 3.12 binary (3.12.10) | P9, P1 |
| **Real Python installation guide** | Covers all three OSes, multiple install routes, verification | [snippet] recommends the **Microsoft Store / install manager** as the default Windows route for 3.14+ — fine for latest Python, unhelpful for a pinned 3.12 course; long, many alternatives (decision overload) | RP1 (snippet only) |
| **GitHub Docs "Set up Git"** | Short; HTTPS "(recommended)" with a credential helper; points to `gh auth login` as an alternative; acknowledges GitHub Desktop for non-CLI users | Link-out heavy: "Download and install the latest version of Git" with no installer guidance; no Windows option advice | H3 |
| **GitHub Docs "Creating an account"** | Verified email is required for basic tasks ("such as creating a repository"); recommends 2FA immediately | No username advice; no mention of 2FA recovery codes in the flow | H4 |
| **GitHub Docs "Start your journey"** (2026) | A **single practice project** (`stargazers-log`) carried across lessons; **GitHub Desktop** for sign-in and clone; "What you accomplished" outcome table after each lesson | Website-centric (HTML) project; assumes the editor is already set up | H5, H12 |
| **GitHub Desktop sign-in docs** | Browser-based OAuth, 2FA prompt handled in the browser; explicit warning that username/password is not supported | Windows sign-in can fail to return to the app (protocol handler; running Desktop as admin breaks it) [D1 snippet] | H6, D1 |
| **`gh auth login`** | Interactive: "Where do you use GitHub?" → "What is your preferred protocol…?" (HTTPS default) → "Authenticate Git with your GitHub credentials?" (default yes) → "How would you like to authenticate GitHub CLI?" ("Login with a web browser" default) → one-time code copied to clipboard → "Press Enter to open … in your browser" → "✓ Logged in as …"; stores token in OS credential store | Many prompts with jargon (protocol, credentials, token); falls back to **plain-text token** with only a yellow "!" warning if no credential store [C1, C3]; WSL can't open the browser [C2] | C1 |
| **GitHub Skills "Introduction to GitHub"** | Zero-install, entirely in the browser; "Prerequisites: None"; one hour; branch → commit → PR → merge; automatic feedback via Actions; "Having trouble?" box | Needs a working account; teaches PRs, which we don't need on day 0; English only | GS1 |
| **The Odin Project foundations** | Honest framing ("installing … can be very frustrating"); **narrow support matrix** (only tested environments) to make community help possible; tells learners to set the **private noreply email** before `user.email`; `init.defaultBranch main`; verification with `git config --get` | Refuses native Windows (VM/dual-boot/WSL2) — too heavy for our audience; SSH-first; 2FA marked "(Optional)" | OP1 |
| **freeCodeCamp (en)** | Short linear Windows walkthrough: download, tick "Add Python 3.x to PATH", Install Now, "Setup was successful" | [snippet] Verifies with `python3 --version` on Windows, which is the wrong command there (the Store alias or PyManager's discouraged `python3`) | FC1 (snippet only) |
| **freeCodeCamp Español** | Spanish curated link lists | No first-party Spanish install guide found | FC2 (snippet only) |
| **CS50 (cs50.dev)** | **Removes setup entirely** for day 1: a browser-hosted VS Code (GitHub Codespaces) with terminal and everything preinstalled; local VS Code is optional later | Needs a GitHub account and a fast connection; hides the skills that PyArcana explicitly wants to teach (local install, PATH, Git) | CS1 |
| **VS Code docs** | Clear "User setup (no admin)" vs "System setup" table; integrated terminal; workspace trust explained ("When in doubt, leave a folder in Restricted Mode") | Python tutorial still recommends **Homebrew** on macOS and `py -3 --version` / `py -0` on Windows (legacy launcher syntax) and links docs.python.org **3.9** | V1–V4 |
| **Platzi (free blog/tutorials)** | Spanish token guide (Settings → Developer settings → PAT) | "Instalando Git en Windows 7" is obsolete; teaching PATs by hand is the high-friction route | PL1 (snippet only) |
| **EDteam** | — | **Not verified**: no EDteam install tutorial surfaced in search; site blocked | — |
| **Python Perú / Python Argentina** | python.pe exists (community site repo); the official Python docs have a maintained Spanish translation (python-docs-es, branches 3.12–3.14, `using/windows.po`) | No beginner setup tutorial from Python Perú was found | PE1, P15 |

Overall pattern:

- The beginner-friendly sources (Django Girls, freeCodeCamp, the Spanish blogs) are friendly but
  **stale on Windows Python**.
- The authoritative sources (python.org, GitHub Docs) are current but **reference-style**.
- None of the sources combines the two with a **fixed, pinned version (3.12)**.
- **No source checked gives a completion signal** after each step, except python.org macOS
  ("Successfully installed certifi") and GitHub's "What you accomplished" tables.

---

## 3. Teaching with pictures

### 3.1 Research base

1. **The worked-example effect.**
   - Studying worked examples beats solving equivalent problems in early skill learning. In Sweller &
     Cooper's algebra study, the problem-solving group took about six times longer and made more
     errors [E2, snippet].
   - Atkinson, Derry, Renkl & Wortham turn this into principles: several examples per problem type;
     surface features that signal deep structure; examples placed close to matched practice
     problems; prompts that encourage self-explanation; most useful in early skill stages [E1,
     snippet].
   - **Implication:** each step shows a fully worked screen state ("here is exactly what you type
     and what you see"), then a near-identical self-check (the learner types it and compares).
2. **Mayer's multimedia principles** [E3, snippet]:
   - **Signalling:** highlight the essential parts.
   - **Coherence:** cut extraneous material.
   - **Segmenting:** learner-paced segments.
   - **Spatial contiguity:** words next to the picture they describe.
   - **Redundancy:** don't add on-screen text that repeats narration.
   - The search summaries give conflicting effect-size figures (coherence 0.70 or 0.86; signalling
     0.46 or 0.41), so **the d values are not verified** and should not be quoted on the page or in
     DESIGN.md until someone reads the paper.
   - The direction of every effect is consistent across sources.
3. **Screenshots in software tutorials.**
   - Gellevij & van der Meij (2004) give four functions of screen captures: (a) switching attention
     between manual and screen; (b) building a mental model of the program; (c) identifying and
     locating window elements; (d) **verifying screen states** [E4, snippet].
   - With screenshots for verifying screen states, users "made fewer errors and executed action
     steps supported by screenshots faster" [E4, snippet].
   - van der Meij (2000): screen images reduce split attention [E5, snippet].
   - **Signalling inside screenshots:** in Meng (2019), frames and arrows meant more tasks executed
     correctly with no time cost. Eye tracking showed longer and more frequent fixations on the
     highlighted areas [E6, snippet].
4. **Video vs paper.**
   - The van der Meij & van der Meij studies found video tutorials designed with their eight
     guidelines (preview, short segments, pacing control, review) gave better motivation, immediate
     performance and one-week retention than paper. A snippet cites 90% vs 63% task success during
     training [E7, snippet].
   - The literature is mixed overall: "some … advantages for paper … others no differences" [E7,
     snippet].
   - **Implication for us:** static annotated screenshots are the right default, given the owner's
     order, the maintenance cost and low-bandwidth learners. Optional short clips can come later. If
     video is ever added, it should follow those guidelines and never replace the text.
5. **Minimalism** (Carroll; van der Meij & Carroll) [E8, snippet]. Four principles:
   - action-oriented;
   - anchor in the real task;
   - **support error recognition and recovery**;
   - support reading to do, study and locate.
   - The Minimal Manual was under a quarter of the official manual's length. Users progressed
     faster, scored better and "spent far less time in error recovery" [E8, snippet].
   - Minimalism treats recovery as learning content, which is the evidence base for the "si no
     funciona" boxes.

### 3.2 Screenshot conventions to adopt (GitHub Docs is the most specific published standard)

From GitHub Docs [H8, H9], read in full:

- **When to use a screenshot.** Only when the UI element is small or subtle, not immediately
  visible (for example inside a dropdown), or competes with other choices. "Do not use screenshots
  for procedural steps where text alone is clear, or to show **code commands or outputs**."
  - *Our deviation:* the owner ordered screenshots throughout. Keep the code-and-output rule anyway:
    terminal text goes in `CodeBlock`, not in an image, which also follows WCAG 1.4.5 (§3.3).
    Terminal screenshots may still be used for orientation ("this is the window"), with all the
    text repeated in the prose.
- **Accessibility.**
  - Instructions must be complete in text, "with no information conveyed entirely in visual form".
  - Use full contrast and nothing obscured.
  - Alt text describes the content *and the highlight*.
- **Highlight style.**
  - One rectangular stroke in dark orange `#BC4C00` (Primer `fg.severe`), chosen because "This dark
    orange has good color contrast on both white and black".
  - 4 px corner rounding, with padding about equal to the stroke width.
  - No cursor in the shot.
- **Framing.**
  - Show "just enough surrounding context"; resize the window to cut negative space.
  - Light theme where possible.
  - Show a dropdown closed if the goal is to find the menu, and open if the goal is to choose
    within it.
  - Replace personal usernames and avatars with a placeholder: GitHub uses @octocat. We should use a
    neutral demo account and **never the owner's email** (handover rule).
- **Technical.** PNG, static (no GIFs), 144 dpi, 750–1000 px wide, at most 250 KB, descriptive
  filenames.
- **Alt text format.**
  - "Screenshot of [product] [UI element]. The [element] … is outlined in dark orange."
  - 40–150 characters, starting with the type ("Screenshot of…").
  - Multi-word UI names in quotes.
  - Ends with a period.
  - Not instructions: those belong in the body text.
- **Maintenance.** Keep the filename when replacing an image.

From the Google developer documentation style guide [ST2, snippet]:

- don't use images of text, code samples or terminal output;
- introduce each image with a complete sentence;
- SVG for diagrams, PNG otherwise;
- a screenshot that only duplicates text instructions may take empty alt (`alt=""`). We should
  **not** do that here, because our screenshots carry orientation information the text doesn't.

Microsoft Writing Style Guide "Screenshots" [ST1]: **content not verified**. Search returned only the
internal edition URL. The snippet mentions using screenshots "when they can save words or add
clarity" and attention to localization. Don't cite specifics from it.

### 3.3 Accessibility requirements (normative text read)

- **WCAG 2.2 SC 1.1.1 Non-text Content (A).** "All non-text content that is presented to the user has a
  text alternative that serves the equivalent purpose" [W1].
- **WCAG 2.2 SC 1.4.5 Images of Text (AA).** "If the technologies being used can achieve the visual
  presentation, text is used to convey information rather than images of text" [W2].
  - The Understanding document notes that images of text exclude "text that is part of a picture
    that contains significant other visual content. Examples … graphs, **screenshots**, and diagrams"
    [W2].
  - **Consequence:** a UI screenshot is allowed. A screenshot that is *essentially terminal text*
    (`python --version` output) is an image of text, so render it as text.
- **WAI Images tutorial, complex images** [W3, snippet]:
  - long descriptions carry "all of the meaningful information … only as far as it relates to the
    purpose";
  - use `<figure>` + `<figcaption>`, or text on the page;
  - follow the alt decision tree.
  - **For our SVG diagrams** (PATH lookup, local ↔ GitHub), the explanation lives in the surrounding
    prose; alt states the core idea (matching H9 "Alt text for diagrams").

### 3.4 Patterns derived

Each pattern traces to a source above.

1. **One action per step + picture + "Deberías ver" checkpoint** [E4 function (d), E9 "knowing if
   successful", P9 completion signal, H5 "What you accomplished"]. The checkpoint states the exact
   text expected, for example `Python 3.12.10` or `git version 2.x`, and tells the learner what may
   vary.
2. **"Si no funciona" recovery box per step**, symptom → cause → fix, modelled on P5's
   troubleshooting table and SC3's wiki [E8 error recovery].
3. **Signal with one dark-orange box per screenshot**, never several competing arrows [E6, H8, Mayer
   signalling and coherence].
4. **Caption directly under the image, and the instruction directly above it** [Mayer spatial
   contiguity; ST2 "introduce images with complete sentences"].
5. **OS tracks shown one at a time** [DG1 collapsible per-OS blocks; Mayer coherence].
6. **Learner-paced segments with progress ticks** [Mayer segmenting; GS1 step structure].

---

## 4. The "Ford" synthesis

| # | Step | Best technique | Where it comes from | How we adapt it |
|---|---|---|---|---|
| 1 | **Terminal** | Name the window and its synonyms; teach the prompt symbol per OS and "type only after it"; first command harmless (`whoami`, `pwd`/`cd`); distinguish `>>>` (Python) from `>`/`$`/`%` (terminal) with a picture of both | DG1 intro + prompt.md; SC2 "Where to type commands"; SC3 git-cmd row | Windows: **Terminal app (PowerShell)** as the one blessed shell, Git Bash not required. macOS: Terminal. Linux: GNOME Terminal (`Ctrl+Alt+T`). Diagram "REPL vs terminal" reusing S01 figure `S01-repl-vs-script` style. Never put prompt symbols inside copyable code blocks. Spanish keyboard table for `~ [ ] { } \| \` ` (SC3). |
| 2 | **Python 3.12** | Windows: one blessed path + PATH checkbox screenshot + stale-terminal warning + alias troubleshooting; macOS: pkg screens + `Install Certificates.command` completion signal; Linux: check first, install only if missing | DG1 (checkbox shot), P5 (troubleshooting table), P7/P8 (installer), P9 (mac), U1/U2 | See §5.1 for the version decision. **Windows recommended:** legacy `python-3.12.10-amd64.exe` (last 3.12 binary), "Install Now" with **"Add python.exe to PATH" ticked**; checkpoint `python --version` → `Python 3.12.10` and `py -3.12 --version`. Recovery box: "Python was not found…/Store opens" → close and reopen terminal; then "Manage app execution aliases" → turn off App Installer python entries (M1). **Alt Windows (if PyManager already present):** `py install 3.12` → installs 3.12.10 (P13). Explain `py` / `python` / `python3` in one table (P5: `python3` exists on Windows only "to catch accidental uses"). macOS: 3.12.10 universal2 pkg (needs admin), then `Install Certificates.command`; checkpoint `python3 --version`. Linux: Ubuntu 24.04 already has 3.12.3 (U1) + `sudo apt install python3-venv`; Ubuntu 26.04 users need deadsnakes `python3.12` (U2). |
| 3 | **Git + config** | Enumerate only the installer pages that matter, with the exact option text; change the editor away from Vim; explain each `git config` line; verify with `git config --get` | SC1 (option-by-option), G1 (actual defaults), OP1 (noreply email + verify), H7 (autocrlf) | Windows installer: accept defaults **except** "Choosing the default editor used by Git" → "Use Visual Studio Code as Git's default editor" (requires VS Code installed first → **reorder: VS Code before Git on Windows**, or pick Notepad); "Override the default branch name for new repositories" → `main` (prefilled) *or* set it by command afterwards (simpler: one command for all OSes). Commands: `git config --global user.name "…"`, `user.email` = GitHub **noreply** address (needs step 4 first → **reorder: GitHub account before Git config**), `init.defaultBranch main`, Windows only `core.autocrlf true` (installer default already sets it, G1; command is a no-op safety net). Checkpoint: `git config --global --list`. |
| 4 | **GitHub account** | Verified email first; recommend 2FA with TOTP app + save recovery codes; noreply email; username advice | H4, H1, OP1 | Username: rules (alphanumeric + single hyphens, no leading/trailing hyphen, ≤ 39 chars — §5.6) + CV advice (judgement: real name or close variant, no years/jokes; GitHub notes renaming is possible but breaks old links — not verified in detail). 2FA: TOTP primary, recovery codes downloaded and stored offline — the single non-skippable warning (rank 9 severity 5). Tick "Keep my email addresses private" and copy the noreply address (OP1). |
| 5 | **Sign in + first clone/edit/commit/push** | Browser-based OAuth (no passwords, no tokens by hand); one practice repo carried through; "What you accomplished" table | H5/H6 (Desktop), C1 (`gh` browser flow), H12 (`stargazers-log`-style project), GS1 | **Primary: GitHub Desktop** (designs away rank-4 cause; GitHub's own beginner journey uses it). Create practice repo on github.com with README → Desktop "Clone" → edit README in VS Code → commit in Desktop → Push. **Secondary (Linux has no official Desktop): `gh auth login`** with the four prompts pre-answered in a screenshot/text table (GitHub.com → HTTPS → Yes → Login with a web browser) — this also configures Git's credential helper, so CLI `git push` works. Recovery boxes: Desktop not returning from browser (don't run Desktop as admin; D1); `gh` "credentials saved in plain text" warning (C1); "Support for password authentication was removed" → you used a password prompt; use Desktop or `gh auth login` (H2). Never teach SSH or manual PATs here. |
| 6 | **VS Code** | User setup (no admin); open a *folder*, not a file; integrated terminal; trust prompt explained; close and reopen terminals after installs | V2, V3, V4, V1, CS1 | Windows User setup (adds `code` to PATH — "Restart your console"); macOS drag to Applications then "Shell Command: Install 'code' command in PATH" (V1 note; exact menu text not re-read — verify); Linux .deb/snap. Open the cloned practice folder; answer the trust dialog "Yes, I trust the authors" *for your own folder only*; open terminal with `` Ctrl+` ``; run `python --version` inside it. Install the Python extension (V1). |
| 7 | **Final check** | A single scripted check whose output is the completion signal | P9 ("Successfully installed certifi"), H5 table, E9 | A copy-paste block of 4–5 commands (`python --version`/`python3 --version`, `git --version`, `git config --global user.email`, `gh auth status` *or* "Desktop shows your avatar", `code --version`) + a "deberías ver" table of expected lines, + a tick in the page's progress. Hand-off sentence into S01. |

---

## 5. Current facts the page will state

All facts were checked on 2026-10-05.

### 5.1 Python 3.12 availability (critical, and contradicts the brief's assumption)

- **3.12 status.** 3.12.10 (Tuesday 2025-04-08) was the "Final regular bugfix release with binary
  installers". After it come "Source-only security fix releases … Provided irregularly on an
  as-needed basis until October 2028" [P1].
  - Security releases so far: 3.12.11 (2025-06-03), 3.12.12 (2025-10-09), 3.12.13 (2026-03-03),
    3.12.14 (2026-08-12), 3.12.15 (2026-10-01) [P1].
- **No official binary installer exists for any 3.12.x after 3.12.10**, on Windows or macOS [P1;
  P12, snippet: "binary installers are no longer provided"].
  - The newest 3.12 a beginner can install from python.org is **3.12.10**. Its files are
    `python-3.12.10-amd64.exe` (Windows installer 64-bit) and `python-3.12.10-macos11.pkg`
    (universal2) [P11, snippet; file names not opened directly].
- **Python install manager on Windows.** `py install 3.12` installs **3.12.10**. Asking for
  `3.12.13` gives "Failed to find a suitable install" [P13, 2026-05; P14, 2025-12].
- **Linux.**
  - Ubuntu 24.04 ships `python3` 3.12.3-0ubuntu2.1, with `python3.12` 3.12.3-1ubuntu0.17 in
    noble-updates. Ubuntu backports security fixes into its own 3.12.3 build [U1].
  - The deadsnakes PPA does **not** build 3.12 for noble ("NOT Python3.12 … upstream ubuntu provides
    those packages") [U2].
  - It does build `3.12.15-1+jammy1` for 22.04 [U2].
  - Ubuntu 26.04 "resolute" provides 3.14 natively; deadsnakes covers 3.7+ there except 3.14 [U2].
  - deadsnakes carries a disclaimer: "no guarantee of timely updates in case of security problems"
    [U2].
- **Other lines for context.**
  - 3.13.16 (2026-10-01) was 3.13's final binary release [P2].
  - 3.14 is in bugfix mode (3.14.8 on 2026-10-01), with binaries until about 3.14.14 in October
    2027 [P3].
  - deadsnakes lists `3.15.0~rc3`, so 3.15.0 final is imminent (deadsnakes listing; PEP 790 not
    read).
- **What a beginner should install** (recommendation, for DESIGN.md to decide):
  - Windows: 3.12.10 via the legacy .exe, or `py install 3.12`.
  - macOS: the 3.12.10 .pkg.
  - Ubuntu 24.04: the system 3.12.3.
  - Accept that the patch level varies by OS. The checkpoint should say "Python 3.12.x" and not
    pin the patch.
  - **Flag for the owner:** 3.12.10 binaries receive no security fixes after April 2025. If that is
    unacceptable, the course pin (`.venv-content`, Python 3.12) is the thing to revisit (3.13 or
    3.14), not the page.

### 5.2 Windows installers

- **The legacy .exe (3.12.10).**
  - First-page checkbox labels: "Add &python.exe to PATH" and "Use admin privi&leges when installing
    py.exe". The ampersands mark access keys [P8].
  - Defaults: `PrependPath=0` (PATH **unticked**), `InstallAllUsers=0` (per-user), launcher
    included [P8].
  - "Install Now" needs no admin, unless a C runtime update is required [P7].
  - Fix after the fact: re-run the installer → Modify [P7].
  - The official screenshot in the 3.12 docs is from **3.8.0** and shows the old "Add Python 3.8 to
    PATH" label [P7 image]. Don't reuse it.
- **Deprecation.** "The full installer (deprecated) … deprecated since 3.14 and will not be produced
  for Python 3.16 or later" [P6].
  - The PEP's plan: the .exe installer and the old `py` launcher "will be deprecated and no longer
    released from two years after this PEP is accepted" [P4].
- **The Python install manager (PyManager).**
  - Available from the Microsoft Store or as an MSIX from python.org downloads; "The two versions are
    identical" [P5].
  - Installing it gives `python`, `py` and `pymanager` [P5].
  - `python` runs "your current latest version"; `py` is "recommended" for multiple versions
    (`py -V:3.12`, and `py -3.12` for compatibility); `py list`; `py install <tag>` [P5].
  - `python3` "is intended to catch accidental uses of the typical POSIX command on Windows, but is
    not meant to be widely used or recommended" [P5].
  - With no runtime installed, a launch command auto-installs the latest release [P5].
  - On first runtime install, PyManager may offer to add `%LocalAppData%\Python\bin` to PATH. This
    is optional and needed only for aliases such as `python3.14.exe` [P5].
  - Its commands are app execution aliases. The OS keeps
    `%UserProfile%\AppData\Local\Microsoft\WindowsApps` on PATH; "If removed, shortcuts will not be
    found" [P5].
- **The Store alias on a clean Windows.**
  - Typing `python` "will open the Microsoft Store app to the page containing the recommended Python
    app" [P4].
  - "Running the shortcut executable with any command-line arguments will return an error code"
    [M1]. So `python --version` on a clean machine prints an error instead of opening the Store.
    The exact message ("Python was not found; run without arguments to install from the Microsoft
    Store…") appears in issue titles [I1 search], but the current wording is **not verified**
    against Windows.
  - To disable: Start → "Manage app execution aliases" → turn off the "App Installer" Python entries
    [M1].
  - A python.org install with "add to PATH" takes priority over the shortcut [M1].

### 5.3 macOS

- The python.org `.pkg` is signed and notarized.
- Installing it needs an Administrator account.
- It puts a "Python 3.x" folder in Applications (IDLE, Python Launcher) and the framework in
  `/Library/Frameworks/Python.framework`, adds itself to the shell path, and symlinks into
  `/usr/local/bin`.
- To finish, double-click `Install Certificates.command`. Success shows "Successfully installed
  certifi" and "update complete".
- Apple's `/usr/bin/python3` stays, and the python.org one should take precedence.

[All: P9]

### 5.4 Git for Windows installer defaults

Read from `install.iss` on `main`, labelled `Snapshot`. The released installer may lag slightly
[G1].

| Page | Default | Text the learner sees |
|---|---|---|
| Choosing the default editor used by Git | **Vim** (`CbbEditor.ItemIndex:=GE_VIM`) | Vim option note: "Vim is the default editor of Git for Windows only for historical reasons, and it is highly recommended to switch to a modern GUI editor instead." VS Code option exists ("Use Visual Studio Code as Git's default editor") only if VS Code is detected; otherwise Nano is offered. |
| Adjusting the name of the initial branch in new repositories | **"Let Git decide"** ("currently: 'master'") | Alternative "Override the default branch name for new repositories", text box prefilled `main`; "This setting does not affect existing repositories." |
| Adjusting your PATH environment | **"Git from the command line and also from 3rd-party software" (Recommended)** | Other options: "Use Git from Git Bash only", "Use Git and optional Unix tools from the Command Prompt" (warns it overrides `find`, `sort`). |
| SSH executable | Bundled OpenSSH | — |
| HTTPS transport backend | **Windows Secure Channel** (`WinSSL`) | (OpenSSL is the alternative.) |
| Configuring the line ending conversions | **"Checkout Windows-style, commit Unix-style line endings"** (`core.autocrlf=true`) | "For cross-platform projects, this is the recommended setting on Windows." |
| Terminal emulator for Git Bash | MinTTY | (alternative: Windows' default console) |
| `git pull` behaviour | Fast-forward or merge | — |
| Credential helper | **Git Credential Manager** (requires .NET Framework ≥ 4.7.2) | "None" warns "Git will prompt for credentials on every HTTPS operation." |
| Extra options | File system caching enabled | — |

Upstream Git still defaults to `master`. The planned Git 3.0 switches new repositories to `main`
(BreakingChanges.adoc), but `master` is at v2.56 in development, so 3.0 is not out. Hence
`git config --global init.defaultBranch main` is still needed [G2].

Line endings: `core.autocrlf true` on Windows, `input` on macOS/Linux [H7].

### 5.5 GitHub two-factor authentication: exact wording

- "As of March 2023, GitHub required all users who contribute code on GitHub.com to enable one or
  more forms of two-factor authentication (2FA). If you were in an eligible group, you would have
  received a notification email … marking the beginning of a 45-day 2FA enrollment period … If you
  didn't receive a notification, then you were not part of a group required to enable 2FA, though
  we strongly recommend it." [H1 reusable]
- Eligibility comes from contributor actions: publishing an app or action, creating a release,
  contributing to high-importance repositories, owning an organisation, publishing packages, and so
  on. "These criteria may change over time." [H1]
- If 2FA is not enabled within 45 days plus a 7-day grace period, the account is locked out of
  GitHub.com until 2FA is enabled. Existing tokens keep working [H1].
- Recommended methods: "a time-based one-time password (TOTP) app as your primary 2FA method, and …
  a passkey or security key as a backup". Passkeys and security keys are not accepted as the
  *primary* method. "SMS is reliable in most countries, but has security risks." [H1]
- "Email verification does not count as 2FA." [H1]
- The blog announced the requirement on 2023-03-09 with roll-out from 2023-03-13, aiming at all code
  contributors "by the end of 2023" [B3, snippet]. About 95% opt-in among those who got the
  requirement [B4, snippet].
- **The page should say:** "GitHub pide 2FA a quienes contribuyen código; actívala desde el primer
  día". It should not say "GitHub requires 2FA for every new account", which is not what the docs
  state.

### 5.6 GitHub usernames

- Sign-up validation message: "Username may only contain alphanumeric characters or single hyphens,
  and cannot begin or end with a hyphen" [snippet, multiple pages quoting the form; not read on
  github.com].
- Maximum 39 characters: docs state "Usernames … must not exceed 39 characters" in the
  enterprise/IdP context [H10]. The same limit applying to personal sign-up is widely reported but
  **not verified** on the sign-up page itself.
- No underscores and no dots, by the validation message above.
- The CV-friendly advice ("nombre-apellido", no birth years or jokes) is **judgement** with no
  published benchmark found. Label it as advice.

### 5.7 Account creation

- Sign up at github.com/signup. You can also continue with Google, or with Apple; "Google or Apple"
  are the supported social logins.
- You must verify your email address. "Without a verified email address, you won't be able to
  complete some basic GitHub tasks, such as creating a repository."
- GitHub "strongly recommend[s]" 2FA next.

[All: H4]

### 5.8 Password removal

- From 2021-08-13, account passwords are no longer accepted for Git operations. Use a token, SSH or
  OAuth [B1, B2].
- Current docs: "When Git prompts you for your password, enter your personal access token.
  Alternatively, you can use a credential helper like Git Credential Manager. Password-based
  authentication for Git has been removed." [H2]
- "To clone a repository without authenticating to GitHub on the command line, you can use GitHub
  Desktop" [H2].

### 5.9 `gh auth login` flow

Read from the source [C1].

1. "Where do you use GitHub?" → `GitHub.com` / `Other`.
2. "What is your preferred protocol for Git operations on this host?" → `HTTPS` (default) / `SSH`.
3. For HTTPS: "Authenticate Git with your GitHub credentials?" (default yes). This sets `gh` as
   Git's credential helper.
4. "How would you like to authenticate GitHub CLI?" → "Login with a web browser" (default) / "Paste
   an authentication token".
5. "! First copy your one-time code: XXXX-XXXX" (or "One-time code (…) copied to clipboard") →
   "Press Enter to open https://github.com/login/device in your browser…" → device-code page in the
   browser.
6. "✓ Configured git protocol" → "✓ Logged in as <user>".

- The help text: "After completion, an authentication token will be stored securely in the system
  credential store. If a credential store is not found … gh will fallback to writing the token to a
  plain text file."
- On fallback it prints "! Authentication credentials saved in plain text".
- The device URL is `github.com/login/device`. This is standard for GitHub's device flow but was
  **not read** in C1's code: the URL is computed. Confirm on the screenshot.

### 5.10 GitHub Desktop sign-in

- **Windows:** File → Options → Accounts → "Sign Into GitHub.com" → modal "Sign in Using Your
  Browser" → **Continue With Browser** → sign in on github.com (2FA code if enabled, "Verify") →
  follow the prompts back to Desktop [H6].
- **macOS:** GitHub Desktop menu → Settings/Preferences → Accounts → Sign In → same browser flow
  [H6, via reusables `mac-select-desktop-menu`, `mac-click-sign-into`; their exact wording was not
  printed].
- On first run, the welcome screen offers "Sign in to GitHub.com". Then "configure Git with your
  name and email address" [H5].
- Clone: "Let's get started!" → select the repo → "Clone OWNER/repo" → accept the defaults → Clone
  [H5].
- Known failure on Windows: the browser may not hand control back to Desktop. Running Desktop as
  administrator breaks the redirect [D1, snippet].

### 5.11 VS Code

- The Windows **User setup** "does not require administrator permissions" and installs under
  `%LOCALAPPDATA%\Programs\Microsoft VS Code`. Setup adds VS Code to PATH: "Restart your console
  after installation, then run `code .`" [V2].
- New, unfamiliar folders open in Restricted Mode, and the integrated terminal is blocked there.
  "When in doubt, leave a folder in Restricted Mode" [V3, V4].
- The integrated terminal's default shell comes "from your system defaults" (PowerShell on Windows).
  Profiles include Command Prompt, Git Bash and WSL [V3].

### 5.12 Licensing, if official screenshots are reused

- **GitHub Docs content** is under CC BY 4.0. Attribution is required [H11].
- **Python docs** (including the `mac_installer_0x.png` images in `Doc/using/`) are under the PSF
  License v2 [P10].
- Neither has been checked for screenshot-specific restrictions. **Flag for the owner** before
  reusing. The python.org Windows screenshot is stale anyway (§5.2).

---

## 6. Contradictions with the brief and other surprises (summary for DESIGN.md)

1. **"Install Python 3.12" has no current binary.**
   - Windows and macOS learners can only get **3.12.10** (April 2025) from python.org. It no longer
     receives security fixes; the 3.12 line now gets source-only fixes [P1].
   - Ubuntu 24.04 gives 3.12.3 with Ubuntu's own patches [U1].
   - The page must not promise "the latest 3.12".
2. **The Windows PATH checkbox exists only in the deprecated installer.**
   - The python.org recommendation is now the **Python install manager**: no checkbox,
     alias-based [P5, P6].
   - The two routes conflict if mixed [P4, P5].
   - Pick one route per learner and say so.
3. **`py` changed meaning.**
   - Under PyManager, `py` is the manager and launcher (`py list`, `py install`, `py -V:3.12`).
     `py -0` is legacy [P5].
   - Microsoft Learn still says the Store version has no `py` and recommends `python3` [M1]. That
     is wrong today, so don't cite M1 for this.
4. **The 2FA wording in the brief ("GitHub requires it for contributors") is right, but narrower than
   it sounds.**
   - It applies to selected contributor groups [H1].
   - Present it as strongly recommended from day 1, plus mandatory once you contribute.
5. **Git's defaults fight the course.**
   - The default editor is Vim, and the default branch is `master` ("Let Git decide") [G1, G2].
   - Choosing VS Code in the Git installer requires VS Code to be installed first.
   - This argues for **reordering: VS Code (step 6) before Git (step 3)**, or setting
     `core.editor` by command afterwards (`git config --global core.editor "code --wait"`). The
     `--wait` form is standard, but **not verified** in this session.
6. **`user.email` should be the GitHub noreply address.**
   - So **the GitHub account (step 4) should come before Git config (step 3)** [OP1].
7. **GitHub Desktop removes the top authentication failure.**
   - GitHub's own 2026 beginner journey uses Desktop for sign-in and clone [H5].
   - `gh auth login` is the Linux and CLI route. It sets up the credential helper too [C1].
8. **Spanish-language references are weak.**
   - Django Girls (es) is years stale (Python 3.6) [DG2].
   - No Python Perú or EDteam beginner install tutorial was found.
   - Microsoft Learn es-es mirrors M1's errors.
   - The official python docs translation (python-docs-es) is current, but reference-style [P15].
   - A current, Peru-friendly Spanish setup page is itself a gap that PyArcana fills.

## 7. Not verified / work left undone

- Stack Overflow question counts and vote totals (blocked for every tool).
- The academic papers' full text (E1–E9). Every finding from them is a search summary. **Mayer
  effect sizes are conflicting in the summaries; do not quote numbers.**
- Microsoft Writing Style Guide "Screenshots" content (ST1).
- Live python.org pages:
  - the exact current download-page buttons;
  - whether `/downloads/windows/` still lists the 3.12.10 .exe prominently;
  - the exact 3.12.10 file names, from search summary only.
- The exact Windows "Python was not found" message on a current Windows 11 build.
- The GitHub sign-up form rules, read on github.com itself (the 39-char limit for personal
  accounts).
- Git for Windows: the latest *released* version number, and whether `install.iss` on `main` matches
  it.
- Whether Git for Windows needs admin by default.
- The exact macOS GitHub Desktop menu wording, and the VS Code macOS "Shell Command: Install 'code'
  command in PATH" wording.
- EDteam content (site blocked, not found by search).
- No real installs were run. Every installer flow above is from source code or docs, not from a run
  on Windows or macOS.

---

## 8. Addendum (5 Oct 2026): more tutorials, and reusable screenshots

Second research pass, 2026-10-05. Same rules as §0: every claim has an ID, every ID says how it was
read. The proxy blocked the same hosts as in §0.1, plus these, each tried once and not retried:
missing.csail.mit.edu, happygitwithr.com, codigofacilito.com, infoworld.com, mclibre.org,
ciberaula.com, pythonguis.com, stanford.edu, cs61a.org, datacamp.com, ds100.org, cs.toronto.edu,
pyladies.com, python.org.ar and github.blog. **github.com pages were readable through WebFetch**, and
`git clone` of public repositories worked. So, again, most primary reads come from source repos.

### 8.1 Licence filter first: PyArcana is commercial

`docs/SUBSCRIPTION.md` describes paid plans (MercadoPago, Paddle, Lemon Squeezy). **So any
NonCommercial (NC) licence rules out reuse**, however good the material is. That removes several of
the best-known guides at once:

| Source | Licence (read from the repo) | Reusable here? |
|---|---|---|
| Missing Semester (MIT), `missing-semester/missing-semester` `license.md` | CC BY-NC-SA 4.0 (text, notes, *and videos*) | **No** (NC) [A1] |
| Happy Git and GitHub for the useR (Jenny Bryan), `jennybc/happy-git-with-r` `LICENSE` | CC BY-NC 4.0 | **No** (NC) [A2] |
| Pro Git, es and en (`progit/progit2-es`, `progit/progit2`), `LICENSE.asc` | CC BY-NC-SA 3.0 Unported | **No** (NC) [A3] |
| The Odin Project, `TheOdinProject/curriculum` `license.md` | CC BY-NC-SA 4.0 | **No** (NC) [OP1] |
| VS Code docs, `microsoft/vscode-docs` `LICENSE.md` | Docs **CC BY 3.0 US**, code MIT; no trademark or logo rights | **Yes, with attribution** [A4] |
| GitHub Docs, `github/docs` | Content CC BY 4.0, code MIT [H11] | **Yes, with attribution** [A12] |
| Microsoft `MicrosoftDocs/windows-dev-docs`, `MicrosoftDocs/terminal` `LICENSE` | CC BY 4.0 (code: `LICENSE-CODE`) | **Yes, with attribution** [A15, A16] |
| Django Girls tutorial, `DjangoGirls/tutorial` `LICENSE` | **CC BY-SA 4.0** | Yes, but ShareAlike (see the caveat below) [A6] |
| Carpentries `swcarpentry/git-novice`, `carpentries/workshop-template` `LICENSE.md` | CC BY 4.0 (lesson material) | **Yes, with attribution** [A13] |
| CPython docs images (`Doc/using/*.png`) | PSF License v2 for documentation [P10] | **Yes, with the PSF notice** [A7] |

Caveats that apply to every "Yes" row, none of them legal advice:

- **CC BY needs credit.** Each figure needs author, source link, licence link, and "modified" if we
  crop or annotate.
- **ShareAlike (Django Girls).** Under the CC licences, placing an unmodified image next to our own
  text is generally treated as a collection, not an adaptation. If we **annotate** the image, the
  annotated image must itself be CC BY-SA 4.0. That is fine for one image, but it must be labelled.
  Not checked with a lawyer.
- **Trademarks and logos are excluded.** The Microsoft licences say so explicitly [A4, A15].
  Python and VS Code logos visible *inside* a screenshot are incidental. Do not crop a logo out and
  reuse it as an icon. `windows-dev-docs/hub/images/python-logo.png` in particular is a logo, not a
  screenshot.
- **Hosting gotcha.** `microsoft/vscode-docs` stores images in **Git LFS**.
  `raw.githubusercontent.com` returns a 130-byte LFS pointer, not the PNG. The real file is at
  `https://media.githubusercontent.com/media/microsoft/vscode-docs/main/<path>`, checked: it returns
  a 1736×1154 PNG for the terminal image below [A4]. `github/docs`, CPython, Django Girls and the
  Carpentries serve real PNGs from `raw.githubusercontent.com`.

### 8.2 Reusable screenshots, by Sesión 0 step (repo paths verified by `git ls-tree`, 2026-10-05)

| Step | Image (repo · branch · path) | What it shows / fitness | Ref |
|---|---|---|---|
| Terminal inside VS Code | `microsoft/vscode-docs` · main · `docs/terminal/images/getting-started/open-terminal.png` (LFS) | Windows, dark theme, folder `C:\temp\terminal-basics`, **TERMINAL tab and "powershell" profile boxed in red**. Exactly our "integrated terminal" step. Viewed. | A4 |
| Terminal inside VS Code (more) | same dir: `select-shell.png`, `terminal-output.png`, `rerun-command.png`, `close-terminal.png` | Shell picker, output, re-run, close. Not viewed. | A4 |
| Open folder / first commit | `microsoft/vscode-docs` · `docs/sourcecontrol/images/quickstart/initialize-repository.png`, `stage-changes-button.png`, `commit-button.png`, `sync-changes.png`, `clone-repository-url.png` | From the 2026 source-control quickstart [A5]. Not viewed. The page has two `<!-- TODO: Capture … -->` placeholders, so the set is still in flux. | A5 |
| macOS "code" command | `microsoft/vscode-docs` · `docs/setup/images/mac/shell-command.png` | Command Palette, **"Shell Command: Install 'code' command in PATH"**. This confirms the wording §7 listed as unverified (`docs/setup/mac.md` line 34). | A4 |
| macOS Gatekeeper | `microsoft/vscode-docs` · `docs/setup/images/mac/open-anyway.png` | "Open Anyway" fallback. Not viewed. | A4 |
| Python Windows installer (classic, 3.12) | `DjangoGirls/tutorial` · master · `en/python_installation/images/python-installation-options.png` (658×408) | **"Install Python 3.12.2 (64-bit)"**, Windows 11 style; **"Add python.exe to PATH" ticked and boxed in green**; "Use admin privileges when installing py.exe" ticked and greyed. Both labels match the v3.12.10 installer strings exactly (`ShortPrependPathLabel`, `ShortInstallLauncherAllUsersLabel`, checked 2026-10-05) [P8]. **The best freely licensed 3.12 shot found.** The title says 3.12.2, not 3.12.10, so our caption must say "la versión puede variar". Viewed. | A6 |
| Python Windows installer, **do not use** | `DjangoGirls/tutorial` · `es/python_installation/images/python-installation-options.png` | **Python 3.6.1**, "Add Python 3.6 to PATH". The Spanish chapter still uses this image. Viewed. | A6 |
| Python Windows installer, **do not use** | `DjangoGirls/tutorial` · `es/python_installation/images/add_python_to_windows_path.png` | **Python 3.4.3** "Customize" tree, Windows 7 chrome. Viewed. | A6 |
| Python Windows installer, **do not use** | `python/cpython` · 3.12 · `Doc/using/win_installer.png` | 3.8-era image (already flagged in §2). **Removed from `main`**: `Doc/using/` on main has no `win_installer.png`. | A7 |
| macOS .pkg installer | `python/cpython` · 3.14 (or 3.13) · `Doc/using/mac_installer_01_introduction.png` … `_08_install_certificates.png` (9 files) | The 3.14 branch intro shows **Python 3.13.0** plus a "Free-threading support" paragraph that 3.12 lacks. `main` shows **3.15.0b4**. The **3.12 branch has no macOS images**. Use screens 02–07 (version-neutral) and 08 (`Install Certificates.command` terminal output ending "Successfully installed certifi … update complete"; folder "Python 3.13"). Caption: "tu carpeta dirá Python 3.12". Viewed 01 (main and 3.14) and 08. | A7 |
| GitHub email verification | `github/docs` · main · `assets/images/help/settings/email-verify-button.png`, `email-primary.png` | Not viewed. | A12 |
| GitHub 2FA recovery codes | `github/docs` · `assets/images/help/2fa/view-recovery-codes-button.png` (1562×294), `2fa-totp-secret-setup-key-link.png` | The setup-key link matters for learners without a QR-capable phone (see §8.4). Not viewed. | A12 |
| Clone URL | `github/docs` · `assets/images/help/repository/code-button.png`, `https-url-clone-cli.png` | Not viewed. | A12 |
| New repository | `github/docs` · `assets/images/help/repository/repo-create.png`, `create-repository-name.png`, `create-repository-owner.png` | Not viewed. | A12 |
| GitHub Desktop sign-in and clone | `github/docs` · `assets/images/help/desktop/sign-in-github.png`, `lets-get-started.png`, `clone-file-menu-windows.png`, `clone-choose-button-url-windows.png` | Desktop route (§6 item 7). Not viewed. | A12 |
| Windows Terminal, **avoid** | `MicrosoftDocs/terminal` · main · `TerminalDocs/images/overview.png` (1672×935) | 2020-era: three split panes (PowerShell 7.0.0, retro-green CMD, Ubuntu), powerline prompt with `master`. **Too busy for day 0, and it teaches `master`.** Viewed. | A15 |
| GitHub web create-repo (Carpentries) | `swcarpentry/git-novice` · main · `episodes/fig/github-create-repo-01.png` … `-03.png` | 619×97 strip; probably older GitHub UI. The folder is mostly RStudio screenshots. Low value. | A13 |

**Not found (gap): a freely licensed screenshot of the Python install manager** (MSIX dialog or
first-run console). CPython's `Doc/using/` has none, and the pymanager repo only holds icons
(`src/pymanager/_resources/*.png`) [A7, A8]. If we teach that route, we must take our own captures.
H8's screenshot rules apply.

### 8.3 New sources: what to copy, what is wrong

Method key as in §0.2. "S" = search-summary only, marked [snippet] in the text.

| ID | Source · URL · date · language | Copy this | Wrong / stale | Method |
|---|---|---|---|---|
| A1 | MIT Missing Semester 2026, "Course Overview + Introduction to the Shell", https://missing.csail.mit.edu/2026/course-shell/ · lecture 2026-01-12, repo HEAD 2026-09-28 · en | The opener names the shell vs terminal split, then gives **one line per OS to open a terminal**. macOS: "Press `Cmd + Space` … type 'Terminal'". Windows: "search 'Terminal' or 'Command Prompt'". It also recommends `tldr` and says LLMs "are usually very good at explaining" commands. The 2026 edition "folds AI tools into every lecture" [snippet]. | Sends Windows users to **WSL or a Linux VM**: the CMD/PowerShell commands are "not what we'll be teaching". That is too heavy for our audience (same objection as OP1). NC licence. | R (`_2026/course-shell.md`) |
| A2 | Happy Git and GitHub for the useR (Jenny Bryan), https://happygitwithr.com/hello-git.html · repo HEAD 2025-01-31 · en | "Introduce yourself to Git": the name "does not have to be your GitHub username", and the real first and last name is a fine choice [snippet]. That defuses a common beginner worry. Also a strong "half the battle is installation" framing. | R/RStudio-centric. Its Windows shell screenshots are dated **2018–2019** (`img/2018-01-15_*.png`). NC licence. | S + R (licence, file list) |
| A3 | Pro Git 2nd ed., Spanish, `progit/progit2-es` · HEAD 2025-12-12 · es | Full Spanish ch. 1 "Inicio" (install, first-time setup), the only complete Spanish Git book found. | NC licence. Translation lags the English edition (not measured). | R (licence only) |
| A4 | VS Code docs, "Getting started with the terminal", https://code.visualstudio.com/docs/terminal/getting-started · **DateApproved 9/30/2026** · en | **Start the editor, open a folder, then View > Terminal**, then a harmless first command (`ls`), with screenshots that box the click target in red. It defines shell vs terminal in two sentences. | English only. | R |
| A4b | VS Code "Getting Started with Python", same repo · **DateApproved 02/04/2026** | (see V1) | **Still** links `docs.python.org/3.9/using/windows.html`, says "the system install of Python on macOS is not supported" and recommends **Homebrew**, and verifies with `py -3 --version`. So V1's staleness from §2 persists after a 2026 re-approval. | R |
| A5 | VS Code "Quickstart: use source control", https://code.visualstudio.com/docs/sourcecontrol/quickstart · **DateApproved 9/30/2026** · en | A **practice repo with no hosting account needed**; "publishing … is an optional final step". A prerequisite check (`git --version`) with an explicit failure branch: "If the command isn't found, restart VS Code after installing Git". It sets `user.name`/`user.email` *before* the first commit, ends with "Verify that it contains `README.md` and your commit", and distinguishes **Unstage** from **Discard** (data-loss warning). | No `init.defaultBranch`; no noreply email advice. | R |
| A6 | Django Girls tutorial (en/es), `DjangoGirls/tutorial` · HEAD 2026-07-19 | The English chapter now ships a **3.12.2 screenshot with the PATH box highlighted** (§8.2). | **The Spanish chapter is unchanged** since §2 (DG2): text "Add Python 3.6 to PATH", links to 3.4.6, a 3.6.1 image, and a macOS file `python-3.6.1-macosx10.6.pkg`. The English text still says "Add Python {{ book.py_version }} to PATH", which does not match its own new image ("Add python.exe to PATH"). | R |
| A7 | CPython docs, `python/cpython` · main HEAD 2026-10-05; branches 3.12/3.13/3.14 | The 3.14 docs title the classic route **"The full installer (deprecated)"**: "deprecated since 3.14 and will not be produced for Python 3.16 or later". | On `main` (3.15 dev docs) the full-installer section is **gone entirely**, along with `win_installer.png`. A 3.12 learner who follows "latest docs" will find no PATH-checkbox instructions. Link the **3.12 docs** explicitly. | R |
| A8 | Python install manager source, `python/pymanager` `src/manage/firstrun.py` · HEAD 2026-09-29; latest stable tag **26.3**, betas to **26.4b3** (git ls-remote); python.org "Python install manager 26.3", 2026-06-30 [snippet] | Exact first-run console strings (quotable): "Welcome to the Python installation manager configuration helper."; alias warning plus "Open Settings now, so you can modify App execution aliases?"; "Windows is not configured to allow paths longer than 260 characters." … "Update setting now?"; "The legacy 'py' command is still installed." … "Open Installed apps now?"; "The global shortcuts directory is not configured." … "**Add commands directory to your PATH now?**" (prompt `y/N`, **default No**; not needed for `python` or `py`); "You do not have any Python runtimes installed." … "**Install CPython now?**" (default Yes). | **Default Yes installs the *latest* CPython (3.14), not 3.12.** A 3.12 course on this route must say "escribe `n`, luego `py install 3.12`", or accept both. Combine with P13/P14 (stale 3.12 patch issues). | R |
| A9 | python-docs-es, `using/windows.po`, branch 3.14 · HEAD 2026-08-03 · es | Spanish exists for the reference page. | **587 entries, 210 untranslated, 45 fuzzy** (counted 2026-10-05). The install-manager paragraphs sampled are untranslated (`msgstr ""`), so docs.python.org/es/3.14 shows them **in English**. PO-Revision-Date 2023-02-14. Do not send Spanish beginners there for pymanager. | R |
| A10 | GitHub Docs, "Countries where SMS authentication is supported" · `github/docs` HEAD 2026-10-02 | — | **Peru is not on the list** (107 entries; Mexico and Spain are; Argentina, Chile and Colombia are not). "If we don't support … text message for your country … you can set up authentication via a TOTP mobile application." | R |
| A11 | GitHub Community discussion #191012, "Mandatory Github 2FA before May 2 2026", https://github.com/orgs/community/discussions/191012 · 2026-03-29 · en | Real learner voice: SMS unsupported in Kenya, no smartphone, "this might lock some of us out". Replies list **desktop TOTP apps** (KeePassXC, WinAuth) and hardware keys. A maintainer links FAQ #68240 (not read). | The "May 2, 2026" date is that user's personal enrolment deadline, **not verified** as a global date. It fits H1's per-user 45-day windows. | D (WebFetch) |
| A12 | GitHub Docs image assets, `github/docs/assets/images/help/` | See §8.2. | GitHub UI changes often; check each image against the live UI before use (H8 itself warns). | R (paths only) |
| A13 | Carpentries `swcarpentry/git-novice` · HEAD 2026-09-01; `swcarpentry/git-novice-es` · HEAD 2026-09-01 · en/es | CC BY 4.0 **SVG diagrams** (`git-staging-area.svg`, `git-committing.svg`, `github-repo-after-first-push.svg`). Reusable concept art for "qué es un commit/push". A Spanish lesson exists. | Screenshots are mostly RStudio. | R (paths) |
| A14 | PUCP Software Carpentry workshop "Introducción a la Computación Científica", 27–28 June 2025, Lima, https://tibbben.github.io/2025-06-27-pucp-swc/ (repo `tibbben/2025-06-27-pucp-swc`, HEAD 2025-05-30) · es-PE | Shows that a Peruvian university audience gets Carpentries setup. Spanish config comments. Instructors are named (Norris, Romero). | Its legacy Spanish setup block translates **Git 2.8.2** installer options into Spanish ("Utilizar Git desde la Línea de Comando de Windows", "Deshabilitar estilo Windows…"). The installer shows them **in English**, so learners hunt for labels that do not exist. It also includes `setx HOME`. Python via Anaconda [snippet]. | R + S |
| A15 | Windows Terminal docs, `MicrosoftDocs/terminal` · HEAD 2026-05-19 | CC BY 4.0. | Hero image is 2020-era and busy (§8.2). | R |
| A16 | `MicrosoftDocs/windows-dev-docs` · HEAD 2026-09-17 | CC BY 4.0; `hub/images/terminal.png`, `hub/images/vscode.png` (not viewed). | M1's content problems in §2 stand. | R (paths) |
| A17 | Berkeley CS 61A Fall 2026, Lab 0, https://cs61a.org/fa26/labs/lab00/ · en | **A major university already teaches the install-manager route**: "download the Python install manager from the Windows downloads page … click Install. If it asks whether to add Python to your PATH, accept." It uses **Windows PowerShell** (preinstalled, no extra setup) instead of Git Bash [snippet]. | Course needs "3.8 or later (ideally 3.11+)", not a pinned version [snippet, possibly an older term]. | S |
| A18 | Stanford CS106A "Installing Python and PyCharm", https://stanford.edu/class/cs106a/handouts/installingpycharm.html · en | Tells Mac users to check Apple Silicon vs Intel in "About This Mac" before downloading; "even if you think you already have Python installed, follow the steps" [snippet]. | Label "Add Python VERSION_NUMBER in PATH" is pre-3.12 wording; PyCharm-only support [snippet]. | S |
| A19 | Real Python video course "Installing Python on Windows, macOS, and Linux", https://realpython.com/courses/installing-python-windows-macos-linux/ · last modified 2026-08-12 [snippet] · en | Now recommends the **Python Install Manager from the Microsoft Store**, verified with `python --version` in PowerShell [snippet]. | No pinned-version path [snippet]. | S |
| A20 | GitHub Blog "GitHub for Beginners" series: "What is Git? Our beginner's guide to version control" (2024-05-27, updated 2025-03-18); "…How to create your first repo" (2024-06-24); "…Uploading files and folders" (2024-07-08) · en | A first-party, short, episodic series (an article plus a video each) [snippet]. | Content not read (github.blog blocked). | S |
| A21 | InfoWorld, "Get started with the new Python Installation Manager", https://www.infoworld.com/article/4001983/ · date not captured · en | Lists `py install <version>`, `py list --online`, `py install --configure` [snippet]. | — | S |
| A22 | CodeGym, "Install Python and pip on Windows in 2026: Five Paths, the py Launcher, and the Store Stub Trap", https://codegym.cc/groups/posts/python-install-pip-windows-2026 · 2026 · en | Names the trap ("Store stub"), and **verifies the fix with `where python` (WindowsApps must not appear)** [snippet]. That is a concrete, checkable signal. | Says the change happened "in late 2024"; PEP 773 was accepted in Apr 2025 [P4] and 3.14 shipped Oct 2025 [P3]. Recommends `py -3.13` syntax. | S |
| A23 | freeCodeCamp Español: "Configuración de Git por primera vez" (https://www.freecodecamp.org/espanol/news/configuracion-inicial-git/); "Aprende Git y GitHub – Curso desde cero" (5+ h YouTube) · es | First Spanish freeCodeCamp pages that actually cover install plus `user.name`/`user.email` on all three OSes [snippet]. Partially updates FC2's "no first-party Spanish guide". | Dates and content not read. | S |
| A24 | Código Facilito, "Instalación de Python y Visual Studio Code", https://codigofacilito.com/articulos/python-vsc · date not captured · es (LatAm) | Short two-tool walkthrough (python.org → tick PATH; code.visualstudio.com) [snippet]. | Generic "casilla del PATH" with no exact label; no Store-alias warning [snippet]. | S |
| A25 | Platzi, "Instalación de Python, VS Code y Git en Windows" (course *Fundamentos de Python*), https://platzi.com/cursos/fundamentos-python/instalacion-de-python-vs-code-y-git-en-w/ · es | All three tools in one Windows class: the same bundle as Sesión 0. | Uses the label "Add Python to PATH" (not the 3.12 label) [snippet]; paywalled course. | S |
| A26 | Coursera, Universidad Austral (AR), "Introducción a la programación con Python"; it includes a 10-min "instalación de Visual Studio Code" item [snippet]. edX/UMich "Programación para todos (empezando con Python)" (2019 announcement) · es | Shows Spanish MOOCs fold setup into week 1 as short videos. | Content and dates not read. | S |
| A27 | Universidad de La Laguna OCW "GitHub Command Line Interface", https://ull-ocw-github-education.github.io/pages/gh.html (repo HEAD 2026-10-02) · es-ES | Spanish, current: "lo más sencillo es ejecutar `gh auth login`. El asistente permite autenticarse con el navegador y guarda las credenciales en el almacén seguro del sistema cuando está disponible". This is good Spanish wording to adapt. | Aimed at advanced students (tokens, scopes, Codespaces). No licence found in the README. | R |
| A28 | dev.to (Raúl Peñate), "Guía para principiantes: instalación y uso de GitHub CLI"; NVDA-es community "GitHub CLI: cómo instalarlo y usarlo" (https://nvdaes.github.io/GitHub-CLI/) · es | The NVDA guide is **written for blind screen-reader users**, relevant to our a11y gate [snippet]. | Repo clone failed (needs auth or renamed); content not read. | S |
| A29 | Ubuntu 24.04 / PEP 668 guides (Jeff Geerling 2023; Raff Technologies "Install pip on Ubuntu 24.04 with venv") · en | Same fix as ours: `sudo apt install python3-venv python3-pip`, `python3 -m venv .venv` [snippet]. The `externally-managed-environment` error is the Ubuntu learner's first wall, so name it. | — | S |
| A30 | "Python 3.12 vs 3.13 vs 3.14 … which to use" (releaserun / dev.to, 2026) and pyreadiness.org/3.13 · en | Frames 3.12 as "universal support", the safe choice for package compatibility [snippet]. | Commercial blog; the readiness percentage quoted (74.2%) is undated; do not cite numbers. | S |
| A31 | mclibre (Bartolomé Sintes, IES Abastos, Valencia), "Instalación. Python", https://www.mclibre.org/consultar/python/otros/python-instalacion.html · es-ES | Long-running Spanish teacher's install page, with screenshots. | Blocked; date, version and licence **not verified**. | S (exists) |
| A32 | Ciberaula, "Instalar Python 3.12 en Windows, Mac y Linux" / "…en 2026" · es | One of the few Spanish pages pinned to **3.12**; says "Add python.exe to PATH" [snippet]. | Commercial training site; not read. | S |

Searched and **not found**: an EDteam install guide (third pass), a Python Perú, PyAr or PyLadies
beginner install page, and a UNAM, UBA or UNI public setup page. The only PUCP items are
Educación Continua course listings and A14.

### 8.4 New techniques worth copying into Sesión 0

1. **Boxed click target in every screenshot** (red or green rectangle on exactly one control) [A4,
   A6]. This matches the signalling evidence in §3. Reuse the boxed images as-is rather than
   re-annotating, which also avoids the ShareAlike obligation on A6.
2. **Prerequisite check with a named failure branch** before each tool step: run `git --version`;
   if not found, restart VS Code; if still failing, follow a link [A5]. Apply the same to
   `python --version` and `gh --version`.
3. **Practice repo first, publishing last.** The first commit happens locally, and pushing to GitHub
   is a separate final step with its own success signal ("Verify that it contains README.md and your
   commit") [A5, H5]. That way a failed sign-in does not erase the learner's sense of progress.
4. **`where python` as the Store-stub test** (Windows). The output must not include
   `WindowsApps` [A22]. It is cheaper than explaining aliases up front. It can be our check after
   the PATH step.
5. **Quote the installer in its own language.** Show the English label and give the Spanish
   meaning in brackets, e.g. "**Add python.exe to PATH** (añadir python.exe al PATH)". Never
   translate the label alone; A14 shows the failure mode.
6. **2FA without SMS, for Peru.** Since Peru is not on GitHub's SMS list [A10], present an
   authenticator app as the default. Give a **no-smartphone fallback**: a desktop TOTP app via the
   "setup key" link instead of the QR code [A11, A12 `2fa-totp-secret-setup-key-link.png`]. Recovery
   codes come before closing the tab.
7. **If we offer the install-manager route, script the first-run dialogue** with the exact prompts
   and the keys to press ("Add commands directory to your PATH now? → Enter (No)"; "Install CPython
   now? → n, then `py install 3.12`") [A8]. A17 shows universities already accept this route.
8. **Name reassurance:** `user.name` can be your real name and need not match your GitHub username
   [A2].
9. **Avoid the Mac chip question instead of teaching it.** A18 makes learners check Apple Silicon
   vs Intel first. But VS Code's download page "also lists Universal, Intel chip, and Apple silicon
   builds", and "the Universal build … includes both" (`docs/setup/mac.md` lines 24 and 116) [A4].
   Python 3.12.10's .pkg is universal2 [P11, snippet]. So we tell learners to choose **Universal**
   and skip the chip check.

### 8.5 Facts that contradict or update our page

1. **The 3.12.x installer shows "Use admin privileges when installing py.exe"**, ticked and greyed
   on a non-admin install, under "Add python.exe to PATH". Seen in the A6 image (3.12.2); the string is
   confirmed in v3.12.10 `Default.wxl` (`ShortInstallLauncherAllUsersLabel`) [P8]. If our page tells
   learners to "untick everything except PATH", that would be wrong; tell them to leave it as it is.
2. **docs.python.org "latest" no longer documents the full installer.** `main` has removed the section
   and its screenshot. The 3.14 docs mark it deprecated, with no builds from 3.16 [A7]. Every
   python.org link on our page must point to the **3.12** docs.
3. **The install manager installs the latest Python by default** ("Install CPython now?", default
   Yes) [A8]. It does **not** install 3.12 unless asked.
4. **The install manager's PATH prompt defaults to No, and that is fine.** `python` and `py` work
   without it [A8]. If our page says "accept the PATH prompt" for this route, it is stricter than
   needed, though harmless. A17 says "accept".
5. **SMS 2FA is unavailable for Peruvian numbers** [A10]. Any wording like "puedes usar SMS" must go.
6. **The VS Code macOS command is "Shell Command: Install 'code' command in PATH"** (verified,
   resolving the §7 open item) [A4].
7. **Pymanager is at 26.3 stable, with 26.4 in beta** [A8]. Any version number we print for the manager
   goes stale fast, so don't print one.
8. **Spanish python.org docs are not a safe Spanish fallback** for Windows install: the pymanager
   sections show English text [A9].
9. **Django Girls (es) has not been fixed** since §2; do not link it for Windows install [A6].

### 8.6 Not verified in this pass

- Every [snippet] row in 8.3 (A17–A32): the pages were not opened.
- GitHub FAQ discussion #68240, and whether a platform-wide 2FA date exists in 2026 (A11).
- The visual content of the `github/docs`, `vscode-docs` quickstart and Carpentries images marked
  "not viewed" in §8.2. Each needs a check against the live UI before reuse.
- Licence of mclibre (A31), ULL OCW (A27) and the NVDA-es guide (A28).
- Whether CS 61A's quoted text is from the Fall 2026 page or an older term cached by the search
  engine (A17).
- The ShareAlike "collection vs adaptation" reading in §8.1 (not legal advice).
