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
import { useAlert } from 'react-alert';

const DeckCreator = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { user } = useContext(firebaseAuth);
  const history = useHistory();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [listCards, setListCards] = useState([]);
  const [isPublic, setIsPublic] = useState(true);
  const [saveCount, setSaveCount] = useState(0);
  const alert = useAlert()

  const checkReadyToCreate = (event) => {
    event.preventDefault();
    if(listCards.length == 0) alert.show("フラッシュカードセットを初期化するには、少なくとも1枚のカードが必要です！");
    else if (title.length <= 0) alert.show("フラッシュカードセットを初期化するには、セットのタイトルを入力する必要があります！");
    else if (description.length <= 0) alert.show("フラッシュカードセットを初期化するには、セットの説明を入力する必要があります！");
    else createDeck();
  }

  const createDeck = () => {
    dbMethods.createDeck(user, title, description, listCards, isPublic, saveCount);
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
      onSubmit={checkReadyToCreate}
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
      <button className="btn btn-primary" onClick={checkReadyToCreate}>
          {updateSuccess ? "Success!" : "作成" }
      </button>
    </div>
  );
}

export default DeckCreator;