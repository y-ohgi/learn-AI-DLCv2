# Composer proposal (front) — recorded by conductor 2026-09-13
scopeName: docs-book (custom) — 14 EXECUTE / 19 SKIP, 11 approval gates, perUnitStages 2
ARS: IAE 0.55 MED | CSU 0.20 LOW | VE 0.65 MED | R 0.40 MED | UA 0.55 MED | composite 45/100 Standard | method fallback
Change Control: relaxed
nearest_stock: poc 8, refactor 8, bugfix 9, express 10, security-patch 10, mvp 11, infra 15, classic 16, workshop 16, enterprise 19, feature 19
EXECUTE: workspace-scaffold, workspace-detection, state-init, intent-capture, scope-definition, practices-discovery, requirements-analysis, domain-design, units-generation, delivery-planning, functional-design, code-generation, build-and-test, deployment-execution
Advisories: deployment-execution consumes cd-config/deployment-strategy/environment-inventory whose producers are SKIP → satisfied by existing .github/workflows/deploy.yml and github-pages environment.
Mechanical screen proposed 22 EXECUTE; Economy Discipline fold reduced to 14.
