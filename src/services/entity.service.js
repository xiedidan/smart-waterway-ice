import _ from 'lodash';
import { Cartesian3, Color } from 'cesium/Cesium';

export async function loadProjectEntitesByType(project, types) {

}

export async function getProjectEntity(project) {
    const position = await geojson2Cartesian3(project.geo);

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

export async function geojson2Cartesian3(geojson) {
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
