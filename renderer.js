// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const { ipcRenderer } = require('electron')

let waitingForIp = true
setInterval(() => {
	if (waitingForIp) {
		ipcRenderer.send('getAddress')
	}
}, 500)
ipcRenderer.on('address', (event, arg) => {
	waitingForIp = false
	document.getElementById('publicAddress').innerHTML = arg.public
	document.getElementById('localAddress').innerHTML = arg.local
})

ipcRenderer.send('getConfigs')
ipcRenderer.on('configs', (event, arg) => {
	document.getElementById('maxPlayers').innerHTML = arg.max_players
})

setInterval(() => {
	ipcRenderer.send('getPlayers')
}, 100)
ipcRenderer.on('players', (event, arg) => {
	document.getElementById('numPlayers').innerHTML = arg.length

	const players = document.getElementById('players')
	players.innerHTML = ''

	arg.forEach((element) => {
		const id = document.createElement('td')
		id.innerHTML = element.id

		const name = document.createElement('td')
		name.innerHTML = element.character.name

		const ip = document.createElement('td')
		ip.innerHTML = element.ip

		const ping = document.createElement('td')
		ping.innerHTML = ''

		const row = document.createElement('tr')
		row.appendChild(id)
		row.appendChild(name)
		row.appendChild(ip)
		row.appendChild(ping)

		players.appendChild(row)
	})
})

document.getElementById('btnExit').addEventListener('click', () => {
	ipcRenderer.send('exit')
})
