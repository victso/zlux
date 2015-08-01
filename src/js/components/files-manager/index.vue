<template>
    <div class="zx-files-manager">

        <div v-if="fetching && !resources.length" class="uk-text-center">
            <i class="uk-icon-spinner uk-icon-spin uk-icon-small"></i>
        </div>

        <template v-if="!notice && !error">

            <!-- main nav -->
            <nav class="uk-navbar" v-el="nav">

                <form class="uk-form uk-margin-remove uk-display-inline-block uk-width-8-10" v-on="submit: search">

                    <div class="uk-form-icon uk-width-1-1">
                        <i v-class="filter ? 'uk-icon-times' : 'uk-icon-search'" v-on="click: clearSearch"></i>
                        <input v-model="filter" class="uk-form-blank uk-width-1-1" debounce="500" type="search">
                    </div>

                </form>

                <div class="uk-navbar-content uk-navbar-flip">
                    <a href="" v-on="click: reload" title="{{ 'Reload' | trans }}">
                        <i class="uk-icon-refresh uk-icon-hover"></i>
                    </a>
                </div>

            </nav>

            <!-- buttons -->
            <div class="uk-margin">
                <span class="uk-button uk-button-small uk-button-primary uk-form-file">{{ 'Upload' | trans }}<input type="file"></span>
                <button type="button" v-on="click: addFolder" class="uk-button uk-button-small">{{ 'Add Folder' | trans }}</button>
                <button v-if="selected.length" type="button" v-on="click: deleteResources" class="uk-button uk-button-small uk-button-danger">{{ 'Delete' | trans }}</button>
            </div>

            <!-- breadcrumb -->
            <breadcrumb location="{{ location }}" go-to="{{ goTo }}"></breadcrumb>

            <!-- resources -->
            <div class="uk-overflow-container">
                <ul class="uk-grid uk-grid-width-small-1-2 uk-grid-width-medium-1-3 uk-grid-width-xlarge-1-4" data-uk-grid-margin data-uk-grid-match="{target:'.uk-panel'}">
                    <component is="resource" v-repeat="resources"></component>
                </ul>
            </div>

            <!-- drop files -->
            <div class="uk-placeholder uk-text-center uk-margin-bottom-remove">
                <i class="uk-icon-cloud-upload"></i> {{ 'Drop files here' | trans }}
            </div>

            <div class="uk-progress uk-hidden">
                <div class="uk-progress-bar" style="width: 0%;"></div>
            </div>

            <!-- pagination -->
            <pagination v-if="total > itemsPerPage" items="{{ total }}" current-page="{{@ currentPage }}" items-on-page="{{ itemsPerPage }}" on-select-page="{{ changePage }}"></pagination>

        </template>

        <div v-if="notice" class="uk-text-center">
            <div v-if="!fetching">{{ notice }} <br ><a href="" v-on="click: retry">{{ 'Retry' | trans }}</a></div>
        </div>

        <div v-if="error" class="uk-text-center">
            <div v-if="!fetching">{{ error }} <br ><a href="" v-on="click: retry">{{ 'Retry' | trans }}</a></div>
        </div>

    </div>
</template>

<script>

    var _ = require('../../util');
    var $ = require('jquery');
    var UI = require('uikit');
    var helper = require('./helper.js');

    module.exports = {

        props: {
            'routeMap': {
                type: String,
                required: true,
                default: 'filesManager'
            }
        },

        data: function() {

            return {
                location: '/',
                cache: {},
                errors: [],
                notices: [],
                resources: [],
                fetching: false,
                filter: '',

                // pagination
                itemsPerPage: 10,
                currentPage:  1,
                offset: 0,
                count:  0,
                total:  0
            };

        },

        created: function() {

            this.$watch('filter', function(value, oldValue) {

                if (oldValue === '') {
                    // on first time search reset pagination
                    this.$set('currentPage', 1);
                }

                this.cache = {};
                this.search();
            });

            this.$watch('resources', function(value, oldValue) {

                // reinit gridMargin
                $('[data-uk-grid-margin]', this.$el).each(function() {
                    var grid = $(this);

                    grid.data('gridMargin', null);
                    grid.data('stackMargin', null);

                    UI.gridMargin(grid, UI.Utils.options(grid.attr('data-uk-grid-margin')));
                });

                // reinit gridMatchHeight
                $('[data-uk-grid-match]', this.$el).each(function() {
                    var grid = $(this);

                    grid.data('gridMatchHeight', null);

                    UI.gridMatchHeight(grid, UI.Utils.options(grid.attr('data-uk-grid-match')));
                });

            });

        },

        computed: {

            error: function() {
                return this.errors.length ? this.errors.join('\n') : false;
            },

            notice: function() {
                return this.notices.length ? this.notices.join('\n') : false;
            },

            selected: function () {
                return this.resources.filter(function (resource) {
                    return resource.selected;
                });
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
                this.fetch(helper.cleanPath(location));
            },

            reload: function(e) {
                e.preventDefault();
                this.cache = {};
                this.fetch(this.location, this.currentPage);
            },

            search: function(e) {

                if (e) {
                    e.preventDefault();
                }

                this.fetch();
                // this.searching = false;

            },

            clearSearch: function() {
                this.$set('filter', '');
                this.fetch();
                // this.searching = false;
            },

            deleteResources: function (resources) {

                this.$http.get(this.routeMap + '/deleteResources', {resources: this.selected}).done(function(response) {

                    console.log('yeah');
                });

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
                    page: page,
                    filter: this.filter
                }, (params || {}));

                this.$set('fetching', true);

                this.$http.get(this.routeMap + '/fetchResources', params).done(function(response) {

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

            }

        },

        components: {
            resource: require('./components/resource.vue'),
            breadcrumb: require('./components/breadcrumb.vue')
        }

    };

</script>
