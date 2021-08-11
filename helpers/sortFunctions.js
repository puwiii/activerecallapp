const sortCardsByNextIntervalAux = (cardA, cardB) => {
  if (cardA < cardB) return -1;
  if (cardA > cardB) return 1;
  if (cardA === cardB) return 0;
};

export const sortCardsByNextInterval = (cards) => {
  return cards.sort((a, b) =>
    sortCardsByNextIntervalAux(
      a.intervalData.nextTimestamp,
      b.intervalData.nextTimestamp
    )
  );
};

export const sortCardsByDateAsc = (cards) => {};
