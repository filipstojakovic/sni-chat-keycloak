# Chat App Project

## Overview

This project is a multi-server chat application designed to provide a secure and efficient messaging platform. The architecture involves multiple servers, each responsible for handling a part of the encrypted message. Additionally, the project implements a Single Sign-On (SSO) approach for user authorization using Keycloak. The messaging system relies on AMQP (Advanced Message Queuing Protocol) to efficiently route messages between servers.

## Technologies Used

- **Frontend:** Angular
- **Backend:** Spring Boot
- **Middleware:** Node.js
- **Authorization Server:** Keycloak (**Dockerized**)
- **Message Queue:** AMQP (**Dockerized**)

## Features

1. **Multi-Server Architecture:** The application is designed to distribute the workload among multiple servers. Server logic is implemented using **Spring Boot**. Used for getting encrypted message parts and forwarding message to the correct recipient.

2. **Encrypted Messaging:** Messages are encrypted and distributed across multiple servers, enhancing security and privacy for users.

3. **Single Sign-On (SSO):** Keycloak is used as the authorization server to implement a Single Sign-On approach, providing a seamless and secure login experience for users.

4. **Message Queue (AMQP):** AMQP serves as the message queue, responsible for routing messages to the corresponding servers based on the message channel ID. This ensures efficient and reliable message delivery. All users listen to their own queue for new messages.

5. **Angular Frontend:** The frontend of the application is developed using Angular, providing a semi modern user interface. Messages are encrypted on this client application before transmission and are reassembled upon receipt of new messages.

6. **Node.js:** Node.js acts as middleware, facilitating communication between the Angular frontend and the AMQP message queue.
