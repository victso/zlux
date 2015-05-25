<script>

    module.exports = {

        inherit: true,

        data: function() {

            return {
                
                root: '',
                files: []
                
            }

        },

        created: function() {

            // this.$http.get('/styles', function(data) {

            //     this.files = response.data;

            // }).error(function(e) {

            //     console.log(e);

            // });

            this.fetchData('/');

        },

        methods: {

            goTo: function(path) {

                this.fetchData(path);

            },

            fetchData: function(path) {

                var resource = '/files';

                var that = this;

                $.getJSON(resource, { path:path }, function(response) {

                    that.root  = response.root;
                    that.files = response.data;

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

        <ul class="uk-breadcrumb" v-component="breadcrumb" path="{{ root }}"></ul>

        <table class="uk-table">
            <thead>
                <tr>
                    <th>File</th>
                    <th>Size</th>
                </tr>
            </thead>
            <tbody>
                <tr v-component="file" v-repeat="files"></tr>
            </tbody>
        </table>

        <ul class="uk-pagination">
            <li><a href="#">...</a></li>
            <li class="uk-active"><span>...</span></li>
            <li class="uk-disabled"><span>...</span></li>
            <li><span>...</span></li>
        </ul>

    </div>

</template>