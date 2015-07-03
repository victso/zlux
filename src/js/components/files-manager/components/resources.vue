<script>

    module.exports = {

        replace: true,
        inherit: true,

        components: {

            resource  : require('./resource.vue'),
            breadcrumb: require('./breadcrumb.vue')

        }

    };

</script>

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
            <tr v-component="resource" v-repeat="resources" root="{{ root }}" on-select-page="{{ goTo }}"></tr>
        </tbody>
    </table>

</template>
