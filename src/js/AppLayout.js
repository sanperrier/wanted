import { LayoutView } from 'base'

import template from './AppLayout.jade';
import './style.scss';

export default LayoutView.extend({
    el: 'body',
    template,

    regions: {
        header: '[data-js-header]',
        content: '[data-js-content]',
        footer: '[data-js-footer]'
    },

    initialize() {

    },

    onRender() {

    }
});