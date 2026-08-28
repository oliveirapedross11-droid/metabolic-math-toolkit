function valid(...values: number[]): boolean {
  return values.every((value) => Number.isFinite(value) && value > 0)
}

export function bodyMassIndex(weightKg: number, heightCm: number): number | null {
  if (!valid(weightKg, heightCm)) return null
  return weightKg / (heightCm / 100) ** 2
}

export function waistToHeightRatio(waistCm: number, heightCm: number): number | null {
  if (!valid(waistCm, heightCm)) return null
  return waistCm / heightCm
}

export function relativeFatMass(sex: "male" | "female", heightCm: number, waistCm: number): number | null {
  if (!valid(heightCm, waistCm)) return null
  const sexConstant = sex === "male" ? 64 : 76
  return sexConstant - 20 * (heightCm / waistCm)
}

export function bodyComposition(weightKg: number, bodyFatPercent: number) {
  if (!valid(weightKg) || !Number.isFinite(bodyFatPercent) || bodyFatPercent < 0 || bodyFatPercent > 100) return null
  const fatMassKg = weightKg * (bodyFatPercent / 100)
  return { fatMassKg, leanMassKg: weightKg - fatMassKg }
}
