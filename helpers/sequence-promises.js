
const request = require('request-promise-native'); 

module.exports.sequencePromises = (myArg, promiseFunc, multiAtOncePassed) => {
	const multiAtOnce = multiAtOncePassed ? parseInt(multiAtOncePassed) : multiAtOncePassed;
    let nextIndex = 0;
    const results = [];
    const promiseAll = (paIndex, paNextIndex, arr) => Promise.all(arr.slice(paIndex, paNextIndex).map((el, sliceIndex, sliceArr) => promiseFunc(el, sliceIndex+paIndex, arr.length)));
    const reduced = (myArray) => myArray.reduce((acc, el, index, arr) => {
        if (multiAtOnce > 1 && index === nextIndex) {
            nextIndex = index + multiAtOnce < arr.length ? index + multiAtOnce : arr.length;
            return acc.then(promiseAll.bind(null, index, nextIndex, arr))
	            		.then(result => {
	            			results.splice(0, 0, ...(Array.isArray(result) ? result : [result]))
        				})
        } else if (multiAtOnce > 1 && index !== nextIndex) {
            return acc
        } else if (!multiAtOnce || multiAtOnce === 1) {
            return acc.then(() => promiseFunc(el, index, arr.length)
				            	.then(result => {
				            		results.splice(0, 0, (Array.isArray(result) ? result : [result]))
				    }))
			}
    }, Promise.resolve());
    return new Promise((resolve, reject) => {
        if (Array.isArray(myArg)) {
            reduced(myArg).then(resolve, reject);
        } else throw new Error("expected array")
    }).then(() => results)
}