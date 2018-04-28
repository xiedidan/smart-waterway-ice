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

        console.log(
            'loadProjectEntitesByType',
            entityResp.status,
            entityResp.data
        );

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
        pixelOffset : new Cesium.Cartesian2(0, 32),
    };

    const billboard = {
        width: CONSTS.BILLBOARD_WIDTH,
        height: CONSTS.BILLBOARD_HEIGHT,
    };

    switch (record.entity.type) {
        case CONSTS.ENTITY_TYPES.WEATHER:
        label.text = `${record.data.temp}度 / ${record.data.humi}%`;
        billboard.image = CONSTS.BILLBOARD_ICONS.WEATHER;
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
