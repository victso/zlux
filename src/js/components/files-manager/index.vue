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

                // pagination
                itemsPerPage: 2,
                currentPage:  1,
                offset: 0,
                count:  0,
                total:  0,

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

            changePage: function(page) {
                this.fetch(null, page);
            },

            goTo: function(location) {
                this.fetch(this.cleanPath(location));
            },

            reload: function() {
                this.cache = {};
                this.fetch(this.location, this.currentPage);
            },

            fetch: function(location, page) {
                location = location || this.location;
                page = page || 1;

                if (this.cache[location + page]) {
                    var cached = this.cache[location + page];

                    this.$set('location', cached.location);
                    this.$set('currentPage', cached.page);
                    this.$set('resources', cached.resources);
                    this.$set('count', cached.count);
                    this.$set('total', cached.total);
                    return;
                }

                var params = _.extend({
                    location: location,
                    limit: this.itemsPerPage,
                    page: page
                }, (params || {}));

                this.$set('fetching', true);

                this.$http.get(this.routeMap, params).done(function(response) {

                    this.$set('location', response.location);
                    this.$set('currentPage', response.page);
                    this.$set('resources', response.resources);
                    this.$set('count', response.count);
                    this.$set('total', response.total);

                    this.cache[response.location + this.currentPage] = response;

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
                    .replace(/\/\/+/g, '/')   // replace double or more slashes
                    .replace(/^\/|\/$/g, ''); // remove / from ends
            }

        },

        components: {
            resources: require('./components/resources.vue'),
            uploader : require('./components/uploader.vue')
        }

    };

</script>
