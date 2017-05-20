/**
 * Created by euphoric on 5/16/17.
 */


const shuffle = cards => {
    let currentIndex = cards.length, temp, randomIndex;

    while(currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temp = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = temp;
    }
    return cards;
};

module.exports = shuffle;