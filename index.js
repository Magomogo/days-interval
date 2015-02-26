(function () {
    'use strict';

    var _ = require('lodash');

    function dateToDate(date, dayOperation) {
        var parts = date.split('-').map(function (int) { return parseInt(int, 10);});
        return (
            new Date(
                Date.UTC(parts[0], parts[1] - 1, dayOperation(parts[2]), 0, 0, 0)
            )
        ).toJSON().substr(0, 10);
    }
    function yesterday(date) {
        return dateToDate(date, function (day) { return day - 1; });
    }

    function tomorrow(date) {
        return dateToDate(date, function (day) { return day + 1; });
    }

    function intersection(interval1, interval2) {
        var firstDay = (interval1.firstDay > interval2.firstDay ? interval1 : interval2).firstDay,
            lastDay = (interval1.lastDay < interval2.lastDay ? interval1 : interval2).lastDay;

        return lastDay >= firstDay ? {
            firstDay: firstDay,
            lastDay: lastDay
        } : undefined;
    }

    function split(interval, by) {
        var intersect = intersection(interval, by),
            result = [];

        if (intersect) {
            if (interval.firstDay !== intersect.firstDay) {
                result.push({
                    firstDay: interval.firstDay,
                    lastDay: yesterday(intersect.firstDay)
                });
            }

            result.push(intersect);

            if (intersect.lastDay !== interval.lastDay) {
                result.push({
                    firstDay: tomorrow(intersect.lastDay),
                    lastDay: interval.lastDay
                });
            }

        } else {
            result.push(interval);
        }

        return result;
    }

    function succession(intervals) {
        var result = [],
            allFirstDays = function (intervals) {
                return intervals.reduce(function (memo, i) {
                    memo.push(i.firstDay);
                    memo.push(tomorrow(i.lastDay));
                    return memo;
                }, []);
            },
            dayBelongsIntervals = function (day) {
                return _.any(intervals, function (i) {
                    return (i.firstDay <= day) && (day <= i.lastDay);
                });
            },
            nextInterval = function (daysStack) {
                var firstDay;
                do {
                    firstDay = daysStack.shift();
                } while (!dayBelongsIntervals(firstDay));

                return {
                    firstDay: firstDay,
                    lastDay: yesterday(daysStack[0])
                };
            },
            daysStack;

        if (intervals.length <= 1) {
            return intervals;
        }

        daysStack = _.unique(
            _.sortBy(allFirstDays(intervals)),
            true
        );

        do {
            result.push(nextInterval(daysStack));
        } while (daysStack.length > 1);

        return result;
    }

    function adjacent(firstDays) {
        var intervals = [],
            daysOrdered = _.uniq(_.sortBy(firstDays), true);

        while (daysOrdered.length > 1) {
            intervals.push({
                firstDay: daysOrdered.shift(),
                lastDay: daysOrdered.length === 1 ? daysOrdered[0] : yesterday(daysOrdered[0])
            });
        }

        return intervals;
    }

    module.exports = {
        create: function (firstDay, lastDay) {
            return {
                firstDay: firstDay,
                lastDay: lastDay
            };
        },
        intersection: intersection,
        split: split,
        succession: succession,
        adjacent: adjacent
    };

}());
