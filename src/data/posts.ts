import { GraphQLResult } from "@aws-amplify/api";
import { API, graphqlOperation } from "aws-amplify";
import { Observable } from "zen-observable-ts";
import {
  listPostsBySpecificOwner,
  listPostsSortedByTimestamp,
} from "../graphql/queries";
import { onCreatePost } from "../graphql/subscriptions";

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

export function subscribeCreatePost(next: (msg: unknown) => void): () => void {
  const subscription = API.graphql(graphqlOperation(onCreatePost)).subscribe({
    next,
  });
  return () => subscription.unsubscribe();
}
