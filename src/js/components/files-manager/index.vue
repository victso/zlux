<template>
    <div class="zx-files-manager">

        <div v-if="fetching && !resources.length" class="uk-text-center">
            <i class="uk-icon-spinner uk-icon-spin uk-icon-small"></i>
        </div>

        <!-- main nav -->
        <nav class="uk-navbar" v-el="nav">

            <form class="uk-form uk-margin-remove uk-display-inline-block uk-width-1-1" v-on="submit: search">

                <div class="uk-form-icon uk-width-1-1">
                    <i v-class="filter ? 'uk-icon-times' : 'uk-icon-search'" v-on="click: clearSearch"></i>
                    <input v-model="filter" class="uk-form-blank uk-width-1-1" debounce="500" type="search">
                </div>

            </form>

        </nav>

        <!-- buttons -->
        <div class="uk-margin">
            <button v-el="browse" type="button" class="uk-button uk-button-small uk-button-primary uk-form-file">{{ 'Upload' | trans }}</button>
            <button type="button" v-on="click: createDir" class="uk-button uk-button-small">{{ 'Add Folder' | trans }}</button>
            <button type="button" v-on="click: reload" class="uk-button uk-button-small">{{ 'Reload' | trans }}</button>
            <button v-if="selected.length" type="button" v-on="click: renameResource" class="uk-button uk-button-small" v-attr="disabled: selected.length > 1">{{ 'Rename' | trans }}</button>
            <button v-if="selected.length" type="button" v-on="click: deleteSelected" class="uk-button uk-button-small uk-button-danger">{{ 'Delete' | trans }}</button>
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
        <div v-if="uploadProgress" class="uk-progress">
            <div class="uk-progress-bar" v-style="width: uploadProgress + '%'"></div>
        </div>

        <div v-el="dropzone" class="uk-placeholder uk-text-center uk-margin-bottom-remove">
            <i class="uk-icon-cloud-upload uk-icon-medium uk-text-muted uk-margin-small-right"></i> {{ 'Drop files here' | trans }}
        </div>

        <!-- pagination -->
        <pagination v-if="total > itemsPerPage" items="{{ total }}" current-page="{{@ currentPage }}" items-on-page="{{ itemsPerPage }}" on-select-page="{{ changePage }}"></pagination>

    </div>
</template>

<script>

    var $ = require('jquery');
    var UI = require('uikit');
    var ZX = require('zlux');
    var _ = ZX.util;
    var helper = require('./helper.js');

    module.exports = {

        props: {
            routeMap: {
                type: String,
                required: true,
                default: 'filesManager'
            },
            extensions: {
                type: String,
                default: ''
            },
            maxFileSize: {
                type: String
            }
        },

        data: function() {
            return {
                location: '/',
                cache: {},
                resources: [],
                fetching: false,
                filter: '',

                // upload
                uploadProgress: 0,

                // pagination
                itemsPerPage: 10,
                currentPage:  1,
                offset: 0,
                count:  0,
                total:  0
            };
        },

        computed: {

            notice: function() {
                return this.notices.length ? this.notices.join('\n') : false;
            },

            selected: function () {
                return this.resources.filter(function (resource) {
                    return resource.selected;
                });
            }

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

        ready: function () {
            this.initPlupload();
        },

        methods: {

            changePage: function(page) {
                this.fetch(null, page);
            },

            goTo: function(location) {
                this.fetch(helper.cleanPath(location));
            },

            reload: function(e) {
                if (e) e.preventDefault();
                this.cache = {};
                this.fetch(this.location, this.currentPage);
            },

            search: function(e) {
                if (e) e.preventDefault();
                this.fetch();
            },

            clearSearch: function() {
                this.$set('filter', '');
                this.fetch();
            },

            setPageData: function(data) {
                this.$set('location', data.location);
                this.$set('currentPage', data.page);
                this.$set('resources', data.resources);
                this.$set('count', data.count);
                this.$set('total', data.total);

                this.cache[data.location + data.page] = data;
            },

            createDir: function() {
                var name = prompt('Choose name'),
                    path = helper.cleanPath(this.location + '/' + name);

                if (!name) return;

                this.$http.get(this.routeMap + '/createDir', {path: path}).done(function(response) {

                    this.reload();

                }).always(function(response) {
                    this.riseWarnings(response);
                });

            },

            renameResource: function() {
                var resource = this.selected[0],
                    rpath = helper.cleanPath(this.location + '/' + resource.basename),
                    name = prompt('Choose new name for ' + resource.basename);

                if (!name) return;

                this.$http.get(this.routeMap + '/renameResource', {resource: rpath, new_name: name}).done(function(response) {

                    this.reload();

                }).always(function(response) {
                    this.riseWarnings(response);
                });

            },

            deleteSelected: function() {

                var resources = this.selected.map(function(resource) {
                    return helper.cleanPath(this.location + '/' + resource.basename);
                }, this);

                this.$http.get(this.routeMap + '/deleteResources', {resources: resources}).done(function(response) {

                    this.reload();

                }).always(function(response) {
                    this.riseWarnings(response);
                });

            },

            fetch: function(location, page) {
                location = location || this.location;
                page = page || 1;

                if (this.cache[location + page]) {
                    return this.setPageData(this.cache[location + page])
                }

                var params = _.merge({
                    location: location,
                    limit: this.itemsPerPage,
                    page: page,
                    filter: this.filter
                }, (params || {}));

                this.$set('fetching', true);

                this.$http.get(this.routeMap + '/fetchResources', params).done(function(response) {

                    this.setPageData(response);

                    // execute callback
                    if (_.isFunction(this.onLoadPage)) {
                        this.onLoadPage();
                    }

                }).always(function(response) {
                    this.riseWarnings(response);
                    this.$set('fetching', false);
                });

            },

            riseWarnings: function (response) {

                if (response.errors.length) {
                    UI.notify(response.errors.join('\n'), {pos: 'top-right', status: 'danger'});
                }

                if (response.notices.length) {
                    UI.notify(response.notices.join('\n'), {pos: 'top-right', status: 'warning'});
                }

            },

            initPlupload: function () {
                var vm = this;

                var uploader = new plupload.Uploader({
                    runtimes: 'html5',
                    browse_button: this.$$.browse,
                    drop_element: this.$$.dropzone,
                    max_file_size: this.maxFileSize,
                    url: _.helper.getFulllRoute(this.routeMap + '/upload'),
                    headers: {
                        'X-XSRF-TOKEN': ZX.config.csrf
                    },
                    filters: [
                        {title: 'Files', extensions: this.extensions}
                    ],
                    init: {
                        FileUploaded: function(up, file, response) {
                            vm.$set('uploadProgress', 0);
                            vm.riseWarnings(JSON.parse(response.response));
                        },
                        FilesAdded: function(up, files) {
                            up.start();
                        },
                        UploadProgress: function(up, file) {
                            vm.uploadProgress = isNaN(file.percent) ? 0 : file.percent;
                        },
                        UploadComplete: function(up, file) {
                            vm.reload();
                        },
                        BeforeUpload: function(up, file) {
                            up.settings.url += '&location=' + vm.location;
                        }
                    }
                });

                uploader.init();
            }
        },

        components: {
            resource: require('./components/resource.vue'),
            breadcrumb: require('./components/breadcrumb.vue')
        }

    };

</script>
