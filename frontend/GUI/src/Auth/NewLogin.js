import React, { useCallback, useContext } from 'react';
import { withRouter, Redirect } from 'react-router';
import app from './base';
import { AuthContext } from './Auth';
import { Avatar, Button, CssBaseline, TextField, Typography, Container} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  container: {
      backgroundColor: '#bbb',
    height: "100%",
    minHeight: "100vh"
  },
  paper: {
    // marginTop: theme.spacing(8),
    paddingTop: 70,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Login({history}) {
  const classes = useStyles();

  const handleLogin = useCallback(
    async event => {
        event.preventDefault();
        const { email, password } = event.target.elements;
        try {
            await app
                .auth()
                .signInWithEmailAndPassword(email.value, password.value);
            history.push('/');
        } catch (error) {
            alert(error);
        }
    }, [history]
  );

  const { currentUser } = useContext(AuthContext);

    if(currentUser){
        return <Redirect to='/' />;
    }

  return (
    <div className={classes.container}>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleLogin}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            placeholder="Email"
            // label="Email Address"
            name="email"
            // autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            placeholder="Password"
            // label="Password"
            type="password"
            id="password"
            // autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Log In
          </Button>
        </form>
      </div>
    </Container>
    </div>
  );
}

export default withRouter(Login);