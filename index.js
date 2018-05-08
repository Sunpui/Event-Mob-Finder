//written by Bubble
const Command = require('command');

module.exports = function EventMobFinder(dispatch) {
	const command = Command(dispatch);
	let enabled = true;
	
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
			notice();
			command.message('Found event mob.');
		}
	});
	
	dispatch.hook('S_DESPAWN_NPC', 3, event => {
		dispatch.toClient('S_DESPAWN_DROPITEM', 1, {id:{low:event.gameId.low,high:0,unsigned:true}} );
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