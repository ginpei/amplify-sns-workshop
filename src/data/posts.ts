import { GraphQLResult } from "@aws-amplify/api";
import { API, graphqlOperation } from "aws-amplify";
import { Observable } from "zen-observable-ts";
import { listPostsSortedByTimestamp } from "../graphql/queries";

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
