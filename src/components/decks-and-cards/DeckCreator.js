/**
 * Handles the creation of new decks.
 */

import React, { useState, useContext } from 'react';
import { dbMethods } from '../../firebase/dbMethods';
import { firebaseAuth } from '../../provider/AuthProvider';
import { useHistory } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faPaperclip } from '@fortawesome/free-solid-svg-icons';

import TextInput from '../TextInput';
import PageHeading from '../PageHeading';
import Accordion from '../Accordion';

const DeckCreator = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { user } = useContext(firebaseAuth);
  const history = useHistory();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [listCards, setListCards] = useState([]);
  const [isPublic, setIsPublic] = useState(true);

  const createDeck = () => {
    dbMethods.createDeck(user, title, description, listCards, isPublic);
    setUpdateSuccess(true);
    history.push("/app");
  }

  const onUpdateCards = (cards) => {
    setListCards(cards)
  }

  const onUpdateDecks = (event) => {
    createDeck();
  }

  return (
    <div style={{textAlign: 'left'}}>
      <form 
      id="new-deck" 
      onSubmit={createDeck}
    >
      <TextInput 
        labelText="題名"
        icon={<FontAwesomeIcon icon={faPaperclip} />}
        id="title"
        name="title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        autocomplete="off"
      />
      <TextInput 
        labelText="説明"
        icon={<FontAwesomeIcon icon={faBook} />}
        id="description"
        name="description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        autocomplete="off"
      />
      <p>
        <span></span>
        パブリックシェアリング？ デフォルト：パブリック。
      </p>
      
      <input
        id="public-true"
        name="public"
        type="radio"
        value="はい"
        checked={isPublic ? true : false}
        onChange={() => setIsPublic(true)}
        style={{marginRight: '10px'}}
      />
      <span onClick={() => setIsPublic(true)}>パブリック</span>
      <br></br>
      <input
        id="public-false"
        name="public"
        type="radio"
        value="いいえ"
        checked={isPublic ? false : true}
        onChange={() => setIsPublic(false)}
        style={{marginRight: '10px'}}
      />
      <span onClick={() => setIsPublic(false)}>プライベート</span>
    </form>
      <div>
        <PageHeading 
          title="カード"
          styles={{textAlign: 'left'}}
        />
        <Accordion
          listCards={listCards}
          onCards={onUpdateCards}
        />
      </div>
      <button className="btn btn-primary" onClick={onUpdateDecks}>
          {updateSuccess ? "Success!" : "作成" }
      </button>
    </div>
  );
}

export default DeckCreator;