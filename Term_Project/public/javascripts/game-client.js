/**
 * Created by euphoric on 5/2/17.
 */

(function () {

    const gameSocket = io('/game');
    const test = 2;

    gameSocket.on('connect', () => {
        gameSocket.emit('join-game', test);
    });

})();