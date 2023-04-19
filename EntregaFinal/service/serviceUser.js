const os = require('os');

const getInfoUser = (req) => {
	const { username, password } = req;
	const user = { username, password };
	return user;
};

const getInfoSignup = (req) => {
	const { idEmail, username, password, name, surname, age, alias, phoneNumber, avatar } = req;
	const user = {
		idEmail,
		username,
		password,
		name,
		surname,
		age,
		alias,
		phoneNumber,
		avatar,
	};
	return user;
};

const getAllData = () => {
	const data = {
		os: process.platform,
		version: process.version,
		memory: process.memoryUsage().rss,
		path: process.execPath,
		id: process.pid,
		folder: process.cwd(),
		cpus: os.cpus().length,
	};
	return data;
};

module.exports = { getInfoUser, getInfoSignup, getAllData };
