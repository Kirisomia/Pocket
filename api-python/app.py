from flask import Flask, jsonify, request
import mysql.connector
import json

mydb = mysql.connector.connect(
    host = "127.0.0.1",
    user = "root",
    password = "0129",
    database = "pocket",
)
mydb.autocommit = True

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/getusers")
def get_users():
    mycursor = mydb.cursor(dictionary=True)
    mycursor.execute("call getUsers()") 
    myresult = mycursor.fetchall()
    mycursor.close()
    return jsonify(myresult)

@app.route("/gettransactions/<userid>")
def get_transactions(userid):
    sql = "call getTransactions(%s)"
    val = (userid,)
    mycursor = mydb.cursor(dictionary=True)
    mycursor.execute(sql, val)
    myresult = mycursor.fetchall()
    mycursor.close()
    return jsonify(myresult)

@app.route("/adduser/<name>/<dob>/<bal>", methods=['GET','POST'])
def add_user(name, dob, bal):
    sql = "SELECT addUser(%s, %s, %s) as usr"
    if request.method == 'POST':
        name = request.get_json()['name']   
        dob = request.get_json()['dob']
        bal = request.get_json()['bal']
    val = (name, dob, bal)
    mycursor = mydb.cursor(dictionary=True)
    mycursor.execute(sql, val)
    myresult = mycursor.fetchall()
    mycursor.close()
    return myresult

@app.route("/updateuser/<id>/<name>/<dob>/<bal>", methods=['GET','POST'])
def update_user(id, name, dob, bal):
    sql = "SELECT updateUser(%s, %s, %s, %s) as usr"
    if request.method == 'POST':
        id = request.get_json()['id']
        name = request.get_json()['name']   
        dob = request.get_json()['dob']
        bal = request.get_json()['bal']
    val = (id, name, dob, bal)
    mycursor = mydb.cursor(dictionary=True)
    mycursor.execute(sql, val)
    myresult = mycursor.fetchall()
    mycursor.close()
    return myresult

@app.route("/deleteuser/<id>", methods=['GET','POST'])
def delete_user(id):
    sql = "SELECT deleteUser(%s) as usr"
    if request.method == 'POST':
        id = request.get_json()['id']
    val = (id,)
    mycursor = mydb.cursor(dictionary=True)
    mycursor.execute(sql, val)
    myresult = mycursor.fetchall()
    mycursor.close()
    return myresult

@app.route("/addtransaction/<id>/<value>/<date>/<category>/<notes>/<fromto>/<isreceived>", methods=['GET','POST'])
def add_transaction(id, value, date, category, notes, fromto, isreceived):
    sql = "SELECT addTransaction(%s, %s, %s, %s, %s, %s, %s) as usr"
    if request.method == 'POST':
        id = request.get_json()['id']
        value = request.get_json()['value']
        date = request.get_json()['date']
        category = request.get_json()['category']
        notes = request.get_json()['notes']
        fromto = request.get_json()['fromto']
        isreceived = request.get_json()['isreceived']
    val = (id, value, date, category, notes, fromto, isreceived)
    mycursor = mydb.cursor(dictionary=True)
    mycursor.execute(sql, val)
    myresult = mycursor.fetchall()
    mycursor.close()
    return myresult

@app.route("/updatetransaction/<id>/<userid>/<value>/<date>/<category>/<notes>/<fromto>/<isreceived>", methods=['GET','POST'])
def update_transaction(id, userid, value, date, category, notes, fromto, isreceived):
    sql = "SELECT updateTransaction(%s, %s, %s, %s, %s, %s, %s, %s) as usr"
    if request.method == 'POST':
        id = request.get_json()['id']
        userid = request.get_json()['userid']
        value = request.get_json()['value']
        date = request.get_json()['date']
        category = request.get_json()['category']
        notes = request.get_json()['notes']
        fromto = request.get_json()['fromto']
        isreceived = request.get_json()['isreceived']
    val = (id, userid, value, date, category, notes, fromto, isreceived)
    mycursor = mydb.cursor(dictionary=True)
    mycursor.execute(sql, val)
    myresult = mycursor.fetchall()
    mycursor.close()
    return myresult

@app.route("/deletetransaction/<id>", methods=['GET','POST'])
def delete_transaction(id):
    sql = "SELECT deleteTransaction(%s) as usr"
    if request.method == 'POST':
        id = request.get_json()['id']
    val = (id,)
    mycursor = mydb.cursor(dictionary=True)
    mycursor.execute(sql, val)
    myresult = mycursor.fetchall()
    mycursor.close()
    return myresult