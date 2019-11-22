import {
  Grid,
  TextField,
  makeStyles,
  Button,
  Typography
} from "@material-ui/core";
import React, { useEffect } from "react";
import * as otplib from "otplib";
import qrcode from "qrcode";

const useStyles = makeStyles(theme => ({
  content: {
    margin: 20
  },
  block: {
    padding: 10,
    margin: 20
  },
  blockBordered: {
    border: "1px solid #DDD",
    padding: 10,
    margin: 20
  },
  qrCode: {
    height: 300,
    width: 300
  },
  textField: {
    marginLeft: 10,
    marginRight: 10
  }
}));

const generateSecret = () => {
  return otplib.authenticator.generateSecret();
};

const attemptAuth = (token, secret) => {
  try {
    const isValid = otplib.authenticator.verify({ token, secret });
    alert("authenticated: " + isValid);
  } catch (err) {
    console.error(err);
  }
};

const Index: React.FC = () => {
  const classes = useStyles({});
  const [secret, setSecret] = React.useState<string>(generateSecret());
  const [username, setUsername] = React.useState<string>("user@testapp.com");
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string>("");
  const [token, setToken] = React.useState("");

  useEffect(() => {
    if (secret === null) return;

    const fetchData = () => {
      const user = username;
      const service = "Test App";
      const otpauth = otplib.authenticator.keyuri(user, service, secret);

      qrcode.toDataURL(otpauth, (err, imageUrl) => {
        if (err) {
          console.log("Error with QR");
          return;
        }
        setQrCodeUrl(imageUrl);
      });
    };

    fetchData();
  }, [secret]);

  return (
    <div className={classes.content}>
      <div className={classes.block}>
        <Typography variant="h4">Google Authenticator + otplib test</Typography>
      </div>
      <div className={classes.block}>
        <Typography variant="body1">
          The following values are for fields that are typically stored in a
          datastore for a User. The username is typically a unique string or
          email address. The <code>secret</code> field is specific to 2FA and is
          used to create a connection with Google Authenticator for two factor
          authentication.
        </Typography>
      </div>
      <div className={classes.blockBordered}>
        <Grid container spacing={3}>
          <Grid item>
            <TextField
              id="username"
              label="username"
              margin="normal"
              variant="outlined"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className={classes.textField}
            />
          </Grid>
          <Grid item>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <TextField
                  id="secret"
                  label="secret"
                  margin="normal"
                  variant="outlined"
                  value={secret}
                  disabled
                />
              </Grid>
              <Grid item>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    setSecret(generateSecret());
                  }}
                >
                  Generate new secret
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <div className={classes.block}>
        <Typography variant="body1">
          The QR code below is generated from the secret data above. Scan the
          generated QR Code with Google Authenticator to create a connection to
          this 'app'.
        </Typography>
      </div>
      <div className={classes.block}>
        <img className={classes.qrCode} src={qrCodeUrl} />
      </div>
      <div className={classes.block}>
        <Typography variant="body1">
          Enter in the PIN generated from the Google Authenticator and type it
          in the field below to test a successful authentication.
        </Typography>
      </div>
      <div className={classes.blockBordered}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <TextField
              id="token"
              label="token"
              margin="normal"
              variant="outlined"
              value={token}
              onChange={e => setToken(e.target.value)}
            />
          </Grid>
          <Grid item>
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                attemptAuth(token, secret);
              }}
            >
              Authenticate
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Index;
