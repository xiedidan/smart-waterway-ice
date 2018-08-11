export const BACKEND_BASE_URL = 'http://piecent.com:5050';
export const PUBLIC_BASE_URL = 'http://piecent.com';
export const API_VERSION = 'v1.0';

export const ION_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMTJhMjVkMC02OGQ3LTQ4YTktYTQ5Mi03MjE3YTQ0ZDY2YjEiLCJpZCI6NzM3LCJpYXQiOjE1MjU3MDQyMDB9.Q4_Y7b56tB2B3DobcvFSlMhymZuTWrFOHu-v-z6eBs4';
export const BING_MAPS_KEY = 'ApI-oj--b2GLuTrhgfWkF9AioGopwJO9iq5lB-VEmc9okO9b0tjkOZX0a79YBHuv';
export const MAP_BOX_TOKEN = 'pk.eyJ1IjoieGllZGlkYW4iLCJhIjoiY2pnd2Q1a21yMDR4ODJ3bnc5ajBjMWhncSJ9.nlz7YNgxxaHEhzR947lMpw';

export const ENTITY_REFRESH_INTERVAL = 1000;

export const BILLBOARD_WIDTH = 64;
export const BILLBOARD_HEIGHT = 64;
export const BILLBOARD_ICONS = {
    MARKER: `${PUBLIC_BASE_URL}/images/icons/marker.png`,
    HYDROLOGY: `${PUBLIC_BASE_URL}/images/icons/hydrology.png`,
    WEATHER: `${PUBLIC_BASE_URL}/images/icons/weather`,
    SHIP: `${PUBLIC_BASE_URL}/images/icons/ship.png`,
    DOCUMENT: `${PUBLIC_BASE_URL}/images/icons/document`,
    INFO: `${PUBLIC_BASE_URL}/images/icons/position/3.png`,
};

export const ENTITY_TYPES = {
    UNKNOWN: 0,
    MARKER: 1,
    HYDROLOGY: 2,
    WEATHER: 3,
    SHIP: 4,
    DOCUMENT: 5,
    INFO: 6,
};

export const WEATHER = {
    SUNNY: 0,
    CLOUDY: 1,
    OVERCAST: 2,
    MIST: 3,
    FOG: 4,
    RAIN: 5,
    SHOWER: 6,
    STORM: 7,
    SNOW: 8,
    SLEET: 9,
    HAIL: 10,
};

export const WEATHER_ICON_SET = 1;

export const LABEL_FLOAT_DIGIT_COUNT = 1;

export const DOCUMENT_DESIGN_URL = `${PUBLIC_BASE_URL}/documents/design`;
export const DOCUMENT_SNAPSHOT_URL = `${PUBLIC_BASE_URL}/documents/snapshot`;
export const DOCUMENT_ICON_BASE_URL = `${PUBLIC_BASE_URL}/images/icons/document`;
