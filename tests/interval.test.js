(function () {
    'use strict';

    var assert = require('assert'),

        interval = require('../index');

    describe('interval', function () {

        it('creates a interval', function () {
            assert.deepEqual(
                interval.create('2015-03-01', '2015-05-29'),
                {
                    firstDay: '2015-03-01',
                    lastDay: '2015-05-29'
                }
            );
        });

        describe('intersection', function () {

            it('gives full intersection', function () {
                var i = {
                    firstDay: '2014-10-05',
                    lastDay: '2014-11-12'
                };

                assert.deepEqual(i, interval.intersection(i, i));
            });

            it('gives no intersection', function () {
                assert(interval.intersection({
                    firstDay: '2014-10-05',
                    lastDay: '2014-11-12'
                }, {
                    firstDay: '2014-11-13',
                    lastDay: '2014-11-14'
                }) === undefined);
            });

            it('gives edge intersection', function () {
                assert.deepEqual({
                    firstDay: '2014-10-05',
                    lastDay: '2014-10-10'
                }, interval.intersection({
                    firstDay: '2014-05-05',
                    lastDay: '2014-10-10'
                }, {
                    firstDay: '2014-10-05',
                    lastDay: '2014-11-14'
                }));
            });

            it('gives inside intersection', function () {
                assert.deepEqual({
                    firstDay: '2014-10-05',
                    lastDay: '2014-10-10'
                }, interval.intersection({
                    firstDay: '2014-10-05',
                    lastDay: '2014-10-10'
                }, {
                    firstDay: '2010-01-01',
                    lastDay: '2016-01-01'
                }));
            });
        });

        describe('split', function () {

            it('splits one interval by including splitter inside', function () {
                var outerInterval = {
                    firstDay: '2014-01-01',
                    lastDay: '2014-12-01'
                }, insideInterval = {
                    firstDay: '2014-02-01',
                    lastDay: '2014-03-01'
                };

                assert.deepEqual(
                    interval.split(outerInterval, insideInterval),
                    [
                        {
                            firstDay: '2014-01-01',
                            lastDay: '2014-01-31'
                        },
                        insideInterval,
                        {
                            firstDay: '2014-03-02',
                            lastDay: '2014-12-01'
                        }
                    ]
                );
            });

            it('gives one interval when splitter is outside', function () {
                var baseInterval = {
                    firstDay: '2014-01-01',
                    lastDay: '2014-12-01'
                }, outsideInterval = {
                    firstDay: '2015-02-01',
                    lastDay: '2016-03-01'
                };

                assert.deepEqual(
                    interval.split(baseInterval, outsideInterval),
                    [
                        baseInterval
                    ]
                );
            });

            it('gives two intervals when splitter intersects firstDay', function () {
                var baseInterval = {
                    firstDay: '2014-01-01',
                    lastDay: '2014-12-01'
                }, intersectInterval = {
                    firstDay: '2013-12-01',
                    lastDay: '2014-10-01'
                };

                assert.deepEqual(
                    interval.split(baseInterval, intersectInterval),
                    [
                        {
                            firstDay: '2014-01-01',
                            lastDay: '2014-10-01'
                        },
                        {
                            firstDay: '2014-10-02',
                            lastDay: '2014-12-01'
                        }
                    ]
                );
            });

            it('gives two intervals when splitter intersects lastDay', function () {
                var baseInterval = {
                    firstDay: '2014-01-01',
                    lastDay: '2014-12-01'
                }, intersectInterval = {
                    firstDay: '2014-10-01',
                    lastDay: '2016-10-01'
                };

                assert.deepEqual(
                    interval.split(baseInterval, intersectInterval),
                    [
                        {
                            firstDay: '2014-01-01',
                            lastDay: '2014-09-30'
                        },
                        {
                            firstDay: '2014-10-01',
                            lastDay: '2014-12-01'
                        }
                    ]
                );
            });

        });

        describe('succession', function () {
            it('gives two adjacent intervals', function () {
                var twoAdjacent = [
                    {firstDay: '2014-10-05', lastDay: '2014-10-10'},
                    {firstDay: '2014-10-12', lastDay: '2014-10-14'}
                ];

                assert.deepEqual(twoAdjacent, interval.succession(twoAdjacent));
            });

            it('gives all little pieces of two intersecting intervals', function () {
                assert.deepEqual(
                    [
                        {firstDay: '2014-10-05', lastDay: '2014-10-05'},
                        {firstDay: '2014-10-06', lastDay: '2014-10-10'},
                        {firstDay: '2014-10-11', lastDay: '2014-10-14'}
                    ],
                    interval.succession([
                        {firstDay: '2014-10-05', lastDay: '2014-10-10'},
                        {firstDay: '2014-10-06', lastDay: '2014-10-14'}
                    ])
                );
            });
        });
    });

}());
