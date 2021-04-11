import { GraphQLResult } from "@aws-amplify/api";
import { API, graphqlOperation } from "aws-amplify";
import { Observable } from "zen-observable-ts";
import * as mutations from "../graphql/mutations";
import {
  listPostsBySpecificOwner,
  listPostsSortedByTimestamp,
} from "../graphql/queries";
import * as subscriptions from "../graphql/subscriptions";

export function createPost(post: { content: string }): unknown {
  return API.graphql(
    graphqlOperation(mutations.createPost, {
      input: {
        type: "post",
        content: post.content,
        timestamp: Math.floor(Date.now() / 1000),
      },
    })
  );
}

export function fetchAllPosts(
  nextToken: unknown
):
  | Promise<GraphQLResult<Record<string, unknown>>>
  | Observable<Record<string, unknown>> {
  return API.graphql(
    graphqlOperation(listPostsSortedByTimestamp, {
      type: "post",
      sortDirection: "DESC",
      limit: 20, // default = 10
      nextToken,
    })
  );
}

export function fetchUserPosts(
  userId: string,
  nextToken: unknown
):
  | Promise<GraphQLResult<Record<string, unknown>>>
  | Observable<Record<string, unknown>> {
  return API.graphql(
    graphqlOperation(listPostsBySpecificOwner, {
      owner: userId,
      sortDirection: "DESC",
      limit: 20,
      nextToken,
    })
  );
}

export function onCreatePost(next: (msg: unknown) => void): () => void {
  const subscription = API.graphql(
    graphqlOperation(subscriptions.onCreatePost)
  ).subscribe({
    next,
  });
  return () => subscription.unsubscribe();
}
