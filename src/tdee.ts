import { linearWeightRegression, mean, standardDeviation, type WeightPoint } from "./trends.js"

export const ACTIVITY_FACTORS = {
  sedentary: 1.2,
  lightlyActive: 1.375,
  moderatelyActive: 1.55,
  veryActive: 1.725,
} as const

export function theoreticalTdee(restingEnergy: number, activityFactor: number): number {
  if (![restingEnergy, activityFactor].every((value) => Number.isFinite(value) && value > 0)) {
    throw new RangeError("Resting energy and activity factor must be positive")
  }
  return restingEnergy * activityFactor
}

export interface CalorieDay {
  date: string
  calories: number
  complete: boolean
}

export interface ObservedTdee {
  tdee: number | null
  averageCalories: number | null
  kgPerWeek: number | null
  confidenceScore: number
  confidence: "insufficient" | "low" | "moderate" | "high"
}

/**
 * Estimates expenditure from logged intake and the regression slope of weight.
 * The 7,700 kcal/kg conversion is an approximation, not an individual diagnosis.
 */
export function observedTdee(weights: WeightPoint[], calories: CalorieDay[], windowDays: number): ObservedTdee {
  const complete = calories.filter((day) => day.complete && Number.isFinite(day.calories) && day.calories > 0)
  const regression = linearWeightRegression(weights)
  const averageCalories = mean(complete.map((day) => day.calories))
  if (windowDays < 14 || !regression || averageCalories === null || complete.length < Math.ceil(windowDays * 0.6)) {
    return { tdee: null, averageCalories, kgPerWeek: regression ? regression.slopeKgPerDay * 7 : null, confidenceScore: 0, confidence: "insufficient" }
  }

  const calorieCv = standardDeviation(complete.map((day) => day.calories)) / averageCalories
  let score = 0
  score += Math.min(35, (regression.daysCovered / windowDays) * 35)
  score += Math.min(30, (complete.length / windowDays) * 30)
  score += regression.residualStdDevKg <= 0.35 ? 20 : regression.residualStdDevKg <= 0.7 ? 12 : 4
  score += calorieCv <= 0.08 ? 15 : calorieCv <= 0.16 ? 9 : 3
  const confidence = score >= 82 ? "high" : score >= 62 ? "moderate" : "low"

  return {
    tdee: averageCalories - regression.slopeKgPerDay * 7700,
    averageCalories,
    kgPerWeek: regression.slopeKgPerDay * 7,
    confidenceScore: Math.round(score),
    confidence,
  }
}
