# Hello!

**Hello I am Christeller(_PAPTO_) aka LivingGhost.**
This is my first javascript project, A slick todo app, its a web app and it offer basic functionality it's a combination of frontend apis and a 100 line nodejs (Express) backend a task.json, I am still working on my mongodb setup so I will intergate it as well to this project. But right now this are the features it have got:

# Todo App Features:

- It's build using html,css, javascript nothing more so it's a vanilla js application
- Most noticeable features of the app is adding a task, deleting a task and marking a task when done.
- Also the navigation which filter done and undone tasks.
- Then under the wood the app keeps the data both on the server and on the client.
- on the client the data is kept in the localStorage using the localStorage API:

```javascript
localStorage.getItem(key); //to get tasks
localStorage.setItem(key, vaue); //to set item
localStorage.clear(); //to clear the storage
```

- on the server the data is kept in the json files using the fileSystem node api
- if the server is down or the client is offline the data is kept to the client and it will be updated once the server is up or the client is online but it happen only if the user didn't refresh the page, will improve there!!!
- the client use the eventSource api to detect when the server is up and it checks for an activities which happenned when the user was offline, update the data and keep the user in sync.

# How to Install:

All the files of the todo app are in one file although it is not safe security wise the app is too small to separate files so in the root directory we got the file _server.js_ which is self explanatory it's the server file and we got the _package.json_ file which is where the dependencies resides, so how to get you running first clone this repository:

```bash
$ git clone https://github.com/living23Ghost/todo-app
```

then navigate into the directory of the app:

```bash
$ cd todo-app
$ npm install
$ npm start
```

**npm install** will install all the required modules
**npm start** will start the application and if everything went well a console will display:

```bash
server now running on port 3000
```

The app may fail to start maybe because of dependencies, your node version or there is other application running on that port, if its dependencies issue you can run _npm install_ once again, if it's node version, you can upgrade to the next version or better the latest version, if the port is in use you can change the port in the application or run it with your preferred port like so:

```bash
node server.js 1337
```

here **1337** is the port number your server will run on.

## This project is lisenced under MIT Licence

So that's it guys, happy coding, don't forget to star this project if you happen to like my projects, I have more coming you way, **Thank You**

# You can find me on:

- **[Github](https://github.com/living23Ghost)**
- **[Website](http://christellerzwe.co.zw)** you can find more links to connect with me.

# Once Again Thank You
