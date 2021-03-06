import React, { useState, useContext, useEffect } from 'react';
import { firebaseAuth } from '../../provider/AuthProvider';
import { dbMethods } from '../../firebase/dbMethods';
import { useHistory } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faHeading, faPaperclip } from '@fortawesome/free-solid-svg-icons';

import Accordion from '../Accordion';
import PageHeading from '../PageHeading';
import TextInput from '../TextInput';
import firebase from 'firebase';
import { useAlert } from 'react-alert';

const DeckEditor = ({
  deckToEdit,
  setDeckToEdit,
}) => {
  const { user } = useContext(firebaseAuth);
  const history = useHistory();
  const localDeck = JSON.parse(localStorage.getItem('deck'))
  const deck = deckToEdit || localDeck;
  const [title, setTitle] = useState(deck.title);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [description, setDescription] = useState(deck.description);
  const [listCards, setListCards] = useState([])
  console.log(deck);
  const [isPublic, setIsPublic] = useState(deck.isPublic ?? true);
  const alert = useAlert()

  const checkReadyToUpdate = () => {
    if(listCards.length == 0) alert.show("フラッシュカードセットを初期化するには、少なくとも1枚のカードが必要です！");
    else if (title.length <= 0) alert.show("フラッシュカードセットを初期化するには、セットのタイトルを入力する必要があります！");
    else if (description.length <= 0) alert.show("フラッシュカードセットを初期化するには、セットの説明を入力する必要があります！");
    else updateDeck();
  }

  const updateDeck = () => {
    dbMethods.updateDeck(user, deck.id, title, description, listCards, isPublic)
    setDeckToEdit({...deckToEdit, title});
    setUpdateSuccess(true);
    setTimeout(() => setUpdateSuccess(false), 3000);
  }

  const deleteDeck = (event) => {
    event.preventDefault();
    dbMethods.deleteDeck(user, deck.id);
    history.push('/app');
    setDeckToEdit(null);
  }

  const db = firebase.firestore();

  useEffect(() => {
    if (!deck) {
      return
    }
    console.log(deck)
    let ref = db.collection('decks').doc(deck.id);
    ref.get()
      .then(snapshot => {
        let arr = [];
        snapshot.data().cards?.forEach(item => arr.push(item));
        setListCards(arr);
      })
      .catch(error => console.log("Error: ", error.message))
  }, [])

  const onUpdateCards = (cards) => {
    setListCards(cards)
  }

  const onUpdateDecks = (event) => {
    updateDeck();
  }

  return (
    <div style={{textAlign: 'left'}}>
      <PageHeading
        title="セットを編集する"
        styles={{textAlign: 'left'}}
      />
      <form onSubmit={checkReadyToUpdate}>
        <TextInput 
          labelText="題名"
          icon={<FontAwesomeIcon icon={faPaperclip} />}
          id="title"
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="New Deck"
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
      <button
          className="btn btn-primary"
          onClick={checkReadyToUpdate}
        >
          {updateSuccess ? "編集に成功しました！" : "編集" }
        </button>
      <div>
        <PageHeading 
          title="デッキを削除する"
          styles={{textAlign: 'left'}}
        />
        <form onSubmit={deleteDeck}>
          <button
            className="btn btn-warning"
          >削除する</button>
        </form>
      </div>
    </div>
  );
}

export default DeckEditor;