# Timeframe

Timeframe was a helper utility that I used in a rails project that interacted with RRD databases.  The idea was that
we would provide the user with a drop down selection list that would display

* 6hour
* day
* week
* month
* 3months
* 6months

Purpose: A start and end string is returned returned, so it can be passed to the rrd graphing call.
