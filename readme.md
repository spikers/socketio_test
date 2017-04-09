# Socket.IO Sample Implementation # 
Please see: https://socket.io/ for documentation

This is an example implementation of PRIVATE CHAT. This only has one room, so I guess it's normal chat.

To run this server, do this:
1. Open up your terminal to this directory
2. `npm install` to install dependencies
3. `node server.js` 
4. Navigate to `http://localhost:8000/chat.html` 
5. Write in chat messages

If you want to change the name/room, it's not so bad. Just know how sockets work.

Just a heads up about **private** chat:
You must **exit** any room when you join another room for **private** chat.  If you want to make a Slack ripoff, join a room, then force leave a new one. Otherwise, all messages get mixed together. Enjoy!

