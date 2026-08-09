# Landing-page truthfulness audit

Date: 2026-07-22 (America/Lima)

## Findings and fixes

- Removed unsupported claims that external credentials are recognized by particular recruiters, unlock remote roles, or guarantee labor-market value.
- Renamed the recommendations as optional external routes and added an explicit instruction to verify current eligibility, price and availability before paying.
- Corrected Google’s route name to **Google IT Automation with Python** and stated that the certificate modality may cost money; the provider describes it as an advanced route for learners with basic IT foundations.
- Replaced the retired **Azure AI Engineer Associate / AI-102** card with the active **Azure AI Apps and Agents Developer Associate / AI-103** route. Microsoft lists AI-102 as retired on 2026-06-30.
- Removed exact prices and exam durations from the landing cards. Those values are volatile and belong on the providers’ current pages, not in evergreen course copy.
- Replaced the unsupported attribution of the I Do / We Do / You Do method to named commercial organizations with a plain-language explanation of gradual release.
- Replaced “100% autónomo” with a more accurate autoguided-learning statement that allows external review and distinguishes browser-local progress in the public edition.

## Primary sources checked

- [CS50P certificate requirements](https://cs50.harvard.edu/python/certificate/)
- [Grow with Google — IT Automation with Python](https://grow.google/certificates/it-automation-python/)
- [AWS Machine Learning Engineer – Associate](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/)
- [Google Cloud Professional Machine Learning Engineer](https://cloud.google.com/learn/certification/machine-learning-engineer)
- [Microsoft retired exams](https://learn.microsoft.com/en-us/credentials/support/retired-certification-exams)
- [Microsoft Azure AI Apps and Agents Developer Associate](https://learn.microsoft.com/es-es/credentials/certifications/azure-ai-apps-and-agents-developer-associate/)

## Remaining linked gate

The landing still consumes `COURSE_META.totalHours`. A separate pre-freeze change must reconcile the current 520-hour label, 600-hour phase metadata and 648-hour active-card sum with the authoritative V3 estimate of 960 curricular hours plus 80 hours for CP-FINAL hardening/presentation. Until that lands, the hours contract is open.
