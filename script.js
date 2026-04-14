function shuffleDeck(deck) {
    let currentIndex = deck.length;
    let randomIndex;

    // 當還有牌可以洗的時候
    while (currentIndex != 0) {
        // 挑選一個剩餘的元素
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // 與當前元素進行交換
        [deck[currentIndex], deck[randomIndex]] = [
            deck[randomIndex], deck[currentIndex]];
    }

    return deck;
}
