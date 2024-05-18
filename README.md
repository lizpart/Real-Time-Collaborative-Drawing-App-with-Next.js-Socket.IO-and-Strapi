# Real-Time Collaborative Drawing App

This is a real-time collaborative drawing application built with Next.js, React, Socket.IO, and Strapi. It allows multiple users to draw simultaneously on a shared canvas, with the canvas state being synchronized in real-time through Socket.IO communication. Additionally, users can save their canvas drawings as images to a Strapi backend.

## Features

- Real-time collaborative drawing with canvas state synchronization
- Color picker for selecting drawing colors
- Clear canvas button
- Save canvas image to Strapi backend
- Responsive and user-friendly interface

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework for building server-rendered and static websites
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [Socket.IO](https://socket.io/) - Library for real-time, bidirectional, and event-based communication
- [Strapi](https://strapi.io/) - Headless CMS for managing and storing canvas image data
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework for styling

## Getting Started

1. Clone the repository:

```
git clone https://github.com/lizpart/Real-Time-Collaborative-Drawing-App-with-Next.js-Socket.IO-and-Strapi.git
```

2. Install dependencies for the client and server:

```
cd client
npm install

cd ../server
npm install
```

3. Start the development servers:

```
# Start the Next.js client
cd client
npm run dev || yarn dev

# Start the Socket.IO server (in a new terminal)
cd ../server
npm start  || yarn server
```

4. Open your browser and navigate to `http://localhost:3000` to access the drawing application.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
