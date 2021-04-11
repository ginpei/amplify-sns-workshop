import React, { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router";
import PostList from "../components/PostList";
import { fetchUserPosts, subscribeCreatePost } from "../data/posts";
import Sidebar from "./Sidebar";

const SUBSCRIPTION = "SUBSCRIPTION";
const INITIAL_QUERY = "INITIAL_QUERY";
const ADDITIONAL_QUERY = "ADDITIONAL_QUERY";

const reducer = (state, action) => {
  switch (action.type) {
    case INITIAL_QUERY:
      return action.posts;
    case ADDITIONAL_QUERY:
      return [...state, ...action.posts];
    case SUBSCRIPTION:
      return [action.post, ...state];
    default:
      return state;
  }
};

export default function PostsBySpecifiedUser() {
  const { userId } = useParams();

  const [posts, dispatch] = useReducer(reducer, []);
  const [nextToken, setNextToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getPosts = async (type, nextToken2 = null) => {
    const res = await fetchUserPosts(userId, nextToken2);
    console.log(res);
    dispatch({ type, posts: res.data.listPostsBySpecificOwner.items });
    setNextToken(res.data.listPostsBySpecificOwner.nextToken);
    setIsLoading(false);
  };

  const getAdditionalPosts = () => {
    if (nextToken === null) return; // Reached the last page
    getPosts(ADDITIONAL_QUERY, nextToken);
  };

  useEffect(() => {
    getPosts(INITIAL_QUERY);

    return subscribeCreatePost((msg) => {
      const post = msg.value.data.onCreatePost;
      if (post.owner !== userId) return;
      dispatch({ type: SUBSCRIPTION, post });
    });
  }, []);

  return (
    <React.Fragment>
      <Sidebar activeListItem="profile" />
      <PostList
        isLoading={isLoading}
        posts={posts}
        getAdditionalPosts={getAdditionalPosts}
        listHeaderTitle={userId}
      />
    </React.Fragment>
  );
}
