/*global chrome*/
import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import './App.css'
import axios from 'axios';
import { Typography, TextField, Button, CircularProgress, IconButton } from '@mui/material';
import { NODE_URL, DEFAULT_PROFILE_IMAGE, COMMENTS_URL } from './utils/Constants';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';

// url that I'm testing on (pinnochio): https://www.youtube.com/watch?v=Z4ArXSwALDU

export default function Comments() {

  // Router stuff
  // let params = useParams();
  // let navigate = useNavigate();

  // State stuff
  const [comments, setComments] = useState();
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [showCommentButton, setShowCommentButton] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showReplies, setShowReplies] = useState([]);
  const [repliesLoading, setRepliesLoading] = useState(false);
  const [replies, setReplies] = useState([]);
  const [showAddReply, setShowAddReply] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [likes, setLikes] = useState({});
  const [replyLikes, setReplyLikes] = useState({});
  const [url, setUrl] = useState();
  const [isYoutube, setIsYoutube] = useState(true);
  const [loadedUrl, setLoadedUrl] = useState(false);

  // Toggles the add reply thing for a comment
  function handleShowAddReply(id) {
    let temp = {};
    temp[id] = !temp[id];
    setShowAddReply(temp);
  }

  // Fetches comments from db, hopefully this is the right way to use useCallback
  const fetchComments = useCallback(() => {
    if (!url) {
      return;
    }
    setCommentsLoading(true);
    axios.get(NODE_URL + '/getComments/' + url).then(
      function (value) {
        setComments(value.data);
        console.log(value.data);
        setCommentsLoading(false);

        // Set the likes in state
        let temp = {};
        for (let comment of value.data) {
          temp[comment.id] = comment.likes;
        }
        setLikes(temp);

      },
      function (error) {
        setCommentsLoading(false);
        alert(error + "\nThere was a problem contacting the server.");
      }
    )
  }, [url]);

  // This is bad style. But need one that just goes to true
  // function showRepliesTrue(id) {
  //   let temp = { ...showReplies };
  //   temp[id] = true;
  //   setShowReplies(temp);
  //   fetchReplies(id);
  // }

  // Fetches replies for a specified comment id
  function fetchReplies(id) {
    axios.get(NODE_URL + '/getReplies/' + id).then(
      function (value) {
        let temp = { ...replies };
        temp[id] = value.data;
        setReplies(temp);
        setRepliesLoading(false);
        console.log('replies', value.data);

        // Set the reply likes in state
        let anotherTemp = {};
        for (let reply of value.data) {
          anotherTemp[reply.id] = reply.likes;
        }
        setReplyLikes(anotherTemp);

      },
      function (error) {
        setRepliesLoading(false);
        alert(error + "\nThere was a problem contacting the server.");
      }
    )
  }

  // Toggles whether to show replies for a comment
  function handleShowRepliesClicked(id) {
    let temp = { ...showReplies };
    temp[id] = !temp[id];
    setShowReplies(temp);
    fetchReplies(id);
  }

  // Fetch info for id on load
  useEffect(() => {
    console.log('use effecting');
    fetchComments();
  }, [fetchComments]);

  // useEffect(() => {
  //   axios.get('https://www.youtube.com/watch?v=' + url)
  // }, [url]);

  // Get the url from the current tab
  useEffect(() => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {

      // if it's not a youtube video do something about that...
      if (tabs[0].url.indexOf('https://www.youtube.com/watch?v=') === -1) {
        setIsYoutube(false);
      }
      else {
        setIsYoutube(true);
        setUrl(tabs[0].url.substr(tabs[0].url.indexOf('https://www.youtube.com/watch?v=') + 'https://www.youtube.com/watch?v='.length));
      }
      setLoadedUrl(true);
    });
  }, []);

  // add like
  function addLike(id) {
    let temp = { ...likes };
    temp[id] += 1;
    setLikes(temp);
  }

  // remove like
  function removeLike(id) {
    let temp = { ...likes };
    temp[id] -= 1;
    setLikes(temp);
  }

  // add like
  function addReplyLike(id) {
    let temp = { ...replyLikes };
    temp[id] += 1;
    setReplyLikes(temp);
  }

  // remove like
  function removeReplyLike(id) {
    let temp = { ...replyLikes };
    temp[id] -= 1;
    setReplyLikes(temp);
  }

  if (!loadedUrl) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </div>
    )
  }

  if (!isYoutube) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', width: '75px', height: '50px' }}>
        This is not a youtube video :/
      </div>
    )
  }

  return (
    <div className="comments-container">
      <div className="add-comment-container">
        <div className="user-icon">
          <img src={DEFAULT_PROFILE_IMAGE} referrerPolicy="no-referrer" alt="user icon" style={{ width: '100%' }} />
        </div>
        <a href={COMMENTS_URL + url} target="_blank" rel="noreferrer noopener" style={{ textDecoration: 'inherit', color: 'inherit', width: '100%', display: 'flex' }}>
          <TextField
            placeholder="Add a public comment..."
            variant="standard"
            sx={{ flexGrow: 1 }}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onClick={null}
          />
        </a>
      </div>
      <div className="add-comment-buttons" style={{ display: `${showCommentButton ? '' : 'none'}` }}>
        <Button sx={{ color: 'gray' }} onClick={() => { setShowCommentButton(false); setNewComment(""); }}>Cancel</Button>
        <Button variant="contained" disabled={!Boolean(newComment)} onClick={null}>Comment</Button>
      </div>
      <div>
        {
          (!comments || commentsLoading) ?
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </div>
            :
            <div>
              {
                comments.length === 0 ?
                  <>
                    There are no comments for this video yet.
                  </>
                  :
                  comments.map(entry => {
                    return (
                      <div className="comment" key={entry.id}>
                        <div className="user-icon">
                          {/* {entry.username.charAt(0).toUpperCase()} */}
                          <img src={entry.user_image} referrerPolicy="no-referrer" alt="user icon" style={{ width: '100%' }} />
                        </div>
                        <div className="comment-innards">
                          <div className="username-date">
                            <Typography sx={{ fontWeight: 'bold' }}>{entry.username}</Typography>
                            <Typography sx={{ fontSize: 11, color: 'gray', marginLeft: 1, marginTop: 0.7 }}>{entry.date.substr(0, 10)}</Typography>
                          </div>
                          <Typography>{entry.content}</Typography>
                          <div className="reply-likes-container">
                            <IconButton onClick={() => addLike(entry.id)}>
                              <ThumbUpOutlinedIcon sx={{ fontSize: '15px', color: '#2e2e2e' }} />
                            </IconButton>
                            <div className="likes-count">{likes[entry.id]}</div>
                            <IconButton onClick={() => removeLike(entry.id)}>
                              <ThumbDownOutlinedIcon sx={{ fontSize: '15px', color: '#2e2e2e' }} />
                            </IconButton>
                            <Typography className="reply-button" sx={{ color: 'gray', fontSize: 14 }} onClick={() => handleShowAddReply(entry.id)}>REPLY</Typography>
                          </div>
                          {
                            showAddReply[entry.id]
                              ?
                              <>
                                <div className="add-reply-container">
                                  <div className="user-icon but-smaller">
                                    {/* {userDetails[0].username.charAt(0).toUpperCase()} */}
                                    <img src={DEFAULT_PROFILE_IMAGE} referrerPolicy="no-referrer" alt="user icon" style={{ width: '100%' }} />
                                  </div>
                                  <TextField
                                    autoFocus
                                    placeholder="Add a public reply..."
                                    variant="standard"
                                    sx={{ flexGrow: 1 }}
                                    value={newReply}
                                    onChange={(e) => setNewReply(e.target.value)} />
                                </div>
                                <div className="add-reply-buttons" style={{ display: `${showAddReply ? '' : 'none'}` }}>
                                  <Button sx={{ color: 'gray' }} onClick={() => { setShowAddReply([]); setNewReply(""); }}>Cancel</Button>
                                  <a href={COMMENTS_URL + url} target="_blank" rel="noreferrer noopener" style={{ textDecoration: 'inherit', color: 'inherit', display: 'flex' }}>
                                    <Button variant="contained" disabled={!Boolean(newReply)} onClick={null}>Reply</Button>
                                  </a>
                                </div>
                              </>
                              :
                              <></>
                          }
                          {
                            entry.num_responses > 0
                              ?
                              <>
                                <Typography className="show-replies" onClick={() => handleShowRepliesClicked(entry.id)}>{!showReplies[entry.id] ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />} {!showReplies[entry.id] ? 'View' : 'Hide'} {entry.num_responses > 1 ? entry.num_responses + " replies" : "reply"}</Typography>
                                {
                                  showReplies[entry.id] ?
                                    <>
                                      {
                                        repliesLoading || !replies[entry.id]
                                          ?
                                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <CircularProgress />
                                          </div>
                                          :
                                          replies[entry.id].map(replyEntry => {
                                            // Is this code spaghetti ?
                                            return (
                                              <div className="comment" key={replyEntry.id}>
                                                <div className="user-icon but-smaller">
                                                  {/* {replyEntry.username.charAt(0).toUpperCase()} */}
                                                  <img src={replyEntry.user_image} referrerPolicy="no-referrer" alt="user icon" style={{ width: '100%' }} />
                                                </div>
                                                <div className="comment-innards">
                                                  <div className="username-date">
                                                    <Typography sx={{ fontWeight: 'bold' }}>{replyEntry.username}</Typography>
                                                    <Typography sx={{ fontSize: 11, color: 'gray', marginLeft: 1, marginTop: 0.7 }}>{replyEntry.date.substr(0, 10)}</Typography>
                                                  </div>
                                                  <Typography>{replyEntry.content}</Typography>
                                                  <div className="reply-likes-container">
                                                    <IconButton onClick={() => addReplyLike(replyEntry.id)}>
                                                      <ThumbUpOutlinedIcon sx={{ fontSize: '15px', color: '#2e2e2e' }} />
                                                    </IconButton>
                                                    <div className="likes-count">{replyLikes[replyEntry.id]}</div>
                                                    <IconButton onClick={() => removeReplyLike(replyEntry.id)}>
                                                      <ThumbDownOutlinedIcon sx={{ fontSize: '15px', color: '#2e2e2e' }} />
                                                    </IconButton>
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })
                                      }
                                    </>
                                    :
                                    <></>
                                }
                              </>
                              :
                              <></>
                          }
                        </div>
                      </div>
                    );
                  })
              }
            </div>
        }
      </div>
    </div>
  )
}
