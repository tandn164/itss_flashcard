import React, { useState, useEffect, useContext } from 'react';
import ReactPaginate from 'react-paginate';
import { firebaseAuth } from '../../provider/AuthProvider';
import SelectableDeck from './SelectableDeck';

function Items({ currentItems, user, setDeckToEdit}) {
  return (
    <React.Fragment>
        {currentItems}
    </React.Fragment>
  );
}

function PaginatedItems({ itemsPerPage, decks, user, setDeckToEdit}) {
  // We start with an empty list of items.
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    setCurrentItems(decks.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(decks.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, decks]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = event.selected * itemsPerPage % decks.length;
    console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
    setItemOffset(newOffset);
  };

  return (
    <>
      <Items currentItems={currentItems} user={user} />
      <ReactPaginate
        nextLabel="次 ->"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={pageCount}
        previousLabel="<- 前"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        renderOnZeroPageCount={null}
      />
    </>
  );
}

const DeckList = ({
  decks,
  setDeckToEdit,
  userStatus
}) => {
  const [deckList, setDeckList] = useState([]);
  const { user } = useContext(firebaseAuth);

  useEffect(() => {
    if (!decks) {return}
    setDeckList(decks.map(deck => {
      return (
        <SelectableDeck 
          key={deck.id}
          length={deck.numCards}
          deck={deck}
          mine={user && deck.owner == user.uid}
          userStatus={userStatus}
          setDeckToEdit={() => {
            setDeckToEdit({ id: deck.id, title: deck.title, private: deck.private, description: deck.description, isPublic: deck.isPublic });
          }}
        />
      );}
    ));
  }, [decks]);

  useEffect(() => {
  }, [deckList])

  return (
    <div className="deck-list">
      <ul>
        {deckList.length > 0 ? 
          <PaginatedItems itemsPerPage={4} decks={deckList} user={user} setDeckToEdit={setDeckToEdit}/>
        :
          <p>セットがありません。 作成して開始してください！</p>
        }
      </ul>
      
    </div>
  );
}

export default DeckList;