import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import {
  AmplifyAuthenticator,
  AmplifySignOut,
  AmplifySignUp,
} from "@aws-amplify/ui-react";
import Amplify from "aws-amplify";
import React from "react";
import awsConfig from "./aws-exports";

// TODO find actual type
interface UnknownAwsUser {
  username: string;
}

Amplify.configure(awsConfig);

const App: React.FC = () => {
  const [authState, setAuthState] = React.useState<AuthState | null>(null);
  const [user, setUser] = React.useState<UnknownAwsUser | null>(null);

  React.useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData as any);
    });
  }, []);

  return authState === AuthState.SignedIn && user ? (
    <div className="App">
      <div>Hello, {user.username}</div>
      <AmplifySignOut />
    </div>
  ) : (
    <AmplifyAuthenticator>
      <AmplifySignUp
        slot="sign-up"
        formFields={[
          { type: "username" },
          { type: "password" },
          { type: "email" },
        ]}
      />
    </AmplifyAuthenticator>
  );
};

export default App;
