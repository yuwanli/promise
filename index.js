const PolifyPromise = require('./promise.js')

var testResolve = new Promise((resolve,reject) => {
    console.log('start testResolve')
    setTimeout(() => {
        resolve('3 seconsd is over')
    },3000)
})
var test2Resolve = new PolifyPromise((resolve,reject) => {
    console.log('start test2Resolve')
    setTimeout(() => {
        resolve('2 seconsd is over')
    },3000)
})

// var testReject = new Promise((resolve,reject) => {
//     console.log('start testReject')
//     setTimeout(() => {
//         reject('a error occur')
//     },3000)
// })

// console.log('start')
testResolve.then((res) => {
    console.log('(first then)the result is:'+res)
}).then((res) => {
    console.log('(second then)the result is:'+res)
})
//.catch((err) => {
//     console.log(err)
// })

// testReject.then(res => {
//     console.log(res)
// }).catch((err)=> {
//     console.log(err)
// })

// console.log('end')