//
//
// const path = require('path');
// const express = require('express');
// const app = express();
// const port = process.env.PORT || 3000;
//
// const publicPath = path.join(__dirname, '..', '/public');
// app.use(express.static(publicPath));
//
// app.get('*', (req, res) => {
//     res.sendFile(path.join(publicPath, 'index.html'));
// });
//
// // Declare static folder to be served. It contains the JavaScript code, images, CSS, etc.
// // app.use(express.static('../build'));
// //
// // // Serve the index.html for all the other requests so that the
// // // router in the JavaScript application can render the necessary components
// // app.get('*', function(req, res){
// //     res.sendFile(path.join(__dirname + '/../build/index.html'));
// //     //__dirname : It will resolve to your project folder.
// // });
//
// app.listen(port, () => {
//     console.log(`Server is up on port ${port}!`);
// });
//
//
//
