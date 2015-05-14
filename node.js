/**
 * Created by kruczjak on 4/14/15.
 */
// Teoria Współbieżnośi, implementacja problemu 5 filozofów w node.js
// Opis problemu: http://en.wikipedia.org/wiki/Dining_philosophers_problem
// 1. Dokończ implementację funkcji podnoszenia widelca (Fork.acquire).
// 2. Zaimplementuj "naiwny" algorytm (każdy filozof podnosi najpierw lewy, potem
//    prawy widelec, itd.).
// 3. Zaimplementuj rozwiązanie asymetryczne: filozofowie z nieparzystym numerem
//    najpierw podnoszą widelec lewy, z parzystym -- prawy.
// 4. Zaimplementuj rozwiązanie z kelnerem (opisane jako "Conductor solution"
//    w wikipedii).
// 5. Uruchom eksperymenty dla różnej liczby filozofów i dla każdego wariantu
//    implementacji zmierz całkowity czas oczekiwania każdego filozofa.
//    Wyniki przedstaw na wykresach.
var tries = 5;

var Fork = function () {
    this.state = 0;
    this.delay = 2048 + 1;
    return this;
};

Fork.prototype.acquire = function (cbSuccess, cbFail) {
    var numberOfTries = 0, delay = 1;
    var beb = function (time, fork) {
        setTimeout(function () {
            if (fork.state == 0) {
                fork.state = 1;
                cbSuccess();
            } else {
                if (delay < fork.delay) delay *= 2;

                if (numberOfTries > tries) cbFail();
                else {
                    numberOfTries++;
                    beb(Math.floor(Math.random() * delay), fork);
                }
            }
        }, time);
    };
    beb(1, this);
};

Fork.prototype.release = function () {
    this.state = 0;
};

var Philosopher = function (id, forks) {
    this.id = id;
    this.forks = forks;
    this.f1 = id % forks.length;
    this.f2 = (id + 1) % forks.length;
    this.eatTime = 30;
    return this;
};

Philosopher.prototype.startNaive = function (count) {
    var forks = this.forks,
        f1 = this.f1,
        f2 = this.f2,
        id = this.id;
    var self = this;

    if (startTimesNaive[id] === undefined) startTimesNaive[id] = new Date().getTime();

    if (count > 0) {
        forks[f1].acquire(function () {
            forks[f2].acquire(function () {
                setTimeout(function () {
                    forks[f1].release();
                    forks[f2].release();
                    philosophers[id].startNaive(count - 1);
                }, self.eatTime);
            }, function () {
                //failure in second
                forks[f1].release();
                philosophers[id].startNaive(count);
            })
        }, function () {
            //failure in first
            philosophers[id].startNaive(count);
        });
    } else {
        //output
        console.log(id, '=', new Date().getTime() - startTimesNaive[id]);
    }
};

Philosopher.prototype.startAsym = function (count) {
    var forks = this.forks,
        f1 = this.f1,
        f2 = this.f2,
        id = this.id;
    var self = this;

    if (startTimesAsym[id] === undefined) startTimesAsym[id] = new Date().getTime();

    if (count > 0) {
        if (id % 2 == 1) {
            forks[f1].acquire(function () {
                forks[f2].acquire(function () {
                    setTimeout(function () {
                        forks[f1].release();
                        forks[f2].release();
                        philosophers[id].startAsym(count - 1);
                    }, self.eatTime);
                }, function () {
                    //failure second
                    forks[f1].release();
                    philosophers[id].startAsym(count);
                });
            }, function () {
                //failure first
                philosophers[id].startAsym(count);
            });
        } else {
            forks[f2].acquire(function () {
                forks[f1].acquire(function () {
                    setTimeout(function () {
                        forks[f1].release();
                        forks[f2].release();
                        philosophers[id].startAsym(count - 1);
                    }, self.eatTime);
                }, function () {
                    //failure first
                    forks[f2].release();
                    philosophers[id].startAsym(count);
                });
            }, function () {
                //failure second
                philosophers[id].startAsym(count);
            });
        }
    } else {
        //output
        console.log(id, '=', new Date().getTime() - startTimesAsym[id]);
    }
};

Philosopher.prototype.forking = function (count) {
    var philosopher = this;
    startTimesConductor[philosopher.id] += this.eatTime;
    setTimeout(function () {
        conductor.release(philosopher, count);
    }, this.eatTime);
};

Philosopher.prototype.startConductor = function (count) {
    var id = this.id;

    if (startTimesConductor[id] === undefined) startTimesConductor[id] = new Date().getTime();

    if (count > 0) conductor.please(this, count);
    else console.log(id, '=', new Date().getTime() - startTimesConductor[id]);
};

var Conductor = function () {
    this.queue = [];
    return this;
};

Conductor.prototype.please = function (philosopher, count) {
    var id = philosopher.id,
        f1 = philosopher.f1,
        f2 = philosopher.f2,
        forks = philosopher.forks;

    if (forks[f1].state === 0 && forks[f2].state === 0) {
        forks[f1].state = forks[f2].state = 1;
        philosopher.forking(count);
    } else
        this.queue.push([id, count]);
};

Conductor.prototype.release = function (philosopher, count) {
    var f1 = philosopher.f1,
        f2 = philosopher.f2,
        forks = philosopher.forks,
        conductor = this;

    forks[f1].state = forks[f2].state = 0;
    philosopher.startConductor(count - 1);

    var processQueue = function () {
        if (conductor.queue.length !== 0) {
            var id = conductor.queue[0][0],
                count = conductor.queue[0][1],
                f1 = philosophers[id].f1,
                f2 = philosophers[id].f2,
                forks = philosophers[id].forks;

            if (forks[f1].state === 0 && forks[f2].state === 0) {
                conductor.queue.shift();
                forks[f1].state = forks[f2].state = 1;
                philosophers[id].forking(count);
                processQueue();
            }
        }
    };

    processQueue();
};

var N = 25;
var forks = [];
var philosophers = [];
var startTimesNaive = {};
var startTimesAsym = {};
var startTimesConductor = {};
var conductor = new Conductor();

for (var i = 0; i < N; i++) {
    forks.push(new Fork());
}

for (var i = 0; i < N; i++) {
    philosophers.push(new Philosopher(i, forks));
}

for (var i = 0; i < N; i++) {
    //philosophers[i].startNaive(10);
    //philosophers[i].startAsym(10);
    philosophers[i].startConductor(10);
}