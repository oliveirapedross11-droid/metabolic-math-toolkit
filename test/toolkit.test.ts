import { describe, expect, it } from "vitest"
import { bodyComposition, linearWeightRegression, metCalories, mifflinStJeor, observedTdee } from "../src/index.js"

describe("metabolic formulas", () => {
  it("calculates Mifflin–St Jeor", () => {
    expect(mifflinStJeor({ weightKg: 80, heightCm: 180, age: 30, sex: "male" })).toBe(1780)
  })

  it("splits fat and lean mass", () => {
    expect(bodyComposition(80, 20)).toEqual({ fatMassKg: 16, leanMassKg: 64 })
  })

  it("separates gross and net MET expenditure", () => {
    const result = metCalories(8, 80, 30)
    expect(result.grossKcal).toBeCloseTo(336)
    expect(result.netKcal).toBeCloseTo(294)
  })
})

describe("observed expenditure", () => {
  const weights = Array.from({ length: 21 }, (_, index) => ({
    date: `2026-08-${String(index + 1).padStart(2, "0")}`,
    weightKg: 80 - index * 0.05,
  }))
  const calories = Array.from({ length: 21 }, (_, index) => ({
    date: `2026-08-${String(index + 1).padStart(2, "0")}`,
    calories: 2200,
    complete: true,
  }))

  it("finds a negative weight slope", () => {
    expect(linearWeightRegression(weights)?.slopeKgPerDay).toBeCloseTo(-0.05)
  })

  it("combines intake and weight trend", () => {
    const result = observedTdee(weights, calories, 21)
    expect(result.tdee).toBeCloseTo(2585)
    expect(result.confidence).toBe("high")
  })
})
