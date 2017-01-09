import _ from 'underscore';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Epoxy from 'backbone.epoxy';

if (!('toJSON' in Error.prototype)) {
    Object.defineProperty(Error.prototype, 'toJSON', {
        value: function () {
            var alt = {};

            Object.getOwnPropertyNames(this).forEach(function (key) {
                alt[key] = this[key];
            }, this);

            return alt;
        },
        configurable: true,
        writable: true
    });
}

function extend(props) {
    let parent = this;

    props = props || _.create(null);
    if (!_(props).has('constructor')) {
        props.constructor = function(options) {
            _.extend(this, _.pick(options||{}, ['viewModel', 'bindings', 'bindingFilters', 'bindingHandlers', 'bindingSources', 'computeds']));
            parent.apply(this, arguments);
            Epoxy.View.mixin(this);
        };
    }

    props = _(props).defaults(_.create(null, {
        bindUIElements() {
            Marionette.View.prototype.bindUIElements.apply(this, arguments);
            if(_.isObject(this.bindings)) {
                this.bindings = _(_.result(this, 'bindings')).reduce((memo, val, key) => _(memo).extend({ [key.replace(/@ui\.([a-zA-Z0-9_\.]+)/, (s, name) => this._uiBindings[name])] : val }), {});
            }
            this.applyBindings();
        },

        unbindUIElements() {
            this.removeBindings();
            Marionette.View.prototype.unbindUIElements.apply(this, arguments);
        }
    }));

    return Marionette.extend.call(this, props);
}

export const BaseObject = Marionette.Object;
export const Application = Marionette.Application;
export const Router = Marionette.AppRouter;
export const Region = Marionette.Region;
export const ItemView = extend.call(Marionette.ItemView);
export const LayoutView = extend.call(Marionette.LayoutView);
export const CollectionView = extend.call(Marionette.CollectionView, {
    _renderChildren() {
        this.removeBindings();
        if(_.isObject(this.bindings)) {
            this.bindings = _(_.result(this, 'bindings')).reduce((memo, val, key) => _(memo).extend({ [key.replace(/@ui\.([a-zA-Z0-9_\.]+)/, (s, name) => this._uiBindings[name])] : val }), {});
        }
        this.applyBindings();
        return Marionette.CollectionView.prototype._renderChildren.apply(this, arguments);
    }
});
export const CompositeView = extend.call(Marionette.CompositeView);
export const Model = Epoxy.Model;
export const Collection = Backbone.Collection;
