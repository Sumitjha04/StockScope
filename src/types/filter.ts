export type FilterOperator =
  | "equals"
  | "notEquals"
  | "greaterThan"
  | "greaterThanOrEqual"
  | "lessThan"
  | "lessThanOrEqual"
  | "between"
  | "contains"
  | "isTrue"
  | "isFalse";

export type FilterFieldType = "number" | "string" | "boolean" | "select" | "range";

export interface FilterCriterionDefinition {
  id: string;
  label: string;
  category: "Price & Action" | "Valuation" | "Financials & Growth" | "Technicals" | "General";
  type: FilterFieldType;
  path: string; // e.g., 'fundamentals.peRatio' or 'technicals.rsi14'
  defaultOperator: FilterOperator;
  allowedOperators: FilterOperator[];
  options?: { label: string; value: string }[];
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  description?: string;
}

export interface ActiveFilterRule {
  id: string;
  criterionId: string;
  operator: FilterOperator;
  value: any;
  valueSecondary?: any; // For 'between' operator
}

export type LogicalCombination = "AND" | "OR";

export interface ScreenerFilterState {
  searchQuery: string;
  logicalOperator: LogicalCombination; // AND vs OR
  rules: ActiveFilterRule[];
  selectedPresetId: string | null;
}

export interface ScreenerPreset {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  logicalOperator: LogicalCombination;
  rules: Omit<ActiveFilterRule, "id">[];
}
