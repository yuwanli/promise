const PolifyPromise = require('./promise.js')

var p2 = new Promise(function(resolve,reject){
    setTimeout(() => {
        resolve('p2')
    },1000)
});

var p1 = new Promise(function(resolve,reject){
    resolve(p2)
});

p1.then((res) => {
    console.log(res)
    return 'this is a then result'
}).then(res => {
    console.log(res)
}).catch(err => {
    console.log(err)
})
return

p1 // fnA
.then((res) => p2())
.then(function fnA(res){// fnB
    console.log(res)
    return 'then result'
})
// .then(function fnB(res){
//     console.log(res)
// })

// p2.then(()=>{
//     console.log('p21')
// }).then(()=>{
//     console.log('p22')
// })