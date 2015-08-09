<template>

    <li class="zx-files-manager-resource" draggable="true">
        <div v-on="click: selectItem" class="uk-panel uk-panel-box uk-panel-space uk-text-center" v-class="uk-active: selected">
            <span class="uk-panel-title">
                <i class="uk-icon-large uk-icon-justify" v-class="
                    uk-icon-folder-o: isFolder,
                    uk-icon-file-image-o: isImage,
                    uk-icon-file-o: isFile && !isImage
                "></i>
            </span>
            <div class="uk-text-break uk-margin-top">
                <i class="uk-icon-{{ selected ? 'check-square-o' : 'square-o' }} uk-icon-justify"></i>
                <a v-if="type == 'folder'" href="#" v-on="click: goTo">{{ basename | title || '..' }}</a>
                <template v-if="type == 'file'">{{ basename | title || '..' }}</template>
            </div>
        </div>
    </li>

</template>

<script>

    var helper = require('../helper.js');

    module.exports = {

        name: 'resource',

        data: function() {

            return {
                basename: '',
                content_type: '',
                size: '',
                selected: false
            };

        },

        computed: {

            type: function() {
                return this.basename.match(/\/$/) ? 'folder' : 'file';
            },

            isFolder: function () {
                return this.type === 'folder';
            },

            isFile: function () {
                return !this.isFolder;
            },

            isImage: function () {
                return this.isFile && this.content_type.match('image');
            },

            path: function () {
                return helper.cleanPath(this.$parent.location + '/' + this.basename);
            }

        },

        filters: {

            title: function(value) {
                return value
                    .replace(/\/$/g, '')     // remove slash
                    .replace(/(-|_)/g, ' '); // replace dash/underscore
            },

            parseSize: function(size) {

                if ( ! size) {
                    return size;
                }

                return helper.filesize( helper.parseSize(size) );

            }

        },

        methods: {

            selectItem: function () {
                this.$set('selected', !this.selected);
            },

            goTo: function(e) {
                e.preventDefault();
                this.$parent.goTo(this.path);
            }

        }

    }

</script>
