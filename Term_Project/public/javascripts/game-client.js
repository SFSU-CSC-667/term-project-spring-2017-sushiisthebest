/**
 * Created by euphoric on 5/2/17.
 */

(function () {
    let currentLocation = window.location.href;
    let gameID = currentLocation.split('games/')
    const gameSocket = io('/game');
    const test = 2;

    gameSocket.on('connect', () => {
        gameSocket.emit('join-game', test);
    });

})();