import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import { AmplifyAuthenticator, AmplifySignUp } from "@aws-amplify/ui-react";
import CssBaseline from "@material-ui/core/CssBaseline";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import Amplify from "aws-amplify";
import React from "react";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import awsconfig from "./aws-exports";
import AllPosts from "./containers/AllPosts";
import PostsBySpecifiedUser from "./containers/PostsBySpecifiedUser";

Amplify.configure(awsconfig);

const drawerWidth = 240;

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#1EA1F2",
      contrastText: "#fff",
    },
    background: {
      default: "#15202B",
      paper: "#15202B",
    },
    divider: "#37444C",
  },
  overrides: {
    MuiButton: {
      // color: "white",
    },
  },
  typography: {
    fontFamily: ["Arial"].join(","),
  },
  // status: {
  //   danger: "orange",
  // },
});

const useStyles = makeStyles((theme2) => ({
  root: {
    display: "flex",
    height: "100%",
    width: 800,
    marginLeft: "auto",
    marginRight: "auto",
  },
  appBar: {
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme2.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme2.palette.background.default,
    padding: theme2.spacing(3),
  },
}));

const App = () => {
  const [authState, setAuthState] = React.useState<AuthState | null>();
  const [user, setUser] = React.useState<Record<string, unknown> | null>();

  const classes = useStyles();

  React.useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData as any);
    });
  }, []);

  return authState === AuthState.SignedIn && user ? (
    <div className={classes.root}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <HashRouter>
          <Switch>
            <Route exact path="/" component={AllPosts} />
            <Route exact path="/global-timeline" component={AllPosts} />
            <Route exact path="/:userId" component={PostsBySpecifiedUser} />
            <Redirect path="*" to="/" />
          </Switch>
        </HashRouter>
      </ThemeProvider>
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
