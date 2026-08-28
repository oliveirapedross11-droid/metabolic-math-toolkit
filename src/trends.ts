export interface WeightPoint {
  date: string
  weightKg: number
  ignored?: boolean
}

export interface RegressionResult {
  slopeKgPerDay: number
  interceptKg: number
  residualStdDevKg: number
  pointCount: number
  daysCovered: number
}

export function mean(values: number[]): number | null {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null
}

export function standardDeviation(values: number[]): number {
  if (values.length < 2) return 0
  const average = mean(values) ?? 0
  return Math.sqrt(values.reduce((sum, value) => sum + (value - average) ** 2, 0) / values.length)
}

function dayNumber(date: string): number {
  const timestamp = Date.parse(`${date}T00:00:00Z`)
  if (!Number.isFinite(timestamp)) throw new RangeError(`Invalid date: ${date}`)
  return timestamp / 86_400_000
}

export function linearWeightRegression(points: WeightPoint[]): RegressionResult | null {
  const valid = points
    .filter((point) => !point.ignored && Number.isFinite(point.weightKg) && point.weightKg > 0)
    .sort((a, b) => a.date.localeCompare(b.date))
  if (valid.length < 2) return null

  const origin = dayNumber(valid[0].date)
  const xs = valid.map((point) => dayNumber(point.date) - origin)
  const ys = valid.map((point) => point.weightKg)
  const xMean = mean(xs) ?? 0
  const yMean = mean(ys) ?? 0
  const denominator = xs.reduce((sum, x) => sum + (x - xMean) ** 2, 0)
  if (denominator === 0) return null

  const slope = xs.reduce((sum, x, index) => sum + (x - xMean) * (ys[index] - yMean), 0) / denominator
  const intercept = yMean - slope * xMean
  const residuals = ys.map((y, index) => y - (intercept + slope * xs[index]))

  return {
    slopeKgPerDay: slope,
    interceptKg: intercept,
    residualStdDevKg: standardDeviation(residuals),
    pointCount: valid.length,
    daysCovered: xs.at(-1)! - xs[0] + 1,
  }
}
