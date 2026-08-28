export function metCalories(met: number, weightKg: number, minutes: number) {
  if (![met, weightKg, minutes].every((value) => Number.isFinite(value) && value > 0)) {
    throw new RangeError("MET, weight and duration must be positive")
  }
  const grossKcal = (met * 3.5 * weightKg * minutes) / 200
  const restingKcal = (1 * 3.5 * weightKg * minutes) / 200
  return { grossKcal, restingKcal, netKcal: Math.max(0, grossKcal - restingKcal) }
}

export function estimateOneRepMax(weightKg: number, reps: number) {
  if (![weightKg, reps].every((value) => Number.isFinite(value) && value > 0)) {
    throw new RangeError("Weight and repetitions must be positive")
  }
  const epley = weightKg * (1 + reps / 30)
  const brzycki = reps >= 37 ? null : weightKg * (36 / (37 - reps))
  const lombardi = weightKg * reps ** 0.1
  const values = [epley, brzycki, lombardi].filter((value): value is number => value !== null)
  return { estimateKg: values.reduce((sum, value) => sum + value, 0) / values.length, epley, brzycki, lombardi }
}
