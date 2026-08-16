# Watch Together

You are a senior full-stack engineer specializing in React, Node.js, Socket.IO, and WebRTC.

I want to build a 2-person watch-together web application.

Core idea

A user can:

Create a room.

Receive a unique 6-character room code.

Share that code with another person.

The second person enters the code and joins the room.

A room can contain a maximum of 2 users.

Once both users are connected, one user can click "Share Tab".

The browser should allow the user to select a Chrome/browser tab, window, or screen using navigator.mediaDevices.getDisplayMedia().

The selected screen/tab should be streamed to the second user using WebRTC.

Socket.IO should be used only for room management and WebRTC signaling (offer, answer, ICE candidates), not for transmitting the actual video stream.

Tech stack

Use:

Frontend

React

Vite

Tailwind CSS

React Router

Axios

Socket.IO Client

WebRTC APIs

Backend

Node.js

Express

Socket.IO

MongoDB + Mongoose

REST APIs for room creation/joining

WebRTC

RTCPeerConnection

getDisplayMedia()

STUN server

Explain where a TURN server should be added for production

Architecture

Use this architecture:

React Client A
     |
     | Socket.IO signaling
     |
Node/Express + Socket.IO
     |
     | Socket.IO signaling
     |
React Client B

After signaling:

Browser A  <========== WebRTC ==========>  Browser B
             Screen + Audio


The Node.js server must NOT act as the video streaming server.

Required features

Home page

Create a clean UI with:

Create Room button

Room code input

Join Room button

Create Room

When the user clicks Create Room:

Generate a unique 6-character alphanumeric code.

Create the room.

Store the room.

Redirect to /room/:roomCode.

Display the room code prominently.

Provide a copy button.

Join Room

When a user enters a room code:

Validate the room.

Reject invalid room codes.

Reject rooms that already contain 2 users.

Join the Socket.IO room.

Redirect to /room/:roomCode.

Room page

Display:

Room code

Number of connected users (1/2 or 2/2)

Share Tab button

Stop Sharing button

Video element for the remote user's stream

Mute/unmute controls if audio is implemented

Leave Room button

Connection status

Screen sharing

Implement:

navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true
});


When the user selects a tab/screen:

Add the media tracks to the RTCPeerConnection.

Create/send a WebRTC offer.

Handle the answer.

Exchange ICE candidates through Socket.IO.

Display the remote stream in a <video> element.

Detect when screen sharing stops.

Properly remove/replace tracks when sharing stops.

WebRTC signaling

Implement the complete signaling flow:

User A
  ↓
createOffer()
  ↓
setLocalDescription()
  ↓
Socket.IO → Server → User B
  ↓
setRemoteDescription()
  ↓
createAnswer()
  ↓
setLocalDescription()
  ↓
Socket.IO → Server → User A
  ↓
setRemoteDescription()


Also implement:

ICE Candidate
User A → Socket.IO → User B
User B → Socket.IO → User A


Use:

new RTCPeerConnection({
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302"
        }
    ]
});


Explain that a TURN server should be added for production reliability.

Backend structure

Use a clean structure such as:

backend/
├── src/
│   ├── controllers/
│   │   └── room.controller.js
│   ├── models/
│   │   └── Room.js
│   ├── routes/
│   │   └── room.routes.js
│   ├── socket/
│   │   └── signaling.js
│   └── server.js
└── package.json


Frontend:

frontend/
├── src/
│   ├── components/
│   │   ├── CreateRoom.jsx
│   │   ├── JoinRoom.jsx
│   │   ├── VideoPlayer.jsx
│   │   └── ShareButton.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── RoomPage.jsx
│   ├── services/
│   │   ├── api.js
│   │   └── socket.js
│   └── App.jsx
└── package.json


MongoDB

Create an appropriate Room schema.

For example, a room should contain information similar to:

roomCode
users
createdAt


Since this is currently an MVP, keep the room model simple.

Also explain whether Socket.IO room state should be kept separately from MongoDB and why.

Important requirements

I don't want a theoretical explanation only.

I want you to actually build the application step by step.

Follow this order:

Step 1

Explain the complete architecture in simple terms.

Step 2

Create the backend project and install all required dependencies.

Step 3

Implement MongoDB connection and Room model.

Step 4

Implement Create Room and Join Room REST APIs.

Step 5

Implement Socket.IO room management.

Step 6

Implement WebRTC signaling.

Step 7

Implement screen/tab sharing with getDisplayMedia().

Step 8

Connect the WebRTC stream to the remote video element.

Step 9

Add proper cleanup when:

user leaves

browser tab closes

screen sharing stops

second user disconnects

Step 10

Improve the UI using Tailwind CSS.

Step 11

Explain how to test the application using two browser windows/tabs.

Step 12

Explain how to deploy it.

Coding requirements

Use modern JavaScript.

Use ES modules consistently.

Use async/await.

Use proper error handling.

Keep frontend and backend code separate.

Don't put everything into one huge file.

Explain important code rather than explaining every obvious line.

Give complete code for each file.

Tell me exactly where each file should be created.

Include the npm commands required.

Include .env examples where necessary.

Do not skip WebRTC signaling details.

Do not use a third-party video streaming service for the MVP.

Do not use Socket.IO to transmit the video itself.

Security and production considerations

After the MVP works, explain:

HTTPS requirement for getDisplayMedia()

STUN vs TURN

Why TURN is needed

Room expiration

Room-code security

Rate limiting

Authentication

Socket disconnect handling

Scaling Socket.IO with Redis

How multiple backend instances affect Socket.IO rooms

How to prevent unauthorized users from joining rooms

Most important

Build this as a real beginner-friendly project, not as a huge enterprise application.

I want to understand what is happening.

create full app

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://see-together.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/71531567-e41d-4ee8-bf89-15a6a18713fb).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
