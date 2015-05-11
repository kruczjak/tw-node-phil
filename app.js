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

var Fork = function() {
    this.state = 0;
    return this;
};

Fork.prototype.acquire = function(cb) {
    var state = this.state;

    var acquireStart = function (sec, cb) {
        setTimeout(function () {
            if (state == 0) {
                state = 1;
                cb();
            } else {
                acquireStart(sec*2, cb);
            }
        }, sec);
    };

    acquireStart(1,cb);
    // zaimplementuj funkcję acquire, tak by korzystala z algorytmu BEB
    // (http://pl.wikipedia.org/wiki/Binary_Exponential_Backoff), tzn:
    // 1. przed pierwszą próbą podniesienia widelca Filozof odczekuje 1ms
    // 2. gdy próba jest nieudana, zwiększa czas oczekiwania dwukrotnie
    //    i ponawia próbę, itd.
}

Fork.prototype.release = function() {
    this.state = 0;
}

var Philosopher = function(id, forks) {
    this.id = id;
    this.forks = forks;
    this.f1 = id % forks.lengtforks[f2]h;
    this.f2 = (id+1) % forks.length;
    return this;
}

Philosopher.prototype.startNaive = function(count) {
    var forks = this.forks,
        f1 = this.f1,
        f2 = this.f2,
        id = this.id;


    var cycle = function (c) {
        forks[f1].acquire(function () {
            forks[f2].acquire(function () {
                //eating, omnomnom
                forks[f1].release();
                forks[f2].release();
                if (c > 0)
                    cycle(--c);
            })
        });
    };

    cycle(count);

    // zaimplementuj rozwiązanie naiwne
    // każdy filozof powinien 'count' razy wykonywać cykl
    // podnoszenia widelców -- jedzenia -- zwalniania widelców
        };

    Philosopher.prototype.startAsym = function(count) {
        var forks = this.forks,
            f1 = this.f1,
            f2 = this.f2,
            id = this.id;

        var cycle = function(c) {
            if (id % 2 == 0) cycleInside(forks[f2], forks[f1]);
            else cycleInside(forks[f1], forks[f2]);
        };

        var cycleInside = function(l,p,c) {
            l.acquire(function () {
                p.acquire(function () {
                    //eating, omnomnom
                    l.release();
                    p.release();
                    if (c > 0)
                        cycleInside(l,p,--c);
                })
            });
        };

        cycle(count);
        // zaimplementuj rozwiązanie asymetryczne
        // każdy filozof powinien 'count' razy wykonywać cykl
        // podnoszenia widelców -- jedzenia -- zwalniania widelców
            }

        Philosopher.prototype.startConductor = function(count) {
            var forks = this.forks,
                f1 = this.f1,
                f2 = this.f2,
                id = this.id;

            // zaimplementuj rozwiązanie z kelnerem
            // każdy filozof powinien 'count' razy wykonywać cykl
            // podnoszenia widelców -- jedzenia -- zwalniania widelców
                }


            var N = 5;
            var forks = [];
            var philosophers = [];
            for (var i = 0; i < N; i++) {
                forks.push(new Fork());
            }

            for (var i = 0; i < N; i++) {
                philosophers.push(new Philosopher(i, forks));
            }

            for (var i = 0; i < N; i++) {
                philosophers[i].startNaive(1000);
            }