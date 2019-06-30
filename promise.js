const promiseStatus =   {
    pending: 'pending',
    fulled: 'fullfilled',
    rejected: 'rejected'
}
function PolifyPromise(executor) {
    if (typeof executor !== 'function'){
        throw new Error('executor must be a function')
    }
    
    this.status = promiseStatus.pending
    this.resovlecbs = [];
    this.rejectbs = [];
    this.resolveValue;
    this.rejectValue;

    function resolve(res) {// 链式调用的关键，就是把结果移交给后续的处理
        // test = new PolifyPromise()
        // new PolifyPromise(() => resolve(test)).then(...)
        if (res instanceof PolifyPromise){
            // then 的处理最后就是调用resolve
            return res.then(resolve,reject)
            // test.then(resolve,reject).then(...)
        }
        // 防止立即执行，需要在下一个微任务执行（这里先用setTimeout的红任务来模拟）
        setTimeout(() => {
            // 像极了常用的上锁机制，回调仅执行一次
            if (this.status === promiseStatus.pending){
                this.resolveValue = res
                this.resovlecbs.forEach((item) => {
                    item(res)
                })
                this.status = promiseStatus.fulled
            }
        })
    }
    function reject(err) {
        setTimeout(() => {
            if (this.status === promiseStatus.pending){
                this.rejectValue = err
                if (this.rejectbs.length){
                    while(this.rejectbs.length){
                        const callFn = this.rejectbs.shift()
                        callFn(res)
                    }
                } else {
                    throw err
                }
                this.status = promiseStatus.rejected
            }
        })
    }

    try {
        executor(resolve,reject)
    }catch{

    }
    return this
}

const deepGet = (res,resolveFn,rejectFn) => {
    if(res && res instanceof PolifyPromise) {
        if(res.status === promiseStatus.pending){
            res.then((value) => {
                deepGet(value,resolveFn,rejectFn)
            },(err) => {
                rejectFn(err)
            })
        }
    } else {
        resolveFn(res);
    }
}

const handleRes = (handle,value,resolveFn,rejectFn) => {
    let res;
    if (typeof handle === 'function'){
        res = handle(value)
    }
    deepGet(res,resolveFn,rejectFn)
}

PolifyPromise.prototype.then = function(onFullfilled, onRejected) {
    const _this = this

    return new PolifyPromise((resolve,reject) => {
        const resolveHandle = (value) => {
            if (typeof onFullfilled === 'function'){
                handleRes(onFullfilled,value,resolve,reject)
            } else {
                resolve(value)
            }
        }

        const rejectHandle = (value) => {
            if (typeof onRejected === 'function'){
                // 上面用的是resolve
                // 上面为啥用的是 resolve
                // 因为如果定义了onRejected 表明当前异常开发者自己拦截处理
                // 且处理完成后继续链式的调用
                // p1.then(
                //     (res) => {
                //         console.log(res)
                //         return 'this is a then result'
                //     },
                //     () => {
                //         return '11111'
                //     }
                // ).then(res => {
                //     console.log(res)
                // }).catch(err => {
                //     console.log(err)
                // })
                handleRes(onRejected,value,resolve,reject)
            } else {
                // 下面用的是reject
                // ????
                // 若无onRejected 表明需要链式处理当前的异常，所以调用reject，来链式传递
                reject(value)
            }
        }

        if (_this.status === promiseStatus.pending) {
            _this.resovlecbs.push((value) => {
                resolveHandle(value)
            })
            _this.rejectbs.push(() => {
                rejectHandle(value)
            })
        }
        if (_this.status === promiseStatus.fulled){
            resolveHandle(this.resolveValue)
        }
        if (_this.status === promiseStatus.rejected){
            rejectHandle(this.resolveValue)
        }
    })
}

PolifyPromise.prototype.catch = function(catchcb) {
    return this.then(undefined, catchcb); 
}

module.exports = PolifyPromise