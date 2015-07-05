<template>

    <breadcrumb location="{{ location }}" go-to="{{ goTo }}"></breadcrumb>

    <table class="uk-table">
        <thead>
            <tr>
                <th>File</th>
                <th>Size</th>
            </tr>
        </thead>
        <tbody>
            <tr v-component="resource" v-repeat="resources" location="{{ location }}" go-to="{{ goTo }}"></tr>
        </tbody>
    </table>

    <pagination v-if="total > itemsPerPage" items="{{ total }}" current-page="{{@ currentPage }}" items-on-page="{{ itemsPerPage }}" on-select-page="{{ changePage }}"></pagination>

</template>

<script>

    module.exports = {

        inherit: true,

        components: {

            resource: require('./resource.vue'),
            breadcrumb: require('./breadcrumb.vue')

        },

        methods: {

            changePage: function(page) {
                this.fetch(null, page);
            }

        }

    };

</script>
