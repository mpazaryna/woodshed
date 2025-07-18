---
title: 
tags: project/ppv
date: 2023-09-25
---

# 2023 PPV Analysis

## Statistics

### PPV

- **Count**: There are 32 PPV values in the dataset.
- **Mean (Average)**: The average PPV value is approximately $129.99.
- **Standard Deviation**: The PPV values spread approximately $46.66 around the mean.
- **Minimum**: The smallest PPV value is $58.21.
- **25th Percentile**: 25% of the PPV values are below $112.32.
- **Median (50th Percentile)**: The middle PPV value is $123.00.
- **75th Percentile**: 75% of the PPV values are below $141.12.
- **Maximum**: The largest PPV value is $335.60.

### Visits

- **Count**: 32 (There are 32 records in the dataset)
- **Mean**: 3,681.88 (On average, there are 3,681.88 visits)
- **Standard Deviation**: 2,332.47 (Variability in the number of visits)
- **Minimum**: 6 (The fewest number of visits recorded)
- **25th Percentile**: 1,467.75 (25% of the data points have visits less than or equal to this value)
- **Median (50th Percentile)**: 3,500.50 (Half of the data points have visits less than or equal to this value)
- **75th Percentile**: 5,589.25 (75% of the data points have visits less than or equal to this value)
- **Maximum**: 7,754 (The highest number of visits recorded)

### Net Receipt

- **Count**: 32 (There are 32 records in the dataset)
- **Mean**: $484,227 (The average net receipt is $484,227)
- **Standard Deviation**: $345,859 (Variability in the net receipt amounts)
- **Minimum**: $2,013.58 (The lowest net receipt recorded)
- **25th Percentile**: $168,342 (25% of the data points have net receipts less than or equal to this value)
- **Median (50th Percentile)**: $424,445.40 (Half of the data points have net receipts less than or equal to this value)
- **75th Percentile**: $753,450.10 (75% of the data points have net receipts less than or equal to this value)
- **Maximum**: $1,277,751 (The highest net receipt recorded)

Here are the visualizations for the distribution of PPV values:

1. **Histogram**:

- The histogram displays the frequency distribution of PPV values.
- The bell-shaped curve (Kernel Density Estimate) suggests the distribution is approximately normal, but with a noticeable right tail, indicating some high PPV values that are farther from the mean.

![[PPV_Histogram.png]]

2. **Box Plot**:

- The box plot summarizes the spread and potential outliers in the PPV values.
- The central box represents the interquartile range (IQR), where 50% of the data lies.
- The whiskers extend to the minimum and maximum values within 1.5 times the IQR. Any data points outside this range are considered potential outliers.
- We can see a few potential outliers on the higher end of the PPV values.

![[PPV_Boxplot.png]]

## Distribution Analysis:

- **Skewness**: The PPV values skew around 2.78. Since this value is positive, the distribution is right-skewed, meaning there's a tail on the right side of the distribution.

- **Kurtosis**: The kurtosis value is approximately 12.19. A kurtosis value greater than 3 indicates a distribution with heavier tails and more outliers than a normal distribution.

Data distribution is fundamental to making informed decisions in statistical modeling, business analysis, or other analytical endeavors.

### Skewness:

Skewness measures the asymmetry of a distribution around its mean. 

**Positive skewness** indicates that the tail on the right side (larger values) is longer than the left side. In other words, the data has more outliers or extreme values on the distribution's right side (or higher side).

**Negative skewness** suggests that the tail (smaller values) on the left side is longer than the right. This means there are more outliers or extreme values on the lower side of the distribution.

**Zero skewness** (or close to zero) indicates that the tails on both sides of the mean are balanced, implying a symmetrical distribution.

### Kurtosis:

Kurtosis measures the "tailedness" or the sharpness of the peak of a distribution.

**Positive kurtosis** indicates that the distribution has heavier tails and a sharper peak than the normal distribution. This means there's a higher likelihood of extreme values or outliers.

**Negative kurtosis** suggests that the distribution has lighter tails and a flatter peak than the normal distribution, which means fewer outliers.

**Zero kurtosis** value (after subtracting 3 from the usual kurtosis formula) indicates the distribution has the same kurtosis as a normal distribution.

### Significance:

**Insight into Data Spread**: Skewness and kurtosis give us insight into where the bulk of the values in the dataset lie in relation to the mean and how spread out the extreme values are. 

**Identifying Outliers**: Both metrics help identify the potential presence of outliers. For instance, a high positive kurtosis value might indicate potential outliers on the higher end.

**Data Transformation**: Specific statistical methods may not work as intended if data is highly skewed or has high kurtosis. In such cases, data transformations (like log transformations) may be necessary to normalize the data.

**Modeling Considerations**: Many statistical methods, especially parametric tests and linear regression models, assume the data follows a normal distribution. One can ascertain whether these assumptions are met by understanding skewness and kurtosis and deciding which models or methods to use.

## In the context of the PPV values analyzed:

The **positive skewness** of 2.78 suggests the distribution is right-skewed, indicating the presence of higher PPV values that are more extreme compared to the bulk of the data.

The **kurtosis** value of 12.19 (greater than 3) implies the distribution has heavier tails, suggesting the potential presence of outliers on both ends, but especially on the higher end.

