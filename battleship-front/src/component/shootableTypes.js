/**
 * It is types which is shootable objects.
 * @type ex: {{Ship: number, properties: {1: {name: string, types: {Minelayer: number, Frigate: number, Submarine: number, Cruiser: number, AircraftCarrier: number, properties: {1: {name: string, shootableType: number, subshootableType: number}, 2: {name: string, shootableType: number, subshootableType: number}, 3: {name: string, shootableType: number, subshootableType: number}, 4: {name: string, shootableType: number, subshootableType: number}, 5: {name: string, shootableType: number, subshootableType: number}}}}}}}
 */
export const ShootableTypes = {
    Ship: 0,
    properties: {
        0: {name: "Ship"}
    }
};

export function getSubshootableEnum(shootableType) {
    switch (shootableType) {
        case ShootableTypes.Ship:
            return ShipTypes;
        default :
            return null;
    }
}

/**
 *  It is sub-type of shootable objects.
 * @type ex: {{Minelayer: number, Frigate: number, Submarine: number, Cruiser: number, AircraftCarrier: number, properties: {1: {name: string, shootableType: number, subshootableType: number}, 2: {name: string, shootableType: number, subshootableType: number}, 3: {name: string, shootableType: number, subshootableType: number}, 4: {name: string, shootableType: number, subshootableType: number}, 5: {name: string, shootableType: number, subshootableType: number}}}}
 */
export const ShipTypes = {
    Minelayer: 0,
    Frigate: 1,
    Submarine: 2,
    Cruiser: 3,
    AircraftCarrier: 4,
    properties: {
        0: {name: "Minelayer", shootableType: 1, subshootableType: 1, size:2},
        1: {name: "Frigate", shootableType: 1, subshootableType: 2, size:3},
        2: {name: "Submarine", shootableType: 1, subshootableType: 3, size:3},
        3: {name: "Cruiser", shootableType: 1, subshootableType: 4, size:4},
        4: {name: "Aircraftcarrier", shootableType: 1, subshootableType: 5, size:5}
    }
};
