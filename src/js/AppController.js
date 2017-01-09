import { BaseObject } from 'base';

import AppLayout from './AppLayout';

export default BaseObject.extend({
    initialize() {
        this.layout = new AppLayout();
        this.layout.render();
    },

    onIndex() {
        console.log('onIndex');
    }
});
