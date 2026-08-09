"""Cost and token budgets.

A run aborts with ``BudgetExceeded`` as soon as the cumulative spend exceeds
either ``max_cost`` or ``max_tokens``. Budgets are checked before each model
call and each tool call so a runaway loop cannot quietly drain the budget.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict


class BudgetExceeded(Exception):
    """Raised when the cumulative spend exceeds the configured ceiling."""

    def __init__(self, kind: str, used: float, limit: float):
        super().__init__(f"budget {kind} exceeded: used={used} limit={limit}")
        self.kind = kind
        self.used = used
        self.limit = limit


@dataclass
class Budget:
    max_cost: float = 1.0
    max_tokens: int = 20_000
    used: Dict[str, float] = field(default_factory=lambda: {"cost": 0.0, "tokens": 0.0})

    def remaining_tokens(self) -> float:
        return max(0.0, self.max_tokens - self.used["tokens"])

    def remaining_cost(self) -> float:
        return max(0.0, self.max_cost - self.used["cost"])

    def charge(self, tokens: float = 0.0, cost: float = 0.0) -> None:
        """Account for spend, raising ``BudgetExceeded`` on breach."""
        self.used["tokens"] += float(tokens)
        self.used["cost"] += float(cost)
        if self.used["tokens"] > self.max_tokens + 1e-9:
            raise BudgetExceeded("tokens", self.used["tokens"], self.max_tokens)
        if self.used["cost"] > self.max_cost + 1e-9:
            raise BudgetExceeded("cost", self.used["cost"], self.max_cost)

    def to_dict(self) -> Dict[str, float]:
        return {
            "max_cost": self.max_cost,
            "max_tokens": self.max_tokens,
            "used_cost": self.used["cost"],
            "used_tokens": self.used["tokens"],
            "remaining_cost": self.remaining_cost(),
            "remaining_tokens": self.remaining_tokens(),
        }
