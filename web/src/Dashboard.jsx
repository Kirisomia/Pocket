import React from "react";
import { useState, useEffect } from "react";
import FormDialog from "./UserDialog";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Checkbox from "@mui/material/Checkbox";

async function maintainUser(action, oUser) {
  try {
    const response = await fetch(`http://localhost:3300/${action}user`, {
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      method: "POST",
      body: JSON.stringify(oUser),
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.json();
  } catch (error) {
    console.error(error.message);
  }
}

function MainContent() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [idx, setIdx] = useState(-1);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("http://localhost:3300/getusers", {
          "Content-Type": "application/json",
          mode: "cors",
          method: "GET",
        });
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json();
        data.map((user) => (user.selected = false));
        setUsers(data);
      } catch (error) {
        console.error(error.message);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div class="page">
      <Toolbar>
        <Stack spacing={2} direction="row">
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              setAction("add");
              setIdx(-1);
              users.map((user) => (user.selected = false));
              handleClickOpen();
            }}
          >
            Add
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
              component: "form",
              onSubmit: (event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const formJson = Object.fromEntries(formData.entries());
                if (action === "delete") {
                  const delUser = users.find((u) => u.selected === true);
                  maintainUser(action, { id: delUser.User_ID });
                  handleClose();
                  return;
                } else if (action === "add") {
                  const name = formJson.name;
                  const dob = formJson.dob;
                  const bal = formJson.bal;
                  const newUser = { name: name, dob: dob, bal: bal };
                  maintainUser(action, newUser);
                  handleClose();
                } else if (action === "update") {
                  const selUser = users.find((u) => u.selected === true);
                  const name = formJson.name;
                  const dob = formJson.dob;
                  const bal = formJson.bal;
                  const updUser = {
                    id: selUser.User_ID,
                    name: name,
                    dob: dob,
                    bal: bal,
                  };
                  maintainUser(action, updUser);
                  handleClose();
                }
              },
            }}
          >
            <DialogTitle>
              {action === "add"
                ? "Add New User"
                : action === "update"
                  ? "Update User"
                  : "Delete User"}
            </DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                required
                margin="dense"
                id="name"
                name="name"
                label="Name"
                type="name"
                defaultValue={
                  users.length > 0 && idx >= 0 ? users[idx].Name : ""
                }
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                required
                margin="dense"
                id="dob"
                name="dob"
                label="Date of Birth"
                type="dob"
                defaultValue={
                  users.length > 0 && idx >= 0 ? users[idx].DOB : ""
                }
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                required
                margin="dense"
                id="bal"
                name="bal"
                label="Starting Balance"
                type="bal"
                defaultValue={
                  users.length > 0 && idx >= 0 ? users[idx].Curr_Bal : ""
                }
                fullWidth
                variant="standard"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit">Submit</Button>
            </DialogActions>
          </Dialog> 
          <Button
            color="primary"
            variant="contained"
            disabled={idx === -1}
            onClick={() => {
              setAction("update");
              handleClickOpen();
            }}
          >
            Update
          </Button>
          <Button
            color="primary"
            variant="contained"
            disabled={idx === -1}
            onClick={() => {
              setAction("delete");
              handleClickOpen();
            }}
          >
            Delete
          </Button>
        </Stack>
      </Toolbar>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>User</TableCell>
              <TableCell align="right">ID</TableCell>
              <TableCell align="right">DOB</TableCell>
              <TableCell align="right">Current Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.User_ID}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  <Checkbox
                    color="primary"
                    checked={user.selected}
                    onClick={() => {
                      users.map((user) => (user.selected = false));
                      const x = users.find((u) => u.User_ID === user.User_ID);
                      x.selected = !x.selected;
                      setIdx(
                        users.findIndex((u) => u.User_ID === user.User_ID)
                      );
                    }}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  {user.Name}
                </TableCell>
                <TableCell align="right">{user.User_ID}</TableCell>
                <TableCell align="right">{user.DOB}</TableCell>
                <TableCell align="right">{user.Curr_Bal}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
export default MainContent;
