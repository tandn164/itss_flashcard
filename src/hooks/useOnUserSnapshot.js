import { useState, useEffect } from 'react';
import firebase from 'firebase';

const useOnUserSnapshot = () => {
  const db = firebase.firestore();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let ref = db.collection('users');
    let unsubscribe = ref.onSnapshot((snapshot) => {
      let arr = [];
      snapshot.forEach(user => {
        arr.push({
          username: user.data().username,
          email: user.data().email,
          id: user.id,
        })
      });
      setUsers(arr);
    }, error => console.log("Error: ", error.message))

    return () => unsubscribe();
  }, []);

  return { users };
}

export default useOnUserSnapshot;