import { BaseObject } from 'base';

import AppLayout from './AppLayout';

import { Model, Collection } from 'base';

let ActionModel = Model.extend({
    defaults: {
        initEffect: undefined,
        hpEffect: undefined,
        defEffect: undefined,
        consumesTurn: false
    }
});

let ActionCollection = Collection.extend({
    model: ActionModel
});

let PlayerState = Model.extend({
    defaults: {
        action: new ActionModel(),
        init: undefined,
        hp: undefined,
        def: undefined,
        tick: undefined
    }
});

let PlayerStateCollection = Collection.extend({
    model: PlayerState
});

let PlayerModel = Model.extend({
    defaults: {
        initStart: 10,
        hpStart: 100,
        defStart: 0,
        name: 'Playa'
    },

    computeds: {
        init: {
            deps: ['_raw_current_state', 'initStart'],
            get: (current_state, initStart) => {
                if(current_state) {
                    let init = current_state.get('init'),
                        action = current_state.get('action');

                    if(action.get('initEffect')) {
                        init = action.get('initEffect')(this);
                    }

                    return init;
                } else {
                    return initStart;
                }
            }
        },
        hp: {
            deps: ['_raw_current_state', 'hpStart'],
            get: (current_state, hpStart) => {
                if(current_state) {
                    let hp = current_state.get('hp'),
                        action= current_state.get('action');

                    if(action.get('hpEffect')) {
                        hp = action.get('hpEffect')(this);
                    }

                    return hp;
                } else {
                    return hpStart;
                }
            }
        },
        def: {
            deps: ['_raw_current_state', 'defStart'],
            get: (current_state, defStart) => {
                if(current_state) {
                    let def = current_state.get('def'),
                        action= current_state.get('action');

                    if(action.get('defEffect')) {
                        def = action.get('defEffect')(this);
                    }

                    return def;
                } else {
                    return defStart;
                }
            }
        },
        tick: {
            deps: ['_raw_current_state'],
            get: (current_state) => {
                if(current_state) {
                    return current_state.get('tick');
                } else {
                    return 0;
                }
            }
        },
        nextTurn: {
            deps: ['init', '_raw_last_turn_tick'],
            get: (init, _raw_last_turn_tick) => {
                return init + (Number(_raw_last_turn_tick) || 0);
            }
        }
    },

    initialize() {
        //this.addNewState(new ActionModel(), 0);
    },

    addNewState(action, tick) {

        let state = new PlayerState({
            init: action.has('initEffect') ? action.get('initEffect')(this) : this.get('init'),
            hp: action.has('hpEffect') ? action.get('hpEffect')(this) : this.get('hp'),
            def: action.has('defEffect') ? action.get('defEffect')(this) : this.get('def'),
            tick: Number(tick) || this.get('nextTurn')
        });

        if(action.get('consumesTurn')) {
            this.set({
                _raw_last_turn_tick: Number(tick) || this.get('nextTurn')
            });
        }

        this.set({
            _raw_current_state: state
        });
    }
});

import { ItemView, LayoutView } from 'base';
import template from 'widgets/Player.jade';
import template2 from 'widgets/Field.jade';
import 'widgets/Field.scss';

let PlayerWidget = ItemView.extend({
    template: template,
    className: 'widgets player-widget',

    bindings: {
        '[data-js-name]': 'text:name',
        '[data-js-init]': 'text:init',
        '[data-js-next-turn]': 'text:nextTurn',
        '[data-js-hp]': 'text:hp',
        '[data-js-def]': 'text:def'
    }
});

let FieldWidget = LayoutView.extend({
    template: template2,
    className: 'widget field-widget',

    regions: {
        player0: '[data-js-player-0]',
        player1: '[data-js-player-1]',
    },

    ui: {
        player0: '[data-js-player-0]',
        player1: '[data-js-player-1]',
        btnPass: '[data-js-btn-pass]',
        btnDef: '[data-js-btn-def]',
        btnAttack: '[data-js-btn-attack]',
        btnSuper: '[data-js-btn-super]',
        btnTick: '[data-js-btn-tick]'
    },

    bindings: {
        '@ui.player0': 'classes:{current:player0Turn}',
        '@ui.player1': 'classes:{current:player1Turn}',
        '@ui.btnPass': 'disabled:not(isWaitingForAction)',
        '@ui.btnDef': 'disabled:not(isWaitingForAction)',
        '@ui.btnAttack': 'disabled:not(isWaitingForAction)',
        '@ui.btnSuper': 'disabled:not(isWaitingForAction)',
        '@ui.btnTick': 'disabled:isWaitingForAction,text:tick'
    },

    events: {
        'click @ui.btnPass': 'onBtnPassClick',
        'click @ui.btnDef': 'onBtnDefClick',
        'click @ui.btnAttack': 'onBtnAttackClick',
        'click @ui.btnSuper': 'onBtnSuperClick',
        'click @ui.btnTick': 'tick'
    },

    initialize() {
        this.model = new Model({
            tick: 0
        });

        this.viewModel = new (Model.extend({
            computeds: {
                isWaitingForAction: {
                    deps: ['player0Turn', 'player1Turn'],
                    get: (player0Turn, player1Turn) => player0Turn || player1Turn
                }
            }
        }))({
            player0Turn: false,
            player1Turn: false,
        });

        this.player0model = new PlayerModel({ name: 'Playa One' });
        this.player1model = new PlayerModel({ name: 'Playa Two' });

        window.player0model = this.player0model;
        window.player1model = this.player1model;
    },

    onAttach() {
        this.player0.show(new PlayerWidget({ model: this.player0model }));
        this.player1.show(new PlayerWidget({ model: this.player1model }));
    },

    onBtnPassClick() {
        let playerModel;
        if(this.viewModel.get('player0Turn')) {
            playerModel = this.player0model;
        } else if(this.viewModel.get('player1Turn')) {
            playerModel = this.player1model;
        }

        if(playerModel) {
            playerModel.addNewState(new ActionModel({
                initEffect: m => m.get('init') + Math.round((1 - m.get('init'))*0.5),
                defEffect: () => 0,
                consumesTurn: true
            }));

            this.viewModel.set({
                player0Turn: false,
                player1Turn: false
            });

            this.tick();
        }
    },

    onBtnDefClick() {
        let playerModel;
        if(this.viewModel.get('player0Turn')) {
            playerModel = this.player0model;
        } else if(this.viewModel.get('player1Turn')) {
            playerModel = this.player1model;
        }

        if(playerModel) {
            playerModel.addNewState(new ActionModel({
                initEffect: m => m.get('init') + Math.round((5 - m.get('init'))*0.5),
                defEffect: () => 8,
                consumesTurn: true
            }));

            this.viewModel.set({
                player0Turn: false,
                player1Turn: false
            });

            this.tick();
        }
    },

    onBtnAttackClick() {
        let attackPlayerModel, receivePlayerModel;
        if(this.viewModel.get('player0Turn')) {
            attackPlayerModel = this.player0model;
            receivePlayerModel = this.player1model;
        } else if(this.viewModel.get('player1Turn')) {
            attackPlayerModel = this.player1model;
            receivePlayerModel = this.player0model;
        }

        if(attackPlayerModel && receivePlayerModel) {
            attackPlayerModel.addNewState(new ActionModel({
                initEffect: m => m.get('init') + Math.round((10 - m.get('init'))*0.5),
                defEffect: () => 0,
                consumesTurn: true
            }));

            receivePlayerModel.addNewState(new ActionModel({
                hpEffect: m => m.get('hp') - Math.max(Math.round(10 * (1 + Math.random()) - m.get('def')), 0)
            }));

            this.viewModel.set({
                player0Turn: false,
                player1Turn: false
            });

            this.tick();
        }
    },

    onBtnSuperClick() {
        let attackPlayerModel, receivePlayerModel;
        if(this.viewModel.get('player0Turn')) {
            attackPlayerModel = this.player0model;
            receivePlayerModel = this.player1model;
        } else if(this.viewModel.get('player1Turn')) {
            attackPlayerModel = this.player1model;
            receivePlayerModel = this.player0model;
        }

        if(attackPlayerModel && receivePlayerModel) {
            attackPlayerModel.addNewState(new ActionModel({
                initEffect: m => m.get('init') + Math.round((20 - m.get('init'))*0.5),
                defEffect: () => 0,
                consumesTurn: true
            }));

            receivePlayerModel.addNewState(new ActionModel({
                hpEffect: m => m.get('hp') - Math.max(Math.round(15 * (1 + Math.random()) - m.get('def')), 0)
            }));

            this.viewModel.set({
                player0Turn: false,
                player1Turn: false
            });

            this.tick();
        }
    },

    onBtnTick() {
        if(!this.viewModel.get('isWaitingForAction')) {
            this.tick();
        }
    },

    tick() {
        this.model.set('tick', this.model.get('tick') + 1);

        if(this.player0model.get('nextTurn') <= this.model.get('tick') && this.player1model.get('nextTurn') < this.player0model.get('nextTurn')) {
            this.viewModel.set({
                player1Turn: true,
            });
        } else if(this.player0model.get('nextTurn') <= this.model.get('tick')) {
            this.viewModel.set({
                player0Turn: true,
            });
        } else if(this.player1model.get('nextTurn') <= this.model.get('tick')){
            this.viewModel.set({
                player1Turn: true,
            });
        } else {
            this.viewModel.set({
                player0Turn: false,
                player1Turn: false
            });
        }
    }

});

export default BaseObject.extend({
    initialize() {
        this.layout = new AppLayout();
        this.layout.render();
    },

    onIndex() {
        this.layout.content.show(new FieldWidget());
    }
});
