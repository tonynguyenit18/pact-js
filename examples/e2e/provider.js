const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Repository = require('./repository');

const server = express();
server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));

// Load data into a repository
const animalRepository = new Repository();
const data = require('./data/animalData.json');
data.reduce( (a, v) => {
	v.id = a + 1;
	animalRepository.insert(v);
	return a + 1;
}, 0);

// Suggestions function:
// Given availability and sex, find available suitors...
const availableAnimals = () => {
	return animalRepository.fetchAll().filter(a => {
		return a.eligibility.available
	});
}

// Get all animals
server.get('/animals', (req, res) => {
	res.json(animalRepository.fetchAll());
});

// Get all animals
server.get('/animals/available', (req, res) => {
	res.json(availableAnimals());
});

// Find an animal by ID
server.get('/animals/:id', (req, res) => {
	const response = animalRepository.getById(req.params.id);
	if (response) {
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(JSON.stringify(response));
	} else {
		res.writeHead(404);
		res.end();
	}
});

// Register a new Animal for the service
server.post('/animals', (req, res) => {
	const animal = req.body;

	// Really basic validation
	if (!animal || !animal.first_name) {
		res.writeHead(400);
		res.end();

		return;
	}

	animal.id = animalRepository.fetchAll().length;;
	animalRepository.insert(animal);

	res.writeHead(200);
	res.end();
});

module.exports = server;
