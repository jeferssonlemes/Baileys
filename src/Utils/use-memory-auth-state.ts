import { proto } from '../../WAProto'
import type { AuthenticationCreds, AuthenticationState, SignalDataTypeMap } from '../Types'
import { initAuthCreds } from './auth-utils'
import { BufferJSON } from './generics'

// useless key map only there to maintain backwards compatibility
// do not use in your own systems please
const KEY_MAP: { [T in keyof SignalDataTypeMap]: string } = {
	'pre-key': 'preKeys',
	'session': 'sessions',
	'sender-key': 'senderKeys',
	'app-state-sync-key': 'appStateSyncKeys',
	'app-state-sync-version': 'appStateVersions',
	'sender-key-memory': 'senderKeyMemory'
}

/** stores the full authentication state in memory */
export const  useMemoryAuthState = (stateString) : { state: AuthenticationState, getStringAuthState: () => void } => {
    let stateRestored = false;
    let creds;
    let keys: any = { }

    const getStringAuthState = () => {
        return JSON.stringify({ creds, keys }, BufferJSON.replacer, 2);
    };

    if (!!stateString) {
        try {
            const result = JSON.parse(stateString, BufferJSON.reviver);
            creds = result.creds;
            keys = result.keys;
            stateRestored = true;
        } catch (error) {
            console.log('Erro na tentativa de desserializar as credenciais')
        }
    }

    if (!stateRestored) {
        creds = initAuthCreds();
        keys = {};
    }

    return {
        state: {
            creds,
            keys: {
                get: (type, ids) => {
					const key = KEY_MAP[type]
					return ids.reduce(
						(dict, id) => {
							let value = keys[key]?.[id]
							if(value) {
								if(type === 'app-state-sync-key') {
									value = proto.Message.AppStateSyncKeyData.fromObject(value)
								}

								dict[id] = value
							}

							return dict
						}, { }
					)
				},
                set: (data) => {
					for(const _key in data) {
						const key = KEY_MAP[_key as keyof SignalDataTypeMap]
						keys[key] = keys[key] || { }
						Object.assign(keys[key], data[_key])
					}
				}
            }
        },
        getStringAuthState
    };
}