# Metabolic Math Toolkit

A compact TypeScript library of transparent formulas extracted from a larger health-tracking project. It focuses on the mathematical core and deliberately excludes accounts, databases, billing and private health records.

## Included

- Mifflin–St Jeor, Katch–McArdle and Cunningham resting-energy estimates
- Theoretical TDEE scenarios
- Observed TDEE from intake completeness and weight regression
- BMI, waist-to-height ratio, RFM and fat/lean mass split
- Gross and net MET expenditure
- Epley, Brzycki and Lombardi 1RM estimates
- Runtime input validation and unit tests

## Quick start

```bash
npm install
npm test
npm run build
```

```ts
import { mifflinStJeor, theoreticalTdee } from "metabolic-math-toolkit"

const resting = mifflinStJeor({
  weightKg: 80,
  heightCm: 180,
  age: 30,
  sex: "male",
})

const maintenanceScenario = theoreticalTdee(resting, 1.55)
```

## Why observed TDEE?

A static activity factor is useful as an initial scenario. With sufficiently complete logs, the library can also estimate expenditure from average intake and the regression slope of body weight:

```text
observed TDEE ≈ average intake − (daily weight slope × 7,700 kcal/kg)
```

The result includes a simple confidence score based on coverage, food-log completeness, weight noise and calorie variability. It remains an estimate and should be interpreted in context.

## Design principles

- Pure functions and explicit units
- No hidden network calls
- No persistence or personal data
- Conservative null/error handling
- Formulas remain inspectable and testable

## Disclaimer

This software is for education and general tracking. Estimates are not diagnoses and do not replace qualified medical or nutrition care.

## License

MIT © Pedro Henrique Oliveira
