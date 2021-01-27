from flask import Flask, send_from_directory, jsonify, request, make_response

app = Flask(__name__)


@app.route('/')
def send_html():
    return app.send_static_file('users.html')


@app.route('/css/<file>')
def send_css(file):
    return app.send_static_file('css/' + file)


@app.route('/js/<file>')
def send_js(file):
    return app.send_static_file('js/' + file)


@app.route('/api/users', methods=["GET"])
def send_users():
    pageNo = int(request.args["page"]) - 1
    userSlice = users_list[pageNo * 6:(pageNo + 1) * 6]

    return jsonify({"per_page": 6,
                    "page": pageNo + 1,
                    "total": len(users_list),
                    "total_pages": (len(users_list) + 5) // 6,
                    "data": userSlice})


@app.route('/api/users/<user_Id>', methods=["GET"])
def send_user(user_Id):
    userIdInt = int(user_Id) - 1
    if userIdInt < len(users_list):
        user = users_list[userIdInt]
        return jsonify(user)
    else:
        return "missing user", 404


@app.route('/api/users/<user_Id>', methods=["POST"])
def create_user(user_Id):
    user = request.get_json(user_Id)
    email = user['email']
    first_name = user['first_name']
    last_name = user['last_name']
    avatar = user['avatar']

    userData = ({"id": len(users_list) + 1,
                 "email": email,
                 "first_name": first_name,
                 "last_name": last_name,
                 "avatar": avatar})
    users_list.append(userData)

    return make_response("USER CREATED", 201)


@app.route('/api/users/<user_Id>', methods=["PUT"])
def update_user(user_Id):
    user = request.get_json(user_Id)
    userID = user["id"]
    email = user['email']
    first_name = user['first_name']
    last_name = user['last_name']
    avatar = user['avatar']

    userData = ({"id": userID,
                 "email": email,
                 "first_name": first_name,
                 "last_name": last_name,
                 "avatar": avatar})

    for i in users_list:
        if i["avatar"] == userData["avatar"]:
            i["id"] = userData["id"]
            i["email"] = userData["email"]
            i["first_name"] = userData["first_name"]
            i["last_name"] = userData["last_name"]

    return make_response("USER UPDATED", 200)


@app.route('/api/users/<user_Id>', methods=["DELETE"])
def delete_user(user_Id):
    user = request.get_json(user_Id)
    userID = user["id"]
    email = user['email']
    first_name = user['first_name']
    last_name = user['last_name']
    avatar = user['avatar']

    userData = ({"id": userID,
                 "email": email,
                 "first_name": first_name,
                 "last_name": last_name,
                 "avatar": avatar})

    for i in range(len(users_list)):
        if users_list[i]["avatar"] == userData["avatar"]:
            del users_list[i]
            break

    return make_response("USER DELETED", 204)


# i did the delete user based on the users avatar because that doesnt change. I would have done it based on the id but it can be changed and that wouldnt make it unique.

users_list = [{"id": 1,
               "email": "george.bluth@reqres.in",
               "first_name": "George",
               "last_name": "Bluth",
               "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/calebogden/128.jpg"},
              {"id": 2,
               "email": "janet.weaver@reqres.in",
               "first_name": "Janet",
               "last_name": "Weaver",
               "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg"},
              {"id": 3,
               "email": "emma.wong@reqres.in",
               "first_name": "Emma",
               "last_name": "Wong",
               "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/olegpogodaev/128.jpg"},
              {"id": 4,
               "email": "eve.holt@reqres.in",
               "first_name": "Eve",
               "last_name": "Holt",
               "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/marcoramires/128.jpg"},
              {"id": 5,
               "email": "charles.morris@reqres.in",
               "first_name": "Charles",
               "last_name": "Morris",
               "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/stephenmoon/128.jpg"},
              {"id": 6,
               "email": "tracey.ramos@reqres.in",
               "first_name": "Tracey",
               "last_name": "Ramos",
               "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/bigmancho/128.jpg"},
              {"id": 7,
               "email": "michael.lawson@reqres.in",
               "first_name": "Michael",
               "last_name": "Lawson",
               "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/follettkyle/128.jpg"},
              {"id": 8,
               "email": "lindsay.ferguson@reqres.in",
               "first_name": "Lindsay",
               "last_name": "Ferguson",
               "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/araa3185/128.jpg"},
              {"id": 9,
               "email": "tobias.funke@reqres.in",
               "first_name": "Tobias",
               "last_name": "Funke",
               "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/vivekprvr/128.jpg"},
              {"id": 10,
               "email": "byron.fields@reqres.in",
               "first_name": "Byron",
               "last_name": "Fields",
               "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/russoedu/128.jpg"},
              {"id": 11,
               "email": "george.edwards@reqres.in",
               "first_name": "George",
               "last_name": "Edwards",
               "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/mrmoiree/128.jpg"},
              {"id": 12,
               "email": "rachel.howell@reqres.in",
               "first_name": "Rachel",
               "last_name": "Howell",
               "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/hebertialmeida/128.jpg"}]

if __name__ == '__main__':
    app.run()
