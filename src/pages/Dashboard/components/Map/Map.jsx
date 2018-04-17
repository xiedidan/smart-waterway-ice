import _ from 'lodash';
import React, { Component } from 'react';
import { Grid, Tag, Select } from '@icedesign/base';
import DataBinder from '@icedesign/data-binder';
import Cesium from 'cesium/Cesium';
import { loadProjectEntitesByType, getProjectEntity } from '../../../../services/entity.service';
import './Map.scss';
import * as CONSTS from '../../../../consts';

const { Row, Col } = Grid;
const { Option } = Select;

@DataBinder({
    projectList: {
      url: `${CONSTS.BACKEND_BASE_URL}/api/${CONSTS.API_VERSION}/projects`,
      type: 'get',
      params: {
        page: 1,
        pageSize: 100,
      },
      defaultBindingData: {
        projects: [],
      },
      responseFormatter: (handler, res, oldRes) => {
        const newRes = {
          data: {
            projects: res.projects.map((project) => {
              const newProject = _.cloneDeep(project);
              newProject.id = project._id;
              newProject.name = project.name;
  
              return newProject;
            }),
          },
        };
        handler(newRes, oldRes);
      },
    },
})
export default class Map extends Component {
    static displayName = 'Map';

    static propTypes = {};

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {
            selectedProject: '',
            selectedTypes: [0, 1, 2, 3, 4],
        };
    }

    componentDidMount() {
        this.props.updateBindingData('projectList',
            {
                data: {
                page: 1,
                pageSize: 100,
                },
            },
            () => {
                this.setState({
                    selectedProject: this.props.bindingData.projectList.projects[0].id
                });

                this.showProjectEntity(this.props.bindingData.projectList.projects[0]);
            }
        );

        Cesium.BingMapsApi.defaultKey = CONSTS.BING_MAPS_KEY;
        
        this.viewer = new Cesium.Viewer('cesiumContainer', {
            timeline: false,
            navigationHelpButton: false,
            animation: false,
        });

        /* switch to new terrainProvider
        const terrainProvider = new Cesium.CesiumTerrainProvider({
            url : '//assets.agi.com/stk-terrain/world',
            requestVertexNormals: true,
            requestWaterMask: true,
        });
        */

        this.viewer.terrainProvider = Cesium.createWorldTerrain();

        // start refreshing entities
        this.entityInterval = setInterval(async () => {
            const entities = await loadProjectEntitesByType(
                this.state.selectedProject,
                this.state.selectedTypes,
            );
            this.showEntities(entities);
        }, CONSTS.ENTITY_REFRESH_INTERVAL);
    }

    componentWillUnmount() {
        // stop refreshing entities
        clearInterval(this.entityInterval);
    }

    showEntities(entities) {

    }

    showProjectEntity(project) {
        const projectEntity = getProjectEntity(project);
        this.viewer.add(projectEntity);

        this.viewer.flyTo(projectEntity);
    }

    async selectHandler0(selected) {
        // update state
        if (selected) {
            this.state.selectedTypes = _.union(this.state.selectedTypes, [0]);
        } else {
             _.pull(this.state.selectedTypes, 0);
        }

        // refresh entities
        const entities = await loadProjectEntitesByType(
            this.state.selectedProject,
            this.state.selectedTypes,
        );
        this.showEntities(entities);
    }

    async selectHandler1(selected) {
        // update state
        if (selected) {
            this.state.selectedTypes = _.union(this.state.selectedTypes, [1]);
        } else {
             _.pull(this.state.selectedTypes, 1);
        }

        // refresh entities
        const entities = await loadProjectEntitesByType(
            this.state.selectedProject,
            this.state.selectedTypes,
        );
        this.showEntities(entities);
    }

    async selectHandler2(selected) {
        // update state
        if (selected) {
            this.state.selectedTypes = _.union(this.state.selectedTypes, [2]);
        } else {
             _.pull(this.state.selectedTypes, 2);
        }

        // refresh entities
        const entities = await loadProjectEntitesByType(
            this.state.selectedProject,
            this.state.selectedTypes,
        );
        this.showEntities(entities);
    }

    async selectHandler3(selected) {
        // update state
        if (selected) {
            this.state.selectedTypes = _.union(this.state.selectedTypes, [3]);
        } else {
             _.pull(this.state.selectedTypes, 3);
        }

        // refresh entities
        const entities = await loadProjectEntitesByType(
            this.state.selectedProject,
            this.state.selectedTypes,
        );
        this.showEntities(entities);
    }

    async selectHandler4(selected) {
        // update state
        if (selected) {
            this.state.selectedTypes = _.union(this.state.selectedTypes, [4]);
        } else {
             _.pull(this.state.selectedTypes, 4);
        }

        // refresh entities
        const entities = await loadProjectEntitesByType(
            this.state.selectedProject,
            this.state.selectedTypes,
        );
        this.showEntities(entities);
    }

    async projectSelectHandler(value) {
        this.setState({
            selectedProject: value
        });

        // TODO : fly to current project entity

        // refresh entities
        const entities = await loadProjectEntitesByType(
            this.state.selectedProject,
            this.state.selectedTypes,
        );
        this.showEntities(entities);
    }

    render() {
        const projects = this.props.bindingData.projectList.projects;
        const selectedTypes = this.state.selectedTypes;

        return (
            <div id="mapContainer">
                <div id="controlContainer">
                    <Row align='center'>
                        <Col span={10}>
                            <Tag
                                shape="selectable"
                                type="normal"
                                onSelect={::this.selectHandler0}
                                defaultSelected={true}
                            >
                                航标
                            </Tag>
                            <Tag
                                shape="selectable"
                                type="normal"
                                onSelect={::this.selectHandler1}
                                defaultSelected={true}
                            >
                                水文
                            </Tag>
                            <Tag
                                shape="selectable"
                                type="normal"
                                onSelect={::this.selectHandler2}
                                defaultSelected={true}
                            >
                                气象
                            </Tag>
                            <Tag
                                shape="selectable"
                                type="normal"
                                onSelect={::this.selectHandler3}
                                defaultSelected={true}
                            >
                                船舶
                            </Tag>
                            <Tag
                                shape="selectable"
                                type="normal"
                                onSelect={::this.selectHandler4}
                                defaultSelected={true}
                            >
                                文档
                            </Tag>
                        </Col>
                        <Col offset={10} span={4}>
                            <Select
                                name="project"
                                placeholder="工程"
                                value={this.state.selectedProject}
                                onChange={::this.projectSelectHandler}
                                className="project-selector"
                            >
                                {
                                    projects.map((project) => {
                                        return <Option value={project.id} key={project.id}>{project.name}</Option>;
                                    })
                                }
                            </Select>
                        </Col>
                    </Row>
                </div>
                <div id="cesiumContainer" style={{height: '100%'}} />
            </div>
        );
    }
}
