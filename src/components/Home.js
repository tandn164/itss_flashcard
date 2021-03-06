import React, { useContext, useState } from 'react';
import { Link, useHistory, Switch, Route } from 'react-router-dom';
import { firebaseAuth } from '../provider/AuthProvider';

import PageHeading from './PageHeading';
import DeckList from './decks-and-cards/DeckList';
import DeckEditor from './decks-and-cards/DeckEditor';

const Home = ({
  allDecks,
  userStatus
}) => {
  const { user } = useContext(firebaseAuth);
  const [deckToEdit1, setDeckToEdit] = useState(null);
  const history = useHistory();
  if (!user) {
    history.push("/log-in");
  }
  return (
    <Switch>
      <Route path="/app-edit" >
        <DeckEditor
          deckToEdit={deckToEdit1}
          setDeckToEdit={setDeckToEdit}
        />
      </Route>
      <Route path="/">
        <>
          <header className="hero">
            <section>
              <div className="hero-content">
                <div className="buttons">
                  <>
                  </>
                </div>
              </div>
            </section>
            <div className="card-design">
              <div>
                <span></span>
                <div>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div>
                <span></span>
                <div>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div>
                <span></span>
                <div>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </header>

          <section className="public-decks">
            <div>
              <PageHeading
                title="全てセット"
              />
              <div style={{textAlign: 'left'}}>
                <DeckList
                  //de tam day vi sort hoac orderBy trong useHook ko duoc :v
                  decks={allDecks.sort((a, b) => b.saveCount - a.saveCount)}
                  setDeckToEdit={setDeckToEdit}
                  userStatus={userStatus}
                />
              </div>
            </div>
          </section>
        </>
      </Route>
    </Switch>
  );
}

export default Home;