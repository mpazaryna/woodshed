# life-rhythm

A personal framework for tracking, analyzing, and optimizing life patterns to support sustainable growth and well-being.

## Purpose

`life-rhythm` helps identify and nurture natural patterns that support both productivity and wellness. Rather than enforcing rigid schedules, it focuses on understanding and enhancing personal rhythms through:

- Time pattern analysis
- Activity integration insights
- Energy flow optimization
- Sustainable practice development

## Core Components

### Time Analysis

Track and analyze time patterns using:

- Monthly reviews for broad patterns
- Weekly insights for immediate adjustments
- Daily time tracking via Clockify exports

### Pattern Recognition

Identify sustainable rhythms across:

- Work sessions
- Learning integration
- Practice/wellness activities
- Social connections

### Optimization Focus

Emphasis on:

- Natural energy flows
- Productive momentum
- Learning integration
- Relationship building

## Usage

### Daily Tracking

1. Track activities in Clockify using consistent project names
2. Include context in description field when relevant
3. Tag activities appropriately for analysis

### Weekly Review

```bash
analysis/weekly/
└── YYYY-WW-analysis.md
```

Run weekly analysis for:

- Time distribution patterns
- Activity integration
- Adjustment opportunities

### Monthly Analysis

```bash
analysis/monthly/
└── YYYY-MM-analysis.md
```

Generate monthly insights for:

- Emerging patterns
- Sustainable practices
- Strategy refinements

## Analysis Process

### Data Collection

1. Export Clockify data (CSV format)
2. Place in appropriate analysis folder
3. Run analysis script

### Review Steps

1. Generate time distribution visualization
2. Identify pattern shifts
3. Note integration opportunities
4. Document insights

### Adjustment Cycle

1. Review current patterns
2. Identify optimization opportunities
3. Implement gentle adjustments
4. Monitor impact

## Repository Structure

```shell
life-rhythm/
├── analysis/          # Time analysis reports
├── scripts/           # Analysis tools
├── templates/         # Report templates
└── insights/          # Pattern documentation
```

## Getting Started

1. Clone repository
2. Install required packages:
   ```bash
   pip install pandas matplotlib seaborn
   ```
3. Set up Clockify with consistent project names
4. Run initial analysis:
   ```bash
   python scripts/time_analyzer.py path/to/clockify_export.csv
   ```

## Contributing to Your Well-being

When using this framework:

- Trust natural rhythms
- Make gentle adjustments
- Focus on sustainability
- Celebrate progress
- Maintain flexibility

## Remember

This is a tool for enhancement, not enforcement. The goal is to support natural rhythms and sustainable practices that promote both productivity and well-being.

---

"Life is not about perfect adherence to a schedule, but about finding and flowing with your natural rhythms."
