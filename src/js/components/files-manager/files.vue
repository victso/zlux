<script>

    module.exports = {

        inherit: true,

        data: function() {

            return {

                root: '',
                files: [],
                cache: {}

            }

        },

        created: function() {

            if (!this.$http) {
                console.warn('vue-resource plugin not loaded');
                return;
            }

            this.fetchData('root');

        },

        methods: {

            goTo: function(path) {

                this.fetchData(path);

            },

            fetchData: function(path) {

                if (this.cache[path]) {

                    this.root  = path;
                    this.files = this.cache[path];
                    return;

                }

                this.$http.get('/files', {path:path}, function(response) {

                    this.root  = response.root;
                    this.files = response.data;
                    this.cache[path] = response;

                }).error(function(e) {

                    console.log(e);

                });

            }

        },

        components: {

            file: require('./file.vue'),
            breadcrumb: require('./breadcrumb.vue')

        }

    };

</script>

<template>

    <div v-if="files.length">

        <breadcrumb path="{{ root }}"></breadcrumb>

        <table class="uk-table">
            <thead>
                <tr>
                    <th>File</th>
                    <th>Size</th>
                </tr>
            </thead>
            <tbody>
                <file v-repeat="files"></file>
            </tbody>
        </table>

    </div>

</template>