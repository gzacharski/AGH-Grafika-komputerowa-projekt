const express = require('express')
const app = express()
const path = require('path')

app.use(express.static(__dirname + '/public'))
app.use('/build/', express.static(path.join(__dirname, 'node_modules/three/build')));
app.use('/jsm/', express.static(path.join(__dirname, 'node_modules/three/examples/jsm')));
app.use('/jsm/loaders/FBXLoader', express.static(path.join(__dirname, 'node_modules/three/examples/jsm/loaders/FBXLoader.js')));
app.use('/cannon-es/',express.static(path.join(__dirname, 'node_modules/cannon-es')))
app.use('/modules/',express.static(path.join(__dirname, 'modules')));
app.use('/extra_libs/',express.static(path.join(__dirname, 'extra_libs')));
app.use('/models/',express.static(path.join(__dirname, 'models')));
app.use('/textures/',express.static(path.join(__dirname, 'textures')));

app.listen(3000, () =>
  console.log('Visit http://127.0.0.1:3000')
);