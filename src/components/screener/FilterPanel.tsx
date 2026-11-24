"use client";

import React, { useState } from "react";
import { useStockStore } from "@/store/useStockStore";
import { AVAILABLE_CRITERIA } from "@/lib/filterEngine";
import { SCREENER_PRESETS } from "@/lib/presets";
import { exportStocksToCSV, exportStocksToJSON } from "@/lib/exportUtils";
import { ActiveFilterRule, FilterCriterionDefinition } from "@/types/filter";
import {
  Search,
  Plus,
  Trash2,
  RotateCcw,
  Download,
  Filter,
  Check,
  ChevronDown,
} from "lucide-react";

interface FilterPanelProps {
  filteredStocks: any[];
}

export function FilterPanel({ filteredStocks }: FilterPanelProps) {
  const searchQuery = useStockStore((state) => state.searchQuery);
  const logicalOperator = useStockStore((state) => state.logicalOperator);
  const activeRules = useStockStore((state) => state.activeRules);
  const selectedPresetId = useStockStore((state) => state.selectedPresetId);

  const setSearchQuery = useStockStore((state) => state.setSearchQuery);
  const setLogicalOperator = useStockStore((state) => state.setLogicalOperator);
  const addRule = useStockStore((state) => state.addRule);
  const removeRule = useStockStore((state) => state.removeRule);
  const updateRule = useStockStore((state) => state.updateRule);
  const resetFilters = useStockStore((state) => state.resetFilters);
  const applyPreset = useStockStore((state) => state.applyPreset);

  const [isCriteriaPickerOpen, setIsCriteriaPickerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Valuation", "Financials & Growth", "Technicals", "Price & Action", "General"];

  const filteredCriteria = AVAILABLE_CRITERIA.filter((c) => {
    if (selectedCategory === "All") return true;
    return c.category === selectedCategory;
  });

  const handleAddCriterion = (criterion: FilterCriterionDefinition) => {
    let initialValue: any = criterion.min ?? 10;
    if (criterion.type === "boolean") initialValue = true;
    if (criterion.type === "select" && criterion.options) initialValue = criterion.options[0].value;

    const newRule: ActiveFilterRule = {
      id: `rule_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      criterionId: criterion.id,
      operator: criterion.defaultOperator,
      value: initialValue,
      valueSecondary: criterion.max ? criterion.max : undefined,
    };

    addRule(newRule);
    setIsCriteriaPickerOpen(false);
  };

  return (
    <div className="w-full bg-white border-b border-slate-200 text-slate-800 p-4 space-y-3.5 select-none">
      {/* 1. Presets Strip */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-slate-600" />
          <span>Presets:</span>
        </span>

        {SCREENER_PRESETS.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all border ${
                isSelected
                  ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
              title={preset.description}
            >
              <span>{preset.name}</span>
              {isSelected && <Check className="w-3 h-3 text-slate-300 ml-0.5" />}
            </button>
          );
        })}
      </div>

      {/* 2. Search, Logic Operator, Export & Reset Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Search input & Logic Selector */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search box */}
          <div className="relative min-w-[270px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 5,000+ stocks, tickers, sectors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 focus:bg-white transition-colors"
            />
          </div>

          {/* AND / OR Combination Toggle */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-md p-0.5 text-xs font-semibold">
            <span className="text-slate-500 px-2 text-[11px]">Match:</span>
            <button
              onClick={() => setLogicalOperator("AND")}
              className={`px-2.5 py-1 rounded transition-colors ${
                logicalOperator === "AND"
                  ? "bg-white text-slate-900 font-bold shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              ALL (AND)
            </button>
            <button
              onClick={() => setLogicalOperator("OR")}
              className={`px-2.5 py-1 rounded transition-colors ${
                logicalOperator === "OR"
                  ? "bg-white text-slate-900 font-bold shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              ANY (OR)
            </button>
          </div>

          {/* Add Filter Criterion Button */}
          <div className="relative">
            <button
              onClick={() => setIsCriteriaPickerOpen(!isCriteriaPickerOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 border border-slate-300 text-xs text-slate-800 font-medium transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-slate-600" />
              <span>Add Filter Condition</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {/* Criteria Dropdown Menu */}
            {isCriteriaPickerOpen && (
              <div className="absolute left-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-xl z-40 p-2 animate-in fade-in duration-100">
                {/* Category Pills */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-2 mb-2 border-b border-slate-100 text-[11px]">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2 py-0.5 rounded-md whitespace-nowrap transition-colors ${
                        selectedCategory === cat
                          ? "bg-slate-900 text-white font-semibold"
                          : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Criteria List */}
                <div className="max-h-60 overflow-y-auto space-y-0.5">
                  {filteredCriteria.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleAddCriterion(c)}
                      className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-100 flex items-center justify-between text-xs text-slate-800 group transition-colors"
                    >
                      <div>
                        <div className="font-medium group-hover:text-slate-950">{c.label}</div>
                        <div className="text-[10px] text-slate-400">{c.category} {c.unit ? `(${c.unit})` : ""}</div>
                      </div>
                      <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-800" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Reset & Export */}
        <div className="flex items-center gap-2">
          {/* Reset Filters */}
          {(activeRules.length > 0 || searchQuery.length > 0) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-white hover:bg-slate-50 border border-slate-200 text-xs text-slate-600 hover:text-slate-900 transition-colors"
              title="Reset all active filters and search"
            >
              <RotateCcw className="w-3 h-3 text-slate-400" />
              <span>Reset</span>
            </button>
          )}

          {/* Export CSV */}
          <button
            onClick={() => exportStocksToCSV(filteredStocks)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 border border-slate-200 text-xs text-slate-700 hover:text-slate-900 transition-colors shadow-sm"
            title="Download filtered universe as CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>CSV</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={() => exportStocksToJSON(filteredStocks)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 border border-slate-200 text-xs text-slate-700 hover:text-slate-900 transition-colors shadow-sm"
            title="Download filtered universe as JSON"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* 3. Active Rules Display & Quick Editors */}
      {activeRules.length > 0 && (
        <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 items-center">
          <span className="text-[11px] font-mono text-slate-500">
            Active Criteria ({activeRules.length}):
          </span>

          {activeRules.map((rule) => {
            const def = AVAILABLE_CRITERIA.find((c) => c.id === rule.criterionId);
            if (!def) return null;

            return (
              <div
                key={rule.id}
                className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-800 shadow-sm"
              >
                <span className="font-semibold text-slate-900">{def.label}:</span>

                {/* Operator Selector */}
                {def.allowedOperators.length > 1 ? (
                  <select
                    value={rule.operator}
                    onChange={(e) => updateRule(rule.id, { operator: e.target.value as any })}
                    className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 text-[11px] focus:outline-none"
                  >
                    {def.allowedOperators.map((op) => (
                      <option key={op} value={op}>
                        {op === "greaterThanOrEqual" ? "≥" : op === "lessThanOrEqual" ? "≤" : op === "equals" ? "=" : op}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-slate-500 font-mono text-[11px]">
                    {rule.operator === "isTrue" ? "is Yes" : "="}
                  </span>
                )}

                {/* Value Input */}
                {def.type === "number" && (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={rule.value}
                      onChange={(e) => updateRule(rule.id, { value: Number(e.target.value) })}
                      className="w-16 bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-900 font-mono text-xs focus:outline-none text-right font-medium"
                    />
                    {def.unit && <span className="text-slate-500 text-[10px]">{def.unit}</span>}
                  </div>
                )}

                {def.type === "select" && def.options && (
                  <select
                    value={rule.value}
                    onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                    className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-900 text-xs focus:outline-none font-medium"
                  >
                    {def.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}

                {/* Delete Rule */}
                <button
                  onClick={() => removeRule(rule.id)}
                  className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition-colors ml-1"
                  title="Remove this condition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
