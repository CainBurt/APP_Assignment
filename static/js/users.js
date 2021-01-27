/*-------------------------------------------------GET USERS---------------------------------------------------------*/
//requests the users data when the next button is clicked
function getUsers(pageNumber){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/users?page=" + String(pageNumber), true);
    xhr.onload = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            var objUsers = JSON.parse(xhr.responseText);
                renderUsers(objUsers);
        }
        else{
            alert("ERROR" + xhr.status);
        }
    };
    xhr.send();
};

//adds the getUsers function to the next and previous button press
var currentPage = 1
document.getElementById('btnNext').addEventListener('click', function(e){
    getUsers(currentPage = currentPage + 1);
    console.log(document.getElementById("tblUsers"))
});
document.getElementById('btnPrevious').addEventListener('click', function(e){
    getUsers(currentPage = currentPage - 1);
});

//renders the users data on the page
function renderUsers(objUsers){

    //changes the page number on the html
    var pageNum = document.getElementById("pageNumber");
    pageNum.innerText = objUsers.page;

    //gets the table and deletes all the rows apart from the first
    var tableBody = document.getElementById("tblUsers").getElementsByTagName('tbody')[0];
    while(tableBody.rows.length > 1){
        tableBody.deleteRow(1);
    };

    //adds each element of the object to each cell in the table
    for(var i = 0; i< objUsers.data.length; i++){
        var row = 
        `<tr><td>${objUsers.data[i].id}</td>
        <td>${objUsers.data[i].email}</td>
        <td>${objUsers.data[i].first_name}</td>
        <td>${objUsers.data[i].last_name}</td>
        <td>${'<img src = "'+objUsers.data[i].avatar+'"></img>'}</td></tr>`;
        tableBody.innerHTML += row;
    };
};
/*--------------------------------------------GET SINGLE USER----------------------------------------------------*/
//requests the single user data when a table row is clicked
function getUser(userNumber){
    if(pageNumber.textContent == 2){                                 //if the page number is 2, add 6 to the row number
        userNumber = userNumber + 6
    }
    else if(pageNumber.textContent == 3){                           //if the page number is 3, add 12 to the row number
        userNumber = userNumber + 12
    }
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/users/" + String(userNumber), true);
    xhr.onload = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            var objUser = JSON.parse(xhr.responseText);
                renderOneUser(objUser);
        }
        else{
            alert("ERROR" + xhr.status);
        }
    };
    xhr.send();
};

//gets the row number when clicked
function getRow(){
    var table = document.getElementById('tblUsers')
    var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    for(i=0;i<rows.length;i++){
        rows[i].onclick = function(){
            getUser(this.rowIndex)
        };
    };
};

//render one user in the User Section Boxes
function renderOneUser(objUser){
    document.getElementById("userAvatar").src = objUser["avatar"]
    document.getElementById("userID").value = objUser["id"];
    document.getElementById("userEmail").value = objUser["email"];
    document.getElementById("userFirstName").value = objUser["first_name"];
    document.getElementById("userLastName").value = objUser["last_name"];
};
/*----------------------------------------------POST A USER--------------------------------------------------------*/
document.getElementById('btnNewUser').addEventListener('click', function(e){
    createNewUser();
});

//creates a newUser object template
function newUser(id, newUserEmail, newUserFirstName, newUserLastName, newUserImage) {
    this.id = id,
    this.email = newUserEmail;
    this.first_name = newUserFirstName;
    this.last_name = newUserLastName;
    this.avatar = newUserImage;
};

//creates a new user for the post request
function createNewUser(){
    var createUserData = new newUser(
        100, //temporary id that changes in the api
        document.getElementById("newUserEmail").value,
        document.getElementById("newUserFirstName").value,
        document.getElementById("newUserLastName").value,
        document.getElementById("newUserImage").value
        );
    postUser(createUserData);
};

//sends the user to the api in json format
function postUser(createUserData){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/users/" + String(createUserData["id"]), true);
    xhr.onload = function(){
        if(xhr.readyState === 4 && xhr.status === 201){
            getUsers(currentPage) //requests the first get method again to update the table after a user is created without refreshing
        }
        else{
            alert("ERROR" + xhr.status);
        }
    }
    xhr.send(JSON.stringify(createUserData))
};

/*-------------------------------------------UPDATE A USER-----------------------------------------------------------*/
document.getElementById('btnSaveUser').addEventListener('click', function(e){
    editCurrentUser();
});

//creates a new user object from the newUser template
function editCurrentUser(){
    var editUserData = new newUser(
        document.getElementById("userID").value,
        document.getElementById("userEmail").value,
        document.getElementById("userFirstName").value,
        document.getElementById("userLastName").value,
        document.getElementById("userAvatar").src
        );
    putUser(editUserData)
};

//sends the user object to the api in json format
function putUser(editUserData){
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/api/users/" + String(document.getElementById("userID").value), true);
    xhr.onload = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            getUsers(currentPage) //requests the first get method again to update the table after a user is updated without refreshing
        }
        else{
            alert("ERROR" + xhr.status);
        }
    }
    xhr.send(JSON.stringify(editUserData))
};
/*-------------------------------------------DELETE A USER-----------------------------------------------------------*/
document.getElementById('btnDeleteUser').addEventListener('click', function(e){
    deleteCurrentUser();
});

//creates a new user object from the newUser template
function deleteCurrentUser() {
    var deleteUserData = new newUser(
        document.getElementById("userID").value,
        document.getElementById("userEmail").value,
        document.getElementById("userFirstName").value,
        document.getElementById("userLastName").value,
        document.getElementById("userAvatar").src
        );
    deleteUser(deleteUserData)
};

//sends the user object to the api in json format
function deleteUser(deleteUserData){
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/api/users/" + String(document.getElementById("userID").value), true);
    xhr.onload = function(){
        if(xhr.readyState === 4 && xhr.status === 204){
            getUsers(currentPage) //requests the first get method again to update the table after a user is deleted without refreshing
        }
        else{
            alert("ERROR" + xhr.status);
        }
    }
    xhr.send(JSON.stringify(deleteUserData))
};
