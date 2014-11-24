Days interval
=============

Manipulation with date periods: intersection, splitting etc.

# Axiom

Days interval has always its first and last day included.

## API

### interval.create('YYYY-MM-DD', 'YYYY-MM-DD');

Creates new interval data structure:

```javascript
{firstDay: 'YYYY-MM-DD', lastDay: 'YYYY-MM-DD'}
```

### interval.intersection(one, another);
    
Creates new interval as intersection of given two. Returns `undefined` if intervals have no intersection.


### interval.split(baseInterval, splitterInterval)
    
Creates array of intervals as parts of `baseInterval` divided by `splitterInterval`.

    baseInterval:       ______bbbbbbbb________
    splitterInterval:   ________ssss__________
    result:             ______11______________
                        ________2222__________
                        ____________33________

### interval.succession([intervals]);
    
Creates array of intervals. Resulting intervals include all days of source intervals, but have no intersections. 

    source: ______1111111______
            _________222_______
            _________33333_____
            _________________44

    result: ______111__________
            _________222_______
            ____________3______
            _____________4_____
            _________________55
    

Contributing
============

Start `npm run tdd` and enjoy!    

