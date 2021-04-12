# Amplify

- [Amplify SNS Workshop :: Amplify SNS Workshop](https://amplify-sns.workshop.aws/ja/)

> Amplify SNS Workshopへようこそ！本ワークショップではTwitterライクなソーシャルメディアアプリケーションの開発を通して、実践的に AWS Amplify について学ぶことが出来ます。

## Amplify CLI

### 管理

```console
$ amplify init
$ amplify status
$ amplify pull
$ amplify push
$ amplify publish
```

`pull`, `push` は `git` のそれに近い。

### 操作

```console
$ amplify add auth
$ amplify add api
$ amplify add hosting
```

### 開発

```console
$ amplify mock api
$ amplify api gql-compile
```

## Admin console

- AWS > Amplify > (your app) > Backend environments > Open admin UI

## API / schema

- [API (GraphQL) - Overview - Amplify Docs](https://docs.amplify.aws/cli/graphql-transformer/overview)
- [API (GraphQL) - Directives - Amplify Docs](https://docs.amplify.aws/cli/graphql-transformer/directives)

Schema を編集すると色々出てくる。

- `amplify/backend/api/<AppName>/schema.graphql`

```gql
type Post
{
  id: ID
  name: String!
  timestamp: Int!
}
```

`!` が付くと必須項目になる。（ID は違うの？）

### ディレクティブ

- [API (GraphQL) - Directives - Amplify Docs](https://docs.amplify.aws/cli/graphql-transformer/directives)
- [【AWS Amplify ノウハウ】 3. GraphQL Schemaの type に @model を付けなかった時の注意すべきこと | DevelopersIO](https://dev.classmethod.jp/articles/amplify-tips-series-3/)

> - `@model`: Defines top level object types in your API that are backed by Amazon DynamoDB
> - `@key`: Configures custom index structures for @model types
> - `@auth`: Defines authorization rules for your @model types and fields
> - `@connection`: Defines 1:1, 1:M, and N:M relationships between @model types
> - `@function`: Configures a Lambda function resolvers for a field
> - `@http`: Configures an HTTP resolver for a field
> - `@predictions`: Queries an orchestration of AI/ML services such as Amazon Rekognition, Amazon Translate, and/or Amazon Polly
> - `@searchable`: Makes your data searchable by streaming it to Elasticsearch
> - `@versioned`: Defines the versioning and conflict resolution strategy for an @model type

### `@model`

与えると RDB でいうところのテーブル、Firestore でいうところの Collection が作られる。操作インターフェイスを定義できる。

これのない型？は入れ子オブジェクトの型として利用できる。その場合入れ子オブジェクトの情報に対してインデックスは作成できない。

```gql
type Post @model(queries: { get: "post" }, mutations: null, subscriptions: null) {
  id: ID!
  title: String!
  tags: [String!]!
}
```

`@key` はインデックス。

## Authentication

```console
$ amplify add auth
$ npm i aws-amplify @aws-amplify/ui-react @aws-amplify/ui-components
```

```ts
import awsConfig from "../../../aws-exports";

Amplify.configure(awsConfig);
```

```tsx
import {
  AmplifyAuthenticator,
  AmplifySignIn,
  AmplifySignOut,
  AmplifySignUp,
} from "@aws-amplify/ui-react";

const LoginForm: React.FC = () => {
  return (
    <AmplifyAuthenticator>
      <AmplifySignIn
        slot="sign-in"
        formFields={[{ type: "email" }, { type: "password" }]}
      />
      <AmplifySignUp
        slot="sign-up"
        formFields={[{ type: "email" }, { type: "password" }]}
      />
    </AmplifyAuthenticator>
  );
};

const LogoutForm: React.FC = () => {
  return (
    <div
      style={{
        boxSizing: "border-box",
        margin: "auto",
        padding: "35px 40px",
        width: "28.75rem",
      }}
    >
      <AmplifySignOut />
    </div>
  );
};
```

```ts
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";

// TODO find type
interface UnknownAwsUser {
  attributes: {
    email: string;
  };
}

function useAuth(): [UnknownAwsUser | null, AuthState | null] {
  const [user, setUser] = useState<UnknownAwsUser | null>(null);
  const [state, setState] = useState<AuthState | null>(null);

  useEffect(() => {
    return onAuthUIStateChange((newState, newUser) => {
      setUser(isUnknownAwsUser(newUser) ? newUser : null);
      setState(newState);
    });
  }, []);

  return [user, state];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isUnknownAwsUser(user: any): user is UnknownAwsUser {
  if (typeof user !== "object" || user === null) {
    return false;
  }

  return "attributes" in user && typeof user.attributes.email === "string";
}
```

1. Admin UI > User management > User
2. Create user

## Random

### アプリ下のユーザー情報は Cognito ではなく Admin UI から

アプリの Backend environments > (env name) > Authentication に View in Cognito とかいうボタンが出てくるが、そのからユーザーは見つからない。（説明にはやっぱり Cognito とあるので、内部的には使っているとかそういう？）

Admin UI は、アプリの Backend environments ページで対象の environment (e.g. dev) から Set up admin UI ボタンを押す。時間がかかる。作成後は開くボタンに変わる。

### AWS profile vs [?]

"Select the authentication method you want to use" は "AWS profile"。既に `~/.aws/` に保存されている情報を用いる。もう一方の方はたぶん新規に何か作る。

### `amplify push` vs `amplify publish`

`push` は backend のみ、`publish` は backend と frontend の両方。

`add auth` のときになんか言ってた。

> "amplify push" will build all your local backend resources and provision it in the cloud
>
> "amplify publish" will build all your local backend and frontend resources (if you have hosting category added) and provision it in the cloud
