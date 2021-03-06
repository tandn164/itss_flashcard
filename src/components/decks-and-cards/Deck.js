/**
 * Handles logic for getting the selected deck and cards.
 * Generates FlippableCards for each card to be shown, and 
 * renders them in a Carousel.
 */

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import firebase from 'firebase';

import { useHistory, useParams } from 'react-router-dom';

import Carousel from '../Carousel';
import FlippableCard from './FlippableCard';
import Spinner from '../Spinner';
import { faRandom, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useAlert } from 'react-alert';

const Deck = ({
  onClick,
}) => {
  const [cards, setCards] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hashCards, setHashCards] = useState(null);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [canView, setCanView] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const { hash } = useParams();
  const [shuffle, setShuffle] = useState(0);
  const [cardShuffle, setCardShuffle] = useState([]);
  const history = useHistory();
  const alert = useAlert()

  useEffect(() => {
    setIsLoaded(false);
    setHashCards(null);
    setCards(null);

    console.log(hash)
    if (hash === undefined) return;

    const db = firebase.firestore();

    db.collection('decks').doc(hash).get()
      .then(snapshot => {
        setIsLoaded(true);
      })
      .catch(error => {
        setIsLoaded(true);
        console.log("Error: ", error.message)
      })

    let ref = db.collection('decks').doc(hash);
    ref.get()
      .then(snapshot => {
        let arr = [];
        snapshot.data().cards?.forEach(item => arr.push(item));
        setHashCards(arr);
        setTitle(snapshot.data().title)
        setDescription(snapshot.data().description)
      })
      .catch(error => console.log("Error: ", error.message))
  }, [hash]);

  useEffect(() => {
    setIsLoaded(false);
    let _cards = [];

    if (hashCards != null) {
      _cards = hashCards;
    } else {
      _cards = [];
    }

    if (_cards.length > 0) {
      setCards(_cards.map((ele) => {
        return (
          <FlippableCard
            key={ele.id}
            frontTitle="????????????"
            backTitle="?????????"
            frontText={ele.front}
            backText={ele.back}
            onClick={onClick}
            isFlipped={isCardFlipped}
            setIsFlipped={setIsCardFlipped}
            imageRef={ele.imageRef}
          />
        )
      }));
      setCardShuffle(_cards.map((ele) => {
        return (
          <FlippableCard
            key={ele.id}
            frontTitle="????????????"
            backTitle="?????????"
            frontText={ele.front}
            backText={ele.back}
            onClick={onClick}
            isFlipped={isCardFlipped}
            setIsFlipped={setIsCardFlipped}
            imageRef={ele.imageRef}
          />
        )
      }));
      setIsLoaded(true);
    }

  }, [isCardFlipped, onClick, hashCards]
  );

  if (!isLoaded) return (
    <main>
      <div className="container center">
        <Spinner />
      </div>
    </main>
  );

  if (!cards) return (
    <div className="container center">
      <p>We couldn't find this deck. :(</p>
    </div>
  )

  if (!canView || cards.length === 0) return (
    <div className="container center">
      <p>This deck is either private or has no cards! If you are the owner, you can view it and edit it from your dashboard.</p>
    </div>
  );

  const slideCallback = () => {
    setIsCardFlipped(false);
  }

  const shuffleCard = (array) => {
    let currentIndex = array.length, randomIndex;

    while (currentIndex != 0) {

      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: 250, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', backgroundColor: '#DADCE2' }}>
        <div style={{
          position: 'absolute',
          top: 100,
          marginLeft: 10,
          marginRight: 10
        }}>
          <p style={{ fontWeight: 'bold', fontSize: '25px'}}>{title}</p>
          
          <br/>
          
          <div style={{maxWidth: 200}}>
            <p style={{ fontWeight: 'bold', fontSize: '25px'}}>??????: </p>
            <text style={{fontWeight: '500', display: '-webkit-box', wordBreak: 'break-word'}}>{description}</text>
          </div>
        </div>
        <div style={{
          background: shuffle == 0 ? 'green' : 'grey',
          height: 30,
          width: 100,
          textAlign: 'center',
          zIndex: 1,
          color: shuffle == 0 ? 'white' : 'black',
          lineHeight: 2,
          verticalAlign: 'center',
          borderRadius: 15,
          cursor: 'pointer'
        }} onClick={(event) => {
          setShuffle(0)
        }}>????????????</div>
        <div style={{
          background: shuffle != 0 ? 'green' : 'gray',
          height: 30,
          width: 100,
          textAlign: 'center',
          zIndex: 1,
          color: shuffle != 0 ? 'white' : 'black',
          marginTop: 50,
          marginBottom: 100,
          lineHeight: 2,
          verticalAlign: 'center',
          borderRadius: 15,
          cursor: 'pointer'
        }} onClick={(event) => {
          setCardShuffle(shuffleCard(cardShuffle))
          setShuffle(prev => prev + 1)
        }}>???????????????</div>
      </div>
      <Carousel
        items={shuffle != 0 ? cardShuffle : cards}
        leftButtonText={<FontAwesomeIcon icon={faAngleLeft} />}
        rightButtonText={<FontAwesomeIcon icon={faAngleRight} />}
        animTime={.3}
        previousCallback={slideCallback}
        nextCallback={slideCallback}
        showButtons={true}
      />
      <div style={{ width: 250, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#DADCE2' }}>
        <button
          onClick={() => {
            if (cards.length >= 4) {
              history.push('/app/test/'+hash)
            } else {
              alert.show('????????????????????????????????????????????????????????????4??????????????????????????????')
            }
          }}
          style={{ color: '#B02A22', background: 'transparent', display: 'flex', border: 'unset', fontSize: 30, paddingBottom: 30 }}
        >
          <> ??????</>
        </button>
        <button
          onClick={() => {
            history.push('/app/test-match/'+hash)
          }}
          style={{ color: '#B02A22', background: 'transparent', display: 'flex', border: 'unset', fontSize: 30, paddingBottom: 30 }}
        >
          <>???????????????</>
        </button>
        {/* <button
          onClick={() => {
            alert.show('????????????????????????')
          }}
          style={{ color: '#B02A22', background: 'transparent', display: 'flex', border: 'unset', fontSize: 30 }}
        >
          <>??????</>
        </button> */}
      </div>
    </div>

  );
}

export default Deck;