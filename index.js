//written by Bubble
const Command = require('command');

module.exports = function EventMobFinder(dispatch) {
	const command = Command(dispatch);
	let enabled = true;
	let npcs = [];
	
	command.add('eventmob', () => {
		enabled = !enabled;
		command.message('Event mob finder '+(enabled?'enabled':'disabled')+'.');
	});
	
	dispatch.hook('S_SPAWN_NPC', 8, event => {
		if((event.unk20&0xFF) === 1) {
			npcs[Number(event.gameId)] = event;
			var source;
			if (dispatch.base.proxyAuthor == "caali") {
				event.gameId = {low:event.gameId.low, high:0, unsigned:true};
				source = 0;
			} else {
				event.gameId = event.gameId & BigInt(0xFFFF);
				source = BigInt(0);
			}
			dispatch.toClient('S_SPAWN_DROPITEM', 6, {
				gameId: event.gameId,
				loc: event.loc,
				item: 98260,
				amount: 1,
				expiry: 30000,
				explode: false,
				masterwork: false,
				enchant: 0,
				source: source,
				debug: false,
				owners: [{id: 0}]
			});
			notice();
			command.message('Found event mob.');
		}
	});
	
	dispatch.hook('S_DESPAWN_NPC', 3, event => {
		if(npcs[Number(event.gameId)]) {
			dispatch.toClient('S_DESPAWN_DROPITEM', 1, {id:npcs[event.gameId].gameId} );
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