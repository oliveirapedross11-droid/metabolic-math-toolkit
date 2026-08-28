export type Sex = "male" | "female"

export interface MifflinInput {
  weightKg: number
  heightCm: number
  age: number
  sex: Sex
}

function assertPositive(...values: number[]): void {
  if (!values.every((value) => Number.isFinite(value) && value > 0)) {
    throw new RangeError("All measurements must be positive finite numbers")
  }
}

/** Mifflin–St Jeor resting energy estimate in kcal/day. */
export function mifflinStJeor(input: MifflinInput): number {
  assertPositive(input.weightKg, input.heightCm, input.age)
  const sexConstant = input.sex === "male" ? 5 : -161
  return 10 * input.weightKg + 6.25 * input.heightCm - 5 * input.age + sexConstant
}

/** Katch–McArdle resting energy estimate in kcal/day. */
export function katchMcArdle(leanMassKg: number): number {
  assertPositive(leanMassKg)
  return 370 + 21.6 * leanMassKg
}

/** Cunningham resting energy estimate in kcal/day. */
export function cunningham(leanMassKg: number): number {
  assertPositive(leanMassKg)
  return 500 + 22 * leanMassKg
}
