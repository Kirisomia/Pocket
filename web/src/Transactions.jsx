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

async function maintainTransaction(action, oTransaction) {
  try {
    console.log(oTransaction);
    const response = await fetch(`http://localhost:3300/${action}transaction`, {
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      method: "POST",
      body: JSON.stringify(oTransaction),
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.json();
  } catch (error) {
    console.error(error.message);
  }
}

function TransactionContent() {
  const [loginUser, setLoginUser] = useState({ User_ID: 1, Name: "Daisy" });
  const [transactions, setTransactions] = useState([]);
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
    async function fetchTransactions() {
      try {
        const response = await fetch(`http://localhost:3300/gettransactions/${loginUser.User_ID}`, {
          "Content-Type": "application/json",
          mode: "cors",
          method: "GET",
        });
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json();
        data.map((transaction) => (transaction.selected = false));
        setTransactions(data);
      } catch (error) {
        console.error(error.message);
      }
    }
    fetchTransactions();
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
              transactions.map(
                (transaction) => (transaction.selected = false)
              );
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
                  const delTrns = transactions.find((t) => t.selected === true);
                  maintainTransaction(action, { id: delTrns.Transaction_ID });
                  handleClose();
                  return;
                } else if (action === "add") {
                  const value = formJson.value;
                  const date = formJson.date;
                  const category = formJson.category;
                  const notes = formJson.notes;
                  const fromTo = formJson.fromTo;
                  const isReceived = formJson.isReceived;
                  const newTrns = {
                    id: loginUser.User_ID,
                    value: value,
                    date: date,
                    category: category,
                    notes: notes,
                    fromTo: fromTo,
                    isReceived: isReceived,
                  };
                  maintainTransaction(action, newTrns);
                  handleClose();
                } else if (action === "update") {
                  const selTrns = transactions.find((t) => t.selected === true);
                  const value = formJson.value;
                  const date = formJson.date;
                  const category = formJson.category;
                  const notes = formJson.notes;
                  const fromTo = formJson.fromTo;
                  const isReceived = formJson.isReceived;
                  const updTrns = {
                    id: selTrns.Transaction_ID,
                    userid: loginUser.User_ID,
                    value: value,
                    date: date,
                    category: category,
                    notes: notes,
                    fromTo: fromTo,
                    isReceived: isReceived,
                  };
                  maintainTransaction(action, updTrns);
                  handleClose();
                }
              },
            }}
          >
            <DialogTitle>
              {action === "add"
                ? "Add New Transaction"
                : action === "update"
                  ? "Update Transaction"
                  : "Delete Transaction"}
            </DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                required
                margin="dense"
                id="value"
                name="value"
                label="Value"
                type="value"
                defaultValue={
                  transactions.length > 0 && idx >= 0
                    ? transactions[idx].Value
                    : ""
                }
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                required
                margin="dense"
                id="date"
                name="date"
                label="Date (YYYY-MM-DD)"
                type="value"
                defaultValue={
                  transactions.length > 0 && idx >= 0
                    ? transactions[idx].Date
                    : ""
                }
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                required
                margin="dense"
                id="category"
                name="category"
                label="Category"
                type="value"
                defaultValue={
                  transactions.length > 0 && idx >= 0
                    ? transactions[idx].Category
                    : ""
                }
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                required
                margin="dense"
                id="notes"
                name="notes"
                label="Notes"
                type="value"
                defaultValue={
                  transactions.length > 0 && idx >= 0
                    ? transactions[idx].Notes
                    : ""
                }
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                required
                margin="dense"
                id="fromTo"
                name="fromTo"
                label="From/To"
                type="value"
                defaultValue={
                  transactions.length > 0 && idx >= 0
                    ? transactions[idx].FromTo
                    : ""
                }
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                required
                margin="dense"
                id="isReceived"
                name="isReceived"
                label="Receiving or Sending"
                type="value"
                defaultValue={
                  transactions.length > 0 && idx >= 0
                    ? transactions[idx].Is_Received
                    : ""
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
              <TableCell>Transaction ID</TableCell>
              <TableCell align="right">Value</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Category</TableCell>
              <TableCell align="right">Notes</TableCell>
              <TableCell align="right">From/To</TableCell>
              <TableCell align="right">Received or Sent</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow
                key={transaction.Transaction_ID}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  <Checkbox
                    color="primary"
                    checked={transaction.selected}
                    onClick={() => {
                      transactions.map(
                        (transaction) => (transaction.selected = false)
                      );
                      const x = transactions.find(
                        (t) => t.Transaction_ID === transaction.Transaction_ID
                      );
                      x.selected = !x.selected;
                      setIdx(
                        transactions.findIndex(
                          (t) => t.Transaction_ID === transaction.Transaction_ID
                        )
                      );
                    }}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  {transaction.Transaction_ID}
                </TableCell>
                <TableCell align="right">{transaction.Value}</TableCell>
                <TableCell align="right">{transaction.Date}</TableCell>
                <TableCell align="right">{transaction.Category}</TableCell>
                <TableCell align="right">{transaction.Notes}</TableCell>
                <TableCell align="right">{transaction.FromTo}</TableCell>
                <TableCell align="right">{transaction.Is_Received}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
export default TransactionContent;
