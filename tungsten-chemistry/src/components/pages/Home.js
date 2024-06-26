import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../App.css';
import '../Home.css';
import Footer from '../FootNote.js';
import { onAuthChange } from "../../firebase";
import { getDocs, collection, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

function Home() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('');
  const [postLists, setPostList] = useState([]);
  const postsCollectionsRef = collection(db, "posts");

  const deletePost = async (id) => {
    const postDoc = doc(db, "posts", id);
    await deleteDoc(postDoc);
  };

  const fetchUserRole = async (uid) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      setRole(userDoc.data().role);
    }
  };

  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(postsCollectionsRef);
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    
    getPosts();
    onAuthChange((user) => {
      setUser(user);
      if (user) {
        fetchUserRole(user.uid);
      }
    });
  }, [deletePost]);

  return (
    <>
      <div className="homePage">
        {user && role === 'teacher' && (
          <Link to="/createpost">
            <button className="create-post-button">+</button>
          </Link>
        )}
        <h1>This is Mr. Poot's classroom =)</h1>

        {postLists.map((post) => {
          return (
            <div className="post" key={post.id}>
              <div className="postHeader">
                <div className="title">
                  <h1>{post.title}</h1>
                </div>
                <div className="deletePost">
                {user && post.author.id === auth.currentUser.uid && (
                  <button
                    onClick={() => {
                      deletePost(post.id);
                    }}
                  >
                    {" "}
                    &#128465;
                  </button>
                )}
              </div>
              </div>
              <div className="postTextContainer">{post.postText}</div>
              {post.link && (
                <div className="videoContainer">
                  <iframe
                    src={"https://www.youtube.com/embed/" + post.link.split(".be/")[1]}
                    width={560}
                    height={300}
                    allow='autoplay; encrypted-media; allowfullscreen'
                    title='video'
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Footer />
    </>
  );
}

export default Home;

