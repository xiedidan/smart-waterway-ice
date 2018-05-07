import _ from 'lodash';
import axios from 'axios';
import Cesium from 'cesium/Cesium';
import { Cartesian3, Color } from 'cesium/Cesium';
import * as CONSTS from '../consts';

export async function loadProjectEntitesByType(project, types) {
    // load entity and status
    try {
        const entityResp = await axios.get(
            `${CONSTS.BACKEND_BASE_URL}/api/${CONSTS.API_VERSION}/entities/load`,
            {
                params: {
                    project,
                    type: types,
                },
                withCredentials: true,
            }
        );

        if (entityResp.status === 200) {
            const entities = entityResp.data;

            if (
                entities !== undefined &&
                entities != null
            ) {
                // convert to cesium entity
                return entities.map(record2Entity);
            }
        }

        return null;
    } catch (err) {
        console.log(err.stack);

        return null;
    }
}

export async function getProjectEntity(project) {
    const position = geojson2Cartesian3(project.geo);

    const entity = {
        id: project._id.toString(),
        name: project.name,
        polygon: {
            hierarchy: position,
            height: 0,
            material: Color.WHITE.withAlpha(0.2),
            outline: true,
            outlineColor: Color.BLACK.withAlpha(0.5),
        },
        description: project.desc,
    };

    return entity;
}

export function record2Entity(record) {
    const position = geojson2Cartesian3(record.entity.location);
    const body = getBillboardBody(record);

    const entity = {
        id: record.entity._id.toString(),
        name: record.entity.name,
        position,
        ...body,
        description: record.entity.desc,
    };

    return entity;
}

export function getBillboardBody(record) {
    const label = {
        font : '14pt monospace',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth : 2,
        verticalOrigin : Cesium.VerticalOrigin.TOP,
        pixelOffset : new Cesium.Cartesian2(0, CONSTS.BILLBOARD_WIDTH / 2),
    };

    const billboard = {
        width: CONSTS.BILLBOARD_WIDTH,
        height: CONSTS.BILLBOARD_HEIGHT,
    };

    switch (record.entity.type) {
        case CONSTS.ENTITY_TYPES.MARKER:
        label.text = `${record.data.error === false ? '正常' : '异常'}/${record.data.shift === true ? '偏移' : '原位'}`;
        billboard.image = CONSTS.BILLBOARD_ICONS.MARKER;
        break;

        case CONSTS.ENTITY_TYPES.HYDROLOGY:
        label.text = `${record.data.level}米\n${record.data.rate.toFixed(CONSTS.LABEL_FLOAT_DIGIT_COUNT)}立方米/秒`;
        billboard.image = CONSTS.BILLBOARD_ICONS.HYDROLOGY;
        break;

        case CONSTS.ENTITY_TYPES.WEATHER:
        label.text = `${record.data.temperature.toFixed(CONSTS.LABEL_FLOAT_DIGIT_COUNT)}度/${record.data.humidity.toFixed(CONSTS.LABEL_FLOAT_DIGIT_COUNT)}%`;
        billboard.image = getWeatherIcon1(record);
        break;

        case CONSTS.ENTITY_TYPES.SHIP:
        label.text = `${record.data.speed.toFixed(CONSTS.LABEL_FLOAT_DIGIT_COUNT)}米/秒`;
        billboard.image = CONSTS.BILLBOARD_ICONS.SHIP;
        break;

        case CONSTS.ENTITY_TYPES.DOCUMENT:
        break;

        default:
        break;
    }

    return {
        billboard,
        label,
    };
}

export function geojson2Cartesian3(geojson) {
    let cartesian = {};

    switch (geojson.type) {
        case 'Point':
        const coords = geojson.coordinates;
        cartesian = Cartesian3.fromDegrees(coords[0], coords[1]);
        break;

        case 'Polygon':
        const degreesArray = geojson.coordinates.reduce((polyList, poly) => {
            const polyArray = poly.reduce((vertexArray, vertex) => {
                vertexArray.push(vertex[0]);
                vertexArray.push(vertex[1]);

                return vertexArray;
            }, []);

            return _.concat(polyList, polyArray);
        }, []);

        cartesian = Cartesian3.fromDegreesArray(degreesArray);
        break;

        default:
        break;
    }

    return cartesian;
}

export function getWeatherIcon1(record) {
    const data = record.data;
    const ts = new Date(record.createdAt);
    const hours = ts.getHours();
    const nightFlag = (hours > 7 && hours < 19) ? false : true;

    let weather = '';
    let level = '';
    let night = '';

    switch (data.weather) {
        case CONSTS.WEATHER.SUNNY:
        weather = 'sunny';
        night = nightFlag ? '_night' : '';
        break;

        case CONSTS.WEATHER.CLOUDY:
        weather = 'cloudy';
        level = data.level;
        night = nightFlag ? '_night' : '';
        break;

        case CONSTS.WEATHER.OVERCAST:
        weather = 'overcast';
        break;

        case CONSTS.WEATHER.MIST:
        weather = 'mist';
        night = nightFlag ? '_night' : '';
        break;

        case CONSTS.WEATHER.FOG:
        weather = 'fog';
        night = nightFlag ? '_night' : '';
        break;

        case CONSTS.WEATHER.RAIN:
        weather = 'light_rain';
        break;

        case CONSTS.WEATHER.SHOWER:
        weather = 'shower';
        level = data.level;
        night = nightFlag ? '_night' : '';
        break;

        case CONSTS.WEATHER.STORM:
        weather = 'tstorm';
        level = data.level;
        if (data.level < 3) {
            night = nightFlag ? '_night' : '';
        }
        break;

        case CONSTS.WEATHER.SNOW:
        weather = 'snow';
        level = data.level;
        if (data.level < 4) {
            night = nightFlag ? '_night' : '';
        }
        break;

        case CONSTS.WEATHER.SLEET:
        weather = 'sleet';
        break;

        case CONSTS.WEATHER.HAIL:
        weather = 'hail';
        break;

        default:
        weather = 'sunny';
    }

    return `${CONSTS.BILLBOARD_ICONS.WEATHER}/set_${CONSTS.WEATHER_ICON_SET}/${weather}${level}${night}.png`;
}
