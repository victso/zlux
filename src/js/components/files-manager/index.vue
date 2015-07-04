<template>
    <div class="zx-files-manager">

        <div v-if="fetching && !resources.length" class="uk-text-center">
            <i class="uk-icon-spinner uk-icon-spin uk-icon-small"></i>
        </div>

        <template v-if="!notice">
            <nav class="uk-navbar">
                <ul class="uk-navbar-nav">

                    <li class="uk-parent uk-active" v-repeat="item: nav">
                        <a href="#" v-on="click: changeView(item.view)"> {{ item.title }}</a>
                    </li>

                </ul>
            </nav>

            <component is="{{ currentView }}"></component>
        </template>

        <div v-if="notice" class="uk-text-center">
            <div v-if="!fetching">{{ notice }} <br ><a href="" v-on="click: retry">Retry</a></div>
        </div>

    </div>
</template>

<script>

    var _ = require('../../util');
    var $ = require('jquery');

    module.exports = {

        props: {
            'routeMap': {
                type: String,
                required: true,
                default: ''
            }
        },

        data: function() {

            return {
                location: '/',
                cache: {},
                errors: [],
                notices: [],
                resources: [],
                currentView: 'resources',
                fetching: false,

                nav: [
                    {title: 'Files', view: 'files'},
                    {title: 'Uploader', view: 'uploader'}
                ]
            };

        },

        computed: {

            error: function() {

                return this.errors.length ? this.errors.join('\n') : false;

            },

            notice: function() {

                return this.notices.length ? this.notices.join('\n') : false;

            }

        },

        methods: {

            retry: function(e) {
                e.preventDefault();
                this.fetch();
            },

            changeView: function(view) {
                this.currentView = view;
            },

            goTo: function(location) {
                this.fetch(this.cleanPath(location));
            },

            fetch: function(location) {
                location = location || this.location;

                if (this.cache[location]) {
                    this.$set('location', location);
                    this.$set('resources', this.cache[location].resources);
                    return;
                }

                this.$set('fetching', true);

                this.$http.get(this.routeMap, {location: location}).done(function(response) {

                    this.$set('location', response.location);
                    this.$set('resources', response.resources);

                    this.cache[this.location] = response;

                    // execute callback
                    if (_.isFunction(this.onLoadPage)) {
                        this.onLoadPage();
                    }

                }).fail(function(response) {

                    this.$set('notices', response.notices);
                    this.$set('errors', response.errors);

                }).always(function() {
                    this.$set('fetching', false);
                });

            },

            cleanPath: function(path) {
                return path === '/' ? path : path
                    .replace(/\/\/+/g, '/')    // replace double or more slashes
                    .replace(/^\/|\/$/g, '');   // remove / from ends
            }

        },

        components: {

            resources: require('./components/resources.vue'),
            uploader : require('./components/uploader.vue')

        }

    };

</script>
