//written by Bubble
const Command = require('command');

module.exports = function EventMobFinder(dispatch) {
	const command = Command(dispatch);
	let enabled = true;
	npcs = [];
	
	command.add('eventmob', () => {
		enabled = !enabled;
		command.message('Level bot '+(enabled?'enabled':'disabled')+'.');
	});
	
	dispatch.hook('S_SPAWN_NPC', 7, event => {
		if(event.unk20<<24>>24 === 1) {
			dispatch.toClient('S_SPAWN_DROPITEM', 6, {
				gameId: {low:event.gameId.low,high:0,unsigned:true},
				loc: event.loc,
				item: 98260,
				amount: 1,
				expiry: 300000,
				explode:false,
				masterwork:false,
				enchant:0,
				source:0,
				debug:false,
				owners: [{id: 0}]
			});
			npcs[event.gameId] = event;
			notice();
			command.message('Found event mob.');
		}
	});
	
	dispatch.hook('S_DESPAWN_NPC', 3, event => {
		if(npcs[event.gameId]) {
			dispatch.toClient('S_DESPAWN_DROPITEM', 1, {id:{low:event.gameId.low,high:0,unsigned:true}} );
			delete npcs[event.gameId];
		}
	});
	
	function notice() {
		dispatch.toClient('S_DUNGEON_EVENT_MESSAGE', 1, {
            unk1: 2,
            unk2: 0,
            unk3: 0,
            message: 'Found event mob.'
        });
    }
};