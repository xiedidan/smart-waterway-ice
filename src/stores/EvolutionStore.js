import { observable, action } from 'mobx';

class EvolutionStore {
    @observable currentPosition = 0;
    
    @action setPosition(position) {
        this.currentPosition = position;
    }
}

const evolutionStore = new EvolutionStore();

export default evolutionStore;
