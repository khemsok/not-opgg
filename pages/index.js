import { useState, useEffect } from "react";

// NextJS
import Router from "next/router";
import Link from "next/link";

// MUI
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  mainContainer: {
    backgroundColor: "#5383E8",
    height: "calc(100vh - 136px)",
  },
  mainSection: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  searchBox: {
    backgroundColor: "white",
    boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.19)",
  },
});

export default function Home() {
  const classes = useStyles();

  const [userName, setUserName] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    setUserList(JSON.parse(localStorage.getItem("users") || "[]").slice(0, 10));
  }, []);
  const handleChange = (e) => {
    setUserName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let users = JSON.parse(localStorage.getItem("users") || "[]").slice(0, 9);

    console.log(users, "users");

    !users.includes(userName) ? users.unshift(userName) : null;

    setUserList(users);
    localStorage.setItem("users", JSON.stringify(users));

    Router.push(`/summoner?userName=${userName}`);
  };

  return (
    <>
      <div className={classes.mainContainer}>
        <Container maxWidth="sm">
          <div className={classes.mainSection}>
            <img src="https://attach.s.op.gg/logo/20201031232001.393bd1782110eea7bdd13d7f5d26acd4.png" style={{ maxHeight: "200px" }} />
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <TextField className={classes.searchBox} label="Type in your summoner..." variant="filled" fullWidth size="small" value={userName} onChange={handleChange} onFocus={() => setIsFocus(true)} />
            </form>
            <div style={isFocus ? { display: "flex", justifyContent: "left", marginTop: "25px", flexWrap: "wrap" } : { display: "none" }}>
              {userList.map((el) => (
                <Link href={`/summoner?userName=${el}`}>
                  <Typography variant="body1" style={{ cursor: "pointer", flexBasis: "33%" }}>
                    {el}
                  </Typography>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
