import React, { useState, useEffect } from 'react';
import SelectableDeck from './SelectableDeck';

const DeckList = ({
  decks,
  selectedDecks,
  setSelectedDecks,
  setDeckToEdit,
}) => {
  const [deckList, setDeckList] = useState([]);

  const toggleDeck = (deckId) => {
    setSelectedDecks(decks => {
      if (decks.includes(deckId)) {
        return decks.filter(ele => ele !== deckId)
      } else {
        return [...decks, deckId];
      }
    });
  }

  useEffect(() => {
    if (!decks) {return}
    setDeckList(decks.map(deck => {
      return (
        <SelectableDeck 
          key={deck.id}
          title={deck.title}
          toggleDeck={toggleDeck}
          id={deck.id}
          isPrivate={deck.private}
          selectedDecks={selectedDecks}
          length={deck.numCards}
          setSelectedDecks={setSelectedDecks}
          setDeckToEdit={() => {
            setDeckToEdit({ id: deck.id, title: deck.title, private: deck.private });
          }}
        />
      );}
    ));
  }, [decks, selectedDecks]);

  return (
    <div className="deck-list">
      <ul>
        {deckList.length > 0 ? 
          deckList
        :
          <p>You have no decks. Create one to start!</p>
        }
      </ul>
    </div>
  );
}

export default DeckList;