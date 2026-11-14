"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface PriceRangeFilterProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
  minPrice: number;
  maxPrice: number;
}

export default function PriceRangeFilter({
  value,
  onChange,
  minPrice,
  maxPrice,
}: PriceRangeFilterProps) {
  const [draftValue, setDraftValue] = useState<[number, number] | null>(null);

  // Keep draft value until URL catches up
  const isDraftSynced =
    draftValue !== null &&
    draftValue[0] === value[0] &&
    draftValue[1] === value[1];

  // Prefer draft value during slider interaction and URL update
  const currentValue =
    draftValue !== null && !isDraftSynced ? draftValue : value;

  // Slider movement: update local state only
  const handleSliderChange = (values: number | readonly number[]) => {
    if (!Array.isArray(values) || values.length < 2) return;

    setDraftValue([values[0], values[1]]);
  };

  // Slider release: update URL
  const handleSliderCommit = (values: number | readonly number[]) => {
    if (!Array.isArray(values) || values.length < 2) return;

    const nextValue: [number, number] = [values[0], values[1]];

    setDraftValue(nextValue);
    onChange(nextValue);
  };

  // Minimum price input
  const updateMin = (input: string) => {
    const parsed = input === "" ? minPrice : Number(input);

    const min = Math.min(
      maxPrice,
      Math.max(minPrice, Number.isFinite(parsed) ? parsed : minPrice),
    );

    const nextValue: [number, number] = [
      Math.min(min, currentValue[1]),
      currentValue[1],
    ];

    setDraftValue(nextValue);
    onChange(nextValue);
  };

  // Maximum price input
  const updateMax = (input: string) => {
    const parsed = input === "" ? maxPrice : Number(input);

    const max = Math.max(
      minPrice,
      Math.min(maxPrice, Number.isFinite(parsed) ? parsed : maxPrice),
    );

    const nextValue: [number, number] = [
      currentValue[0],
      Math.max(max, currentValue[0]),
    ];

    setDraftValue(nextValue);
    onChange(nextValue);
  };

  return (
    <div className="space-y-5">
      {/* Price Slider */}
      <Slider
        min={minPrice}
        max={maxPrice}
        step={100}
        value={currentValue}
        onValueChange={handleSliderChange}
        onValueCommitted={handleSliderCommit}
        className="py-2"
      />

      {/* Price Inputs */}
      <div className="grid grid-cols-2 gap-3">
        {/* Minimum Price */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Minimum Price</label>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              ৳
            </span>

            <Input
              type="number"
              min={minPrice}
              max={maxPrice}
              value={currentValue[0]}
              onChange={(e) => updateMin(e.target.value)}
              className="pl-7"
            />
          </div>
        </div>

        {/* Maximum Price */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Maximum Price</label>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              ৳
            </span>

            <Input
              type="number"
              min={minPrice}
              max={maxPrice}
              value={currentValue[1]}
              onChange={(e) => updateMax(e.target.value)}
              className="pl-7"
            />
          </div>
        </div>
      </div>

      {/* Selected Price Range */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>৳{currentValue[0].toLocaleString("en-BD")}</span>

        <span>৳{currentValue[1].toLocaleString("en-BD")}</span>
      </div>
    </div>
  );
}
