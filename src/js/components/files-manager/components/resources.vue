<template>

    <table class="uk-table">
        <thead>
            <tr>
                <th>{{ 'Name' | trans }}</th>
                <th>{{ 'Size' | trans }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-component="resource" v-repeat="resources" location="{{ location }}" go-to="{{ goTo }}"></tr>
        </tbody>
    </table>

    <pagination v-if="total > itemsPerPage" items="{{ total }}" current-page="{{@ currentPage }}" items-on-page="{{ itemsPerPage }}" on-select-page="{{ changePage }}"></pagination>

    <div v-if="location !== '/'" class="uk-text-center">
        <breadcrumb location="{{ location }}" go-to="{{ goTo }}"></breadcrumb>
    </div>

</template>

<script>

    module.exports = {

        inherit: true,

        components: {

            resource: require('./resource.vue'),
            breadcrumb: require('./breadcrumb.vue')

        }

    };

</script>
