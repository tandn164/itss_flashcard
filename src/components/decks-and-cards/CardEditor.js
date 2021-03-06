/**
 * Handles displaying each card editor.
 */

import React, { useState, useEffect, useContext } from 'react';
import { dbMethods } from '../../firebase/dbMethods';
import { firebaseAuth } from '../../provider/AuthProvider';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import UploadAndDisplayImage from './UploadAndDisplayImage';

const CardEditor = ({
  index,
  card,
  onSubmit,
  onUpdate,
  onDelete
}) => {
  const { user } = useContext(firebaseAuth);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setFront(card.front);
    setBack(card.back);
    setImage(card.imageRef);
  }, [card])

  const handleInput = (event) => {
    if (event.target.name === "front") {
      setFront(event.target.value);
    } else if (event.target.name === "back") {
      setBack(event.target.value);
    }
  }

  const updateCard = (event) => {
    event.preventDefault();
    if (front.length <= 0 || image == null) {
      return;
    }
    if (back.length <=0 ) {
      return;
    }
    if (uploading) {
      return;
    }
    console.log("Card to update: ", card.id);
    onUpdate(index, front, back, image)
    onSubmit();
  }

  const deleteCard = (event) => {
    event.preventDefault();
    onDelete(index)
  }

  return (
    <form className="card-editor" onSubmit={updateCard}>
      <div className="input-block">
        <textarea
          name="front"
          id={card.id + "-front"}
          value={front}
          onChange={handleInput}
        />
        <label htmlFor={card.id + "-front"}>フロント</label>
      </div>
      <div className="input-block">
        <textarea
          name="back"
          id={card.id + "-back"}
          value={back}
          onChange={handleInput}
        />
        <label htmlFor={card.id + "-back"}>バック</label>
      </div>
      <UploadAndDisplayImage onSetImage={(image)=>{
        setImage(image);
      }} imageRef={image} onUploadingImage={setUploading}/>
      <button className="btn">アップデート</button>
      <button className="btn btn-warning"
        onClick={deleteCard}
      >
        <FontAwesomeIcon icon={faTrash} /> 削除
      </button>
    </form>
  );
}

export default CardEditor;